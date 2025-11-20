const MOCK_MESSAGES = [
  { id: 1, text: 'Reunión mañana a las 10am', user: 'admin' },
  { id: 2, text: 'El informe de proyecto-alfa está listo.', user: 'alice' },
  { id: 3, text: 'Necesito acceso al proyecto-alfa.', user: 'bob' },
  { id: 4, text: 'Reunión de seguimiento.', user: 'admin' },
];

function searchMessages(query, author = null) {
  const normalizedQuery = query.toLowerCase();
  
  let results = MOCK_MESSAGES.filter(message => {
    // 1. Filtrar por texto
    const textMatches = message.text.toLowerCase().includes(normalizedQuery);
    
    // 2. Filtrar por autor (si se especifica)
    const authorMatches = author ? message.user.toLowerCase() === author.toLowerCase() : true;
    
    return textMatches && authorMatches;
  });

  return results;
}

function assert(condition, message) {
  if (condition) {
    console.log(`✅ TEST PASSED: ${message}`);
  } else {
    console.error(`❌ TEST FAILED: ${message}`);
  }
}

console.log('\n--- Corriendo Pruebas de Búsqueda de Mensajes ---');

// Prueba 1: Búsqueda de texto simple
const result1 = searchMessages('Reunión');
assert(result1.length === 2 && result1[0].id === 1, 
       'Debe encontrar dos mensajes con la palabra "Reunión".');

// Prueba 2: Búsqueda con filtro de autor
const result2 = searchMessages('proyecto-alfa', 'alice');
assert(result2.length === 1 && result2[0].id === 2, 
       'Debe encontrar un mensaje de "alice" que contenga "proyecto-alfa".');

// Prueba 3: Búsqueda que no arroja resultados
const result3 = searchMessages('factura');
assert(result3.length === 0, 
       'Debe retornar una lista vacía para un término no encontrado.');

// Prueba 4: Búsqueda solo por autor (vacío)
const result4 = searchMessages('10am');
assert(result4.length === 1 && result4[0].user === 'admin', 
       'Debe encontrar el mensaje por la hora "10am".');