const f = (n: number) => n.toFixed(2)

/** Noktalardan yumuşatılmış bir SVG yolu üretir (orta nokta eğrileri). */
export function smoothLinePath(pts: [number, number][]): string {
  if (pts.length === 0) return ''
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`
  if (pts.length === 1) return d
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i]
    const [nx, ny] = pts[i + 1]
    d += ` Q${f(x)},${f(y)} ${f((x + nx) / 2)},${f((y + ny) / 2)}`
  }
  const last = pts[pts.length - 1]
  return `${d} L${f(last[0])},${f(last[1])}`
}