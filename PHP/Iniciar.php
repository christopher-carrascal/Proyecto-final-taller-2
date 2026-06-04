<?php
include("Conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario  = $_POST['email']; 
    $password = $_POST['password'];


    $sql = "SELECT * FROM usuarios WHERE Nombre = '$usuario'";
    $resultado = mysqli_query($conexion, $sql);

    //Esto es para que si se encuentra solo un resultado...
    if (mysqli_num_rows($resultado) == 1) {
        //Recoge los datos del resultado
        $fila = mysqli_fetch_assoc($resultado);
        
        if (password_verify($password, $fila['Contra'])) {

            echo "<h3>¡Bienvenido a Ticketa, " . $fila['Nombre'] . "!</h3>";
            echo "<p>Inicio de sesión correcto.</p>";
            echo "<a href='../HTML/Index.html'>Ir al Inicio</a>";
        } else {
            echo "Contraseña incorrecta. <a href='../HTML/IniciarS.html'>Intentar de nuevo</a>";
        }
    } else {
        echo "El nombre de usuario no existe. <a href='../HTML/IniciarS.html'>Intentar de nuevo</a>";
    }
}

mysqli_close($conexion);
?>