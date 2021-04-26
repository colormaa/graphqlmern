const { ApolloServer, PubSub } = require("apollo-server");

const mongoose = require("mongoose");
const { MONGODB } = require("./config");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers/index");
const PORT = process.env.port || 5000;
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
