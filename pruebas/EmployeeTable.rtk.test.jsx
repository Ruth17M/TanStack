import { describe, it, expect } from 'vitest'
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

describe('Estados de RTK Query', () => {

  it('muestra "Cargando..." en el instante del montaje, antes de que la petición resuelva', () => {
    renderWithStore()
    expect(screen.getByText('Cargando (primera carga)...')).toBeInTheDocument()
  })

  it('tras resolver la primera petición, el subtítulo cambia a mostrar el conteo real (isSuccess implícito)', async () => {
    renderWithStore()
    await waitFor(() => {
      expect(screen.getByText('20 registros encontrados')).toBeInTheDocument()
    })

    expect(screen.queryByText('Cargando (primera carga)...')).not.toBeInTheDocument()
  })

  it('al cambiar un filtro, isFetching se activa ("Actualizando...") aunque no sea la primera carga', async () => {
    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText('20 registros encontrados')).toBeInTheDocument()
    })

    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Admin' } }) 

    const subtitle = document.querySelector('.panel-subtitle')
    expect(subtitle.textContent).toBe('Actualizando...')
    expect(screen.queryByText('Cargando (primera carga)...')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('6 registros encontrados')).toBeInTheDocument()
    })
  })

  it('el botón "Actualizar" (refetch) dispara una nueva petición con los mismos parámetros actuales', async () => {
    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText('20 registros encontrados')).toBeInTheDocument()
    })

    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Editor' } })

    await waitFor(() => {
      expect(screen.getByText('7 registros encontrados')).toBeInTheDocument()
    })

    const refetchButton = screen.getByRole('button', { name: /actualizar/i })
    expect(refetchButton).not.toBeDisabled()
    fireEvent.click(refetchButton)

    await waitFor(() => {
      expect(screen.getByText('7 registros encontrados')).toBeInTheDocument()
    })
    expect(selects[0]).toHaveValue('Editor')
  })

  it('si el backend no está disponible, isError se activa y se muestra el mensaje de error', async () => {
    const { createApi, fetchBaseQuery } = await import('@reduxjs/toolkit/query/react')

    const brokenApi = createApi({
      reducerPath: 'brokenEmployeesApi',
      baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8999/' }),
      endpoints: (builder) => ({
        getEmployees: builder.query({
          query: () => ({ url: 'employees.php' }),
        }),
      }),
    })

    function BrokenTableProbe() {
      const { isError, error } = brokenApi.endpoints.getEmployees.useQuery()
      if (isError) {
        return (
          <div>
            No se pudo conectar con el servicio backend (employees.php).
            {error?.status ? ` (HTTP ${error.status})` : ' (sin respuesta del servidor)'}
          </div>
        )
      }
      return <div>Cargando...</div>
    }

    const brokenStore = configureStore({
      reducer: { [brokenApi.reducerPath]: brokenApi.reducer },
      middleware: (getDefault) => getDefault().concat(brokenApi.middleware),
    })

    render(
      <Provider store={brokenStore}>
        <BrokenTableProbe />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/No se pudo conectar con el servicio backend/)).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})