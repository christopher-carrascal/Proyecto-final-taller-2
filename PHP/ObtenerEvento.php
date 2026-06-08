<?php
include("Conexion.php");

header('Content-Type: application/json; charset=utf-8');

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'mensaje' => 'ID de evento inválido.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = mysqli_real_escape_string($conexion, $id);
$sql = "SELECT * FROM eventos WHERE ID_Evento = $id LIMIT 1";
$resultado = mysqli_query($conexion, $sql);

if (!$resultado) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al buscar el evento.',
        'detalle' => mysqli_error($conexion)
    ], JSON_UNESCAPED_UNICODE);
    mysqli_close($conexion);
    exit;
}

$evento = mysqli_fetch_assoc($resultado);

if (!$evento) {
    http_response_code(404);
    echo json_encode([
        'error' => true,
        'mensaje' => 'Evento no encontrado.'
    ], JSON_UNESCAPED_UNICODE);
    mysqli_close($conexion);
    exit;
}

$response = [
    'id' => $evento['ID_Evento'],
    'nombre' => $evento['Nombre'],
    'fecha' => $evento['Fecha'],
    'ubicacion' => $evento['Ubicacion'],
    'descripcion' => $evento['Descripcion'],
    'imagen' => $evento['Imagen'],
    'precio' => $evento['Precio']
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);

mysqli_close($conexion);
?>