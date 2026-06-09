const inputImagen = document.getElementById('imagen-evento');
const zonaImagen = document.getElementById('zona-imagen');
const previewImagen = document.getElementById('preview-imagen');

let urlTemporal = null;
let urlTemporalEditar = null;

if (inputImagen && zonaImagen && previewImagen) {
    inputImagen.addEventListener('change', () => {
        const archivo = inputImagen.files[0];

        if (urlTemporal) {
            URL.revokeObjectURL(urlTemporal);
        }

        if (!archivo) {
            previewImagen.hidden = true;
            previewImagen.removeAttribute('src');
            return;
        }

        if (!archivo.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida.');
            inputImagen.value = '';
            previewImagen.hidden = true;
            previewImagen.removeAttribute('src');
            return;
        }

        urlTemporal = URL.createObjectURL(archivo);
        previewImagen.src = urlTemporal;
        previewImagen.alt = `Vista previa de ${archivo.name}`;
        previewImagen.hidden = false;
    });
}

fetch('../PHP/SiHay.php')
    .then(response => response.json())
    .then(data => {
        if (data.logueado) {
            // Ocultar botones de invitado
            document.querySelectorAll('.invitado').forEach(elemento => {
                elemento.classList.add('hidden');
            });

            // Mostrar menú de usuario y poner nombre si existe
            document.querySelectorAll('.usuario-registrado').forEach(elemento => {
                elemento.classList.remove('hidden');
            });

            const botonCuenta = document.querySelector('.dropdown .MiCuenta');
            if (botonCuenta) {
                botonCuenta.textContent = `Cuenta${data.usuario ? ` (${data.usuario})` : ''}`;
            }

            // Verifica si soy admin, y si lo soy, muestro el botón de admin
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
        }
    })
    .catch(error => {
        console.error("Error revisando la sesión:", error);
    });

//-------------------------------------------
cargarDashboard();

