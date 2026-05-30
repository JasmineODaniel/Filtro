import { create } from 'zustand'
import { QueryGroup, QueryNode, QueryRule, QueryTree, ValidationError, QueryPreset, QueryHistoryEntry, Schema } from '@/types'
import { generateId, validateTree } from '@/utils'
import { ALL_SCHEMAS } from '@/types/schema'

const createDefaultRule = (): QueryRule => ({
  id: generateId(),
  type: 'rule',
  field: '',
  operator: 'equals',
  value: '',
})

const createDefaultGroup = (): QueryGroup => ({
  id: generateId(),
  type: 'group',
  operator: 'AND',
  children: [createDefaultRule()],
  collapsed: false,
})

const createDefaultTree = (): QueryTree => ({
  root: createDefaultGroup(),
})

const updateNodeInGroup = (group: QueryGroup, nodeId: string, updater: (node: QueryNode) => QueryNode): QueryGroup => ({
  ...group,
  children: group.children.map(child => {
    if (child.id === nodeId) return updater(child) as QueryNode
    if (child.type === 'group') return updateNodeInGroup(child, nodeId, updater)
    return child
  }),
})

const removeNodeFromGroup = (group: QueryGroup, nodeId: string): QueryGroup => ({
  ...group,
  children: group.children
    .filter(child => child.id !== nodeId)
    .map(child => child.type === 'group' ? removeNodeFromGroup(child, nodeId) : child),
})

const addNodeToGroup = (group: QueryGroup, parentId: string, node: QueryNode): QueryGroup => {
  if (group.id === parentId) {
    return { ...group, children: [...group.children, node] }
  }
  return {
    ...group,
    children: group.children.map(child =>
      child.type === 'group' ? addNodeToGroup(child, parentId, node) : child
    ),
  }
}

const reorderInGroup = (group: QueryGroup, parentId: string, oldIndex: number, newIndex: number): QueryGroup => {
  if (group.id === parentId) {
    const children = [...group.children]
    const [moved] = children.splice(oldIndex, 1)
    children.splice(newIndex, 0, moved)
    return { ...group, children }
  }
  return {
    ...group,
    children: group.children.map(child =>
      child.type === 'group' ? reorderInGroup(child, parentId, oldIndex, newIndex) : child
    ),
  }
}

interface QueryStore {
  tree: QueryTree
  schema: Schema
  validationErrors: ValidationError[]
  presets: QueryPreset[]
  history: QueryHistoryEntry[]
  activePresetId: string | null
  previewMode: 'sql' | 'mongo'
  theme: 'light' | 'dark'

  setSchema: (schema: Schema) => void
  addRule: (parentId: string) => void
  addGroup: (parentId: string) => void
  updateRule: (ruleId: string, updates: Partial<QueryRule>) => void
  removeNode: (nodeId: string) => void
  toggleGroupOperator: (groupId: string) => void
  toggleGroupCollapsed: (groupId: string) => void
  reorderNodes: (parentId: string, oldIndex: number, newIndex: number) => void
  resetTree: () => void
  validateQuery: () => void
  savePreset: (name: string) => void
  loadPreset: (presetId: string) => void
  deletePreset: (presetId: string) => void
  pushHistory: () => void
  loadHistory: (entryId: string) => void
  clearHistory: () => void
  setPreviewMode: (mode: 'sql' | 'mongo') => void
  toggleTheme: () => void
  importTree: (tree: QueryTree) => void
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  tree: createDefaultTree(),
  schema: ALL_SCHEMAS[0],
  validationErrors: [],
  presets: [],
  history: [],
  activePresetId: null,
  previewMode: 'sql',
  theme: 'dark',

  setSchema: (schema: Schema) => set({ schema, tree: createDefaultTree(), validationErrors: [] }),

  addRule: (parentId: string) => {
    const rule = createDefaultRule()
    set((state: QueryStore) => ({
      tree: { root: addNodeToGroup(state.tree.root, parentId, rule) }
    }))
  },

  addGroup: (parentId: string) => {
    const group = createDefaultGroup()
    set((state: QueryStore) => ({
      tree: { root: addNodeToGroup(state.tree.root, parentId, group) }
    }))
  },

  updateRule: (ruleId: string, updates: Partial<QueryRule>) => {
    set((state: QueryStore) => ({
      tree: {
        root: updateNodeInGroup(state.tree.root, ruleId, node => ({ ...node, ...updates } as QueryNode))
      }
    }))
  },

  removeNode: (nodeId: string) => {
    set((state: QueryStore) => ({
      tree: { root: removeNodeFromGroup(state.tree.root, nodeId) }
    }))
  },

  toggleGroupOperator: (groupId: string) => {
    set((state: QueryStore) => ({
      tree: {
        root: updateNodeInGroup(state.tree.root, groupId, node =>
          node.type === 'group'
            ? { ...node, operator: node.operator === 'AND' ? 'OR' : 'AND' } as QueryNode
            : node
        )
      }
    }))
  },

  toggleGroupCollapsed: (groupId: string) => {
    set((state: QueryStore) => ({
      tree: {
        root: updateNodeInGroup(state.tree.root, groupId, node =>
          node.type === 'group' ? { ...node, collapsed: !node.collapsed } as QueryNode : node
        )
      }
    }))
  },

  reorderNodes: (parentId: string, oldIndex: number, newIndex: number) => {
    set((state: QueryStore) => ({
      tree: { root: reorderInGroup(state.tree.root, parentId, oldIndex, newIndex) }
    }))
  },

  resetTree: () => set({ tree: createDefaultTree(), validationErrors: [] }),

  validateQuery: () => {
    const { tree, schema } = get()
    const errors = validateTree(tree.root, schema.fields)
    set({ validationErrors: errors })
  },

  savePreset: (name: string) => {
    const { tree } = get()
    const preset: QueryPreset = {
      id: generateId(),
      name,
      tree: JSON.parse(JSON.stringify(tree)),
      createdAt: new Date().toISOString(),
    }
    set((state: QueryStore) => ({ presets: [...state.presets, preset], activePresetId: preset.id }))
  },

  loadPreset: (presetId: string) => {
    const { presets } = get()
    const preset = presets.find((p: QueryPreset) => p.id === presetId)
    if (preset) set({ tree: JSON.parse(JSON.stringify(preset.tree)), activePresetId: presetId, validationErrors: [] })
  },

  deletePreset: (presetId: string) => {
    set((state: QueryStore) => ({
      presets: state.presets.filter((p: QueryPreset) => p.id !== presetId),
      activePresetId: state.activePresetId === presetId ? null : state.activePresetId,
    }))
  },

  pushHistory: () => {
    const { tree } = get()
    const entry: QueryHistoryEntry = {
      id: generateId(),
      tree: JSON.parse(JSON.stringify(tree)),
      timestamp: new Date().toISOString(),
    }
    set((state: QueryStore) => ({ history: [entry, ...state.history].slice(0, 50) }))
  },

  loadHistory: (entryId: string) => {
    const { history } = get()
    const entry = history.find((h: QueryHistoryEntry) => h.id === entryId)
    if (entry) set({ tree: JSON.parse(JSON.stringify(entry.tree)), validationErrors: [] })
  },

  clearHistory: () => set({ history: [] }),

  setPreviewMode: (mode: 'sql' | 'mongo') => set({ previewMode: mode }),

  toggleTheme: () => set((state: QueryStore) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  importTree: (tree: QueryTree) => set({ tree, validationErrors: [] }),
}))