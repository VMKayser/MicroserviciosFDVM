// ==========================================================================
// UNIVERSIDAD SAN FRANCISCO XAVIER DE CHUQUISACA
// COM-600 · Microservicios · Gestión 2026
// Práctica 1 — MongoDB CRUD (Parte B: Ejercicios Resolutivos B1 a B32)
// Estudiante: Valencia Medina Freddy Daniel
// ==========================================================================

db = db.getSiblingDB('tienda');
load('seed.js');

print('\n--- INICIANDO EJECUCIÓN DE LA PARTE B (B1 a B32) ---\n');

// ==========================================================================
// ■ CONSULTAS (B1–B18)
// ==========================================================================

// B1. Mostrá los productos de la categoría 2 o 7, con el nombre y el precio únicamente, sin el _id.
print('\n>>> [B1] B1. Productos de categoría 2 o 7 con nombre y precio (sin _id)');
db.productos.find({ categoria: { $in: [2, 7] } }, { nombre: 1, precio: 1, _id: 0 });

// B2. Mostrá los productos cuyo precio esté entre 100 y 300, incluidos los dos extremos.
print('\n>>> [B2] B2. Productos con precio entre 100 y 300 (inclusivo)');
db.productos.find({ precio: { $gte: 100, $lte: 300 } });

// B3. Mostrá los productos que no están activos.
print('\n>>> [B3] B3. Productos que no están activos');
db.productos.find({ activo: false });

// B4. Mostrá los productos cuyo nombre empiece con la letra A o con la letra C.
print('\n>>> [B4] B4. Productos cuyo nombre empieza con la letra A o con la letra C');
db.productos.find({ nombre: /^[AC]/ });

// B5. Mostrá los productos que tienen el campo variantes.
print('\n>>> [B5] B5. Productos que tienen el campo variantes');
db.productos.find({ variantes: { $exists: true } });

// B6. Encontrá los productos donde stock_minimo se cargó como texto en vez de número.
print('\n>>> [B6] B6. Productos donde stock_minimo se cargó como texto en vez de número');
db.productos.find({ stock_minimo: { $type: "string" } });

// B7. Mostrá los 4 productos con más stock, con el nombre y el stock únicamente.
print('\n>>> [B7] B7. Los 4 productos con más stock (solo nombre y stock)');
db.productos.find({}, { nombre: 1, stock: 1, _id: 0 }).sort({ stock: -1 }).limit(4);

// B8. Mostrá la segunda página de un listado ordenado por nombre ascendente, de 4 en 4.
print('\n>>> [B8] B8. Segunda página de listado ordenado por nombre ascendente (de 4 en 4)');
db.productos.find().sort({ nombre: 1 }).skip(4).limit(4);

// B9. Mostrá los productos que tengan la etiqueta "organico" o la etiqueta "artesania".
print('\n>>> [B9] B9. Productos con la etiqueta "organico" o "artesania"');
db.productos.find({ etiquetas: { $in: ["organico", "artesania"] } });

// B10. Mostrá los productos cuyo array categorias tenga exactamente un elemento.
print('\n>>> [B10] B10. Productos cuyo array categorias tiene exactamente un elemento');
db.productos.find({ categorias: { $size: 1 } });

// B11. Mostrá los productos con menos de 10 unidades en el almacén de La Paz. Escribí las dos versiones —sin $elemMatch y con $elemMatch— y anotá cuántos documentos devuelve cada una y por qué son distintas.
// JUSTIFICACIÓN:
// • Sin $elemMatch (devuelve 4 documentos): Evalúa los criterios de forma independiente sobre el array `inventario`. Se cuela erróneamente el producto TEX-006 (Chompa de alpaca), ya que cumple `almacen: "La Paz"` en un elemento (cantidad: 10) y `cantidad < 10` en otro elemento diferente (almacén: "Sucre", cantidad: 8).
// • Con $elemMatch (devuelve 3 documentos): Exige de forma estricta que ambas condiciones (`almacen == "La Paz"` y `cantidad < 10`) se cumplan dentro del MISMO subdocumento del array, retornando con precisión únicamente los productos correctos: ART-001, CER-007 y TEX-012.
print('\n>>> [B11] B11. Productos con menos de 10 unidades en La Paz ($elemMatch vs sin $elemMatch)');
db.productos.find({ "inventario.almacen": "La Paz", "inventario.cantidad": { $lt: 10 } });
db.productos.find({ inventario: { $elemMatch: { almacen: "La Paz", cantidad: { $lt: 10 } } } });

