function createChannel(channelName) {
  if (!channelName || channelName.trim().length < 3) {
    return { success: false, error: 'El nombre debe tener al menos 3 caracteres.' };
  }
  
  // Simulación: No permitir caracteres especiales (solo letras, números y guiones)
  const regex = /^[a-zA-Z0-9-]+$/;
  if (!regex.test(channelName)) {
    return { success: false, error: 'El nombre solo puede contener letras, números y guiones.' };
  }

  // Simulación: Éxito
  const newChannel = { id: `C-${Date.now()}`, name: channelName.toLowerCase() };
  return { success: true, channel: newChannel };
}

function assert(condition, message) {
  if (condition) {
    console.log(`✅ TEST PASSED: ${message}`);
  } else {
    console.error(`❌ TEST FAILED: ${message}`);
  }
}

console.log('\n--- Corriendo Pruebas de Creación de Canales ---');

const result1 = createChannel('proyecto-nuevo');
assert(result1.success === true && result1.channel.name === 'proyecto-nuevo', 
       'Debe crear un canal con nombre válido y convertirlo a minúsculas.');

const result2 = createChannel('ab');
assert(result2.success === false && result2.error.includes('al menos 3'), 
       'Debe fallar si el nombre es demasiado corto.');

const result3 = createChannel('canal&invalido');
assert(result3.success === false && result3.error.includes('solo puede contener'), 
       'Debe fallar si contiene caracteres especiales no permitidos (&).');

const result4 = createChannel('');
assert(result4.success === false && result4.error.includes('al menos 3'), 
       'Debe fallar si el nombre está vacío.');