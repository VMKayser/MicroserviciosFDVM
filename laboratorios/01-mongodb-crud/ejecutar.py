#!/usr/bin/env python3
import os
import sys
import subprocess
import time
import signal

# Ignore SIGPIPE to handle pipes (less, head, etc.) gracefully
try:
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
except Exception:
    pass


# ANSI Color codes
C_RESET = "\033[0m"
C_BOLD = "\033[1m"
C_CYAN = "\033[1;36m"
C_GREEN = "\033[1;32m"
C_YELLOW = "\033[1;33m"
C_BLUE = "\033[1;34m"
C_MAGENTA = "\033[1;35m"
C_RED = "\033[1;31m"
C_GRAY = "\033[0;90m"
C_WHITE = "\033[1;37m"

def run_mongo_eval(code):
    cmd = ["mongosh", "tienda", "--eval", code]
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.stdout.strip()

EXERCISES_DATA = [
    # B1 - B18: Consultas
    {
        "num": "B1",
        "title": "B1 · Productos de categoría 2 o 7 con nombre y precio (sin _id)",
        "statement": "Mostrá los productos de la categoría 2 o 7, con el nombre y el precio únicamente, sin el _id.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ categoria: { $in: [2, 7] } }, { nombre: 1, precio: 1, _id: 0 })",
                "eval": "db.productos.find({ categoria: { $in: [2, 7] } }, { nombre: 1, precio: 1, _id: 0 })"
            }
        ],
        "explanation": "Se utiliza $in sobre categoria y proyección { nombre: 1, precio: 1, _id: 0 }."
    },
    {
        "num": "B2",
        "title": "B2 · Productos con precio entre 100 y 300 (inclusivo)",
        "statement": "Mostrá los productos cuyo precio esté entre 100 y 300, incluidos los dos extremos.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ precio: { $gte: 100, $lte: 300 } })",
                "eval": "db.productos.find({ precio: { $gte: 100, $lte: 300 } })"
            }
        ],
        "explanation": "Se combinan los operadores $gte y $lte en el campo precio."
    },
    {
        "num": "B3",
        "title": "B3 · Productos que no están activos",
        "statement": "Mostrá los productos que no están activos.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ activo: false })",
                "eval": "db.productos.find({ activo: false })"
            }
        ],
        "explanation": "Filtro directo por { activo: false }."
    },
    {
        "num": "B4",
        "title": "B4 · Productos cuyo nombre empieza con la letra A o C",
        "statement": "Mostrá los productos cuyo nombre empiece con la letra A o con la letra C.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ nombre: /^[AC]/ })",
                "eval": "db.productos.find({ nombre: /^[AC]/ })"
            }
        ],
        "explanation": "Expresión regular con anclaje al inicio /^[AC]/."
    },
    {
        "num": "B5",
        "title": "B5 · Productos que tienen el campo variantes",
        "statement": "Mostrá los productos que tienen el campo variantes.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ variantes: { $exists: true } })",
                "eval": "db.productos.find({ variantes: { $exists: true } })"
            }
        ],
        "explanation": "El operador $exists: true verifica la presencia del campo."
    },
    {
        "num": "B6",
        "title": "B6 · Productos con stock_minimo cargado como texto",
        "statement": "Encontrá los productos donde stock_minimo se cargó como texto en vez de número.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ stock_minimo: { $type: \"string\" } })",
                "eval": "db.productos.find({ stock_minimo: { $type: 'string' } })"
            }
        ],
        "explanation": "El operador $type: \"string\" detecta los datos mal cargados."
    },
    {
        "num": "B7",
        "title": "B7 · Los 4 productos con más stock (solo nombre y stock)",
        "statement": "Mostrá los 4 productos con más stock, con el nombre y el stock únicamente.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({}, { nombre: 1, stock: 1, _id: 0 }).sort({ stock: -1 }).limit(4)",
                "eval": "db.productos.find({}, { nombre: 1, stock: 1, _id: 0 }).sort({ stock: -1 }).limit(4)"
            }
        ],
        "explanation": "Proyección y ordenamiento con .sort({ stock: -1 }).limit(4)."
    },
    {
        "num": "B8",
        "title": "B8 · Segunda página de listado ordenado por nombre (de 4 en 4)",
        "statement": "Mostrá la segunda página de un listado ordenado por nombre ascendente, de 4 en 4.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find().sort({ nombre: 1 }).skip(4).limit(4)",
                "eval": "db.productos.find().sort({ nombre: 1 }).skip(4).limit(4)"
            }
        ],
        "explanation": "Paginación usando .sort({ nombre: 1 }).skip(4).limit(4)."
    },
    {
        "num": "B9",
        "title": "B9 · Productos con la etiqueta \"organico\" o \"artesania\"",
        "statement": "Mostrá los productos que tengan la etiqueta \"organico\" o la etiqueta \"artesania\".",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ etiquetas: { $in: [\"organico\", \"artesania\"] } })",
                "eval": "db.productos.find({ etiquetas: { $in: ['organico', 'artesania'] } })"
            }
        ],
        "explanation": "Operador $in sobre el array etiquetas."
    },
    {
        "num": "B10",
        "title": "B10 · Productos cuyo array categorias tiene exactamente 1 elemento",
        "statement": "Mostrá los productos cuyo array categorias tenga exactamente un elemento.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ categorias: { $size: 1 } })",
                "eval": "db.productos.find({ categorias: { $size: 1 } })"
            }
        ],
        "explanation": "Operador $size: 1 para longitud exacta de array."
    },
    {
        "num": "B11",
        "title": "B11 · Productos con menos de 10 unidades en La Paz ($elemMatch)",
        "statement": "Mostrá los productos con menos de 10 unidades en el almacén de La Paz. Escribí las dos versiones —sin $elemMatch y con $elemMatch— y anotá cuántos documentos devuelve cada una y por qué son distintas.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ \"inventario.almacen\": \"La Paz\", \"inventario.cantidad\": { $lt: 10 } })",
                "eval": "db.productos.find({ 'inventario.almacen': 'La Paz', 'inventario.cantidad': { $lt: 10 } })"
            },
            {
                "cmd": "db.productos.find({ inventario: { $elemMatch: { almacen: \"La Paz\", cantidad: { $lt: 10 } } } })",
                "eval": "db.productos.find({ inventario: { $elemMatch: { almacen: 'La Paz', cantidad: { $lt: 10 } } } })"
            }
        ],
        "explanation": "JUSTIFICACIÓN:\n- Sin $elemMatch (devuelve 4): Evalúa condiciones de forma independiente; cuela TEX-006 (La Paz tiene 10, pero Sucre tiene 8 < 10).\n- Con $elemMatch (devuelve 3): Exige que ambas condiciones se cumplan en el MISMO subdocumento (ART-001, CER-007, TEX-012)."
    },
    {
        "num": "B12",
        "title": "B12 · Productos cuya primera categoría es 1",
        "statement": "Mostrá los productos cuya primera categoría del array categorias sea 1.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ \"categorias.0\": 1 })",
                "eval": "db.productos.find({ 'categorias.0': 1 })"
            }
        ],
        "explanation": "Notación de punto con posición indexada \"categorias.0\"."
    },
    {
        "num": "B13",
        "title": "B13 · Productos registrados durante el año 2025",
        "statement": "Mostrá los productos registrados durante el año 2025.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.find({ registrado: { $gte: ISODate(\"2025-01-01\"), $lt: ISODate(\"2026-01-01\") } })",
                "eval": "db.productos.find({ registrado: { $gte: ISODate('2025-01-01'), $lt: ISODate('2026-01-01') } })"
            }
        ],
        "explanation": "Rango de fechas con ISODate."
    },
    {
        "num": "B14",
        "title": "B14 · Cantidad de productos activos",
        "statement": "Averiguá cuántos productos están activos. Se pide el número, no la lista.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.productos.countDocuments({ activo: true })",
                "eval": "db.productos.countDocuments({ activo: true })"
            }
        ],
        "explanation": "countDocuments({ activo: true }) devuelve 10."
    },
    {
        "num": "B15",
        "title": "B15 · Pedidos de Sucre con total mayor a 300",
        "statement": "Mostrá los pedidos de la ciudad de Sucre cuyo total sea mayor a 300.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.pedidos.find({ ciudad: \"Sucre\", total: { $gt: 300 } })",
                "eval": "db.pedidos.find({ ciudad: 'Sucre', total: { $gt: 300 } })"
            }
        ],
        "explanation": "Filtro AND implícito por ciudad y total."
    },
    {
        "num": "B16",
        "title": "B16 · Pedidos que incluyan el producto \"ALM-005\"",
        "statement": "Mostrá los pedidos que incluyan el producto de código \"ALM-005\".",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.pedidos.find({ \"items.codigo\": \"ALM-005\" })",
                "eval": "db.pedidos.find({ 'items.codigo': 'ALM-005' })"
            }
        ],
        "explanation": "Notación de punto dentro del array items."
    },
    {
        "num": "B17",
        "title": "B17 · Pedidos que tengan más de un ítem",
        "statement": "Mostrá los pedidos que tengan más de un ítem.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.pedidos.find({ \"items.1\": { $exists: true } })",
                "eval": "db.pedidos.find({ 'items.1': { $exists: true } })"
            }
        ],
        "explanation": "Existencia del índice 1 en el array items."
    },
    {
        "num": "B18",
        "title": "B18 · Lista de clientes distintos que hicieron pedidos",
        "statement": "Mostrá la lista de clientes distintos que hicieron pedidos.",
        "category": "Consultas (B1–B18)",
        "steps": [
            {
                "cmd": "db.pedidos.distinct(\"cliente\")",
                "eval": "db.pedidos.distinct('cliente')"
            }
        ],
        "explanation": "distinct('cliente') extrae los 4 clientes únicos."
    },

    # B19 - B22: Creación
    {
        "num": "B19",
        "title": "B19 · Inserción de un producto nuevo completo",
        "statement": "Insertá un producto nuevo que tenga, como mínimo: un array de textos, un subdocumento y un array de subdocumentos. Los datos son de tu invención, pero tienen que ser coherentes con los demás productos.",
        "category": "Creación (B19–B22)",
        "steps": [
            {
                "cmd": '''db.productos.insertOne({
  codigo: "TEX-013",
  nombre: "Gorro de lana de llama",
  precio: 75,
  stock: 30,
  stock_minimo: 5,
  activo: true,
  categoria: 4,
  categorias: [4, 8],
  etiquetas: ["textil", "lana", "artesania"],
  medidas: { alto: 25, ancho: 20, unidad: "cm" },
  inventario: [
    { almacen: "Sucre", cantidad: 20 },
    { almacen: "La Paz", cantidad: 10 }
  ],
  registrado: new Date("2025-08-01T00:00:00Z")
})''',
                "eval": '''db.productos.insertOne({
  codigo: "TEX-013",
  nombre: "Gorro de lana de llama",
  precio: 75,
  stock: 30,
  stock_minimo: 5,
  activo: true,
  categoria: 4,
  categorias: [4, 8],
  etiquetas: ["textil", "lana", "artesania"],
  medidas: { alto: 25, ancho: 20, unidad: "cm" },
  inventario: [
    { almacen: "Sucre", cantidad: 20 },
    { almacen: "La Paz", cantidad: 10 }
  ],
  registrado: new Date("2025-08-01T00:00:00Z")
})'''
            }
        ],
        "explanation": "insertOne() con array de textos, subdocumento y array de subdocumentos."
    },
    {
        "num": "B20",
        "title": "B20 · Inserción de tres productos en una sola instrucción",
        "statement": "Insertá tres productos más en una sola instrucción.",
        "category": "Creación (B19–B22)",
        "steps": [
            {
                "cmd": '''db.productos.insertMany([
  { codigo: "CER-014", nombre: "Taza de arcilla esmaltada", precio: 35, stock: 50, activo: true, categoria: 5, etiquetas: ["ceramica", "artesania"] },
  { codigo: "BEB-015", nombre: "Vino tinto de Cinti 750 ml", precio: 80, stock: 45, activo: true, categoria: 2, etiquetas: ["bebida", "vino", "cinti"] },
  { codigo: "JOY-016", nombre: "Anillo de filigrana de plata", precio: 220, stock: 15, activo: true, categoria: 6, etiquetas: ["joyeria", "plata"] }
])''',
                "eval": '''db.productos.insertMany([
  { codigo: "CER-014", nombre: "Taza de arcilla esmaltada", precio: 35, stock: 50, activo: true, categoria: 5, etiquetas: ["ceramica", "artesania"] },
  { codigo: "BEB-015", nombre: "Vino tinto de Cinti 750 ml", precio: 80, stock: 45, activo: true, categoria: 2, etiquetas: ["bebida", "vino", "cinti"] },
  { codigo: "JOY-016", nombre: "Anillo de filigrana de plata", precio: 220, stock: 15, activo: true, categoria: 6, etiquetas: ["joyeria", "plata"] }
])'''
            }
        ],
        "explanation": "insertMany() para inserción múltiple atómica."
    },
    {
        "num": "B21",
        "title": "B21 · Inserción de un pedido con _id 7 y dos ítems",
        "statement": "Insertá un pedido con _id 7, de un cliente que no exista todavía, con dos ítems.",
        "category": "Creación (B19–B22)",
        "steps": [
            {
                "cmd": '''db.pedidos.insertOne({
  _id: 7,
  cliente: "Mateo Fernandez",
  ciudad: "Cochabamba",
  estado: "pendiente",
  items: [
    { codigo: "ART-001", cantidad: 2, precio: 850 },
    { codigo: "ALM-005", cantidad: 5, precio: 28 }
  ],
  total: 1840,
  fecha: new Date("2025-07-15T10:00:00Z")
})''',
                "eval": '''db.pedidos.insertOne({
  _id: 7,
  cliente: "Mateo Fernandez",
  ciudad: "Cochabamba",
  estado: "pendiente",
  items: [
    { codigo: "ART-001", cantidad: 2, precio: 850 },
    { codigo: "ALM-005", cantidad: 5, precio: 28 }
  ],
  total: 1840,
  fecha: new Date("2025-07-15T10:00:00Z")
})'''
            }
        ],
        "explanation": "insertOne() con _id numérico explícito y cálculo de total."
    },
    {
        "num": "B22",
        "title": "B22 · Inserción sin precio y conteo de productos sin precio",
        "statement": "Insertá un producto sin el campo precio. Después contá cuántos productos no tienen precio y explicá el número que sale.",
        "category": "Creación (B19–B22)",
        "steps": [
            {
                "cmd": '''db.productos.insertOne({
  codigo: "ESC-017",
  nombre: "Escultura tallada en madera",
  stock: 4,
  stock_minimo: 1,
  activo: true,
  categoria: 3,
  etiquetas: ["madera", "escultura"]
})''',
                "eval": '''db.productos.insertOne({
  codigo: "ESC-017",
  nombre: "Escultura tallada en madera",
  stock: 4,
  stock_minimo: 1,
  activo: true,
  categoria: 3,
  etiquetas: ["madera", "escultura"]
})'''
            },
            {
                "cmd": "db.productos.countDocuments({ precio: { $exists: false } })",
                "eval": "db.productos.countDocuments({ precio: { $exists: false } })"
            }
        ],
        "explanation": "JUSTIFICACIÓN:\nSalen 2 productos sin precio (el original TEX-012 poncho de vicuña + el nuevo ESC-017 recién insertado)."
    },

    # B23 - B28: Actualización
    {
        "num": "B23",
        "title": "B23 · Subir 10% el precio en categoría 4 y análisis de TEX-012 ($mul)",
        "statement": "Subí un 10 % el precio de los productos de la categoría 4. Después mirá el precio del poncho de vicuña (TEX-012) y explicá qué le pasó y por qué.",
        "category": "Actualización (B23–B28)",
        "steps": [
            {
                "cmd": "load(\"seed.js\")",
                "eval": "load('seed.js')"
            },
            {
                "cmd": "db.productos.updateMany({ categoria: 4 }, { $mul: { precio: 1.1 } })",
                "eval": "db.productos.updateMany({ categoria: 4 }, { $mul: { precio: 1.1 } })"
            },
            {
                "cmd": "db.productos.find({ codigo: \"TEX-012\" }, { codigo: 1, nombre: 1, precio: 1, _id: 0 })",
                "eval": "db.productos.find({ codigo: 'TEX-012' }, { codigo: 1, nombre: 1, precio: 1, _id: 0 })"
            }
        ],
        "explanation": "JUSTIFICACIÓN:\nEl poncho TEX-012 no tenía precio. El operador $mul sobre un campo inexistente lo crea y lo inicializa en 0 (0 * 1.1 = 0), quedando precio: 0."
    },
    {
        "num": "B24",
        "title": "B24 · Actualizar pedidos enviados a entregados con fecha del servidor",
        "statement": "Pasá a \"entregado\" todos los pedidos que estén en \"enviado\", y dejales registrada la fecha de entrega con la hora del servidor. Una sola instrucción.",
        "category": "Actualización (B23–B28)",
        "steps": [
            {
                "cmd": '''db.pedidos.updateMany(
  { estado: "enviado" },
  { $set: { estado: "entregado" }, $currentDate: { fecha_entrega: true } }
)''',
                "eval": '''db.pedidos.updateMany(
  { estado: "enviado" },
  { $set: { estado: "entregado" }, $currentDate: { fecha_entrega: true } }
)'''
            }
        ],
        "explanation": "updateMany() con $set y $currentDate."
    },
    {
        "num": "B25",
        "title": "B25 · Agregar etiqueta \"liquidacion\" a inactivos sin duplicar",
        "statement": "Agregá la etiqueta \"liquidacion\" a todos los productos inactivos, de manera que no se duplique si alguno ya la tuviera.",
        "category": "Actualización (B23–B28)",
        "steps": [
            {
                "cmd": '''db.productos.updateMany(
  { activo: false },
  { $addToSet: { etiquetas: "liquidacion" } }
)''',
                "eval": '''db.productos.updateMany(
  { activo: false },
  { $addToSet: { etiquetas: "liquidacion" } }
)'''
            }
        ],
        "explanation": "$addToSet asegura no duplicar la etiqueta."
    },
    {
        "num": "B26",
        "title": "B26 · Eliminar stock_minimo cargado como texto ($unset)",
        "statement": "Borrá el campo stock_minimo únicamente en los productos donde está cargado como texto. Verificá después que no queda ninguno así.",
        "category": "Actualización (B23–B28)",
        "steps": [
            {
                "cmd": '''db.productos.updateMany(
  { stock_minimo: { $type: "string" } },
  { $unset: { stock_minimo: "" } }
)''',
                "eval": '''db.productos.updateMany(
  { stock_minimo: { $type: "string" } },
  { $unset: { stock_minimo: "" } }
)'''
            },
            {
                "cmd": "db.productos.find({ stock_minimo: { $type: \"string\" } })",
                "eval": "db.productos.find({ stock_minimo: { $type: 'string' } })"
            }
        ],
        "explanation": "$unset borra el campo stock_minimo de los registros mal tipados."
    },
    {
        "num": "B27",
        "title": "B27 · Agregar almacén Camiri al Café de los Yungas ($push)",
        "statement": "Agregá al café de los Yungas (ALM-011) un almacén nuevo: \"Camiri\" con 5 unidades, sin tocar los almacenes que ya tiene.",
        "category": "Actualización (B23–B28)",
        "steps": [
            {
                "cmd": '''db.productos.updateOne(
  { codigo: "ALM-011" },
  { $push: { inventario: { almacen: "Camiri", cantidad: 5 } } }
)''',
                "eval": '''db.productos.updateOne(
  { codigo: "ALM-011" },
  { $push: { inventario: { almacen: "Camiri", cantidad: 5 } } }
)'''
            }
        ],
        "explanation": "$push añade el almacén al final del array."
    },
    {
        "num": "B28",
        "title": "B28 · Actualizar o crear BEB-030 con upsert",
        "statement": "Con una sola instrucción, actualizá el producto de código \"BEB-030\" si existe y creálo si no existe, con un nombre, precio 40 y stock 25.",
        "category": "Actualización (B23–B28)",
        "steps": [
            {
                "cmd": '''db.productos.updateOne(
  { codigo: "BEB-030" },
  { $set: { nombre: "Cerveza artesanal de trigo", precio: 40, stock: 25 } },
  { upsert: true }
)''',
                "eval": '''db.productos.updateOne(
  { codigo: "BEB-030" },
  { $set: { nombre: "Cerveza artesanal de trigo", precio: 40, stock: 25 } },
  { upsert: true }
)'''
            }
        ],
        "explanation": "upsert: true inserta el producto si no existe."
    },

    # B29 - B32: Eliminación
    {
        "num": "B29",
        "title": "B29 · Contar y eliminar pedidos cancelados",
        "statement": "Contá cuántos pedidos están cancelados y recién después borralos. Entregá los dos comandos, en ese orden.",
        "category": "Eliminación (B29–B32)",
        "steps": [
            {
                "cmd": "db.pedidos.countDocuments({ estado: \"cancelado\" })",
                "eval": "db.pedidos.countDocuments({ estado: 'cancelado' })"
            },
            {
                "cmd": "db.pedidos.deleteMany({ estado: \"cancelado\" })",
                "eval": "db.pedidos.deleteMany({ estado: 'cancelado' })"
            }
        ],
        "explanation": "Verificación previa con countDocuments() y borrado con deleteMany()."
    },
    {
        "num": "B30",
        "title": "B30 · Eliminar un solo producto con etiqueta \"textil\"",
        "statement": "Eliminá un solo producto que tenga la etiqueta \"textil\". Ojo: hay más de uno, y el comando tiene que borrar exactamente uno.",
        "category": "Eliminación (B29–B32)",
        "steps": [
            {
                "cmd": "db.productos.deleteOne({ etiquetas: \"textil\" })",
                "eval": "db.productos.deleteOne({ etiquetas: 'textil' })"
            }
        ],
        "explanation": "deleteOne() elimina solo el primer documento que coincide."
    },
    {
        "num": "B31",
        "title": "B31 · Eliminar productos con stock menor a 5",
        "statement": "Eliminá los productos con stock menor a 5.",
        "category": "Eliminación (B29–B32)",
        "steps": [
            {
                "cmd": "db.productos.deleteMany({ stock: { $lt: 5 } })",
                "eval": "db.productos.deleteMany({ stock: { $lt: 5 } })"
            }
        ],
        "explanation": "deleteMany({ stock: { $lt: 5 } }) borra masivamente."
    },
    {
        "num": "B32",
        "title": "B32 · Restaurar base de datos y verificar conteos",
        "statement": "Restaurá la base al punto de partida y verificá que quedaron 12 productos y 6 pedidos.",
        "category": "Eliminación (B29–B32)",
        "steps": [
            {
                "cmd": "load(\"seed.js\")",
                "eval": "load('seed.js')"
            },
            {
                "cmd": "db.productos.countDocuments()",
                "eval": "db.productos.countDocuments()"
            },
            {
                "cmd": "db.pedidos.countDocuments()",
                "eval": "db.pedidos.countDocuments()"
            }
        ],
        "explanation": "Restauración con seed.js y comprobación de 12 productos y 6 pedidos."
    }
]

