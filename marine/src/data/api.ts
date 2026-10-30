import { mockConditions } from '@/data/mock/conditions'
import { mockGlance } from '@/data/mock/glance'
import { mockKpis } from '@/data/mock/kpis'
import { mockSources } from '@/data/mock/sources'
import type {
  ConditionSeries,
  ConditionVariable,
  DataSource,
  GlanceMetric,
  KpiMetric,
  RangeDays,
} from '@/data/types'

const MOCK_LATENCY_MS = 350
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function fetchKpis(): Promise<KpiMetric[]> {
  await wait(MOCK_LATENCY_MS)
  return mockKpis
}

export async function fetchGlance(range: RangeDays): Promise<GlanceMetric[]> {
  await wait(250)
  return mockGlance[range]
}

export async function fetchConditions(): Promise<Record<ConditionVariable, ConditionSeries>> {
  await wait(MOCK_LATENCY_MS)
  return mockConditions
}

export async function fetchSources(): Promise<DataSource[]> {
  await wait(MOCK_LATENCY_MS)
  return mockSources
}