import { Kafka } from "kafkajs";
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"];
const kafka = new Kafka({ clientId: "inventory-service", brokers });
export const consumer = kafka.consumer({ groupId: "inventory-group" });
export const producer = kafka.producer();
