<?php
session_start();
include("conexion.php");

// Debug: ver qué se recibe
error_log("REQUEST_METHOD: " . $_SERVER["REQUEST_METHOD"]);
error_log("POST data: " . json_encode($_POST));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['IdBorrar'])) {
        echo "Error: El campo IdBorrar no fue recibido en el POST";
        error_log("IdBorrar no está en POST");
        exit;
    }
    
    $id = mysqli_real_escape_string($conexion, $_POST['IdBorrar']);
    error_log("ID a borrar: " . $id);

    // 1. Primero seleccionamos el evento para saber la ruta de su imagen
    $sqlImagen = "SELECT Imagen FROM eventos WHERE ID_Evento = '$id'";
    $resImagen = mysqli_query($conexion, $sqlImagen);
    
    error_log("Query resultado: " . ($resImagen ? "OK" : "FALLO"));

    if ($resImagen && mysqli_num_rows($resImagen) > 0) {
        $fila = mysqli_fetch_assoc($resImagen);
        $rutaImagen = $fila['Imagen'];
        error_log("Imagen encontrada: " . $rutaImagen);

        // 2. Borramos el archivo físico de la carpeta si existe
        if (file_exists($rutaImagen)) {
            unlink($rutaImagen);
            error_log("Archivo borrado: " . $rutaImagen);
        }

        // 3. Borramos el registro definitivo de la base de datos
        $sqlDelete = "DELETE FROM eventos WHERE ID_Evento = '$id'";
        
        if (mysqli_query($conexion, $sqlDelete)) {
            echo "exito";
            error_log("Evento borrado exitosamente");
        } else {
            $error = "Error al eliminar: " . mysqli_error($conexion);
            echo $error;
            error_log($error);
        }
    } else {
        $msg = "El evento no existe.";
        echo $msg;
        error_log($msg);
    }
} else {
    echo "Método no es POST";
    error_log("Método no es POST, es: " . $_SERVER["REQUEST_METHOD"]);
}

mysqli_close($conexion);
?>