// B12. Mostrá los productos cuya primera categoría del array categorias sea 1.
print('\n>>> [B12] B12. Productos cuya primera categoría es 1');
db.productos.find({ "categorias.0": 1 });

// B13. Mostrá los productos registrados durante el año 2025.
print('\n>>> [B13] B13. Productos registrados durante el año 2025');
db.productos.find({ registrado: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } });

// B14. Averiguá cuántos productos están activos. Se pide el número, no la lista.
print('\n>>> [B14] B14. Cantidad de productos activos');
db.productos.countDocuments({ activo: true });

// B15. Mostrá los pedidos de la ciudad de Sucre cuyo total sea mayor a 300.
print('\n>>> [B15] B15. Pedidos de Sucre con total mayor a 300');
db.pedidos.find({ ciudad: "Sucre", total: { $gt: 300 } });

// B16. Mostrá los pedidos que incluyan el producto de código "ALM-005".
print('\n>>> [B16] B16. Pedidos que incluyan el producto "ALM-005"');
db.pedidos.find({ "items.codigo": "ALM-005" });

// B17. Mostrá los pedidos que tengan más de un ítem.
print('\n>>> [B17] B17. Pedidos que tengan más de un ítem');
db.pedidos.find({ "items.1": { $exists: true } });

// B18. Mostrá la lista de clientes distintos que hicieron pedidos.
print('\n>>> [B18] B18. Lista de clientes distintos que hicieron pedidos');
db.pedidos.distinct("cliente");

// ==========================================================================
// ■ CREACIÓN (B19–B22)
// ==========================================================================

// B19. Insertá un producto nuevo que tenga, como mínimo: un array de textos, un subdocumento y un array de subdocumentos. Los datos son de tu invención, pero tienen que ser coherentes con los demás productos.
print('\n>>> [B19] B19. Inserción de un producto nuevo completo');
db.productos.insertOne({
  codigo: "TEX-013",
  nombre: "Gorro de lana de llama",
  precio: 75,
  stock: 30,
  stock_minimo: 5,
  activo: true,
  categoria: 4,
  categorias: [4, 8],
  etiquetas: ["textil", "lana", "artesania"],
  medidas: {
    alto: 25,
    ancho: 20,
    unidad: "cm"
  },
  inventario: [
    { almacen: "Sucre", cantidad: 20 },
    { almacen: "La Paz", cantidad: 10 }
  ],
  registrado: new Date("2025-08-01T00:00:00Z")
});

// B20. Insertá tres productos más en una sola instrucción.
print('\n>>> [B20] B20. Inserción de tres productos en una sola instrucción');
db.productos.insertMany([
  {
    codigo: "CER-014",
    nombre: "Taza de arcilla esmaltada",
    precio: 35,
    stock: 50,
    activo: true,
    categoria: 5,
    etiquetas: ["ceramica", "artesania"]
  },
  {
    codigo: "BEB-015",
    nombre: "Vino tinto de Cinti 750 ml",
    precio: 80,
    stock: 45,
    activo: true,
    categoria: 2,
    etiquetas: ["bebida", "vino", "cinti"]
  },
  {
    codigo: "JOY-016",
    nombre: "Anillo de filigrana de plata",
    precio: 220,
    stock: 15,
    activo: true,
    categoria: 6,
    etiquetas: ["joyeria", "plata"]
  }
]);

// B21. Insertá un pedido con _id 7, de un cliente que no exista todavía, con dos ítems.
print('\n>>> [B21] B21. Inserción de un pedido con _id 7 y dos ítems');
db.pedidos.insertOne({
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
});

// B22. Insertá un producto sin el campo precio. Después contá cuántos productos no tienen precio y explicá el número que sale.
// JUSTIFICACIÓN:
// El resultado del conteo es 2. Esto se debe a que la base de datos ya contenía inicialmente un producto sin el campo `precio` (TEX-012, Poncho de vicuña, como parte de las irregularidades intencionales de la práctica). Al insertar este nuevo producto (ESC-017) omitiendo también el campo `precio`, la consulta `{ precio: { $exists: false } }` detecta ambos documentos (1 original + 1 nuevo = 2).
print('\n>>> [B22] B22. Inserción sin precio y conteo de productos sin precio');
db.productos.insertOne({
  codigo: "ESC-017",
  nombre: "Escultura tallada en madera",
  stock: 4,
  stock_minimo: 1,
  activo: true,
  categoria: 3,
  etiquetas: ["madera", "escultura"]
});
db.productos.countDocuments({ precio: { $exists: false } });

