export const EMPLOYEES = [
  { id: 1,  name: 'Ana García',       email: 'ana.garcia@queplan.mx',       role: 'Admin',   department: 'Ingeniería',       status: 'Activo',    salary: 85000, startDate: '2022-03-15' },
  { id: 2,  name: 'Carlos López',     email: 'carlos.lopez@queplan.mx',     role: 'Editor',  department: 'Diseño',           status: 'Activo',    salary: 62000, startDate: '2023-01-10' },
  { id: 3,  name: 'María Rodríguez',  email: 'maria.rodriguez@queplan.mx',  role: 'Usuario', department: 'Marketing',        status: 'Pendiente', salary: 48000, startDate: '2024-02-01' },
  { id: 4,  name: 'Luis Hernández',   email: 'luis.hernandez@queplan.mx',   role: 'Admin',   department: 'Finanzas',         status: 'Activo',    salary: 91000, startDate: '2021-08-20' },
  { id: 5,  name: 'Sofía Martínez',   email: 'sofia.martinez@queplan.mx',   role: 'Editor',  department: 'Contenido',        status: 'Inactivo',  salary: 55000, startDate: '2022-11-05' },
  { id: 6,  name: 'Diego Pérez',      email: 'diego.perez@queplan.mx',      role: 'Usuario', department: 'Soporte',          status: 'Activo',    salary: 42000, startDate: '2023-06-18' },
  { id: 7,  name: 'Valentina Torres', email: 'valentina.torres@queplan.mx', role: 'Admin',   department: 'Operaciones',      status: 'Activo',    salary: 79000, startDate: '2021-04-12' },
  { id: 8,  name: 'Andrés Flores',    email: 'andres.flores@queplan.mx',    role: 'Editor',  department: 'Ingeniería',       status: 'Pendiente', salary: 67000, startDate: '2023-09-25' },
  { id: 9,  name: 'Isabella Ramírez', email: 'isabella.ramirez@queplan.mx', role: 'Usuario', department: 'Diseño',           status: 'Activo',    salary: 45000, startDate: '2024-01-08' },
  { id: 10, name: 'Miguel Sánchez',   email: 'miguel.sanchez@queplan.mx',   role: 'Editor',  department: 'Marketing',        status: 'Inactivo',  salary: 58000, startDate: '2022-07-30' },
  { id: 11, name: 'Camila Jiménez',   email: 'camila.jimenez@queplan.mx',   role: 'Usuario', department: 'Ventas',           status: 'Activo',    salary: 51000, startDate: '2023-03-14' },
  { id: 12, name: 'Emilio Vargas',    email: 'emilio.vargas@queplan.mx',    role: 'Admin',   department: 'TI',               status: 'Activo',    salary: 88000, startDate: '2020-12-01' },
  { id: 13, name: 'Natalia Cruz',     email: 'natalia.cruz@queplan.mx',     role: 'Editor',  department: 'Contenido',        status: 'Activo',    salary: 60000, startDate: '2022-05-22' },
  { id: 14, name: 'Ricardo Morales',  email: 'ricardo.morales@queplan.mx',  role: 'Usuario', department: 'Soporte',          status: 'Pendiente', salary: 39000, startDate: '2024-03-11' },
  { id: 15, name: 'Daniela Castro',   email: 'daniela.castro@queplan.mx',   role: 'Editor',  department: 'Finanzas',         status: 'Activo',    salary: 72000, startDate: '2021-10-19' },
  { id: 16, name: 'Sebastián Ruiz',   email: 'sebastian.ruiz@queplan.mx',   role: 'Usuario', department: 'Ingeniería',       status: 'Inactivo',  salary: 47000, startDate: '2022-09-07' },
  { id: 17, name: 'Laura Mendoza',    email: 'laura.mendoza@queplan.mx',    role: 'Admin',   department: 'Recursos Humanos', status: 'Activo',    salary: 83000, startDate: '2021-02-28' },
  { id: 18, name: 'Felipe Ortega',    email: 'felipe.ortega@queplan.mx',    role: 'Editor',  department: 'Marketing',        status: 'Activo',    salary: 64000, startDate: '2023-04-16' },
  { id: 19, name: 'Mariana Guzmán',   email: 'mariana.guzman@queplan.mx',   role: 'Usuario', department: 'Ventas',           status: 'Activo',    salary: 53000, startDate: '2023-07-03' },
  { id: 20, name: 'Pablo Espinoza',   email: 'pablo.espinoza@queplan.mx',   role: 'Admin',   department: 'TI',               status: 'Pendiente', salary: 76000, startDate: '2022-01-17' },
]

export function useFrontendEmployeeData() {
  return {
    rows: EMPLOYEES,
    pageCount: undefined,
    totalRows: EMPLOYEES.length,
    isLoading: false,
    isFetching: false,
    isError: false,
    errorMessage: '',
    onRefetch: () => {}, 
  }
}
