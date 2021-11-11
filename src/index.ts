import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import { Logger } from "./modules/Logger";

const logger = new Logger();


const supergraphSdl = ''; // TODO!

const gateway = new ApolloGateway({
  supergraphSdl
});

const server = new ApolloServer({
  gateway,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
}).catch(err => {logger.error(err)});