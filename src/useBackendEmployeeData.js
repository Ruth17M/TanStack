import { useState, useEffect } from 'react'
import { useGetEmployeesQuery } from '../src/store/EmployessApi'

export function useBackendEmployeeData({ sorting, columnFilters, globalFilter, pagination }) {
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(globalFilter), 400)
    return () => clearTimeout(timeout)
  }, [globalFilter])

  const roleFilter = columnFilters.find(f => f.id === 'role')?.value ?? ''
  const statusFilter = columnFilters.find(f => f.id === 'status')?.value ?? ''
  const departmentFilter = columnFilters.find(f => f.id === 'department')?.value ?? ''
  const sortBy = sorting[0]?.id ?? ''
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc'

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetEmployeesQuery({
    search: debouncedSearch,
    role: roleFilter,
    status: statusFilter,
    department: departmentFilter,
    sortBy,
    sortDir,
    page: pagination.pageIndex + 1, 
    pageSize: pagination.pageSize,
  })

  const rows = apiResponse?.data ?? []
  const meta = apiResponse?.meta ?? { total: 0, totalPages: 0 }

  return {
    rows,
    pageCount: meta.totalPages,
    totalRows: meta.total,
    isLoading,
    isFetching,
    isError,
    errorMessage: isError
      ? `No se pudo conectar con el servicio backend ${error?.status ? ` (HTTP ${error.status})` : ''}`
      : '',
    onRefetch: refetch,
  }
}
