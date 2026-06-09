<?php
session_start();
include("conexion.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Verificamos que venga el ID y no esté vacío
    if (!isset($_POST['IdEvento']) || empty($_POST['IdEvento'])) {
        echo "Error: ID de evento ausente.";
        exit;
    }

    $idEvento = intval($_POST['IdEvento']);
    
    // Capturamos los campos editados desde los nombres definidos en el JS dinámico
    $nombre = mysqli_real_escape_string($conexion, $_POST['ModNombre']);
    $fecha = mysqli_real_escape_string($conexion, $_POST['ModFecha']);
    $ubicacion = mysqli_real_escape_string($conexion, $_POST['ModUbicacion']);
    $precio = floatval($_POST['ModPrecio']);
    $descripcion = mysqli_real_escape_string($conexion, $_POST['ModDescripcion']);

    $imagenSql = '';
    $rutaImagenNueva = '';

    if (isset($_FILES['imagen-evento']) && $_FILES['imagen-evento']['error'] !== UPLOAD_ERR_NO_FILE) {
        $archivoImagen = $_FILES['imagen-evento'];
        $nombreOriginal = $archivoImagen['name'];
        $rutaTemporal   = $archivoImagen['tmp_name'];
        $errorArchivo   = $archivoImagen['error'];

        if ($errorArchivo === 0) {
            $nombreUnico = time() . "_" . basename($nombreOriginal);
            $directorioDestino = "../IMAGENES/Bruh/" . $nombreUnico;

            if (move_uploaded_file($rutaTemporal, $directorioDestino)) {
                $rutaImagenNueva = mysqli_real_escape_string($conexion, $directorioDestino);

                $sqlImagenActual = "SELECT Imagen FROM eventos WHERE ID_Evento = '$idEvento' LIMIT 1";
                $resultadoImagen = mysqli_query($conexion, $sqlImagenActual);
                if ($resultadoImagen) {
                    $filaImagen = mysqli_fetch_assoc($resultadoImagen);
                    if ($filaImagen && !empty($filaImagen['Imagen']) && file_exists($filaImagen['Imagen'])) {
                        unlink($filaImagen['Imagen']);
                    }
                }

                $imagenSql = ", Imagen = '$rutaImagenNueva'";
            } else {
                echo "Error al mover el archivo de imagen al directorio de destino.";
                mysqli_close($conexion);
                exit;
            }
        } else {
            echo "Error en la carga del archivo de imagen. Código de error: " . $errorArchivo;
            mysqli_close($conexion);
            exit;
        }
    }

    $sql = "UPDATE eventos SET 
                Nombre = '$nombre', 
                Fecha = '$fecha', 
                Ubicacion = '$ubicacion', 
                Precio = $precio,
                Descripcion = '$descripcion' $imagenSql
            WHERE ID_Evento = '$idEvento'";
            
    if (mysqli_query($conexion, $sql)) {
        echo "exito";
    } else {
        echo "Error al actualizar la base de datos: " . mysqli_error($conexion);
    }

} else {
    echo "Acceso denegado.";
}

mysqli_close($conexion);
?>