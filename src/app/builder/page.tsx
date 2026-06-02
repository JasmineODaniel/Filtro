'use client'

import dynamic from 'next/dynamic'
import LoadingScreen from '@/components/ui/LoadingScreen'

const QueryBuilder = dynamic(
  () => import('@/components/builder/QueryBuilder'),
  { ssr: false, loading: () => <LoadingScreen /> }
)

export default function BuilderPage() {
  return <QueryBuilder />
}
