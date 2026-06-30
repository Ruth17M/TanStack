import React, { useState } from 'react'
import UnifiedEmployeeTable, { INITIAL_PAGINATION } from './UnifiedEmployeeTable'
import { useFrontendEmployeeData } from '../useFrontendEmployeeData'

export default function EmployeeTableFrontendExample() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState(INITIAL_PAGINATION)

  const dataSource = useFrontendEmployeeData()

  return (
    <UnifiedEmployeeTable
      mode="frontend"
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
