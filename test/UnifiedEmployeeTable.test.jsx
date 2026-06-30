import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { employeesApi } from '../src/store/EmployessApi'
import EmployeeTableFrontendExample from '../src/components/EmployeeTableFrontendExample'
import UnifiedEmployeeTable, { INITIAL_PAGINATION } from '../src/components/UnifiedEmployeeTable'
import { useBackendEmployeeData } from '../src/useBackendEmployeeData'

function renderBackendExample() {
  const store = configureStore({
    reducer: { [employeesApi.reducerPath]: employeesApi.reducer },
    middleware: (getDefault) => getDefault().concat(employeesApi.middleware),
  })

  function Inner() {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [pagination, setPagination] = React.useState(INITIAL_PAGINATION)
    const dataSource = useBackendEmployeeData({ sorting, columnFilters, globalFilter, pagination })
    return (
      <UnifiedEmployeeTable
        mode="backend"
        sorting={sorting} setSorting={setSorting}
        columnFilters={columnFilters} setColumnFilters={setColumnFilters}
        globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
        pagination={pagination} setPagination={setPagination}
        dataSource={dataSource}
      />
    )
  }

  return render(
    <Provider store={store}>
      <Inner />
    </Provider>
  )
}

describe('UnifiedEmployeeTable — modo frontend', () => {
  it('renderiza el dataset completo paginado en memoria (5 filas en página 1 de 20 registros)', () => {
    render(<EmployeeTableFrontendExample />)
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows.length).toBe(5)
    expect(screen.getByText(/20 registros encontrados/)).toBeInTheDocument()
  })

  it('filtra por búsqueda global sin red, instantáneamente', () => {
    render(<EmployeeTableFrontendExample />)
    const input = screen.getByPlaceholderText('Buscar en todos los campos...')
    fireEvent.change(input, { target: { value: 'ana garcía' } })
    expect(screen.getByText(/1 registro encontrado/)).toBeInTheDocument()
    expect(screen.getByText('Ana García')).toBeInTheDocument()
  })

  it('combina filtro de Rol + búsqueda con lógica AND', () => {
    render(<EmployeeTableFrontendExample />)
    fireEvent.change(screen.getByPlaceholderText('Buscar en todos los campos...'), {
      target: { value: 'a' },
    })
    fireEvent.change(screen.getByDisplayValue('Todos los roles'), {
      target: { value: 'Admin' },
    })
    const badges = screen.getAllByText('Admin')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('cambia el tamaño de página y reordena por salario', () => {
    render(<EmployeeTableFrontendExample />)
    fireEvent.change(screen.getByDisplayValue('5'), { target: { value: '20' } })
    let rows = screen.getAllByRole('row').slice(1)
    expect(rows.length).toBe(20)

    fireEvent.click(screen.getByText('Salario'))
    rows = screen.getAllByRole('row').slice(1)
    let firstRowCells = within(rows[0]).getAllByRole('cell')
    expect(firstRowCells.some(c => c.textContent.includes('91,000'))).toBe(true) 


    fireEvent.click(screen.getByText('Salario'))
    rows = screen.getAllByRole('row').slice(1)
    firstRowCells = within(rows[0]).getAllByRole('cell')
    expect(firstRowCells.some(c => c.textContent.includes('39,000'))).toBe(true) 
})

describe('UnifiedEmployeeTable — modo backend', () => {
  it('carga la primera página desde el mock del servicio PHP (5 filas, meta.total = 20)', async () => {
    renderBackendExample()
    await waitFor(() => {
      expect(screen.getByText(/20 registros encontrados/)).toBeInTheDocument()
    })
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows.length).toBe(5)
  })

  it('aplica búsqueda con debounce y dispara una nueva petición al backend mock', async () => {
    renderBackendExample()
    await waitFor(() => screen.getByText(/20 registros encontrados/))

    const input = screen.getByPlaceholderText('Buscar en todos los campos...')
    fireEvent.change(input, { target: { value: 'maría' } })

    await waitFor(() => {
      expect(screen.getByText(/1 registro encontrado/)).toBeInTheDocument()
    }, { timeout: 1500 }) 

    expect(screen.getByText('María Rodríguez')).toBeInTheDocument()
  })

  it('manualPagination/manualSorting hacen que la tabla muestre EXACTAMENTE lo recibido del backend, sin reprocesar', async () => {
    renderBackendExample()
    await waitFor(() => screen.getByText(/20 registros encontrados/))

    fireEvent.click(screen.getByText('Salario'))

    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1)
      const firstRowCells = within(rows[0]).getAllByRole('cell')
      const text = firstRowCells.map(c => c.textContent).join(' | ')

      expect(text.includes('91,000') || text.includes('39,000')).toBe(true)
    }, { timeout: 2000 })
  })

  it('muestra el mensaje de error si la petición al backend falla', async () => {
    const original = global.fetch
    global.fetch = () => Promise.reject(new Error('network down'))
    renderBackendExample()
    await waitFor(() => {
      expect(screen.getByText(/No se pudo conectar con el servicio backend/)).toBeInTheDocument()
    })
    global.fetch = original
  })
})

})