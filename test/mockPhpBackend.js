import { EMPLOYEES } from '../src/useFrontendEmployeeData'

const SEARCHABLE_COLUMNS = ['name', 'email', 'role', 'department', 'status']
const FILTERABLE_COLUMNS = ['role', 'status', 'department']
const ALLOWED_PAGE_SIZES = [5, 10, 15, 20]

function applySearch(rows, search) {
  if (!search) return rows
  const needle = search.toLowerCase()
  return rows.filter(row =>
    SEARCHABLE_COLUMNS.some(col => String(row[col] ?? '').toLowerCase().includes(needle))
  )
}

function applyFilters(rows, filters) {
  let result = rows
  for (const col of FILTERABLE_COLUMNS) {
    const value = filters[col]
    if (!value) continue
    result = result.filter(row => String(row[col]) === value)
  }
  return result
}

function applySort(rows, sortBy, sortDir) {
  const by = sortBy || 'id'
  const dir = sortDir === 'desc' ? 'desc' : 'asc'
  const copy = [...rows]
  copy.sort((a, b) => {
    const valA = a[by]
    const valB = b[by]
    let cmp
    if (typeof valA === 'number' && typeof valB === 'number') {
      cmp = valA - valB
    } else {
      cmp = String(valA).localeCompare(String(valB), undefined, { sensitivity: 'base' })
    }
    return dir === 'desc' ? -cmp : cmp
  })
  return copy
}

function applyPagination(rows, page, pageSize, total) {
  const offset = (page - 1) * pageSize
  if (offset >= total) return []
  return rows.slice(offset, offset + pageSize)
}

export function mockGetEmployees(params) {
  const search = params.search || ''
  const filters = {
    role: params.role || '',
    status: params.status || '',
    department: params.department || '',
  }
  const sortBy = params.sortBy || null
  const sortDir = params.sortDir || 'asc'
  const page = Number(params.page) > 0 ? Number(params.page) : 1
  const pageSize = ALLOWED_PAGE_SIZES.includes(Number(params.pageSize)) ? Number(params.pageSize) : 5

  let result = [...EMPLOYEES]
  result = applySearch(result, search)
  result = applyFilters(result, filters)
  const totalAfterFilters = result.length
  result = applySort(result, sortBy, sortDir)
  const paged = applyPagination(result, page, pageSize, totalAfterFilters)

  return {
    data: paged,
    meta: {
      total: totalAfterFilters,
      page,
      pageSize,
      totalPages: pageSize > 0 ? Math.ceil(totalAfterFilters / pageSize) : 0,
    },
  }
}
