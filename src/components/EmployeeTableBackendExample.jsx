import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import UnifiedEmployeeTable, { INITIAL_PAGINATION } from '../components/UnifiedEmployeeTable'
import { useBackendEmployeeData } from '../useBackendEmployeeData'

function EmployeeTableBackendExampleInner() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState(INITIAL_PAGINATION)

  const dataSource = useBackendEmployeeData({ sorting, columnFilters, globalFilter, pagination })

  return (
    <UnifiedEmployeeTable
      mode="backend"
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      pagination={pagination}
      setPagination={setPagination}
      dataSource={dataSource}
    />
  )
}

export default function EmployeeTableBackendExample() {
  return (
    <Provider store={store}>
      <EmployeeTableBackendExampleInner />
    </Provider>
  )
}
