# Script PowerShell para poblar clientes usando curl
# Requiere que proporciones un token válido

param(
    [string]$Token = ""
)

$API_URL = "http://localhost:8000"

$clientesHistoricos = @(
    @{ rut = "12345678-9"; nombre = "Juan"; apellido = "Pérez González"; email = "juan.perez@email.com"; telefono = "+56912345678"; direccion = "Av. Libertador Bernardo O'Higgins 1234, Santiago" },
    @{ rut = "23456789-0"; nombre = "María"; apellido = "García Rodríguez"; email = "maria.garcia@email.com"; telefono = "+56923456789"; direccion = "Calle Huérfanos 567, Santiago Centro" },
    @{ rut = "34567890-1"; nombre = "Carlos"; apellido = "López Martínez"; email = "carlos.lopez@email.com"; telefono = "+56934567890"; direccion = "Av. Providencia 2890, Providencia" },
    @{ rut = "45678901-2"; nombre = "Ana"; apellido = "Fernández Silva"; email = "ana.fernandez@email.com"; telefono = "+56945678901"; direccion = "Calle Moneda 1456, Santiago" },
    @{ rut = "56789012-3"; nombre = "Roberto"; apellido = "Martínez Torres"; email = "roberto.martinez@email.com"; telefono = "+56956789012"; direccion = "Av. Las Condes 3456, Las Condes" },
    @{ rut = "67890123-4"; nombre = "Carmen"; apellido = "Sánchez Morales"; email = "carmen.sanchez@email.com"; telefono = "+56967890123"; direccion = "Calle Ahumada 789, Santiago Centro" },
    @{ rut = "78901234-5"; nombre = "Pedro"; apellido = "Ramírez Castro"; email = "pedro.ramirez@email.com"; telefono = "+56978901234"; direccion = "Av. Vicuña Mackenna 4567, Ñuñoa" },
    @{ rut = "89012345-6"; nombre = "Isabel"; apellido = "Flores Vargas"; email = "isabel.flores@email.com"; telefono = "+56989012345"; direccion = "Calle Estado 234, Santiago" },
    @{ rut = "90123456-7"; nombre = "Diego"; apellido = "Morales Rojas"; email = "diego.morales@email.com"; telefono = "+56990123456"; direccion = "Av. Apoquindo 5678, Las Condes" },
    @{ rut = "11223344-5"; nombre = "Patricia"; apellido = "Vega Muñoz"; email = "patricia.vega@email.com"; telefono = "+56911223344"; direccion = "Calle Agustinas 1123, Santiago Centro" }
)

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "❌ Error: Se requiere un token de autenticación" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 USO:" -ForegroundColor Yellow
    Write-Host "   .\scripts\seed-clientes.ps1 -Token 'TU_TOKEN_AQUI'"
    Write-Host ""
    Write-Host "📝 Para obtener el token:" -ForegroundColor Cyan
    Write-Host "   1. Inicia sesión en la aplicación web (http://localhost:5173)"
    Write-Host "   2. Abre las herramientas de desarrollador (F12)"
    Write-Host "   3. Ve a Application -> Local Storage"
    Write-Host "   4. Busca la clave 'access' y copia su valor"
    Write-Host ""
    exit 1
}

Write-Host "🌱 Iniciando población de clientes históricos..." -ForegroundColor Green
Write-Host ""

$creados = 0
$existentes = 0
$errores = 0

foreach ($cliente in $clientesHistoricos) {
    try {
        $body = $cliente | ConvertTo-Json
        $headers = @{
            "Authorization" = "Bearer $Token"
            "Content-Type" = "application/json"
        }

        $response = Invoke-RestMethod -Uri "$API_URL/pos/api/clientes/" -Method Post -Headers $headers -Body $body -ErrorAction Stop
        
        Write-Host "✅ Cliente creado: $($cliente.nombre) $($cliente.apellido) ($($cliente.rut))" -ForegroundColor Green
        $creados++
        
        Start-Sleep -Milliseconds 200
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 400) {
            Write-Host "⚠️  Cliente ya existe: $($cliente.nombre) $($cliente.apellido) ($($cliente.rut))" -ForegroundColor Yellow
            $existentes++
        } elseif ($statusCode -eq 401) {
            Write-Host "❌ Error de autenticación. El token puede haber expirado." -ForegroundColor Red
            Write-Host "💡 Obtén un nuevo token iniciando sesión en la aplicación." -ForegroundColor Yellow
            break
        } else {
            Write-Host "❌ Error creando $($cliente.nombre) $($cliente.apellido): $_" -ForegroundColor Red
            $errores++
        }
    }
}

Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "   ✅ Clientes creados: $creados" -ForegroundColor Green
Write-Host "   ⚠️  Clientes existentes: $existentes" -ForegroundColor Yellow
Write-Host "   ❌ Errores: $errores" -ForegroundColor Red
Write-Host ("=" * 50) -ForegroundColor Cyan
