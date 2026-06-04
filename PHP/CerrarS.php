<?php
session_start();
session_unset(); // Borra todas las variables de sesión
session_destroy(); // Destruye la sesión por completo

// Redirigimos al Index (como estamos en PHP, salimos a la raíz del proyecto para buscar el HTML)
header("Location: ../HTML/Index.html"); 
exit();
?>