import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import typeDefs from "@/schema";
import resolvers from "@/resolvers";

import ProductAPI from "@/apis/product.api";
import WarehouseAPI from "@/apis/warehouse.api";
import MovementAPI from "@/apis/movement.api";

interface ContextValue {
  dataSources: {
    productAPI: ProductAPI;
    warehouseAPI: WarehouseAPI;
    movementAPI: MovementAPI;
  };
}

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        productAPI: new ProductAPI({ cache }),
        warehouseAPI: new WarehouseAPI({ cache }),
        movementAPI: new MovementAPI({ cache }),
      },
    };
  },
});

console.log(`🚀 Apollo Server ready at: ${url}`);
