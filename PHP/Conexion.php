<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "proyecto-taller2";

$conexion = mysqli_connect($host, $user, $password, $database);

if (!$conexion) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se pudo conectar a la base de datos.',
        'detalle' => mysqli_connect_error()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

mysqli_set_charset($conexion, "utf8mb4");
?>