<?php

/**
 * Employees.php
 *
 * Ejemplos de uso:
 *   GET /employees.php                              
 *   GET /employees.php?search=ana
 *   GET /employees.php?role=Admin&status=Activo
 *   GET /employees.php?sortBy=salary&sortDir=desc
 *   GET /employees.php?page=2&pageSize=10
 *   GET /employees.php?search=mar&department=Marketing&sortBy=name&page=1&pageSize=5
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); 

require_once __DIR__ . '/EmployeeService.php';


if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'error' => 'Método no permitido. Este servicio solo acepta solicitudes GET.',
    ]);
    exit;
}

try {
    $service = new EmployeeService();
    $result = $service->getEmployees($_GET);

    http_response_code(200);
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Ocurrió un error interno al procesar la solicitud.',
    ]);
}