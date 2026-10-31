export type DataMode = 'sample' | 'live'

/** 'sample': arayüz mock veriyle çalışıyor. Backend bağlanınca VITE_DATA_MODE=live yapılır. */
export const DATA_MODE: DataMode =
  import.meta.env.VITE_DATA_MODE === 'live' ? 'live' : 'sample'