#!/bin/bash
# setup.sh - Script de inicialización rápida para pruebas Cucumber

set -e

echo "=========================================="
echo "Setup de Cucumber para Mattermost"
echo "=========================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Node.js versión: $(node -v)"
echo "✅ npm versión: $(npm -v)"
echo ""

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p reports screenshots artifacts logs
echo "✅ Directorios creados"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
echo "✅ Dependencias instaladas"
echo ""

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Edítalo según tus necesidades."
else
    echo "✅ Archivo .env ya existe."
fi
echo ""

# Verificar conexión a Mattermost
echo "🔍 Verificando conexión a Mattermost..."
if curl -s http://localhost:8065 > /dev/null; then
    echo "✅ Mattermost está accesible en http://localhost:8065"
else
    echo "⚠️  No se puede conectar a Mattermost en http://localhost:8065"
    echo "   Asegúrate de que Mattermost esté corriendo antes de ejecutar pruebas."
fi
echo ""

echo "=========================================="
echo "✅ Setup completado!"
echo "=========================================="
echo ""
echo "Próximos pasos:"
echo "  1. Edita .env con tus valores"
echo "  2. Ejecuta: npm test"
echo "  3. Ver reporte: npm run test:report"
echo ""
