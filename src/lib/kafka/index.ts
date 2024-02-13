import environmentVariables from "../environment";
import messageHandler from "./handler";
import { randomUUID } from "crypto";
import { EventEmitter } from "events";
import { Kafka } from "kafkajs";

const kafka: any = new Kafka({
  clientId: environmentVariables.serviceName,
  brokers: ["kafka:9092"],
});

console.log("DOCKER_HOST_IP:");
class KafkaModel {
  constructor() {}
  topic: string = environmentVariables.serviceName;
  producer: any;
  consumer: any;
  eventEmitter: any;

  async initialize() {
    try {
      this.consumer = kafka.consumer({
        groupId: this.topic,
      });
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic });
      this.producer = kafka.producer();
      await this.producer.connect();
      this.eventEmitter = new EventEmitter();
      this.consumerMessages();
    } catch (e) {
      // if this make problems, try to use  console .log
      console.log("Kafka err ", e);
    }
  }

  async consumerMessages() {
    console.log("Consumer new listen... 🚀🚀🚀🚀");
    await this.consumer.run({
      eachMessage: async ({ message, topic, partition }: any) => {
        console.log("Consumer recive ==> ", message);
        const isAction = message?.headers?.action?.toString();
        const key = JSON.parse(message.key.toString());
        const data = JSON.parse(message.value);

        if (!isAction) {
          console.log("replay to  producer 🚀🚀🚀🚀🚀🚀==> ", data, key);
          this.eventEmitter.emit(key, data);
        } else {
          const action = JSON.parse(message?.headers?.action?.toString());
          const replyTo = JSON.parse(message?.headers?.replyTo.toString());
          console.log(
            "Consumer recive new a message 🚀🚀==> ",
            data,
            key,
            action,
            replyTo
          );
          // await consumer.disconnect();
          const result: any = await messageHandler(action, data);

          console.log(
            "Consumer Send message 🚀==> ",
            result,
            "replyTo",
            replyTo
          );
          await this.producer.send({
            topic: replyTo,
            messages: [
              {
                value: JSON.stringify(result),
                key: JSON.stringify(key),
                headers: {},
              },
            ],
          });
          console.log(
            "Consumer producer Send message 🚀🚀==> ",
            result,
            "replyTo",
            replyTo
          );
          //  await this.producer.disconnect();
        }
      },
    });
  }

  async producerMessages(
    topic: string,
    action: string,
    data: any,
    key: string = randomUUID(),
    replyTo: string = environmentVariables.serviceName
  ) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
          key: JSON.stringify(key),
          headers: {
            action: JSON.stringify(action),
            replyTo: JSON.stringify(replyTo),
          },
        },
      ],
    });

    console.log("SEND ======>   ", topic, action, data, key, replyTo);

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(key, async (message: any) => {
        console.log(
          "Producer eventEmitter recive the messages... 🚀🚀🚀🚀🚀🚀 🚀🚀🚀🚀🚀🚀",
          message
        );
        resolve(message);
      });
    });
  }
}

const kafkaInit = new KafkaModel();
kafkaInit.initialize();

export default kafkaInit;
