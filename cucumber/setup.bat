@echo off
REM setup.bat - Script de inicialización para Windows

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Setup de Cucumber para Mattermost
echo ==========================================
echo.

REM Verificar Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo XX Node.js no esta instalado.
    echo Por favor instala Node.js primero desde https://nodejs.org
    exit /b 1
)

echo ++ Node.js version: 
node -v
echo ++ npm version:
npm -v
echo.

REM Crear directorios
echo Creando directorios...
if not exist reports mkdir reports
if not exist screenshots mkdir screenshots
if not exist artifacts mkdir artifacts
if not exist logs mkdir logs
echo ++ Directorios creados
echo.

REM Instalar dependencias
echo Instalando dependencias...
call npm install
echo ++ Dependencias instaladas
echo.

REM Crear .env si no existe
if not exist .env (
    echo Creando archivo .env...
    copy .env.example .env
    echo ++ Archivo .env creado. Editalo segun tus necesidades.
) else (
    echo ++ Archivo .env ya existe.
)
echo.

REM Verificar Mattermost
echo Verificando conexion a Mattermost...
curl -s http://localhost:8065 >nul 2>&1
if errorlevel 1 (
    echo !! No se puede conectar a Mattermost en http://localhost:8065
    echo    Asegurate de que Mattermost este corriendo antes de ejecutar pruebas.
) else (
    echo ++ Mattermost esta accesible en http://localhost:8065
)
echo.

echo ==========================================
echo ++ Setup completado!
echo ==========================================
echo.
echo Proximos pasos:
echo   1. Edita .env con tus valores
echo   2. Ejecuta: npm test
echo   3. Ver reporte: npm run test:report
echo.

endlocal
