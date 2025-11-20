const CURRENT_USER_ID = 'user123';
const CURRENT_USERNAME = '@alice';

function shouldNotify(message, isDM = false) {
  // 1. Siempre notificar si es un Mensaje Directo (DM)
  if (isDM) {
    return { notify: true, reason: 'Mensaje Directo' };
  }

  // 2. Notificar si el mensaje contiene una mención al usuario
  const mentionPattern = new RegExp(`(^|\\s)${CURRENT_USERNAME}(\\s|$)`, 'i');
  if (mentionPattern.test(message)) {
    return { notify: true, reason: 'Mención directa' };
  }
  
  // 3. Notificar si contiene la mención especial "@all"
  if (message.includes('@all')) {
    return { notify: true, reason: '@all' };
  }

  // 4. No notificar
  return { notify: false, reason: 'Mensaje de canal normal' };
}

function assert(condition, message) {
  if (condition) {
    console.log(`✅ TEST PASSED: ${message}`);
  } else {
    console.error(`❌ TEST FAILED: ${message}`);
  }
}

console.log('\n--- Corriendo Pruebas de Notificaciones ---');

// Prueba 1: Mención Directa
const result1 = shouldNotify('Hola @alice, revisa esto.');
assert(result1.notify === true && result1.reason === 'Mención directa', 
       'Debe notificar si el usuario es mencionado directamente.');

// Prueba 2: Mensaje de Canal Normal
const result2 = shouldNotify('Este es un mensaje normal de canal.');
assert(result2.notify === false && result2.reason === 'Mensaje de canal normal', 
       'No debe notificar si no hay mención ni es DM.');

// Prueba 3: Mensaje Directo (DM)
const result3 = shouldNotify('Mensaje privado.', true);
assert(result3.notify === true && result3.reason === 'Mensaje Directo', 
       'Debe notificar siempre que sea un Mensaje Directo (DM).');

// Prueba 4: Mención @all
const result4 = shouldNotify('Atención equipo, @all es urgente.');
assert(result4.notify === true && result4.reason === '@all', 
       'Debe notificar si incluye la mención @all.');