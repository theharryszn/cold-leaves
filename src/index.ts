import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs";
import { Logger } from "./modules/Logger";

const logger = new Logger();


const supergraphSdl = readFileSync('./supergraph.graphql').toString(); // TODO!

const gateway = new ApolloGateway({
  supergraphSdl
});

const server = new ApolloServer({
  gateway,
});

server.listen().then(({ url }) => {
  logger.success(`🚀 Gateway ready at ${url}`);
}).catch(err => {logger.error(err)});