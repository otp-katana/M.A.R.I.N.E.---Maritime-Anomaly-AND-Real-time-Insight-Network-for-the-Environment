import { mockConditions } from '@/data/mock/conditions'
import { mockGlance } from '@/data/mock/glance'
import { mockInsights } from '@/data/mock/insights'
import { mockKpis } from '@/data/mock/kpis'
import { mockLayers } from '@/data/mock/layers'
import { mockSources } from '@/data/mock/sources'
import type {
  ConditionSeries,
  ConditionVariable,
  DataSource,
  GlanceMetric,
  Insight,
  KpiMetric,
  OceanLayer,
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

export async function fetchInsights(): Promise<Insight[]> {
  await wait(MOCK_LATENCY_MS)
  return mockInsights
}

export async function fetchLayers(): Promise<OceanLayer[]> {
  await wait(250)
  return mockLayers
}