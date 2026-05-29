import { Kafka } from "kafkajs";
const kafka = new Kafka({ clientId: "analytics-service", brokers: ["localhost:9092"] });
export const consumer = kafka.consumer({ groupId: "analytics-group" });
export const producer = kafka.producer();
export const wsConsumer = kafka.consumer({ groupId: "websocket-hub-group" });
