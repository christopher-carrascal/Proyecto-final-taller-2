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
                const botonCuenta = document.querySelector('.usuario-registrado');

                if (botonCuenta) {
                    botonCuenta.classList.remove('hidden');

                    const enlaceTexto = botonCuenta.querySelector('.MiCuenta');

                    if (enlaceTexto) {
                        enlaceTexto.textContent = `Cuenta (${data.usuario})`;
                    }
                }

                // Dropdown
                const dropdown = document.querySelector('.dropdown');
                const dropdownContent = document.querySelector('.dropdown-content');
                const btnCerrar = document.querySelector('.btn-cerrar');

                console.log("btnCerrar =", btnCerrar);

                console.log("btnCerrar =", btnCerrar);

                if (btnCerrar) {

                    btnCerrar.onclick = function (e) {
                        e.stopPropagation();

                        console.log("CLICK EN CERRAR");

                        window.location.href = this.href;
                    };

                }
            }
        })
        .catch(error => {
            console.error("Error revisando la sesión:", error);
        });

});