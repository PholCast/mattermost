function login(username, password) {
  // Simulación: Credenciales correctas
  if (username === 'admin' && password === '12345') {
    return { success: true, user: { id: 1, username: username } };
  } 
  // Simulación: Credenciales incorrectas
  else if (username && password) {
    return { success: false, error: 'Credenciales inválidas' };
  }
  // Simulación: Campos vacíos
  else {
    return { success: false, error: 'Campos requeridos vacíos' };
  }
}

function assert(condition, message) {
  if (condition) {
    console.log(`✅ TEST PASSED: ${message}`);
  } else {
    console.error(`❌ TEST FAILED: ${message}`);
  }
}

console.log('--- Corriendo Pruebas de Login ---');

const result1 = login('admin', '12345');
assert(result1.success === true && result1.user.username === 'admin', 
       'Debe iniciar sesión correctamente con credenciales válidas.');

const result2 = login('admin', 'password_incorrecta');
assert(result2.success === false && result2.error === 'Credenciales inválidas', 
       'Debe fallar el login con contraseña incorrecta.');

const result3 = login('', '');
assert(result3.success === false && result3.error === 'Campos requeridos vacíos', 
       'Debe fallar el login con campos vacíos.');