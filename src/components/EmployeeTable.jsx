import React, { useState, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { useGetEmployeesQuery } from '../store/EmployessApi'
import '../estilos/EmployeeTable.css'


const columnHelper = createColumnHelper()
const DEPARTMENTS = [
  'Contenido',
  'Diseño',
  'Finanzas',
  'Ingeniería',
  'Marketing',
  'Operaciones',
  'Recursos Humanos',
  'Soporte',
  'TI',
  'Ventas',
]

const columns = [
  columnHelper.accessor('id', {
    header: '#',
    enableColumnFilter: false,
    cell: info => (
      <span className="cell-id">{info.getValue()}</span>
    ),
  }),

  columnHelper.accessor('name', {
    header: 'Nombre',
    cell: info => (
      <div className="cell-name">
        <span className="avatar">
          {info.getValue().charAt(0)}
        </span>
        <span>{info.getValue()}</span>
      </div>
    ),
  }),

  columnHelper.accessor('email', {
    header: 'Correo electrónico',
    cell: info => (
      <span className="cell-muted">{info.getValue()}</span>
    ),
  }),

  columnHelper.accessor('role', {
    header: 'Rol',
    cell: info => {
      const role = info.getValue()
      const cls = role === 'Admin'
        ? 'badge badge-admin'
        : role === 'Editor'
        ? 'badge badge-editor'
        : 'badge badge-user'
      return <span className={cls}>{role}</span>
    },
  }),

  columnHelper.accessor('department', {
    header: 'Departamento',
  }),

  columnHelper.accessor('status', {
    header: 'Estado',
    cell: info => {
      const s = info.getValue()
      const cls = s === 'Activo'
        ? 'badge badge-active'
        : s === 'Inactivo'
        ? 'badge badge-inactive'
        : 'badge badge-pending'
      return <span className={cls}>{s}</span>
    },
  }),

  columnHelper.accessor('salary', {
    header: 'Salario',
    enableColumnFilter: false,
    cell: info => (
      <span className="cell-right">
        ${info.getValue().toLocaleString('es-MX')}
      </span>
    ),
  }),

  columnHelper.accessor('startDate', {
    header: 'Ingreso',
    enableColumnFilter: false,
    cell: info => {
      const [y, m, d] = info.getValue().split('-')
      return <span className="cell-muted">{`${d}/${m}/${y}`}</span>
    },
  }),
]


export default function EmployeeTable() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(globalFilter)
    }, 400)
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
    isSuccess,
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
  const data = rows

  const table = useReactTable({
    data,
    columns,
    pageCount: meta.totalPages,
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  })
  const setColumnFilter = (columnId, value) => {
    setColumnFilters(prev => {
      const others = prev.filter(f => f.id !== columnId)
      return value ? [...others, { id: columnId, value }] : others
    })
    setPagination(p => ({ ...p, pageIndex: 0 }))
  }

  const getColumnFilterValue = (columnId) =>
    columnFilters.find(f => f.id === columnId)?.value ?? ''
  const totalRows = meta.total
  const { pageIndex, pageSize } = table.getState().pagination
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min(firstRow + pageSize - 1, totalRows)

  return (
    <div className="table-container">

      <div className="panel-header">
        <div>
          <h1 className="panel-title">Gestión de empleados</h1>
          <p className="panel-subtitle">
            {isLoading
              ? 'Cargando (primera carga)...'
              : isFetching
                ? 'Actualizando...'
                : `${totalRows} registro${totalRows !== 1 ? 's' : ''} encontrado${totalRows !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          className="btn-clear-all"
          onClick={() => refetch()}
          disabled={isFetching}
          title="Vuelve a pedir los mismos datos al backend, sin cambiar filtros"
        >
          {isFetching ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {isError && (
        <div className="filters-bar" style={{ background: '#faece7', color: '#993c1d' }}>
          No se pudo conectar con el servicio backend (employees.php). Verifica que el
          servidor PHP esté corriendo en http://127.0.0.1:8000.
          {error?.status ? ` (HTTP ${error.status})` : ''}
        </div>
      )}

      <div className="filters-bar">
        <div className="filter-group filter-wide">
          <label className="filter-label">Búsqueda global</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">🔍</span>
            <input
              className="filter-input"
              type="text"
              placeholder="Buscar en todos los campos..."
              value={globalFilter}
              onChange={e => {
                setGlobalFilter(e.target.value)
                setPagination(p => ({ ...p, pageIndex: 0 }))
              }}
            />
            {globalFilter && (
              <button
                className="clear-btn"
                onClick={() => setGlobalFilter('')}
                title="Limpiar búsqueda"
              >✕</button>
            )}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Rol</label>
          <select
            className="filter-select"
            value={getColumnFilterValue('role')}
            onChange={e => setColumnFilter('role', e.target.value)}
          >
            <option value="">Todos los roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Usuario">Usuario</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select
            className="filter-select"
            value={getColumnFilterValue('status')}
            onChange={e => setColumnFilter('status', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Departamento</label>
          <select
            className="filter-select"
            value={getColumnFilterValue('department')}
            onChange={e => setColumnFilter('department', e.target.value)}
          >
            <option value="">Todos</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {(globalFilter || columnFilters.length > 0) && (
          <div className="filter-group filter-clear">
            <label className="filter-label">&nbsp;</label>
            <button
              className="btn-clear-all"
              onClick={() => {
                setGlobalFilter('')
                setColumnFilters([])
                setPagination(p => ({ ...p, pageIndex: 0 }))
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={header.column.getCanSort() ? 'th-sortable' : ''}
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === 'asc'
                          ? 'Ordenar ascendente'
                          : header.column.getNextSortingOrder() === 'desc'
                          ? 'Ordenar descendente'
                          : 'Sin orden'
                        : undefined
                    }
                  >
                    <span className="th-content">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className={`sort-icon ${header.column.getIsSorted() ? 'sort-active' : ''}`}>
                          {header.column.getIsSorted() === 'asc'
                            ? ' ↑'
                            : header.column.getIsSorted() === 'desc'
                            ? ' ↓'
                            : ' ↕'}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <p>Sin resultados para los filtros aplicados</p>
                  <button
                    className="btn-clear-all"
                    onClick={() => {
                      setGlobalFilter('')
                      setColumnFilters([])
                    }}
                  >
                    Limpiar filtros
                  </button>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? '' : 'row-alt'}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pg-info">
          {totalRows > 0
            ? `Mostrando ${firstRow}–${lastRow} de ${totalRows} registros`
            : '0 registros'}
        </div>

        <div className="pg-size-selector">
          <label>Filas por página:</label>
          <select
            value={pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 15, 20].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="pg-buttons">
          <button
            className="pg-btn"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="Primera página"
          >«</button>

          <button
            className="pg-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Página anterior"
          >‹</button>

          {Array.from({ length: table.getPageCount() }, (_, i) => i).map(i => {
            const current = table.getState().pagination.pageIndex
            const total = table.getPageCount()
            if (
              i === 0 ||
              i === total - 1 ||
              Math.abs(i - current) <= 1
            ) {
              return (
                <button
                  key={i}
                  className={`pg-btn ${i === current ? 'pg-btn-active' : ''}`}
                  onClick={() => table.setPageIndex(i)}
                >
                  {i + 1}
                </button>
              )
            }
            if (i === 1 || i === total - 2) {
              return <span key={i} className="pg-ellipsis">…</span>
            }
            return null
          })}

          <button
            className="pg-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Página siguiente"
          >›</button>

          <button
            className="pg-btn"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            title="Última página"
          >»</button>
        </div>
      </div>
    </div>
  )
}