function cargarDashboard() {
    fetch('../PHP/DashboardData.php')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const totalUsuarios = document.getElementById('dashboard-total-usuarios');
            const totalCuentas = document.getElementById('dashboard-total-cuentas');
            const totalEventos = document.getElementById('dashboard-total-eventos');
            const totalDinero = document.getElementById('dashboard-total-dinero');

            if (totalUsuarios) totalUsuarios.textContent = data.total_usuarios ?? 0;
            if (totalCuentas) totalCuentas.textContent = data.total_cuentas ?? 0;
            if (totalEventos) totalEventos.textContent = data.total_eventos ?? 0;
            if (totalDinero) totalDinero.textContent = `$${Number(data.total_dinero ?? 0).toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error cargando datos del dashboard:', error);
        });
}

//------------------------------------------
const FormularioE = document.getElementById('formulario-evento');

if (FormularioE) {
    FormularioE.addEventListener('submit', (e) => {
        e.preventDefault();

        const DatosF = new FormData(FormularioE);

        fetch('../PHP/GuardarE.php', {
            method: 'POST',
            body: DatosF,
        })

            .then(response => response.text())
            .then(respuestaPHP => {
                console.log("Respuesta del servidor:", respuestaPHP);

                if (respuestaPHP.trim() === "exito") {

                    alert("¡Evento creado y guardado con éxito!");
                    FormularioE.reset();

                    if (previewImagen) {

                        previewImagen.hidden = true;
                        previewImagen.removeAttribute('src');
                    }

                    cargarDashboard();
                } else {
                    console.error("Error capturado:", respuestaPHP);
                    alert("Error del servidor: " + respuestaPHP.trim());
                }
            })
            .catch(error => {
                console.error("Error en la conexión del formulario:", error);
                alert("Hubo un error al intentar conectar con el servidor: " + error.message);
            });
    });

}

LogicaEliminar();

/*---------------------------------------------------------------*/
function LogicaEliminar() {

    const inputIdBorrar = document.getElementById('idBorrar');
    const btnBuscarBorrar = document.getElementById('btnBuscarBorrar');
    const vistaPreviaBorrar = document.getElementById('vista-previa-borrar');
    const formularioGestion = document.getElementById('formularioGestion');

    // 1. Lógica para buscar el evento y cargar sus datos en inputs editables
    if (btnBuscarBorrar && inputIdBorrar && vistaPreviaBorrar) {
        btnBuscarBorrar.addEventListener('click', () => {
            const id = inputIdBorrar.value.trim();

            if (id === "") {
                console.warn("[Gestión] Intento de búsqueda con el campo ID vacío.");
                return;
            }

            fetch(`../PHP/ObtenerEvento.php?id=${id}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (!data.error && data.encontrado !== false) {
                        // Pintamos el formulario de edición a la derecha con los datos actuales cargados en los values
                        vistaPreviaBorrar.innerHTML = `
                        <div style="background: #fff; padding: 20px; border-radius: 8px; width: 100%; border: 1px solid #cfd8dc; text-align: left; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                            <h3 style="margin: 0 0 10px 0; color: #0076fe;">✏️ Editando Evento #${id}</h3>
                            
                            <label style="font-size: 0.85rem; font-weight: bold;">Nombre:</label>
                            <input type="text" name="ModNombre" value="${data.nombre}" required style="width: 100%; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px;">

                            <label style="font-size: 0.85rem; font-weight: bold;">Fecha:</label>
                            <input type="date" name="ModFecha" value="${data.fecha}" required style="width: 100%; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px;">

                            <label style="font-size: 0.85rem; font-weight: bold;">Ubicación:</label>
                            <input type="text" name="ModUbicacion" value="${data.ubicacion}" required style="width: 100%; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px;">

                            <label style="font-size: 0.85rem; font-weight: bold;">Precio de la Entrada ($):</label>
                            <input type="number" name="ModPrecio" value="${data.precio || data.Precio || 0}" step="0.01" required style="width: 100%; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; box-sizing: border-box;">

                            <label style="font-size: 0.85rem; font-weight: bold;">Descripción:</label>
                            <textarea name="ModDescripcion" rows="3" required style="width: 100%; padding: 8px; border: 1px solid #cfd8dc; border-radius: 6px; font-family: Arial, sans-serif; resize: vertical;">${data.descripcion}</textarea>

                            <label style="font-size: 0.85rem; font-weight: bold; margin-top: 10px;">Imagen actual:</label>
                            <img id="preview-imagen-editar" src="${data.imagen}" alt="Imagen actual del evento" style="width: 100%; max-height: 240px; object-fit: cover; border-radius: 8px; border: 1px solid #cfd8dc;">
                            <label for="imagen-evento-editar" style="display: inline-block; margin-top: 8px; padding: 10px 12px; background: #5856d6; color: white; border-radius: 6px; cursor: pointer; font-weight: bold; width: fit-content;">
                                Cambiar imagen
                                <input type="file" name="imagen-evento" id="imagen-evento-editar" accept="image/*" hidden>
                            </label>
                            <small style="color: #555;">Selecciona una nueva imagen para reemplazar la actual (opcional).</small>

                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                <button type="button" class="btn-accion-gestion" data-accion="modificar" style="flex: 1; background-color: #34c759; color: white; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Guardar Cambios</button>
                                <button type="button" class="btn-accion-gestion" data-accion="eliminar" style="flex: 1; background-color: #ff3b30; color: white; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Eliminar Evento</button>
                            </div>
                        </div>
                        `;

                        // Enganchar eventos a los nuevos botones dinámicos generados
                        asignarEventosBotonesGestion();
                        configurarInputImagenEditar();

                    } else {
                        console.warn(`[Gestión] No se encontró ningún evento con el ID: ${id}`);
                        alert("No se encontró ningún evento con el ID: " + id);
                        reestablecerSeccionBorrar();
                    }
                })
                .catch(error => {
                    console.error("%c[Error en Búsqueda PHP]", "color: white; background: red; padding: 3px;", error);
                });
        });
    }

    function reestablecerSeccionBorrar() {
        if (vistaPreviaBorrar) {
            vistaPreviaBorrar.innerHTML = `
                <div class="placeholder-borrar" style="color: #8e8e93; border: 2px dashed #ccc; border-radius: 8px; padding: 20px; text-align: center; height: 100%; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box;">
                    Busque un ID para cargar y editar los datos del evento
                </div>
            `;
        }
    }

    // 2. Escuchar cuál botón fue presionado (Modificar o Eliminar)
    function asignarEventosBotonesGestion() {
        const botones = vistaPreviaBorrar.querySelectorAll('.btn-accion-gestion');
        botones.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const accion = e.target.getAttribute('data-accion');
                procesarAccion(accion);
            });
        });
    }

    function configurarInputImagenEditar() {
        const inputImagenEditar = document.getElementById('imagen-evento-editar');
        const previewImagenEditar = document.getElementById('preview-imagen-editar');

        if (!inputImagenEditar || !previewImagenEditar) {
            return;
        }

        inputImagenEditar.addEventListener('change', () => {
            const archivo = inputImagenEditar.files[0];

            if (!archivo) {
                return;
            }

            if (!archivo.type.startsWith('image/')) {
                alert('Por favor selecciona una imagen válida.');
                inputImagenEditar.value = '';
                return;
            }

            if (urlTemporalEditar) {
                URL.revokeObjectURL(urlTemporalEditar);
            }

            urlTemporalEditar = URL.createObjectURL(archivo);
            previewImagenEditar.src = urlTemporalEditar;
            previewImagenEditar.alt = `Nueva imagen de ${archivo.name}`;
        });
    }

    function procesarAccion(accion) {
        const datosF = new FormData(formularioGestion);
        // Añadimos manualmente el ID del input principal al FormData por seguridad
        datosF.append('IdEvento', inputIdBorrar.value.trim());

        if (accion === 'eliminar') {
            const seguro = confirm("¿Estás absolutamente seguro de que deseas ELIMINAR este evento definitivamente?");
            if (!seguro) return;

            enviarPeticion('../PHP/BorrarE.php', datosF, "Eliminado");
        }

        if (accion === 'modificar') {
            const seguro = confirm("¿Deseas guardar los cambios realizados en este evento?");
            if (!seguro) return;

            enviarPeticion('../PHP/ModificarE.php', datosF, "Modificado");
        }
    }

    // Función auxiliar común para hacer el fetch POST limpio
    function enviarPeticion(url, formData, operacionExito) {
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(respuesta => {
                if (respuesta.trim() === "exito") {
                    console.log(`%c[Éxito] El evento fue ${operacionExito} correctamente.`, "color: green; font-weight: bold;");
                    alert(`¡Evento ${operacionExito} con éxito!`);
                    formularioGestion.reset();
                    reestablecerSeccionBorrar();
                    cargarDashboard();
                } else {
                    console.error(`%c[Error del Servidor PHP en ${operacionExito}]`, "color: white; background: #ff3b30; padding: 4px;");
                    console.log("Respuesta cruda:\n", respuesta);
                    alert("Error del servidor: " + respuesta.trim());
                }
            })
            .catch(error => {
                console.error("%c[Error de Red/Fetch]", "color: white; background: orange; padding: 3px;", error);
            });
    }
}