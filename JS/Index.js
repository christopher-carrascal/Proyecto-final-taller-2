document.addEventListener("DOMContentLoaded", () => {
    // Buscamos saliendo de la carpeta de vistas hacia PHP
    fetch('../PHP/SiHay.php')
        .then(response => response.json())
        .then(data => {
            if (data.logueado) {
                // 1. Ocultamos los botones de invitado
                document.querySelectorAll('.invitado').forEach(elemento => {
                    elemento.classList.add('hidden'); 
                });

                // 2. Mostramos el botón de cuenta
                const botonCuenta = document.querySelector('.usuario-registrado');
                if (botonCuenta) {
                    botonCuenta.classList.remove('hidden');
                    
                    const enlaceTexto = botonCuenta.querySelector('a');
                    if (enlaceTexto) {
                        enlaceTexto.textContent = `Cuenta (${data.usuario})`;
                    }
                }
            }
        })
        .catch(error => console.error("Error revisando la sesión:", error));
});