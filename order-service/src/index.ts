import express from "express";
import orderRoutes from "./routes/order.routes";
import { producer } from "./config/kafka";

const app = express();

app.use(express.json());
 
app.use(orderRoutes);

async function startServer() {
  await producer.connect();

  console.log("Kafka Producer Connected");

  app.listen(5001, () => {
    console.log("Order Service Running on port 5001");
  });
}

startServer();