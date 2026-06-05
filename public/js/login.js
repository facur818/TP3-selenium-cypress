const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const statusMsg = document.getElementById('statusMsg');

function clearLoginMessages() {
  usernameError.textContent = '';
  passwordError.textContent = '';
  statusMsg.textContent = '';
  statusMsg.className = 'status';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearLoginMessages();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  let hasError = false;

  if (!username) {
    usernameError.textContent = 'El campo usuario es obligatorio.';
    hasError = true;
  }

  if (!password) {
    passwordError.textContent = 'El campo contrasena es obligatorio.';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  statusMsg.textContent = 'Validando credenciales...';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      statusMsg.textContent = data.message;
      statusMsg.classList.add('success');
      setTimeout(() => {
        window.location.assign('/producto.html');
      }, 500);
      return;
    }

    statusMsg.textContent = data.message || 'No se pudo iniciar sesion.';
    statusMsg.classList.add('error');
  } catch (error) {
    statusMsg.textContent = 'Error de red al iniciar sesion.';
    statusMsg.classList.add('error');
  }
});
