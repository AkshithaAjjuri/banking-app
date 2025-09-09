import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { typeDefs, resolvers } from "./graphql/schema.js";
import { authMiddleware } from "./middleWare/authMiddleWare.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // Since authMiddleware is middleware, let's call it manually and wait for it:
          authMiddleware(req, res, () => {});
        return { user: req.user };
      },
    })
  );

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
      console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is ready at http://localhost:${PORT}/graphql`);
    })
  })
     .catch (err => console.error("MongoDB connection error:", err));
     }

startServer();
