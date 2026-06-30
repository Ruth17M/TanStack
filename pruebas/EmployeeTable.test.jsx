/* import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { employeesApi } from '../src/store/EmployessApi'
import EmployeeTable from '../src/components/EmployeeTable'


function renderWithStore() {
  const store = configureStore({
    reducer: { [employeesApi.reducerPath]: employeesApi.reducer },
    middleware: (getDefault) => getDefault().concat(employeesApi.middleware),
  })
  return render(
    <Provider store={store}>
      <EmployeeTable />
    </Provider>
  )
}

describe('EmployeeTable: integración real contra backend PHP', () => {
  it('carga el dataset base completo al montar sin parámetros', async () => {
    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText(/20 registros encontrados/)).toBeInTheDocument()
    }, { timeout: 5000 })

    expect(screen.getByText('Ana García')).toBeInTheDocument()
    expect(screen.getByText('Carlos López')).toBeInTheDocument()
    expect(screen.queryByText('Pablo Espinoza')).not.toBeInTheDocument()
  })

  it('al hacer click en el encabezado Salario, el orden visual coincide con los datos reales del backend', async () => {
    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText(/20 registros encontrados/)).toBeInTheDocument()
    })

    const selects = screen.getAllByRole('combobox')
    const roleSelect = selects[0]
    fireEvent.change(roleSelect, { target: { value: 'Editor' } })

    await waitFor(() => {
      expect(screen.getByText(/7 registros encontrados/)).toBeInTheDocument()
    })

    const salaryHeader = screen.getByText('Salario')
    fireEvent.click(salaryHeader)

    await waitFor(() => {
      const sortIcon = document.querySelector('.sort-icon.sort-active')
      if (!sortIcon) throw new Error('Sort icon not active yet')

      const rows = screen.getAllByRole('row')
      const firstDataRowSalaryText = rows[1].textContent
      const direction = sortIcon.textContent.includes('↓') ? 'desc' : 'asc'
      const expectedExtreme = direction === 'desc' ? '72,000' : '55,000'
      if (!firstDataRowSalaryText.includes(expectedExtreme)) {
        throw new Error(
          `Esperaba salario ${expectedExtreme} (${direction}), vi: ${firstDataRowSalaryText}`
        )
      }
    }, { timeout: 5000, interval: 100 })

    const sortIcon = document.querySelector('.sort-icon.sort-active')
    const direction = sortIcon.textContent.includes('↓') ? 'desc' : 'asc'

    const res = await fetch(
      `http://127.0.0.1:8000/employees.php?role=Editor&sortBy=salary&sortDir=${direction}&pageSize=10`
    )
    const backendTruth = await res.json()
    const expectedFirstName = backendTruth.data[0].name

    const rows = screen.getAllByRole('row')
    expect(rows[1].textContent).toContain(expectedFirstName)
  })

  it('permite ordenar por la columna id', async () => {
    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText(/20 registros encontrados/)).toBeInTheDocument()
    })

    const idHeader = screen.getByText('#')
    fireEvent.click(idHeader)

    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      expect(rows[1].textContent).toContain('Pablo Espinoza')
    }, { timeout: 5000 })
  })

  it('permite ordenar por la columna email y el orden coincide con el backend', async () => {
    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText(/20 registros encontrados/)).toBeInTheDocument()
    })

    const emailHeader = screen.getByText('Correo electrónico')
    fireEvent.click(emailHeader)

    await waitFor(() => {
      const sortIcon = document.querySelector('.sort-icon.sort-active')
      expect(sortIcon).toBeTruthy()
    }, { timeout: 5000 })

    const sortIcon = document.querySelector('.sort-icon.sort-active')
    const direction = sortIcon.textContent.includes('↓') ? 'desc' : 'asc'

    const res = await fetch(
      `http://127.0.0.1:8000/employees.php?sortBy=email&sortDir=${direction}&pageSize=5`
    )
    const backendTruth = await res.json()
    const expectedFirstEmail = backendTruth.data[0].email

    const rows = screen.getAllByRole('row')
    expect(rows[1].textContent).toContain(expectedFirstEmail)
  })

  it('combina búsqueda global + filtro de columna', async () => {
    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText(/20 registros encontrados/)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Buscar en todos los campos...')
    fireEvent.change(searchInput, { target: { value: 'a' } })

    await waitFor(() => {
      expect(screen.queryByText(/20 registros encontrados/)).not.toBeInTheDocument()
    }, { timeout: 2000 })

    const selects = screen.getAllByRole('combobox')
    const roleSelect = selects[0]
    fireEvent.change(roleSelect, { target: { value: 'Admin' } })

    await waitFor(() => {
      const subtitle = screen.getByText(/registros encontrados/)
      expect(subtitle).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})
*/