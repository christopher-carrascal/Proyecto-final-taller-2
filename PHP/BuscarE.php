<?php
include("conexion.php");

if (isset($_GET['id'])) {
    $id = mysqli_real_escape_string($conexion, $_GET['id']);
    
    $sql = "SELECT * FROM eventos WHERE ID_Evento = '$id'";
    $resultado = mysqli_query($conexion, $sql);
    
    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $fila = mysqli_fetch_assoc($resultado);
        echo json_encode([
            "encontrado"  => true,
            "nombre"      => $fila['Nombre'],
            "fecha"       => $fila['Fecha'],
            "ubicacion"   => $fila['Ubicacion'],
            "descripcion" => $fila['Descripcion'],
            "imagen"      => $fila['Imagen'],
            "precio"      => $fila['Precio']
        ]);
    } else {
        echo json_encode(["encontrado" => false]);
    }
} else {
    echo json_encode(["encontrado" => false, "error" => "No se proporcionó ID"]);
}

mysqli_close($conexion);
?>