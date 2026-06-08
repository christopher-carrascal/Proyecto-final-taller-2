const inputImagen = document.getElementById('imagen-evento');
const zonaImagen = document.getElementById('zona-imagen');
const previewImagen = document.getElementById('preview-imagen');

let urlTemporal = null;

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
    .then(response => response.text())
    .then(texto => {
        const data = texto ? JSON.parse(texto) : {};

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
    const btnEliminar = document.getElementById('btnEliminar');
    const formularioBorrar = document.getElementById('formularioBorrar');

    // 1. Lógica para buscar el evento al dar clic en "Buscar"
    if (btnBuscarBorrar && inputIdBorrar && vistaPreviaBorrar) {
        btnBuscarBorrar.addEventListener('click', () => {
            const id = inputIdBorrar.value.trim();

            if (id === "") {
                alert("Por favor ingresa un ID válido primero.");
                return;
            }

            // Llamamos al buscador enviando el ID por la URL (GET)
            fetch(`../PHP/ObtenerEvento.php?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    if (!data.error) {
                        // Si lo encuentra, pintamos la estructura de tarjeta a la derecha
                        vistaPreviaBorrar.innerHTML = `
                        <div class="tarjeta-preview-borrar" style="display: flex; gap: 15px; background: #fff; padding: 15px; border-radius: 8px; width: 100%; border: 1px solid #ff3b30; text-align: left;">
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 5px 0; color: #ff3b30;">⚠️ Seleccionado: ${data.nombre}</h3>
                                <p style="margin: 3px 0; font-size: 0.9rem;">📅 <strong>Fecha:</strong> ${data.fecha}</p>
                                <p style="margin: 3px 0; font-size: 0.9rem;">📍 <strong>Lugar:</strong> ${data.ubicacion}</p>
                                <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">${data.descripcion}</p>
                            </div>
                            <div>
                                <img src="${data.imagen}" alt="Preview" style="width: 120px; height: 90px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">
                            </div>
                        </div>
                    `;
                        // Activamos el botón de eliminar porque ya sabemos qué vamos a borrar
                        btnEliminar.disabled = false;
                    } else {
                        alert("No se encontró ningún evento con el ID: " + id);
                        reestablecerSeccionBorrar();
                    }
                })
                .catch(error => {
                    console.error("Error buscando el evento:", error);
                    alert("Hubo un error al consultar el servidor.");
                });
        });
    }

    // Función auxiliar para limpiar la derecha si el ID no existe o se elimina
    function reestablecerSeccionBorrar() {
        vistaPreviaBorrar.innerHTML = `
        <div class="placeholder-borrar" style="color: #8e8e93; border: 2px dashed #ccc; border-radius: 8px; padding: 20px; text-align: center; height: 100%; display: flex; align-items: center; justify-content: center;">
            Aquí aparecerá la vista previa del evento seleccionado
        </div>
    `;
        btnEliminar.disabled = true;
    }

    // 2. Lógica para procesar el formulario de borrado definitivo (POST)
    if (formularioBorrar) {
        formularioBorrar.addEventListener('submit', (e) => {
            e.preventDefault();

            // Una doble confirmación nativa por seguridad
            const seguro = confirm("¿Estás absolutamente seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.");
            if (!seguro) return;

            const datosB = new FormData(formularioBorrar);

            fetch('../PHP/BorrarE.php', {
                method: 'POST',
                body: datosB
            })
                .then(response => response.text())
                .then(respuesta => {
                    console.log("RESPUESTA COMPLETA DEL SERVIDOR:", respuesta);
                    console.log("TRIMMED:", respuesta.trim());
                    
                    if (respuesta.trim() === "exito") {
                        alert("¡El evento ha sido eliminado con éxito de la base de datos y del servidor!");
                        formularioBorrar.reset();
                        reestablecerSeccionBorrar();
                    } else {
                        console.error("%c[Error del Servidor PHP en BorrarE]", "color: white; background: #ff3b30; padding: 4px; font-weight: bold;");
                        console.log("Respuesta exacta recibida:", respuesta);
                        alert("Error del servidor: " + respuesta);
                        
                    }
                })
                .catch(error => {
                    console.error("Error en la petición de borrado:", error);
                    alert("No se pudo conectar con el servidor para eliminar: " + error.message);
                });
        });
    }
}