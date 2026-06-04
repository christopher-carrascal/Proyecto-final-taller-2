<?php
include("Conexion.php"); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario  = $_POST['username'];
    $correo   = $_POST['email'];
    $password = $_POST['password'];
    $confirmar_pass = $_POST['confirmPassword'];

    if ($password !== $confirmar_pass) {
        die("Error: Las contraseñas no coinciden. <a href='../HTML/Registro.html'>Volver</a>");
    }

    //Esto encripta la contraseña antes de guardarla en la base de datos, es una buena práctica para seguridad.
    $password_encriptada = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (Nombre, Correo, Contra) VALUES ('$usuario', '$correo', '$password_encriptada')";

    $ejecutar = mysqli_query($conexion, $sql);

    if ($ejecutar) {
        echo "<h3>¡Cuenta creada con éxito en Ticketa, $usuario!</h3>";
        echo "<a href='../HTML/IniciarS.html'>Ir al Login para iniciar sesión</a>";
    } else {
        echo "Error al registrar: " . mysqli_error($conexion);
    }
}

mysqli_close($conexion);
?>