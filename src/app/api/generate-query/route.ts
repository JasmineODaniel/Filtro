import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import type { Schema } from '@/types/query'

const OPERATORS_BY_TYPE = {
  string: 'equals, not_equals, contains, not_contains, starts_with, ends_with, is_empty, is_not_empty, regex',
  number: 'equals, not_equals, greater_than, less_than, greater_than_or_equal, less_than_or_equal, between, is_empty, is_not_empty',
  date: 'equals, not_equals, before, after, between, is_empty, is_not_empty',
  enum: 'equals, not_equals, in_array, not_in_array, is_empty, is_not_empty',
  boolean: 'equals, not_equals',
} as const

function buildSystemPrompt(schema: Schema): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const today = now.toISOString().slice(0, 10)
  const thisMonthStart = new Date(y, m, 1).toISOString().slice(0, 10)
  const thisMonthEnd = new Date(y, m + 1, 0).toISOString().slice(0, 10)
  const lastMonthStart = new Date(y, m - 1, 1).toISOString().slice(0, 10)
  const lastMonthEnd = new Date(y, m, 0).toISOString().slice(0, 10)

  const fieldDefs = schema.fields
    .map(f => {
      const enumNote = f.enumValues ? ` — allowed values: [${f.enumValues.join(', ')}]` : ''
      return `  - ${f.name} (${f.label}): ${f.type}${enumNote}`
    })
    .join('\n')

  const operatorDefs = (Object.entries(OPERATORS_BY_TYPE) as [string, string][])
    .map(([type, ops]) => `  ${type}: ${ops}`)
    .join('\n')

  return `You are a query-builder assistant for the "${schema.name}" dataset. Convert a plain English request into a JSON filter tree.

AVAILABLE FIELDS:
${fieldDefs}

OPERATORS BY TYPE:
${operatorDefs}

DATE CONTEXT (today: ${today}):
  "this month"  → between ["${thisMonthStart}", "${thisMonthEnd}"]
  "last month"  → between ["${lastMonthStart}", "${lastMonthEnd}"]
  "this year"   → between ["${y}-01-01", "${y}-12-31"]

When the request is understandable, respond with:
{"type":"query","confidence":<number 0.0-1.0>,"tree":{"root":{"id":"<id>","type":"group","operator":"AND","children":[...],"collapsed":false}}}

When a key detail is missing or ambiguous, respond with:
{"type":"clarification","question":"<one specific question>"}

NODE FORMATS:
  Rule:  {"id":"<6-char alphanum>","type":"rule","field":"<field_name>","operator":"<operator>","value":<value>}
  Group: {"id":"<6-char alphanum>","type":"group","operator":"AND"|"OR","children":[...],"collapsed":false}

RULES:
- Only use field names from the available fields list above.
- "between" operator value must be a [min, max] array. "in_array"/"not_in_array" value must be a string array.
- Boolean field values must be true or false (not strings).
- All dates must be ISO format YYYY-MM-DD.
- Set confidence below 0.7 when making significant assumptions.
- Use nested groups for OR logic within an outer AND query.
- Ask for clarification when a required value cannot be inferred from context.
- Every id must be a unique 6-character alphanumeric string.`
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { type: 'error', message: 'GROQ_API_KEY is not configured. Add it to .env.local to enable AI query generation.' },
      { status: 500 }
    )
  }

  try {
    const { prompt, schema }: { prompt: string; schema: Schema } = await req.json()
    const client = new Groq({ apiKey })

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(schema) },
        { role: 'user', content: prompt },
      ],
    })

    const raw = completion.choices[0].message.content ?? ''
    const parsed: unknown = JSON.parse(raw)
    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
    return NextResponse.json({ type: 'error', message }, { status: 500 })
  }
}
