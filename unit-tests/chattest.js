function sendMessage(channelId, message, isAuthenticated = true) {
  if (!isAuthenticated) {
    return { success: false, error: 'No autenticado' };
  }
  if (!channelId || !message || message.trim() === '') {
    return { success: false, error: 'Mensaje o canal inválido' };
  }
  
  // Simulación de respuesta exitosa de la API
  const newPost = { 
    id: Date.now(), 
    channel_id: channelId, 
    text: message, 
    user: 'testuser' 
  };
  return { success: true, post: newPost };
}

function assert(condition, message) {
  if (condition) {
    console.log(`✅ TEST PASSED: ${message}`);
  } else {
    console.error(`❌ TEST FAILED: ${message}`);
  }
}

console.log('\n--- Corriendo Pruebas de Envío de Chat ---');

const result1 = sendMessage('general', 'Hola a todos!');
assert(result1.success === true && result1.post.text === 'Hola a todos!', 
       'Debe enviar un mensaje de texto correctamente.');

const result2 = sendMessage('general', '   ');
assert(result2.success === false && result2.error.includes('inválido'), 
       'Debe fallar si el mensaje está vacío.');

const result3 = sendMessage('general', 'Mensaje secreto', false);
assert(result3.success === false && result3.error.includes('autenticado'), 
       'Debe fallar si el usuario no está autenticado.');