def print_header(clear=True):
    if clear:
        os.system("clear" if os.name == "posix" else "cls")
    print(f"{C_CYAN}{C_BOLD}╔══════════════════════════════════════════════════════════════════════╗{C_RESET}")
    print(f"{C_CYAN}{C_BOLD}║      UNIVERSIDAD SAN FRANCISCO XAVIER DE CHUQUISACA                  ║{C_RESET}")
    print(f"{C_CYAN}{C_BOLD}║      COM-600 · Microservicios · Práctica 1 (MongoDB CRUD)            ║{C_RESET}")
    print(f"{C_CYAN}{C_BOLD}║      Estudiante: Valencia Medina Freddy Daniel                       ║{C_RESET}")
    print(f"{C_CYAN}{C_BOLD}╚══════════════════════════════════════════════════════════════════════╝{C_RESET}\n")

def execute_exercise(ex):
    print(f"{C_BLUE}{C_BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{C_RESET}")
    print(f"{C_YELLOW}{C_BOLD}▶ [{ex['num']}] {ex['title']}{C_RESET}")
    print(f"{C_GRAY}Enunciado: {C_WHITE}{ex['statement']}{C_RESET}")
    print(f"{C_BLUE}──────────────────────────────────────────────────────────────────────{C_RESET}")
    
    for step in ex["steps"]:
        print(f"{C_GREEN}{C_BOLD}tienda>{C_RESET} {C_WHITE}{step['cmd']}{C_RESET}")
        out = run_mongo_eval(step["eval"])
        if out:
            print(f"{C_CYAN}{out}{C_RESET}")
        else:
            print(f"{C_GRAY}// (sin salida / cursor vacío){C_RESET}")
    
    print(f"\n{C_MAGENTA}💡 Explicación / Justificación:{C_RESET}")
    print(f"{C_GRAY}{ex['explanation']}{C_RESET}")
    print(f"{C_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{C_RESET}\n")

