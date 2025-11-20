const ROLES = {
    MEMBER: 'member',
    MODERATOR: 'moderator',
    ADMIN: 'admin'
};

function checkPermission(userRole, action, isPrivateChannel = false) {
  
  if (userRole === ROLES.ADMIN) {
    return true;
  }

  switch (action) {
    case 'post_message':
      // Todos los miembros pueden postear, incluso en canales privados
      return userRole === ROLES.MEMBER || userRole === ROLES.MODERATOR;

    case 'delete_message':
      // Solo moderadores y administradores pueden eliminar mensajes
      return userRole === ROLES.MODERATOR;

    case 'invite_user':
      // En canales privados, solo el moderador/admin puede invitar
      if (isPrivateChannel) {
        return userRole === ROLES.MODERATOR;
      }
      // En canales públicos, todos los miembros pueden invitar
      return userRole === ROLES.MEMBER || userRole === ROLES.MODERATOR;

    default:
      return false;
  }
}

function assert(condition, message) {
  if (condition) {
    console.log(`✅ TEST PASSED: ${message}`);
  } else {
    console.error(`❌ TEST FAILED: ${message}`);
  }
}
console.log('\n--- Corriendo Pruebas de Permisos de Usuario ---');

// Prueba 1: Administrador puede eliminar mensajes
assert(checkPermission(ROLES.ADMIN, 'delete_message') === true, 
       'ADMIN debe poder eliminar mensajes.');

// Prueba 2: Miembro NO puede eliminar mensajes
assert(checkPermission(ROLES.MEMBER, 'delete_message') === false, 
       'MEMBER NO debe poder eliminar mensajes.');

// Prueba 3: Moderador puede invitar en canal público
assert(checkPermission(ROLES.MODERATOR, 'invite_user', false) === true, 
       'MODERATOR debe poder invitar en canal público.');

// Prueba 4: Miembro NO puede invitar en canal privado
assert(checkPermission(ROLES.MEMBER, 'invite_user', true) === false, 
       'MEMBER NO debe poder invitar en canal privado.');

// Prueba 5: Todos pueden postear
assert(checkPermission(ROLES.MEMBER, 'post_message') === true, 
       'Todos los usuarios (MEMBER) deben poder postear mensajes.');