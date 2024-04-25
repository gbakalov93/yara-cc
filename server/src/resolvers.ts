const resolvers = {
  Query: {
    products: async (_, { hazard, ids }, { dataSources }) => {
      const products = await dataSources.productAPI.getAllProducts();

      // filter by hazard:
      if (hazard != null && typeof hazard === "boolean") {
        return products.filter(product => product.hazard === hazard);
      }

      // filter by ids:
      if (ids != null && Array.isArray(ids) && ids.length > 0) {
        return products.filter(product => ids.includes(product.id));
      }

      return products;
    },
    product: async (_, { id }, { dataSources }) => {
      return dataSources.productAPI.getProductById(id);
    },
    productMovements: async (_, { id }, { dataSources }) => {
      return dataSources.movementAPI.getProductMovements(id);
    },
    warehouses: async (_, { hazard }, { dataSources }) => {
      const warehouses = await dataSources.warehouseAPI.getAllWarehouses();

      if (hazard != null && typeof hazard === "boolean") {
        return warehouses.filter(warehouse => warehouse.hazard === hazard);
      }

      return warehouses;
    },
    warehouse: async (_, { id }, { dataSources }) => {
      return dataSources.warehouseAPI.getWarehouseById(id);
    },
    warehouseMovements: async (_, { id, productId }, { dataSources }) => {
      // product movements through specific warehouse:
      if (productId) {
        return dataSources.movementAPI.getWarehouseProductMovements(id, productId);
      }

      return dataSources.movementAPI.getWarehouseMovements(id);
    },
    movements: async (_, {}, { dataSources }) => {
      return dataSources.movementAPI.getAllMovements();
    },
    movement: async (_, { id }, { dataSources }) => {
      return dataSources.movementAPI.getMovementById(id);
    },
  },
  Mutation: {
    createProduct: async (_, { product }, { dataSources }) => {
      return dataSources.productAPI.createProduct(product);
    },
    updateProduct: async (_, { id, product }, { dataSources }) => {
      return dataSources.productAPI.updateProduct(id, product);
    },
    deleteProduct: async (_, { id }, { dataSources }) => {
      return dataSources.productAPI.deleteProduct(id);
    },
    createMovement: async (_, { movement }, { dataSources }) => {
      return dataSources.movementAPI.createMovement(movement);
    },
  }
};

export default resolvers;