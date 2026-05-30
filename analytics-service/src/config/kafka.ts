import { Kafka } from "kafkajs";
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"];
const kafka = new Kafka({ clientId: "analytics-service", brokers });
export const consumer = kafka.consumer({ groupId: "analytics-group" });
export const producer = kafka.producer();
export const wsConsumer = kafka.consumer({ groupId: "websocket-hub-group" });
