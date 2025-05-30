import { useState, useEffect, useCallback } from 'react'

export function usePaginatedResource(
  listWithMetaFn,
  { initialPage = 1, initialPageSize = 20, initialFilters = {} } = {}
) {
  const [items, setItems]       = useState([])
  const [count, setCount]       = useState(0)
  const [page, setPage]         = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [filters, setFilters]   = useState(initialFilters)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    listWithMetaFn({ page, page_size: pageSize, ...filters })
      .then(({ items, count }) => {
        setItems(items)
        setCount(count)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [listWithMetaFn, page, pageSize, filters])

  useEffect(() => {
    reload()
  }, [reload])

  return {
    items,
    count,
    page,
    pageSize,
    filters,
    loading,
    error,
    setPage,
    setPageSize,
    setFilters,
    reload
  }
}
