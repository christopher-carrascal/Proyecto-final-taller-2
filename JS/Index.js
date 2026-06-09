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
        
    initFiltradoEventos();
    // cargarEventos(); // viejo flujo de carga desactivado porque el filtrado ahora carga los eventos
    initCarousel();
});

/*---------------------------------------------------------------------*/
function initCarousel() {
    const carousel = document.getElementById('imageCarousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const indicators = Array.from(carousel.querySelectorAll('.carousel-indicator'));
    const btnPrev = carousel.querySelector('.carousel-button.prev');
    const btnNext = carousel.querySelector('.carousel-button.next');
    let currentIndex = 0;
    let intervalId = null;

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    btnNext?.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    btnPrev?.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
    });

    function resetInterval() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(nextSlide, 5000);
    }

    goToSlide(0);
    resetInterval();
}

//--------------------------------------------------------
//Lo siguiente es la logica para añada cada cuadro que encuentre en base de datos

//Se comentó, debido a que ya no se usaba, sin envargo queda ahi por si acaso
/*function cargarEventos() {

    const seccionInferior = document.querySelector('.CuerpoInferior-izquierda');
    const contenedorEventos = document.getElementById('contenedor-eventos');
    const busquedaInput = document.getElementById('busqueda-eventos-input');
    const categoriaSelect = document.getElementById('categoria-eventos-select');
    const sinResultados = document.getElementById('sin-resultados');

    if (!seccionInferior || !contenedorEventos || !busquedaInput || !categoriaSelect || !sinResultados) return;

    let eventosGuardados = [];

    function renderEventos(eventos) {
        if (eventos.length === 0) {
            contenedorEventos.innerHTML = '';
            sinResultados.classList.remove('hidden');
            return;
        }

        sinResultados.classList.add('hidden');
        contenedorEventos.innerHTML = eventos.map(evento => `
            <div class="tarjeta-evento-guardado">
                <div class="evento-texto">
                    <h2>${evento.nombre}</h2>
                    <p class="fecha">📅 <strong>Fecha:</strong> ${evento.fecha}</p>
                    <p class="ubicacion">📍 <strong>Lugar:</strong> ${evento.ubicacion}</p>
                    <p class="descripcion"><strong>Desc: </strong>${evento.descripcion}</p>
                </div>
                <div class="evento-foto">
                    <a class="evento-imagen-link" href="EventoDetalle.html?id=${evento.id}" title="Ver detalles de ${evento.nombre}">
                        <img src="${evento.imagen}" alt="Imagen de ${evento.nombre}">
                    </a>
                </div>
            </div>
        `).join('');
    }

    function actualizarCategorias(eventos) {
        const categorias = Array.from(new Set(eventos
            .map(evento => evento.ubicacion?.trim())
            .filter(Boolean)
        )).sort();

        categoriaSelect.innerHTML = '<option value="">Todas</option>' + categorias
            .map(categoria => `<option value="${categoria}">${categoria}</option>`)
            .join('');
    }

    function aplicarFiltros() {
        const termino = busquedaInput.value.trim().toLowerCase();
        const categoriaSeleccionada = categoriaSelect.value;

        const eventosFiltrados = eventosGuardados.filter(evento => {
            const coincidenciaCategoria = !categoriaSeleccionada || evento.ubicacion === categoriaSeleccionada;
            const textoBusqueda = `${evento.nombre} ${evento.ubicacion} ${evento.descripcion}`.toLowerCase();
            const coincidenciaTexto = termino === '' || textoBusqueda.includes(termino);
            return coincidenciaCategoria && coincidenciaTexto;
        });

        renderEventos(eventosFiltrados);
    }

    busquedaInput.addEventListener('input', aplicarFiltros);
    categoriaSelect.addEventListener('change', aplicarFiltros);

    fetch('../PHP/ObtenerE.php')
        .then(response => response.json())
        .then(eventos => {

            // Verifica si en la base de datos hay eventos siquiera
            if (eventos.length > 0) {

                //Deja el título principal


                //Crea un contenedor interno para ordenar los cuadros con CSS
                const Contenedor = document.createElement('div');
                Contenedor.classList.add('contenedorE');

                //Recorre los eventos devueltos por PHP
                eventos.forEach(evento => {

                    //Esto crea la estructura del contenedor
                    const Estructura = `
                        <div class="tarjeta-evento-guardado">
                            <div class="evento-texto">
                                <h2>${evento.nombre}</h2>
                                <p class="fecha">📅 <strong>Fecha:</strong> ${evento.fecha}</p>
                                <p class="ubicacion">📍 <strong>Lugar:</strong> ${evento.ubicacion}</p>
                                <p class="descripcion"><strong>Desc: </strong>${evento.descripcion}</p>
                            </div>
                            <div class="evento-foto">
                                <a class="evento-imagen-link" href="EventoDetalle.html?id=${evento.id}" title="Ver detalles de ${evento.nombre}">
                                    <img src="${evento.imagen}" alt="Imagen de ${evento.nombre}">
                                </a>
                            </div>
                        </div>
                    `;
                    //Vamos sumando cada tarjeta al contenedor
                    Contenedor.innerHTML += Estructura;
                });

                //Inyecta todo el bloque de tarjetas dentro de la sección
                seccionInferior.appendChild(Contenedor);
            }
        })
        .catch(error => console.error("Error al traer los eventos de la base de datos:", error));
}*/