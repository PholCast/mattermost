class MockFile {
    constructor(name, size, type) {
        this.name = name;
        this.size = size; // en bytes
        this.type = type;
    }
}

function uploadImage(file) {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  if (!file) {
    return { success: false, error: 'Archivo no seleccionado' };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: 'Archivo demasiado grande' };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Tipo de archivo no permitido' };
  }

  return { success: true, message: `Archivo ${file.name} subido.` };
}

function assert(condition, message) {
  if (condition) {
    console.log(`✅ TEST PASSED: ${message}`);
  } else {
    console.error(`❌ TEST FAILED: ${message}`);
  }
}

console.log('\n--- Corriendo Pruebas de Subida de Imagen ---');

const imgOK = new MockFile('test.png', 1000000, 'image/png'); // 1MB
const imgGrande = new MockFile('big.jpg', 6000000, 'image/jpeg'); // 6MB
const docInvalido = new MockFile('doc.pdf', 1000, 'application/pdf');

// Prueba 1: Subida Exitoso
const result1 = uploadImage(imgOK);
assert(result1.success === true, 
       'Debe aceptar una imagen de tipo y tamaño válidos (PNG).');

// Prueba 2: Archivo Demasiado Grande
const result2 = uploadImage(imgGrande);
assert(result2.success === false && result2.error.includes('demasiado grande'), 
       'Debe rechazar archivos que superen el límite de tamaño.');

// Prueba 3: Tipo de Archivo No Permitido
const result3 = uploadImage(docInvalido);
assert(result3.success === false && result3.error.includes('no permitido'), 
       'Debe rechazar tipos de archivo no permitidos (PDF).');