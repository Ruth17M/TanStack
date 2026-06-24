import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const employeesApi = createApi({
  reducerPath: 'employeesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/',
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params = {}) => ({
        url: 'employees.php',
        params: {
          search: params.search || undefined,
          role: params.role || undefined,
          status: params.status || undefined,
          department: params.department || undefined,
          sortBy: params.sortBy || undefined,
          sortDir: params.sortDir || undefined,
          page: params.page || undefined,
          pageSize: params.pageSize || undefined,
        },
      }),
    }),
  }),
})

export const { useGetEmployeesQuery } = employeesApi