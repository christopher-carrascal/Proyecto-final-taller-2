<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "proyecto-taller2";

$conexion = mysqli_connect($host, $user, $password, $database);

if (!$conexion) {
    die("Error al conectar con la base de datos: " . mysqli_connect_error());
}

mysqli_set_charset($conexion, "utf8mb4");

echo "¡Conexión exitosa a la base de datos!";
?>