def run_all(pause_between_batches=False, batch_size=10):
    print(f"{C_GREEN}Restaurando base de datos inicial con seed.js...{C_RESET}")
    run_mongo_eval("load('seed.js')")
    time.sleep(0.3)
    
    count = 0
    total = len(EXERCISES_DATA)
    for idx, ex in enumerate(EXERCISES_DATA, 1):
        execute_exercise(ex)
        count += 1
        
        if pause_between_batches and (count % batch_size == 0) and idx < total:
            print(f"{C_YELLOW}{C_BOLD}--- Lote completado ({idx}/{total}) ---{C_RESET}")
            input(f"{C_GREEN}Presiona [ENTER] para continuar con los siguientes...{C_RESET}\n")

def run_category(cat_name):
    print(f"{C_GREEN}Restaurando base de datos inicial con seed.js...{C_RESET}")
    run_mongo_eval("load('seed.js')")
    
    filtered = [e for e in EXERCISES_DATA if e["category"] == cat_name]
    for ex in filtered:
        execute_exercise(ex)

def run_single(ex_num):
    ex_num = ex_num.strip().upper()
    found = [e for e in EXERCISES_DATA if e["num"] == ex_num]
    if not found:
        print(f"{C_RED}Error: Ejercicio '{ex_num}' no encontrado (debe ser B1 a B32).{C_RESET}")
        return
    execute_exercise(found[0])

