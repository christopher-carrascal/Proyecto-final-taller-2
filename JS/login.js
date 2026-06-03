const authForm = document.getElementById('authForm');
const loginMessage = document.getElementById('loginMessage');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const formTitle = document.getElementById('formTitle');
const formDescription = document.getElementById('formDescription');
const authButton = document.getElementById('authButton');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const confirmPasswordInput = document.getElementById('confirmPassword');

let currentMode = 'login';

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
  loginMessage.textContent = message;
  loginMessage.classList.remove('success', 'error');
  if (type) {
    loginMessage.classList.add(type);
  }
}

function setMode(mode) {
  currentMode = mode;
  if (mode === 'login') {
    showLogin.classList.add('active');
    showRegister.classList.remove('active');
    formTitle.textContent = 'Iniciar sesión';
    formDescription.textContent = 'Accede a tu cuenta con tu correo y contraseña.';
    authButton.textContent = 'Ingresar';
    confirmPasswordGroup.classList.add('hidden');
  } else {
    showRegister.classList.add('active');
    showLogin.classList.remove('active');
    formTitle.textContent = 'Registrarse';
    formDescription.textContent = 'Crea una nueva cuenta.';
    authButton.textContent = 'Registrarse';
    confirmPasswordGroup.classList.remove('hidden');
  }
  showMessage('', '');
}

showLogin.addEventListener('click', () => setMode('login'));
showRegister.addEventListener('click', () => setMode('register'));

authForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (currentMode === 'register') {
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
    setMode('login');
    authForm.reset();
    return;
  }

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

setMode('login');
