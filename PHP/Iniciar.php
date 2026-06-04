<?php
session_start(); // 👈 1. IMPORTANTE: Arranca el sistema de sesiones en la primera línea
include("Conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario  = $_POST['User']; 
    $password = $_POST['password'];

    $sql = "SELECT * FROM usuarios WHERE Nombre = '$usuario'";
    $resultado = mysqli_query($conexion, $sql);

    if (mysqli_num_rows($resultado) == 1) {
        $fila = mysqli_fetch_assoc($resultado);
        
        if (password_verify($password, $fila['Contra'])) {
            // 2. Guardamos el nombre en la sesión del servidor
            $_SESSION['usuario_logueado'] = $usuario; 
            
            echo "correcto";
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "El nombre de usuario no existe.";
    }
}

mysqli_close($conexion);
?>