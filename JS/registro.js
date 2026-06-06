const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

function showMessage(message, type = '') {
  registerMessage.textContent = message;
  registerMessage.classList.remove('success', 'error');
  if (type) registerMessage.classList.add(type);
}

registerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Frenamos el envío clásico

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (password !== confirmPassword) {
    showMessage('Las contraseñas no coinciden.', 'error');
    return;
  }

  const datos = new FormData();
  datos.append('username', username);
  datos.append('email', email);
  datos.append('password', password);
  datos.append('confirmPassword', confirmPassword);

  fetch('../PHP/Registrar.php', {
    method: 'POST',
    body: datos
  })
    .then(response => response.text())
    .then(textoPHP => {

      showMessage('¡Registro exitoso en la base de datos!', 'success');
      registerForm.reset();
    })
    .catch(error => {
      showMessage('Hubo un error en la conexión con el servidor.', 'error');
    });
});