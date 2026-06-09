document.addEventListener("DOMContentLoaded", () => {

    fetch('../PHP/SiHay.php')
        .then(response => response.text())
        .then(texto => {
            const data = texto ? JSON.parse(texto) : {};

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
                const botonCuenta = document.querySelector('.usuario_registrado');

                if (botonCuenta) {
                    botonCuenta.classList.remove('hidden');

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

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const eventoId = params.get('id');
    const errorElement = document.getElementById('evento-error');
    const detalleSection = document.querySelector('.detalle-contenido');

    if (!eventoId) {
        showError('No se proporcionó el ID del evento.');
        return;
    }

    const addButton = document.getElementById('btn-agregar-carrito');
    let detalleEvento = null;

    fetch(`../PHP/ObtenerEvento.php?id=${encodeURIComponent(eventoId)}`)
        .then(response => response.json()
            .then(data => ({ ok: response.ok, data }))
        )
        .then(({ ok, data }) => {
            if (!ok || data.error) {
                showError(data.mensaje || 'No se pudo cargar el evento.');
                return;
            }

            detalleEvento = data;
            document.getElementById('evento-nombre').textContent = data.nombre;
            document.getElementById('evento-fecha').textContent = `📅 Fecha: ${data.fecha}`;
            document.getElementById('evento-ubicacion').textContent = `📍 Lugar: ${data.ubicacion}`;
            document.getElementById('evento-precio').textContent = `💰 Precio: ${data.precio}`;
            document.getElementById('evento-descripcion').textContent = data.descripcion;
            const imagen = document.getElementById('evento-imagen');
            imagen.src = data.imagen;
            imagen.alt = `Imagen de ${data.nombre}`;

            if (addButton) {
                addButton.disabled = false;
                addButton.addEventListener('click', () => {
                    fetch('../PHP/SiHay.php')
                        .then(response => response.text())
                        .then(texto => {
                            const data = texto ? JSON.parse(texto) : {};

                            //Si no esta logueado...
                            if (!data.logueado) {
                                window.location.href = 'IniciarS.html';
                                return;
                            }

                            addEventoAlCarrito(detalleEvento);
                        })
                        .catch(() => {
                            window.location.href = 'IniciarS.html';
                        });
                });
            }
        })
        .catch(() => {
            showError('Error cargando los detalles del evento.');
        });

    function addEventoAlCarrito(evento) {
        if (!evento || !evento.id) return;

        const CART_KEY = 'cart_items_v1';
        const rawCart = localStorage.getItem(CART_KEY);
        const cart = rawCart ? JSON.parse(rawCart) : [];
        const precio = Number(String(evento.precio).replace(/[^0-9\.]+/g, '')) || 0;
        const existing = cart.find(item => item.id == evento.id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: evento.id,
                title: evento.nombre,
                price: precio,
                img: evento.imagen,
                qty: 1
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        alert('Evento agregado al carrito.');
    }

    function showError(mensaje) {
        if (detalleSection) {
            detalleSection.classList.add('hidden');
        }
        if (errorElement) {
            errorElement.textContent = mensaje;
            errorElement.classList.remove('hidden');
        }
    }
});