// ==========================================================================
// ■ ACTUALIZACIÓN (B23–B28)
// ==========================================================================

// B23. Subí un 10 % el precio de los productos de la categoría 4. Después mirá el precio del poncho de vicuña (TEX-012) y explicá qué le pasó y por qué.
// JUSTIFICACIÓN:
// El poncho de vicuña (TEX-012) pertenece a la categoría 4 pero originalmente no tenía el campo `precio`. En MongoDB, cuando el operador `$mul` se ejecuta sobre un campo que NO existe en el documento, MongoDB no genera error ni ignora el registro; crea automáticamente el campo numérico y lo inicializa en 0 (0 * 1.1 = 0). Por lo tanto, el poncho queda con `precio: 0`.
print('\n>>> [B23] B23. Subir 10% el precio en categoría 4 y análisis de TEX-012 ($mul)');
load("seed.js");
db.productos.updateMany({ categoria: 4 }, { $mul: { precio: 1.1 } });
db.productos.find({ codigo: "TEX-012" }, { codigo: 1, nombre: 1, precio: 1, _id: 0 });

// B24. Pasá a "entregado" todos los pedidos que estén en "enviado", y dejales registrada la fecha de entrega con la hora del servidor. Una sola instrucción.
print('\n>>> [B24] B24. Actualizar pedidos enviados a entregados con fecha del servidor');
db.pedidos.updateMany(
  { estado: "enviado" },
  { $set: { estado: "entregado" }, $currentDate: { fecha_entrega: true } }
);

// B25. Agregá la etiqueta "liquidacion" a todos los productos inactivos, de manera que no se duplique si alguno ya la tuviera.
print('\n>>> [B25] B25. Agregar etiqueta "liquidacion" a productos inactivos sin duplicar');
db.productos.updateMany(
  { activo: false },
  { $addToSet: { etiquetas: "liquidacion" } }
);

// B26. Borrá el campo stock_minimo únicamente en los productos donde está cargado como texto. Verificá después que no queda ninguno así.
print('\n>>> [B26] B26. Eliminar campo stock_minimo cargado como texto ($unset)');
db.productos.updateMany(
  { stock_minimo: { $type: "string" } },
  { $unset: { stock_minimo: "" } }
);
db.productos.find({ stock_minimo: { $type: "string" } });

// B27. Agregá al café de los Yungas (ALM-011) un almacén nuevo: "Camiri" con 5 unidades, sin tocar los almacenes que ya tiene.
print('\n>>> [B27] B27. Agregar nuevo almacén al Café de los Yungas ($push)');
db.productos.updateOne(
  { codigo: "ALM-011" },
  { $push: { inventario: { almacen: "Camiri", cantidad: 5 } } }
);

// B28. Con una sola instrucción, actualizá el producto de código "BEB-030" si existe y creálo si no existe, con un nombre, precio 40 y stock 25.
print('\n>>> [B28] B28. Actualizar o crear producto BEB-030 con upsert');
db.productos.updateOne(
  { codigo: "BEB-030" },
  { $set: { nombre: "Cerveza artesanal de trigo", precio: 40, stock: 25 } },
  { upsert: true }
);

// ==========================================================================
// ■ ELIMINACIÓN (B29–B32)
// ==========================================================================

// B29. Contá cuántos pedidos están cancelados y recién después borralos. Entregá los dos comandos, en ese orden.
print('\n>>> [B29] B29. Contar y eliminar pedidos cancelados');
db.pedidos.countDocuments({ estado: "cancelado" });
db.pedidos.deleteMany({ estado: "cancelado" });

// B30. Eliminá un solo producto que tenga la etiqueta "textil". Ojo: hay más de uno, y el comando tiene que borrar exactamente uno.
print('\n>>> [B30] B30. Eliminar un solo producto con etiqueta "textil"');
db.productos.deleteOne({ etiquetas: "textil" });

// B31. Eliminá los productos con stock menor a 5.
print('\n>>> [B31] B31. Eliminar productos con stock menor a 5');
db.productos.deleteMany({ stock: { $lt: 5 } });

// B32. Restaurá la base al punto de partida y verificá que quedaron 12 productos y 6 pedidos.
print('\n>>> [B32] B32. Restaurar base de datos y verificar conteos');
load("seed.js");
db.productos.countDocuments();
db.pedidos.countDocuments();
