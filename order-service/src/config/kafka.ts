import { Kafka } from "kafkajs";

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"];

const kafka = new Kafka({
  clientId: "order-service",
  brokers,
});

export const producer = kafka.producer();