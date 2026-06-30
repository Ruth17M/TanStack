import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { mockGetEmployees } from './mockPhpBackend'


global.fetch = vi.fn((input) => {
  const urlString = typeof input === 'string' ? input : input.url
  const parsed = new URL(urlString)
  const params = Object.fromEntries(parsed.searchParams.entries())
  const result = mockGetEmployees(params)
  return Promise.resolve(
    new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  )
})
