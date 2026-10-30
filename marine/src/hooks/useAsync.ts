import { useEffect, useState } from 'react'

export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

/** `fn` modül seviyesinde tanımlı (referansı sabit) bir fonksiyon olmalı. */
export function useAsync<T>(fn: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    fn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error })
      })
    return () => {
      cancelled = true
    }
  }, [fn])

  return state
}