import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import orderRoutes from "./routes/order.routes";
import { producer } from "./config/kafka";
import { connectDatabase } from "./config/database";

const app = express();

app.use(cors());
app.use(express.json());
 
app.use(orderRoutes);

async function startServer() {
  await connectDatabase();
  await producer.connect();

  console.log("Kafka Producer Connected");

  app.listen(5001, () => {
    console.log("Order Service Running on port 5001");
  });
}

startServer();