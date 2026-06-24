<?php

/**
 * EmployeeService
 *
 * Servicio único responsable de controlar la carga de datos de empleados:
 * búsqueda global, filtros por columna, ordenamiento y paginación.
 */
class EmployeeService
{
    private array $employees;

    private const SORTABLE_COLUMNS = [
        'id', 'name', 'email', 'role', 'department', 'status', 'salary', 'startDate'
    ];
    private const FILTERABLE_COLUMNS = ['role', 'status', 'department'];
    private const SEARCHABLE_COLUMNS = ['name', 'email', 'role', 'department', 'status'];
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PAGE_SIZE = 5;
    private const ALLOWED_PAGE_SIZES = [5, 10, 15, 20];
    private const MAX_PAGE_SIZE = 100; 

    public function __construct(?array $employees = null)
    {
        $this->employees = $employees ?? $this->defaultDataset();
    }

    public function getEmployees(array $params = []): array
    {
        $filters = $this->extractFilters($params);
        $search  = $this->extractSearch($params);
        $sort    = $this->extractSort($params);
        $pagination = $this->extractPagination($params);

        $result = $this->employees;

        $result = $this->applySearch($result, $search);

        $result = $this->applyFilters($result, $filters);

        $totalAfterFilters = count($result);

        $result = $this->applySort($result, $sort);

        $paged = $this->applyPagination($result, $pagination, $totalAfterFilters);

        return [
            'data' => $paged,
            'meta' => [
                'total'      => $totalAfterFilters,
                'page'       => $pagination['page'],
                'pageSize'   => $pagination['pageSize'],
                'totalPages' => $pagination['pageSize'] > 0
                    ? (int) ceil($totalAfterFilters / $pagination['pageSize'])
                    : 0,
                'appliedFilters' => $filters + ['search' => $search],
                'sort' => $sort,
            ],
        ];
    }

    private function extractFilters(array $params): array
    {
        $filters = [];
        foreach (self::FILTERABLE_COLUMNS as $column) {
            $value = $params[$column] ?? '';
            $filters[$column] = is_string($value) ? trim($value) : '';
        }
        return $filters;
    }

    private function extractSearch(array $params): string
    {
        $value = $params['search'] ?? '';
        return is_string($value) ? trim($value) : '';
    }

    private function extractSort(array $params): array
    {
        $sortBy  = $params['sortBy'] ?? null;
        $sortDir = strtolower((string) ($params['sortDir'] ?? 'asc'));

        if (!is_string($sortBy) || !in_array($sortBy, self::SORTABLE_COLUMNS, true)) {
            $sortBy = null; 
        }

        if (!in_array($sortDir, ['asc', 'desc'], true)) {
            $sortDir = 'asc';
        }

        return ['by' => $sortBy, 'dir' => $sortDir];
    }

    private function extractPagination(array $params): array
    {
        $page = filter_var($params['page'] ?? self::DEFAULT_PAGE, FILTER_VALIDATE_INT);
        if ($page === false || $page < 1) {
            $page = self::DEFAULT_PAGE;
        }

        $pageSize = filter_var($params['pageSize'] ?? self::DEFAULT_PAGE_SIZE, FILTER_VALIDATE_INT);
        if ($pageSize === false || $pageSize < 1) {
            $pageSize = self::DEFAULT_PAGE_SIZE;
        }
        if ($pageSize > self::MAX_PAGE_SIZE) {
            $pageSize = self::MAX_PAGE_SIZE;
        }

        return ['page' => $page, 'pageSize' => $pageSize];
    }

    private function applySearch(array $rows, string $search): array
    {
        if ($search === '') {
            return $rows; 
        }

        $needle = $this->lower($search);

        return array_values(array_filter($rows, function ($row) use ($needle) {
            foreach (self::SEARCHABLE_COLUMNS as $column) {
                $value = (string) ($row[$column] ?? '');
                if (strpos($this->lower($value), $needle) !== false) {
                    return true;
                }
            }
            return false;
        }));
    }

    private function lower(string $value): string
    {
        return function_exists('mb_strtolower')
            ? mb_strtolower($value, 'UTF-8')
            : strtolower($value);
    }

    private function applyFilters(array $rows, array $filters): array
    {
        foreach ($filters as $column => $value) {
            if ($value === '') {
                continue; 
            }
            $rows = array_values(array_filter($rows, function ($row) use ($column, $value) {
                return isset($row[$column]) && (string) $row[$column] === $value;
            }));
        }
        return $rows;
    }

    private function applySort(array $rows, array $sort): array
    {
        $by  = $sort['by'] ?? 'id';
        $dir = $sort['dir'] ?? 'asc';

        usort($rows, function ($a, $b) use ($by, $dir) {
            $valA = $a[$by] ?? null;
            $valB = $b[$by] ?? null;

            if (is_numeric($valA) && is_numeric($valB)) {
                $cmp = $valA <=> $valB;
            } else {
                $cmp = strcasecmp((string) $valA, (string) $valB);
            }

            return $dir === 'desc' ? -$cmp : $cmp;
        });

        return $rows;
    }

