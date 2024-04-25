const typeDefs = `#graphql
type Product {
  id: ID!
  name: String!
  unit_size: Float!
  hazard: Boolean!
}

type Warehouse {
  id: ID!
  name: String!
  max_amount: Float!
  hazard: Boolean!
}

type Movement {
  id: ID!
  amount: Float!
  date: String!
  product_id: ID!
  product_name: String!
  to_warehouse_id: ID!
  to_warehouse_name: String!
  from_warehouse_id: ID
  from_warehouse_name: String
}

type ProductAmount {
  product_id: ID!
  product_unit_size: Float!
  import_amount: Float!
  export_amount: Float!
}

type WarehouseMovements {
  imports: [Movement]
  exports: [Movement]
  product_amounts: [ProductAmount]
}

input CreateProduct {
  name: String!
  unit_size: Float!
  hazard: Boolean!
}

input UpdateProduct {
  name: String
  unit_size: Float
  hazard: Boolean
}

type DeleteProductMutationResponse {
  success: Boolean!
}

type CreateUpdateProductMutationResponse {
  success: Boolean!
  product: Product!
}

input CreateMovement {
  amount: Float!
  date: String!
  product_id: ID!
  to_warehouse_id: ID!
  from_warehouse_id: ID!
}

type CreateMovementMutationResponse {
  success: Boolean!
  movement: Movement!
}

type Query {
  products(hazard: Boolean): [Product]
  product(id: ID!): Product
  productMovements(id: ID!): [Movement]
  warehouses(hazard: Boolean): [Warehouse]
  warehouse(id: ID!): Warehouse
  warehouseMovements(id: ID!, productId: ID): WarehouseMovements
  movements: [Movement]
  movement(id: ID!): Movement
}

type Mutation {
  createProduct(product: CreateProduct!): CreateUpdateProductMutationResponse
  updateProduct(id: ID!, product: UpdateProduct): CreateUpdateProductMutationResponse
  deleteProduct(id: ID!): DeleteProductMutationResponse
  createMovement(movement: CreateMovement!): CreateMovementMutationResponse
}
`;

export default typeDefs;