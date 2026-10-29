export type SystemStatus = {
  /** Son başarılı veri güncellemesi (ISO 8601, UTC) */
  lastUpdated: string
}

export const mockStatus: SystemStatus = {
  lastUpdated: '2026-10-26T14:37:00Z',
}