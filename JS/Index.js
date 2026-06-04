document.addEventListener("DOMContentLoaded", () => {
    // Buscamos saliendo de la carpeta de vistas hacia PHP
    fetch('../PHP/SiHay.php')
        .then(response => response.json())
        .then(data => {
            if (data.logueado) {
                // 1. Ocultamos los botones de Iniciar Sesión y Registrarse
                document.querySelectorAll('.invitado').forEach(elemento => {
                    elemento.classList.add('hidden'); 
                });

                // 2. Buscamos el botón de 'Cuenta' y le quitamos el 'hidden'
                const botonCuenta = document.querySelector('.usuario-registrado');
                if (botonCuenta) {
                    botonCuenta.classList.remove('hidden');
                    
                    // Modificamos el enlace dinámicamente con el nombre real del usuario
                    const enlaceTexto = botonCuenta.querySelector('.MiCuenta');
                    if (enlaceTexto) {
                        enlaceTexto.textContent = `Cuenta (${data.usuario})`;
                    }
                }

                // 3. Lógica para abrir/cerrar el menú desplegable
                const dropdown = document.querySelector('.dropdown');
                const dropdownContent = document.querySelector('.dropdown-content');

                if (dropdown && dropdownContent) {
                    dropdown.addEventListener('click', (e) => {
                        e.preventDefault(); // Evitamos que intente saltar a '#'
                        dropdownContent.classList.toggle('show');
                    });

                    // Si da clic en cualquier otro lado de la pantalla, cerramos el menú
                    window.addEventListener('click', (e) => {
                        if (!dropdown.contains(e.target)) {
                            dropdownContent.classList.remove('show');
                        }
                    });
                }
            }
        })
        .catch(error => console.error("Error revisando la sesión:", error));
});