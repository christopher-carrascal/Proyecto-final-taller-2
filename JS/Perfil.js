document.addEventListener("DOMContentLoaded", () => {

    fetch('../PHP/SiHay.php')
        .then(response => response.json())
        .then(data => {
            if (data.logueado) {

                // Ocultar botones de invitado
                document.querySelectorAll('.invitado').forEach(elemento => {
                    elemento.classList.add('hidden');
                });

                // Mostrar menú de usuario
                //Ahora muestra todo lo oculto
                document.querySelectorAll('.usuario-registrado').forEach(elemento => {
                    elemento.classList.remove('hidden');
                });

                // Personalizar el texto del botón Cuenta dentro del dropdown
                const botonCuenta = document.querySelector('.usuario-registrado.dropdown');

                if (botonCuenta) {
                    const enlaceTexto = botonCuenta.querySelector('.MiCuenta');

                    if (enlaceTexto) {
                        enlaceTexto.textContent = `Cuenta (${data.usuario})`;
                    }
                }

                //Verifica si soy admin, y si lo soy, muestro el botón de admin
                if (data.rol === 'admin') {
                    const botonAdmin = document.querySelector('.opcion-admin');
                    if (botonAdmin) {
                        botonAdmin.classList.remove('hidden');
                    }
                }

                // Dropdown de cuenta
                const dropdown = document.querySelector('.dropdown');
                const dropdownContent = dropdown?.querySelector('.dropdown-content');
                const btnCuenta = dropdown?.querySelector('.MiCuenta');
                const btnCarro = dropdown?.querySelector('.MiCarro');
                const btnCerrar = document.querySelector('.btn-cerrar');

                if (btnCuenta && dropdownContent) {
                    btnCuenta.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropdownContent.classList.toggle('show');
                    });
                }

                document.addEventListener('click', (e) => {
                    if (!dropdown?.contains(e.target)) {
                        dropdownContent?.classList.remove('show');
                    }
                });

                if (btnCerrar) {
                    btnCerrar.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.location.href = btnCerrar.href;
                    });
                }

                if (btnCarro) {
                    btnCarro.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.location.href = btnCarro.href;
                    });
                }
            }
        })
        .catch(error => {
            console.error("Error revisando la sesión:", error);
        });

});