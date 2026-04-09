#!/bin/bash

# Script para iniciar servidor local

cd "$(dirname "$0")"

echo "🚀 Iniciando servidor HTTP..."
echo "📍 Acceso: http://localhost:8000"
echo "🔐 Admin: http://localhost:8000/?admin (contraseña: admin)"
echo "⏹️  Presiona Ctrl+C para detener"
echo ""

python3 -m http.server 8000
