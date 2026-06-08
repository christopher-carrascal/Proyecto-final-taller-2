let eventosGuardadosFiltrados = [];
let contenedorEventosFiltrados;
let busquedaEventosInput;
let precioEventosSelect;
let sinResultadosEvento;

function initFiltradoEventos() {
    contenedorEventosFiltrados = document.getElementById('contenedor-eventos');
    busquedaEventosInput = document.getElementById('busqueda-eventos-input');
    precioEventosSelect = document.getElementById('precio-eventos-select');
    sinResultadosEvento = document.getElementById('sin-resultados');

    if (!contenedorEventosFiltrados || !busquedaEventosInput || !precioEventosSelect || !sinResultadosEvento) return;

    busquedaEventosInput.addEventListener('input', aplicarFiltrosEventos);
    precioEventosSelect.addEventListener('change', aplicarFiltrosEventos);

    fetch('../PHP/ObtenerE.php')
        .then(response => response.json())
        .then(eventos => {
            cargarEventosFiltrables(eventos);
        })
        .catch(error => console.error('Error al traer los eventos de la base de datos:', error));
}

function cargarEventosFiltrables(eventos) {
    eventosGuardadosFiltrados = eventos;
    renderEventosFiltrados(eventosGuardadosFiltrados);
}

function renderEventosFiltrados(eventos) {
    if (!contenedorEventosFiltrados) return;

    if (eventos.length === 0) {
        contenedorEventosFiltrados.innerHTML = '';
        sinResultadosEvento?.classList.remove('hidden');
        return;
    }

    sinResultadosEvento?.classList.add('hidden');
    contenedorEventosFiltrados.innerHTML = eventos.map(evento => `
        <div class="tarjeta-evento-guardado">
            <div class="evento-texto">
                <h2>${evento.nombre}</h2>
                <p class="fecha">📅 <strong>Fecha:</strong> ${evento.fecha}</p>
                <p class="ubicacion">📍 <strong>Lugar:</strong> ${evento.ubicacion}</p>
                <p class="precio"><strong>Precio:</strong> ${evento.precio}</p>
            </div>
            <div class="evento-foto">
                <a class="evento-imagen-link" href="EventoDetalle.html?id=${evento.id}" title="Ver detalles de ${evento.nombre}">
                    <img src="${evento.imagen}" alt="Imagen de ${evento.nombre}">
                </a>
            </div>
        </div>
    `).join('');
}

function aplicarFiltrosEventos() {
    if (!busquedaEventosInput || !precioEventosSelect) return;

    const termino = busquedaEventosInput.value.trim().toLowerCase();
    const precioSeleccionado = precioEventosSelect.value;

    const eventosFiltrados = eventosGuardadosFiltrados.filter(evento => {
        const textoBusqueda = `${evento.nombre} ${evento.ubicacion} ${evento.descripcion}`.toLowerCase();
        const coincidenciaTexto = termino === '' || textoBusqueda.includes(termino);
        const coincidenciaPrecio = !precioSeleccionado || precioFilterMatches(evento.precio, precioSeleccionado);
        return coincidenciaTexto && coincidenciaPrecio;
    });

    renderEventosFiltrados(eventosFiltrados);
}

function precioFilterMatches(precio, rango) {
    const precioNumero = Number(String(precio).replace(/[^0-9.,-]/g, '').replace(',', '.'));
    if (Number.isNaN(precioNumero)) return false;

    switch (rango) {
        case '0-100':
            return precioNumero <= 100;
        case '101-200':
            return precioNumero > 100 && precioNumero <= 200;
        case '201-300':
            return precioNumero > 200 && precioNumero <= 300;
        case '301-500':
            return precioNumero > 300 && precioNumero <= 500;
        case '501-':
            return precioNumero > 500;
        default:
            return true;
    }
}
