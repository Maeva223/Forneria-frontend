import os
import random
import sys
from datetime import timedelta
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import django
from django.utils import timezone

BACKEND_ROOT = Path(__file__).resolve().parents[2] / "Forneria"
sys.path.insert(0, str(BACKEND_ROOT))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "forneria.settings")
django.setup()

from pos.models import Cliente, DetalleVenta, Empleado, Pago, Producto, Venta


CLIENTES_DATA = [
    {
        "rut": "12345678-9",
        "nombre": "Juan Pérez González",
        "correo": "juan.perez@email.com",
        "telefono": "+56912345678",
    },
    {
        "rut": "23456789-0",
        "nombre": "María García Rodríguez",
        "correo": "maria.garcia@email.com",
        "telefono": "+56923456789",
    },
    {
        "rut": "34567890-1",
        "nombre": "Carlos López Martínez",
        "correo": "carlos.lopez@email.com",
        "telefono": "+56934567890",
    },
    {
        "rut": "45678901-2",
        "nombre": "Ana Fernández Silva",
        "correo": "ana.fernandez@email.com",
        "telefono": "+56945678901",
    },
    {
        "rut": "56789012-3",
        "nombre": "Roberto Martínez Torres",
        "correo": "roberto.martinez@email.com",
        "telefono": "+56956789012",
    },
    {
        "rut": "67890123-4",
        "nombre": "Carmen Sánchez Morales",
        "correo": "carmen.sanchez@email.com",
        "telefono": "+56967890123",
    },
    {
        "rut": "78901234-5",
        "nombre": "Pedro Ramírez Castro",
        "correo": "pedro.ramirez@email.com",
        "telefono": "+56978901234",
    },
    {
        "rut": "89012345-6",
        "nombre": "Isabel Flores Vargas",
        "correo": "isabel.flores@email.com",
        "telefono": "+56989012345",
    },
    {
        "rut": "90123456-7",
        "nombre": "Diego Morales Rojas",
        "correo": "diego.morales@email.com",
        "telefono": "+56990123456",
    },
    {
        "rut": "11223344-5",
        "nombre": "Patricia Vega Muñoz",
        "correo": "patricia.vega@email.com",
        "telefono": "+56911223344",
    },
]


def quantize_amount(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def ensure_clientes():
    clientes = []
    creados = 0
    for data in CLIENTES_DATA:
        cliente, created = Cliente.objects.get_or_create(
            rut=data["rut"],
            defaults={
                "nombre": data["nombre"],
                "correo": data["correo"],
                "telefono": data["telefono"],
                "es_empresa": False,
            },
        )
        clientes.append(cliente)
        if created:
            creados += 1
    return clientes, creados


def ensure_stock(productos):
    updated = 0
    for producto in productos:
        if not producto.stock_fisico or producto.stock_fisico <= 0:
            producto.stock_fisico = 100
            producto.save(update_fields=["stock_fisico"])
            updated += 1
    return updated


def crear_ventas(productos, clientes, empleado):
    fechas = [timezone.now() - timedelta(days=i) for i in range(20, 0, -2)]
    ventas_creadas = 0

    for idx, cliente in enumerate(clientes[:10]):
        fecha = fechas[idx % len(fechas)]

        items = []
        total = Decimal("0")

        for _ in range(random.randint(2, 4)):
            producto = random.choice(productos)
            cantidad = random.randint(1, 3)
            precio_unitario = Decimal(
                str(producto.precio_venta or producto.precio_costo or 5000)
            )
            total += precio_unitario * cantidad
            items.append((producto, cantidad, precio_unitario))

        neto = quantize_amount(total / Decimal("1.19"))
        iva = quantize_amount(total - neto)

        venta = Venta.objects.create(
            fecha=fecha,
            cliente=cliente,
            empleado=empleado,
            canal_venta="pos",
            direccion_despacho=None,
            costo_envio=Decimal("0"),
            neto=neto,
            iva=iva,
            total=total,
            estado="pagado",
            tipo_documento="boleta",
        )

        for producto, cantidad, precio_unitario in items:
            DetalleVenta.objects.create(
                venta=venta,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                descuento=0,
            )

        Pago.objects.create(
            venta=venta,
            monto=total,
            metodo=random.choice(["EFE", "TAR", "TRA"]),
            fecha=fecha,
        )

        ventas_creadas += 1
        print(f"✅ Venta #{venta.id} - {cliente.nombre} - ${total:,.0f}")

    return ventas_creadas


def main():
    print("\n🌱 Iniciando seed de ventas...\n")

    productos = list(Producto.objects.all())
    if not productos:
        print("❌ No hay productos disponibles. Ejecuta primero los seeds de productos.")
        return

    clientes, clientes_creados = ensure_clientes()
    if not clientes:
        print("❌ No se pudieron crear/obtener clientes")
        return

    empleado = Empleado.objects.first()
    stock_actualizados = ensure_stock(productos)

    print(
        f"Productos: {len(productos)} | Clientes: {len(clientes)} (+{clientes_creados} nuevos) | Empleado: {empleado}"
    )
    if stock_actualizados:
        print(f"Stocks ajustados a 100 para {stock_actualizados} productos sin stock")

    print("\n💰 Creando ventas históricas...\n")
    total_ventas = crear_ventas(productos, clientes, empleado)

    print(f"\n📊 Total ventas creadas: {total_ventas}")
    print("\n✨ ¡Completado!\n")


if __name__ == "__main__":
    main()
