'use client'

import { memo, useCallback } from 'react'
import { useQueryStore } from '@/store'
import { QueryGroup as QueryGroupType, QueryNode } from '@/types'
import { ChevronDown, ChevronRight, Plus, FolderPlus, Trash2 } from 'lucide-react'
import QueryRuleComponent from './QueryRule'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { ConnectorLine } from '@/components/ui/ConnectorLine'
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

const DEPTH_COLORS_LIGHT = ['#111111', '#3b82f6', '#a855f7', '#f97316']
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
  const depthColors = theme === 'dark' ? DEPTH_COLORS_DARK : DEPTH_COLORS_LIGHT
  const depthColor = depthColors[depth % depthColors.length]
  const errorId = `error-${group.id}`

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = group.children.findIndex((c: QueryNode) => c.id === active.id)
    const newIndex = group.children.findIndex((c: QueryNode) => c.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderNodes(group.id, oldIndex, newIndex)
  }, [group.children, group.id, reorderNodes])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0', animation: 'slideDown 0.2s ease' }}
      role="group"
      aria-label={`Condition group with ${group.operator} logic`}
    >
      <Card error={!!error}>
        <CardHeader>
          <Button
            variant="icon"
            size="sm"
            label={group.collapsed ? 'Expand group' : 'Collapse group'}
            onClick={() => toggleGroupCollapsed(group.id)}
            style={{
              width: '20px',
              height: '20px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-sm)',
              flexShrink: 0,
            }}
          >
            {group.collapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
          </Button>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            {group.operator === 'AND' ? 'All conditions must match' : 'Any condition must match'}
          </span>

          <button
            onClick={() => toggleGroupOperator(group.id)}
            aria-label={`Toggle group operator. Currently ${group.operator}`}
            style={{
              padding: '2px var(--space-2)',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-text)',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            {group.operator}
          </button>

          {error && (
            <span
              id={errorId}
              role="alert"
              style={{ fontSize: '11px', color: 'var(--destructive)' }}
            >
              {error.message}
            </span>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Button
              variant="primary"
              size="sm"
              label="Add rule to group"
              title="Add rule"
              onClick={() => addRule(group.id)}
              style={{ width: '28px', padding: 0 }}
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
              <Plus size={12} />
            </Button>

            <Button
              variant="primary"
              size="sm"
              label="Add nested group"
              title="Add group"
              onClick={() => addGroup(group.id)}
              style={{ width: '28px', padding: 0 }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--surface)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <FolderPlus size={12} />
            </Button>

            {!isRoot && (
              <Button
                variant="danger"
                size="sm"
                label="Delete group"
                onClick={() => removeNode(group.id)}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--destructive)'
                  e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'
                  e.currentTarget.style.borderColor = 'var(--destructive)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        </CardHeader>

        {!group.collapsed && (
          <CardBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={group.children.map((c: QueryNode) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {group.children.map((child: QueryNode, index: number) => (
                    <div key={child.id}>
                      {index > 0 && (
                        <ConnectorLine
                          operator={group.operator}
                          depthColor={depthColor}
                          onToggle={() => toggleGroupOperator(group.id)}
                        />
                      )}
                      {child.type === 'rule' ? (
                        <QueryRuleComponent rule={child} />
                      ) : (
                        <div
                          style={{
                            paddingLeft: 'var(--space-4)',
                            borderLeft: `2px solid ${depthColor}`,
                            marginLeft: 'var(--space-3)',
                          }}
                        >
                          <QueryGroupComponent group={child} depth={depth + 1} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

          </CardBody>
        )}
      </Card>
    </div>
  )
}

export default memo(QueryGroupComponent)