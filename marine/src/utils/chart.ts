function niceStep(raw: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const f = raw / pow
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nice * pow
}

const clean = (n: number) => Number(n.toFixed(10))

/** Değer aralığını "yuvarlak" sınırlara ve tik değerlerine çevirir. */
export function niceDomain(min: number, max: number, count = 4) {
  const range = max - min || Math.abs(max) * 0.1 || 1
  const step = niceStep(range / count)
  const lo = Math.floor(min / step) * step
  let hi = Math.ceil(max / step) * step
  if (hi === lo) hi = lo + step

  const ticks: number[] = []
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(clean(v))
  return { lo: clean(lo), hi: clean(hi), ticks }
}

/** [t0, t1] aralığındaki her ayın 1'i (UTC ms). */
export function monthTicks(t0: number, t1: number): number[] {
  const start = new Date(t0)
  const year = start.getUTCFullYear()
  let month = start.getUTCMonth()
  let t = Date.UTC(year, month, 1)
  if (t < t0) {
    month += 1
    t = Date.UTC(year, month, 1)
  }
  const out: number[] = []
  while (t <= t1) {
    out.push(t)
    month += 1
    t = Date.UTC(year, month, 1)
  }
  return out
}