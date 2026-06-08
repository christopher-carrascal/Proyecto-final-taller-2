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
                    addEventoAlCarrito(detalleEvento);
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
        window.location.href = 'Carrito.html';
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