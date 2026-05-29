import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({
  groupId: "analytics-group",
});