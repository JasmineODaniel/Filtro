'use client'

import dynamic from 'next/dynamic'

const QueryBuilder = dynamic(() => import('@/components/builder/QueryBuilder'), { ssr: false })

export default function Home() {
  return <QueryBuilder />
}