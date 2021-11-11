// import { ApolloGateway } from "@apollo/gateway";
import { buildFederatedSchema } from "@apollo/subgraph/dist/buildSubgraphSchema";
import { GraphQLResolverMap } from "apollo-graphql";
import { ApolloServer, gql } from "apollo-server";
import { readFileSync } from "fs";
import { Logger } from "./modules/Logger";

const logger = new Logger();

const products = [
  { id: 'apollo-federation', sku: 'federation', package: '@apollo/federation', variation: "OSS" },
  { id: 'apollo-studio', sku: 'studio', package: '', variation: "platform" },
]

const delivery = [
  { id: 'apollo-federation', estimatedDelivery: '6/25/2021', fastestDelivery: '6/24/2021' },
  { id: 'apollo-studio', estimatedDelivery: '6/25/2021', fastestDelivery: '6/24/2021' },
]

const users = [
  { email: 'support@apollographql.com', name: "Apollo Studio Support", totalProductsCreated: 4 }
]

const supergraphSdl = readFileSync('./supergraph.graphql').toString(); // TODO!

// const gateway = new ApolloGateway({
//   supergraphSdl,
// });

const typeDefs = gql(supergraphSdl)

const resolvers : GraphQLResolverMap = {
  User: {
    __resolveReference: (reference: { email: string; }) => {
        return users.find(u => u.email == reference.email);
    }
  },
  Query: {
    allProducts: () => {
        return products;
    },
    product: (_: any,args) => {
        return products.find(p => p.id == args.id);
    }
  },
  Product: {
      variation: (reference: { variation: any; id: string; }) => {
          if (reference.variation) return { id: reference.variation };
          return { id: products.find(p => p.id == reference.id)?.variation }
      },
      dimensions: () => {
          return { size: "1", weight: 1 }
      },
      createdBy: () => {
          return { email: 'support@apollographql.com', totalProductsCreated: 1337 }
      },
      __resolveReference: (reference: { id?: string; sku?: string; package?: string; }) => {
          if (reference.id) return products.find(p => p.id == reference.id);
          else if (reference.sku && reference.package) return products.find(p => p.sku == reference.sku && p.package == reference.package);
          else return { id: 'rover', package: '@apollo/rover', ...reference };
      },
      delivery: (product: { id: string; }) => {
        return delivery.find(p => p.id == product.id);
      }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers}]),
});

server.listen().then(({ url }) => {
  logger.success(`🚀 Gateway ready at ${url}`);
}).catch(err => {logger.error(err)});