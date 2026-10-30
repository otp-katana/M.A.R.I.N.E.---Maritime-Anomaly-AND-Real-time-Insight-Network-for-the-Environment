export type Cadence = 'live' | 'daily' | 'monthly' | 'annual'
export type Sentiment = 'good' | 'bad' | 'neutral'
export type KpiIcon = 'thermometer' | 'drop' | 'waves'

export type KpiMetric = {
  id: string
  label: string
  icon: KpiIcon
  value: number
  unit: string
  decimals: number
  /** Pozitif değerlerin önüne "+" koyar */
  showSign?: boolean
  /** Önceki döneme göre değişim */
  delta: number
  deltaDecimals: number
  /** Değişimin "iyi mi kötü mü" olduğu; rengi belirler */
  sentiment: Sentiment
  /** Verinin yenilenme sıklığı; "canlı" izlenimi vermemek için kartta gösterilir */
  cadence: Cadence
  series: number[]
}

export type RangeDays = 7 | 30 | 90
export type GlanceIcon = 'waves' | 'leaf' | 'thermometer'
export type Tone = 'cyan' | 'green' | 'orange'

export type GlanceMetric = {
  id: string
  label: string
  icon: GlanceIcon
  tone: Tone
  value: number
  unit: string
  decimals: number
  /** Seçili aralıktaki yüzde değişim */
  deltaPct: number
  sentiment: Sentiment
  cadence: Cadence
}

export type ConditionVariable = 'temperature' | 'salinity' | 'chlorophyll'

/** t: UTC milisaniye */
export type SeriesPoint = { t: number; v: number }

export type ConditionSeries = {
  id: ConditionVariable
  label: string
  unit: string
  decimals: number
  /** Eksen etiketlerinde sayının yanına yazılır (ör. °C) */
  tickSuffix: string
  points: SeriesPoint[]
}

export type SourceStatus = 'online' | 'delayed' | 'planned'
export type SourceIcon = 'buoy' | 'orbit' | 'alert' | 'globe'

export type DataSource = {
  id: string
  name: string
  description: string
  /** Yenilenme sıklığı, serbest metin (ör. "Hourly") */
  refresh: string
  status: SourceStatus
  icon: SourceIcon
}