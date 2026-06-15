'use client'

import { memo, useCallback } from 'react'
import { useQueryStore } from '@/store'
import { QueryGroup as QueryGroupType, QueryNode } from '@/types'
import { ChevronDown, ChevronRight, Plus, FolderPlus, Trash2 } from 'lucide-react'
import QueryRuleComponent from './QueryRule'
import { OperatorToggle } from '@/components/ui/OperatorToggle'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface Props {
  group: QueryGroupType
  depth: number
  isRoot?: boolean
}

const DEPTH_COLORS = ['#111111', '#3b82f6', '#a855f7', '#f97316']
const DEPTH_COLORS_DARK = ['#c8ff00', '#3b82f6', '#a855f7', '#f97316']

function QueryGroupComponent({ group, depth, isRoot = false }: Props) {
  const {
    addRule,
    addGroup,
    removeNode,
    toggleGroupOperator,
    toggleGroupCollapsed,
    reorderNodes,
    validationErrors,
    theme,
  } = useQueryStore()

  const error = validationErrors.find(e => e.nodeId === group.id)
  const depthColors = theme === 'dark' ? DEPTH_COLORS_DARK : DEPTH_COLORS
  const depthColor = depthColors[depth % depthColors.length]

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = group.children.findIndex(c => c.id === active.id)
    const newIndex = group.children.findIndex(c => c.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderNodes(group.id, oldIndex, newIndex)
    }
  }, [group.children, group.id, reorderNodes])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderBottom: group.collapsed ? 'none' : `1px solid var(--border)`,
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <button
            onClick={() => toggleGroupCollapsed(group.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
            }}
          >
            {group.collapsed
              ? <ChevronRight size={11} />
              : <ChevronDown size={11} />
            }
          </button>

          <div
            style={{
              width: '3px',
              height: '16px',
              backgroundColor: depthColor,
              borderRadius: '2px',
              flexShrink: 0,
            }}
          />

          <OperatorToggle
            value={group.operator}
            onToggle={() => toggleGroupOperator(group.id)}
          />

          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            {group.children.length} condition{group.children.length !== 1 ? 's' : ''}
          </span>

          {error && (
            <span style={{ fontSize: '11px', color: 'var(--destructive)' }}>
              {error.message}
            </span>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => addRule(group.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent-text)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--surface)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <Plus size={11} />
              Add Rule
            </button>

            <button
              onClick={() => addGroup(group.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--surface)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <FolderPlus size={11} />
              Add Group
            </button>

            {!isRoot && (
              <button
                onClick={() => removeNode(group.id)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid transparent',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--destructive)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.08)'
                  e.currentTarget.style.borderColor = 'var(--destructive)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {!group.collapsed && (
          <div style={{ padding: '12px' }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={group.children.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.children.map((child: QueryNode) =>
                    child.type === 'rule' ? (
                      <QueryRuleComponent key={child.id} rule={child} />
                    ) : (
                      <QueryGroupComponent
                        key={child.id}
                        group={child}
                        depth={depth + 1}
                      />
                    )
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(QueryGroupComponent)
