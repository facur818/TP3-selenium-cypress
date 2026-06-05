const productForm = document.getElementById('productForm');
const codigoInput = document.getElementById('codigo');
const nombreInput = document.getElementById('nombre');
const precioInput = document.getElementById('precio');
const stockInput = document.getElementById('stock');

const codigoError = document.getElementById('codigoError');
const nombreError = document.getElementById('nombreError');
const precioError = document.getElementById('precioError');
const stockError = document.getElementById('stockError');
const statusMsg = document.getElementById('statusMsg');

function clearProductMessages() {
  codigoError.textContent = '';
  nombreError.textContent = '';
  precioError.textContent = '';
  stockError.textContent = '';
  statusMsg.textContent = '';
  statusMsg.className = 'status';
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearProductMessages();

  const payload = {
    codigo: codigoInput.value.trim(),
    nombre: nombreInput.value.trim(),
    precio: Number(precioInput.value),
    stock: Number(stockInput.value)
  };

  statusMsg.textContent = 'Cargando producto...';

  try {
    const response = await fetch('/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      statusMsg.textContent = data.message;
      statusMsg.classList.add('success');
      return;
    }

    const errors = data.errors || {};
    codigoError.textContent = errors.codigo || '';
    nombreError.textContent = errors.nombre || '';
    precioError.textContent = errors.precio || '';
    stockError.textContent = errors.stock || '';

    statusMsg.textContent = data.message || 'No se pudo cargar el producto.';
    statusMsg.classList.add('error');
  } catch (error) {
    statusMsg.textContent = 'Error de red al cargar producto.';
    statusMsg.classList.add('error');
  }
});
