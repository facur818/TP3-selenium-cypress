const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, service: 'app-e2e-demo' });
});

app.post('/api/login', (req, res) => {
  const { username = '', password = '' } = req.body || {};

  const user = String(username).trim();
  const pass = String(password).trim();

  if (!user || !pass) {
    return res.status(400).json({ ok: false, message: 'Usuario y contrasena son obligatorios.' });
  }

  if (user === 'admin' && pass === '1234') {
    return res.status(200).json({ ok: true, message: 'Inicio de sesion exitoso' });
  }

  return res.status(401).json({ ok: false, message: 'Usuario o contrasena incorrectos' });
});

app.post('/api/productos', async (req, res) => {
  const { codigo = '', nombre = '', precio, stock } = req.body || {};

  const item = {
    codigo: String(codigo).trim(),
    nombre: String(nombre).trim(),
    precio: Number(precio),
    stock: Number(stock)
  };

  const errors = {};

  if (!item.codigo) {
    errors.codigo = 'El codigo es obligatorio.';
  }

  if (!item.nombre) {
    errors.nombre = 'El nombre es obligatorio.';
  }

  if (!Number.isFinite(item.precio) || item.precio <= 0) {
    errors.precio = 'El precio debe ser mayor a 0.';
  }

  if (!Number.isInteger(item.stock) || item.stock < 0) {
    errors.stock = 'El stock no puede ser negativo.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors, message: 'Datos invalidos.' });
  }

  await new Promise((resolve) => setTimeout(resolve, 700));

  return res.status(201).json({
    ok: true,
    message: 'Producto cargado en API',
    data: {
      id: Date.now(),
      ...item
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`App E2E demo escuchando en http://localhost:${PORT}`);
});