def main_menu():
    while True:
        print_header(clear=True)
        print(f"{C_BOLD}Selecciona una opción de ejecución:{C_RESET}\n")
        print(f"  {C_GREEN}1.{C_RESET} {C_BOLD}Ejecutar TODO completo (B1 a B32 continuo — queda todo en el historial){C_RESET}")
        print(f"  {C_GREEN}2.{C_RESET} {C_BOLD}Ejecutar de 10 en 10 (con pausas interactivas [Enter]){C_RESET}")
        print(f"  {C_GREEN}3.{C_RESET} {C_BOLD}Ejecutar paso a paso (ejercicio por ejercicio con pausa){C_RESET}")
        print(f"  {C_GREEN}4.{C_RESET} {C_BOLD}Ejecutar por Bloques:{C_RESET}")
        print(f"      {C_CYAN}4.1{C_RESET} Consultas (B1 a B18)")
        print(f"      {C_CYAN}4.2{C_RESET} Creación (B19 a B22)")
        print(f"      {C_CYAN}4.3{C_RESET} Actualización (B23 a B28)")
        print(f"      {C_CYAN}4.4{C_RESET} Eliminación (B29 a B32)")
        print(f"  {C_GREEN}5.{C_RESET} {C_BOLD}Ejecutar un Ejercicio específico (ej. B11, B22, B23...){C_RESET}")
        print(f"  {C_GREEN}6.{C_RESET} {C_BOLD}Restaurar base de datos a estado inicial (load seed.js){C_RESET}")
        print(f"  {C_GREEN}0.{C_RESET} {C_BOLD}Salir{C_RESET}\n")
        
        choice = input(f"{C_YELLOW}Ingresa tu opción [0-6]: {C_RESET}").strip()
        
        if choice == "1":
            print_header(clear=False)
            run_all(pause_between_batches=False)
            print(f"{C_GREEN}{C_BOLD}✓ Todo ejecutado exitosamente. Puedes usar la rueda del ratón o Shift+RePág para subir y ver desde B1 hasta B32.{C_RESET}")
            input(f"\n{C_YELLOW}Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "2":
            print_header(clear=False)
            run_all(pause_between_batches=True, batch_size=10)
            input(f"\n{C_GREEN}Ejecución finalizada. Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "3":
            print_header(clear=False)
            run_all(pause_between_batches=True, batch_size=1)
            input(f"\n{C_GREEN}Ejecución finalizada. Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice in ["4", "4.1"]:
            print_header(clear=False)
            run_category("Consultas (B1–B18)")
            input(f"\n{C_GREEN}Bloque completado. Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "4.2":
            print_header(clear=False)
            run_category("Creación (B19–B22)")
            input(f"\n{C_GREEN}Bloque completado. Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "4.3":
            print_header(clear=False)
            run_category("Actualización (B23–B28)")
            input(f"\n{C_GREEN}Bloque completado. Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "4.4":
            print_header(clear=False)
            run_category("Eliminación (B29–B32)")
            input(f"\n{C_GREEN}Bloque completado. Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "5":
            num = input(f"{C_CYAN}Ingresa el número de ejercicio (ej. B11): {C_RESET}").strip()
            print_header(clear=False)
            run_single(num)
            input(f"\n{C_GREEN}Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "6":
            print_header(clear=False)
            print(f"{C_GREEN}Restaurando base de datos 'tienda' con seed.js...{C_RESET}")
            res = run_mongo_eval("load('seed.js'); db.productos.countDocuments() + ' productos y ' + db.pedidos.countDocuments() + ' pedidos';")
            print(f"{C_CYAN}{res}{C_RESET}")
            input(f"\n{C_GREEN}Base restaurada. Presiona [ENTER] para volver al menú...{C_RESET}")
        elif choice == "0" or choice.lower() == "salir":
            print(f"\n{C_GREEN}¡Hasta pronto!{C_RESET}\n")
            break
        else:
            print(f"{C_RED}Opción no válida.{C_RESET}")
            time.sleep(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg == "all":
            run_all(pause_between_batches=False)
        elif arg in ["10", "batch"]:
            run_all(pause_between_batches=True, batch_size=10)
        elif arg.upper().startswith("B"):
            run_single(arg)
        else:
            main_menu()
    else:
        main_menu()
