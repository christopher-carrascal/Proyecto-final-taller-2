const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

function showMessage(message, type = '') {
    loginMessage.textContent = message;
    loginMessage.classList.remove('success', 'error');
    if (type) {
        loginMessage.classList.add(type);
    }
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Frenamos la recarga de la página

    const usuario = document.getElementById('User').value.trim();
    const password = document.getElementById('password').value.trim();

    const datos = new FormData();
    datos.append('User', usuario);
    datos.append('password', password);

    fetch('../PHP/Iniciar.php', {
        method: 'POST',
        body: datos
    })
        .then(response => response.text())
        .then(respuestaPHP => {
            // Usamos trim() para limpiar espacios invisibles o saltos de línea del PHP
            if (respuestaPHP.trim().includes("correcto")) {
                showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

                setTimeout(() => {
                    window.location.href = "Index.html";
                }, 1500);

            } else {
                showMessage(respuestaPHP, 'error');
            }
        })
        .catch(error => {
            showMessage('Hubo un error en la conexión con el servidor.', 'error');
        });
});