    private function applyPagination(array $rows, array $pagination, int $total): array
    {
        $page     = $pagination['page'];
        $pageSize = $pagination['pageSize'];

        if ($pageSize <= 0) {
            return [];
        }

        $offset = ($page - 1) * $pageSize;

        if ($offset >= $total) {
            return [];
        }

        return array_slice($rows, $offset, $pageSize);
    }

  
    private function defaultDataset(): array
    {
        return [
            ['id' => 1,  'name' => 'Ana García',       'email' => 'ana.garcia@queplan.mx',       'role' => 'Admin',   'department' => 'Ingeniería',       'status' => 'Activo',    'salary' => 85000, 'startDate' => '2022-03-15'],
            ['id' => 2,  'name' => 'Carlos López',     'email' => 'carlos.lopez@queplan.mx',     'role' => 'Editor',  'department' => 'Diseño',           'status' => 'Activo',    'salary' => 62000, 'startDate' => '2023-01-10'],
            ['id' => 3,  'name' => 'María Rodríguez',  'email' => 'maria.rodriguez@queplan.mx',  'role' => 'Usuario', 'department' => 'Marketing',        'status' => 'Pendiente', 'salary' => 48000, 'startDate' => '2024-02-01'],
            ['id' => 4,  'name' => 'Luis Hernández',   'email' => 'luis.hernandez@queplan.mx',   'role' => 'Admin',   'department' => 'Finanzas',         'status' => 'Activo',    'salary' => 91000, 'startDate' => '2021-08-20'],
            ['id' => 5,  'name' => 'Sofía Martínez',   'email' => 'sofia.martinez@queplan.mx',   'role' => 'Editor',  'department' => 'Contenido',        'status' => 'Inactivo',  'salary' => 55000, 'startDate' => '2022-11-05'],
            ['id' => 6,  'name' => 'Diego Pérez',      'email' => 'diego.perez@queplan.mx',      'role' => 'Usuario', 'department' => 'Soporte',          'status' => 'Activo',    'salary' => 42000, 'startDate' => '2023-06-18'],
            ['id' => 7,  'name' => 'Valentina Torres', 'email' => 'valentina.torres@queplan.mx', 'role' => 'Admin',   'department' => 'Operaciones',      'status' => 'Activo',    'salary' => 79000, 'startDate' => '2021-04-12'],
            ['id' => 8,  'name' => 'Andrés Flores',    'email' => 'andres.flores@queplan.mx',    'role' => 'Editor',  'department' => 'Ingeniería',       'status' => 'Pendiente', 'salary' => 67000, 'startDate' => '2023-09-25'],
            ['id' => 9,  'name' => 'Isabella Ramírez', 'email' => 'isabella.ramirez@queplan.mx', 'role' => 'Usuario', 'department' => 'Diseño',           'status' => 'Activo',    'salary' => 45000, 'startDate' => '2024-01-08'],
            ['id' => 10, 'name' => 'Miguel Sánchez',   'email' => 'miguel.sanchez@queplan.mx',   'role' => 'Editor',  'department' => 'Marketing',        'status' => 'Inactivo',  'salary' => 58000, 'startDate' => '2022-07-30'],
            ['id' => 11, 'name' => 'Camila Jiménez',   'email' => 'camila.jimenez@queplan.mx',   'role' => 'Usuario', 'department' => 'Ventas',           'status' => 'Activo',    'salary' => 51000, 'startDate' => '2023-03-14'],
            ['id' => 12, 'name' => 'Emilio Vargas',    'email' => 'emilio.vargas@queplan.mx',    'role' => 'Admin',   'department' => 'TI',               'status' => 'Activo',    'salary' => 88000, 'startDate' => '2020-12-01'],
            ['id' => 13, 'name' => 'Natalia Cruz',     'email' => 'natalia.cruz@queplan.mx',     'role' => 'Editor',  'department' => 'Contenido',        'status' => 'Activo',    'salary' => 60000, 'startDate' => '2022-05-22'],
            ['id' => 14, 'name' => 'Ricardo Morales',  'email' => 'ricardo.morales@queplan.mx',  'role' => 'Usuario', 'department' => 'Soporte',          'status' => 'Pendiente', 'salary' => 39000, 'startDate' => '2024-03-11'],
            ['id' => 15, 'name' => 'Daniela Castro',   'email' => 'daniela.castro@queplan.mx',   'role' => 'Editor',  'department' => 'Finanzas',         'status' => 'Activo',    'salary' => 72000, 'startDate' => '2021-10-19'],
            ['id' => 16, 'name' => 'Sebastián Ruiz',   'email' => 'sebastian.ruiz@queplan.mx',   'role' => 'Usuario', 'department' => 'Ingeniería',       'status' => 'Inactivo',  'salary' => 47000, 'startDate' => '2022-09-07'],
            ['id' => 17, 'name' => 'Laura Mendoza',    'email' => 'laura.mendoza@queplan.mx',    'role' => 'Admin',   'department' => 'Recursos Humanos', 'status' => 'Activo',    'salary' => 83000, 'startDate' => '2021-02-28'],
            ['id' => 18, 'name' => 'Felipe Ortega',    'email' => 'felipe.ortega@queplan.mx',    'role' => 'Editor',  'department' => 'Marketing',        'status' => 'Activo',    'salary' => 64000, 'startDate' => '2023-04-16'],
            ['id' => 19, 'name' => 'Mariana Guzmán',   'email' => 'mariana.guzman@queplan.mx',   'role' => 'Usuario', 'department' => 'Ventas',           'status' => 'Activo',    'salary' => 53000, 'startDate' => '2023-07-03'],
            ['id' => 20, 'name' => 'Pablo Espinoza',   'email' => 'pablo.espinoza@queplan.mx',   'role' => 'Admin',   'department' => 'TI',               'status' => 'Pendiente', 'salary' => 76000, 'startDate' => '2022-01-17'],
        ];
    }
}