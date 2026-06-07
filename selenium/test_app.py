from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:3000"


# CASOS FELIZ
def test_login_exitoso(driver):
    driver.get(BASE_URL)

    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-username"]').send_keys("admin")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]').send_keys("1234")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
    
    WebDriverWait(driver, 5).until(EC.url_contains("producto.html"))
    assert "producto.html" in driver.current_url

def test_producto_alta_exitosa(driver):
    driver.get(f"{BASE_URL}/producto.html")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-codigo"]').send_keys("PRD001")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-nombre"]').send_keys("Notebook")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-precio"]').send_keys("1000")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-stock"]').send_keys("10")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-submit"]').click()
    WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[data-testid="producto-status"]'),'Producto cargado en API'))
    status = driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-status"]')
    assert status.text == "Producto cargado en API"


# CASOS VALIDACION
def test_login_validacion_campos_obligatorios(driver):
    driver.get(BASE_URL)
    
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
    usuario_error = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-username-error"]')
    password_error = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password-error"]')
    assert usuario_error.text == "El campo usuario es obligatorio."
    assert password_error.text == "El campo contrasena es obligatorio."

def test_login_credenciales_invalidas(driver):
    driver.get(BASE_URL)
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-username"]').send_keys("admin")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]').send_keys("incorrecta")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
    WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[data-testid="login-status"]'),'incorrectos'))

    status = driver.find_element(By.CSS_SELECTOR,'[data-testid="login-status"]')

    assert status.text == "Usuario o contrasena incorrectos"
    assert "incorrect" in status.text.lower()


def test_producto_validacion_campos(driver):
    #Deberia loguearme primero, pero actualmente el producto.html no tiene proteccion de acceso, asi que lo dejo asi
    driver.get(f"{BASE_URL}/producto.html")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-submit"]').click()
    WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[data-testid="producto-status"]'),'Datos invalidos.'))
    codigo_error = driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-codigo-error"]')
    nombre_error = driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-nombre-error"]')
    precio_error = driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-precio-error"]')
    assert codigo_error.text == "El codigo es obligatorio."
    assert nombre_error.text == "El nombre es obligatorio."
    assert precio_error.text == "El precio debe ser mayor a 0."


def test_precio_producto_negativo(driver):
    driver.get(f"{BASE_URL}/producto.html")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-codigo"]').send_keys("PRD002")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-nombre"]').send_keys("Producto Precio Negativo")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-precio"]').send_keys("-100")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-stock"]').send_keys("5")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-submit"]').click()
    WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[data-testid="producto-status"]'),'Datos invalidos.'))
    precio_error = driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-precio-error"]')
    assert precio_error.text == "El precio debe ser mayor a 0."

def test_stock_producto_negativo(driver):
    driver.get(f"{BASE_URL}/producto.html")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-codigo"]').send_keys("PRD003")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-nombre"]').send_keys("Producto Stock Negativo")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-precio"]').send_keys("100")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-stock"]').send_keys("-5")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-submit"]').click()
    WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[data-testid="producto-status"]'),'Datos invalidos.'))
    stock_error = driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-stock-error"]')
    assert stock_error.text == "El stock no puede ser negativo."

#CASOS NEGATIVOS DE NEGOCIO
def test_producto_codigo_duplicado(driver):
    driver.get(f"{BASE_URL}/producto.html")

    #Primer producto con codigo PRD001
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-codigo"]').send_keys("PRD001")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-nombre"]').send_keys("Notebook")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-precio"]').send_keys("1000")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-stock"]').send_keys("10")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-submit"]').click()
    
    WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[data-testid="producto-status"]'),'Producto cargado en API'))

    #Segundo producto con mismo codigo PRD001
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-codigo"]').send_keys("PRD001")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-nombre"]').send_keys("Heladera")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-precio"]').send_keys("100")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-stock"]').send_keys("5")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="producto-submit"]').click()

    codigo_error = WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[data-testid="producto-codigo-error"]'),'Datos invalidos.'))
    assert codigo_error.text == "El codigo ya existe."