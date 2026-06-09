<?php
session_start();
include("conexion.php");

// Debug: ver qué se recibe en la consola de Apache/XAMPP
error_log("REQUEST_METHOD: " . $_SERVER["REQUEST_METHOD"]);
error_log("POST data: " . json_encode($_POST));

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // CORREGIDO: Validamos la llave correcta que envía el nuevo JS ('IdEvento')
    if (!isset($_POST['IdEvento']) || empty($_POST['IdEvento'])) {
        echo "Error: El campo IdEvento no fue recibido en el POST";
        error_log("IdEvento no está en POST");
        exit;
    }

    $id = mysqli_real_escape_string($conexion, $_POST['IdEvento']);
    error_log("ID a borrar: " . $id);

    // 1. Primero seleccionamos el evento para saber la ruta de su imagen
    // NOTA: Verifica que en tu tabla realmente se llame ID_Evento
    $sqlImagen = "SELECT Imagen FROM eventos WHERE ID_Evento = '$id'";
    $resImagen = mysqli_query($conexion, $sqlImagen);

    error_log("Query resultado: " . ($resImagen ? "OK" : "FALLO"));

    if ($resImagen && mysqli_num_rows($resImagen) > 0) {
        $fila = mysqli_fetch_assoc($resImagen);
        $rutaImagen = $fila['Imagen'];
        error_log("Imagen encontrada: " . $rutaImagen);

        // 2. Borramos el archivo físico de la carpeta si existe
        if (!empty($rutaImagen) && file_exists($rutaImagen)) {
            unlink($rutaImagen);
            error_log("Archivo físico borrado: " . $rutaImagen);
        }

        // 3. Borramos el registro definitivo de la base de datos
        $sqlDelete = "DELETE FROM eventos WHERE ID_Evento = '$id'";

        if (mysqli_query($conexion, $sqlDelete)) {
            echo "exito";
            error_log("Evento borrado exitosamente en la BD");
        } else {
            $error = "Error al eliminar de la BD: " . mysqli_error($conexion);
            echo $error;
            error_log($error);
        }
    } else {
        $msg = "El evento con ID $id no existe en la base de datos.";
        echo $msg;
        error_log($msg);
    }
} else {
    echo "Método no es POST";
    error_log("Método no es POST, es: " . $_SERVER["REQUEST_METHOD"]);
}

mysqli_close($conexion);
?>