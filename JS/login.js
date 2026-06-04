const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

function getUserKey(email) {
  return `user_${email.toLowerCase()}`;
}

function getUser(email) {
  const stored = localStorage.getItem(getUserKey(email));
  return stored ? JSON.parse(stored) : null;
}

function showMessage(message, type = '') {
  loginMessage.textContent = message;
  loginMessage.classList.remove('success', 'error');
  if (type) {
    loginMessage.classList.add(type);
  }
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const user = getUser(email);
  if (!user) {
    showMessage('No se encontró una cuenta con ese correo. Regístrate primero.', 'error');
    return;
  }

  if (user.password === password) {
    showMessage('Inicio de sesión exitoso. ¡Bienvenido!', 'success');
  } else {
    showMessage('Contraseña incorrecta. Intenta de nuevo.', 'error');
  }
});
