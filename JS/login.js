const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

const USER_EMAIL = 'usuario@correo.com';
const USER_PASSWORD = '123456';

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email === USER_EMAIL && password === USER_PASSWORD) {
    loginMessage.textContent = 'Inicio de sesión exitoso. ¡Bienvenido!';
    loginMessage.style.color = '#0a8a0a';
  } else {
    loginMessage.textContent = 'Correo o contraseña incorrectos.';
    loginMessage.style.color = '#c12c2c';
  }
});
