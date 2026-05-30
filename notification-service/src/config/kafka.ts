import { Kafka } from "kafkajs";
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"];
const kafka = new Kafka({ clientId: "notification-service", brokers });
export const consumer = kafka.consumer({ groupId: "notification-group" });
export const producer = kafka.producer();
