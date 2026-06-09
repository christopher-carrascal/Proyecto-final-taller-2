<?php
include("Conexion.php");
header('Content-Type: application/json; charset=utf-8');

$response = [
    'total_usuarios' => 0,
    'total_cuentas' => 0,
    'total_eventos' => 0,
    'total_dinero' => 0.0,
];

// Comprueba si existe la columna Rol en la tabla usuarios
$columnaRolExiste = false;
$consultaRol = "SHOW COLUMNS FROM usuarios LIKE 'Rol'";
$resultadoRol = mysqli_query($conexion, $consultaRol);
if ($resultadoRol && mysqli_num_rows($resultadoRol) > 0) {
    $columnaRolExiste = true;
}

// Total de cuentas creadas
$sqlCuentas = "SELECT COUNT(*) AS total_cuentas FROM usuarios";
$resultadoCuentas = mysqli_query($conexion, $sqlCuentas);
if ($resultadoCuentas) {
    $fila = mysqli_fetch_assoc($resultadoCuentas);
    $response['total_cuentas'] = intval($fila['total_cuentas']);
}

// Total de usuarios con rol usuario
if ($columnaRolExiste) {
    $sqlUsuarios = "SELECT COUNT(*) AS total_usuarios FROM usuarios WHERE LOWER(Rol) = 'usuario'";
    $resultadoUsuarios = mysqli_query($conexion, $sqlUsuarios);
    if ($resultadoUsuarios) {
        $fila = mysqli_fetch_assoc($resultadoUsuarios);
        $response['total_usuarios'] = intval($fila['total_usuarios']);
    }
} else {
    // Si no hay columna Rol, asumimos que todas las cuentas son usuarios
    $response['total_usuarios'] = $response['total_cuentas'];
}

// Total eventos y total dinero ganado
$sqlEventos = "SELECT COUNT(*) AS total_eventos, COALESCE(SUM(Precio), 0) AS total_dinero FROM eventos";
$resultadoEventos = mysqli_query($conexion, $sqlEventos);
if ($resultadoEventos) {
    $fila = mysqli_fetch_assoc($resultadoEventos);
    $response['total_eventos'] = intval($fila['total_eventos']);
    $response['total_dinero'] = floatval($fila['total_dinero']);
}

mysqli_close($conexion);

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
