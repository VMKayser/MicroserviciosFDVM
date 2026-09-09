const typeDefs = `#graphql
type Cliente {
  id: Int!
  nombre: String!
  email: String
}

type DetalleVenta {
  id: Int!
  producto: String!
  cantidad: Int!
  precioUnitario: Float!
}

type Venta {
  id: Int!
  clienteId: Int!
  cliente: Cliente
  fecha: String!
  total: Float!
  detalle: [DetalleVenta!]!
}

type Query {
  ventas: [Venta!]!
  venta(id: Int!): Venta
}

input DetalleInput {
  producto: String!
  cantidad: Int!
  precioUnitario: Float!
}

input VentaInput {
  clienteId: Int!
  fecha: String!
  detalle: [DetalleInput!]!
}

type Mutation {
  crearVenta(input: VentaInput!): Venta!
  cambiarCantidad(detalleId: Int!, cantidad: Int!): DetalleVenta!
}
`;

module.exports = typeDefs;
