import classNames from 'classnames'
import { Button } from './Button'

/**
 * Props:
 * - currentPage, totalItems, pageSize
 * - onPageChange(page), onPageSizeChange(size)
 * - pageSizeOptions: array of numbers
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50]
}) {
  const totalPages = Math.ceil(totalItems / pageSize)
  if (totalPages <= 1) return null

  const pages = []
  for (let p = 1; p <= totalPages; p++) {
    pages.push(p)
  }

  return (
    <div className="d-flex align-items-center justify-content-between my-3">
      <ul className="pagination mb-0">
        <li className={classNames('page-item', { disabled: currentPage === 1 })}>
          <Button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
        </li>
        {pages.map(p => (
          <li key={p} className={classNames('page-item', { active: p === currentPage })}>
            <Button className="page-link" onClick={() => onPageChange(p)}>
              {p}
            </Button>
          </li>
        ))}
        <li className={classNames('page-item', { disabled: currentPage === totalPages })}>
          <Button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </li>
      </ul>

      {onPageSizeChange && (
        <div className="ms-3">
          <label className="form-label me-2">Per page:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
