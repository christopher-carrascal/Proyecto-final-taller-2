<?php
//Carajo, la habia escrito con una s y puro error
session_start();
include("conexion.php");

//Esto es para verificar que el metodo de envio es POST, es decir, que se esta enviando informacion
//Joder y es con guion bajo el request
if ($_SERVER ["REQUEST_METHOD"] == "POST"){

    //Esto captura la informacion registrada y la almacena tipo string
    //Y la variable es con name, no con id
    $nombre = mysqli_real_escape_string($conexion, $_POST['NombreE']);
    $fecha = mysqli_real_escape_string($conexion, $_POST['FechaE']);
    $ubicacion = mysqli_real_escape_string($conexion, $_POST['UbicacionE']);
    $precio = mysqli_real_escape_string($conexion, $_POST['PrecioE']);
    $desc = mysqli_real_escape_string($conexion, $_POST['DescripcionE']);

    //Esto procesa la imagen que se suba
    $archivoImagen = $_FILES['imagen-evento'];
    $nombreOriginal = $archivoImagen['name'];
    $rutaTemporal   = $archivoImagen['tmp_name'];
    $errorArchivo   = $archivoImagen['error'];

    if ($errorArchivo === 0) {
        //Esto genera como un numero aleatorio y luego el nombre de la imagen
        $nombreUnico = time() . "_" . basename($nombreOriginal);
        
        //Aqui se guardaran las imagenes, bruh
        $directorioDestino = "../IMAGENES/Bruh/" . $nombreUnico;

        //Aqui se trata de guardar dicha imagen
        if (move_uploaded_file($rutaTemporal, $directorioDestino)) {
            
            //Y si se guadra/mueve con exito, se guarda la ruta en la base datos
            $sql = "INSERT INTO eventos (Nombre, Fecha, Ubicacion, Descripcion, Imagen, Precio) 
                    VALUES ('$nombre', '$fecha', '$ubicacion', '$desc', '$directorioDestino', '$precio')";

            //Echos de errores posibles
            if (mysqli_query($conexion, $sql)) {
                echo "exito";
            } else {
                echo "Error al insertar en la base de datos: " . mysqli_error($conexion);
            }

        } else {
            echo "Error al mover el archivo de imagen al directorio de destino.";
        }
    } else {
        echo "Error en la carga del archivo de imagen. Código de error: " . $errorArchivo;
    }
}

mysqli_close($conexion);
?>
