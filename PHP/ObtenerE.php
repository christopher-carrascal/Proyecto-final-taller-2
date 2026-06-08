<?php
// El propósito de este PHP es recoger los datos de la tabla eventos y empaquetarlos en JSON.
// No es necesario que la sesión esté iniciada, porque se muestran siempre.
include("Conexion.php");

//Al parecer muestra del mas nuevo al mas viejo
$sql = "SELECT * FROM eventos ORDER BY ID_Evento DESC";
$resultado = mysqli_query($conexion, $sql);

$eventos = [];

if ($resultado) {
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $eventos[] = [
            'id'          => $fila['ID_Evento'],
            'nombre'      => $fila['Nombre'],
            'fecha'       => $fila['Fecha'],
            'ubicacion'   => $fila['Ubicacion'],
            'descripcion' => $fila['Descripcion'],
            'imagen'      => $fila['Imagen'], //Contiene la ruta exacta: ../IMAGENES/Bruh/archivo.jpg
            'precio'      => $fila['Precio']
        ];
    }
}

//Esto es como un srguro para que siempre devuelva un JSON
header('Content-Type: application/json; charset=utf-8');

$json = json_encode($eventos, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);

if ($json === false) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se pudo serializar los eventos.',
        'detalle' => json_last_error_msg()
    ], JSON_UNESCAPED_UNICODE);
    mysqli_close($conexion);
    exit;
}

echo $json;

mysqli_close($conexion);

?>