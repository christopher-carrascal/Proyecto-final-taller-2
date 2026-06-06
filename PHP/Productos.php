<?php
header('Content-Type: application/json');
include("Conexion.php");

$respuesta = [
    'success' => false,
    'products' => [],
    'error' => ''
];

$sql = "SELECT * FROM productos";
$resultado = mysqli_query($conexion, $sql);

if (!$resultado) {
    $respuesta['error'] = "Error de consulta: " . mysqli_error($conexion);
    echo json_encode($respuesta);
    mysqli_close($conexion);
    exit;
}

while ($fila = mysqli_fetch_assoc($resultado)) {
    $respuesta['products'][] = $fila;
}

$respuesta['success'] = true;
echo json_encode($respuesta);

mysqli_close($conexion);
?>