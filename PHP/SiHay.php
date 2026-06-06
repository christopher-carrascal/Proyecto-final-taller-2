<?php
session_start();

$respuesta = [
    'logueado' => false,
    'usuario' => '',
    'rol' => ''
];

// Si la variable de sesión existe, cambiamos la respuesta
if (isset($_SESSION['usuario_logueado'])) {
    $respuesta['logueado'] = true;
    $respuesta['rol'] = $_SESSION['rol_usuario'] ?? $_SESSION['Rol'] ?? '';
    $respuesta['usuario'] = $_SESSION['usuario_logueado'];
}

// Lo enviamos en formato JSON para que JavaScript lo entienda perfectamente
header('Content-Type: application/json');
echo json_encode($respuesta);
?>