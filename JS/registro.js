const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

function getUserKey(email) {
  return `user_${email.toLowerCase()}`;
}

function saveUser(email, password) {
  const user = { email: email.toLowerCase(), password };
  localStorage.setItem(getUserKey(email), JSON.stringify(user));
}

function getUser(email) {
  const stored = localStorage.getItem(getUserKey(email));
  return stored ? JSON.parse(stored) : null;
}

function showMessage(message, type = '') {
  registerMessage.textContent = message;
  registerMessage.classList.remove('success', 'error');
  if (type) {
    registerMessage.classList.add(type);
  }
}

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (password !== confirmPassword) {
    showMessage('Las contraseñas no coinciden. Verifica y vuelve a intentar.', 'error');
    return;
  }

  if (getUser(email)) {
    showMessage('Ya existe un usuario con ese correo. Usa otro o inicia sesión.', 'error');
    return;
  }

  saveUser(email, password);
  showMessage('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
  registerForm.reset();
});