import type { DataSource } from '@/data/types'

export const mockSources: DataSource[] = [
  {
    id: 'ndbc',
    name: 'NOAA NDBC',
    description: 'Buoy observations · Hourly',
    refresh: 'Hourly',
    status: 'online',
    icon: 'buoy',
  },
  {
    id: 'gibs',
    name: 'NASA GIBS',
    description: 'Satellite imagery · Daily',
    refresh: 'Daily',
    status: 'online',
    icon: 'orbit',
  },
  {
    id: 'eonet',
    name: 'NASA EONET',
    description: 'Natural events · As reported',
    refresh: 'Event-driven',
    status: 'online',
    icon: 'alert',
  },
  {
    id: 'copernicus',
    name: 'Copernicus Marine',
    description: 'Ocean reanalysis · v2 roadmap',
    refresh: 'Not started',
    status: 'planned',
    icon: 'globe',
  },
]