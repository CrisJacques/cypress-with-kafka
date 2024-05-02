const {Kafka, logLevel} = require("kafkajs")
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const brokers = ["localhost:19092"]

/**
 * Produz uma mensagem no tópico passado por parâmetro
 * @param {Object} messageJson - Mensagem a ser enviada (JSON)
 * @param {String} topicName  - Nome do tópico
 */
async function produce(messageJson, topicName){
    const kafka = new Kafka({
        clientId: "cypress-" + topicName,
        brokers,
        logLevel: logLevel.INFO
    })

    const messageData = () => {
        return {
            key: 'key',
            value: JSON.stringify(messageJson)
        }
    }

    const producer = kafka.producer()
    await producer.connect()

    await producer.send({
        topic: topicName,
        messages: [messageData()]
    })

    await producer.disconnect()

    return messageData().value

}


/**
 * Consome as mensagens de um tópico passado por parâmetro
 * @param {String} topic - Nome do tópico
 */
async function consume(topic){
    let responseData = [];

    const kafka = new Kafka({
        clientId: "cypress-" + topic,
        brokers,
        logLevel: logLevel.INFO
    })

    const consumer = kafka.consumer({
        groupId: "cypressGroup-" + topic
    })

    await consumer.connect()
    await consumer.subscribe({
        topic,
        fromBeginning: true
    })

    await consumer.run({
        autoCommit: true,
        eachMessage: ({ message }) => {
            responseData.push(JSON.parse(message.value.toString()))
        }
    })

    await sleep(5000)
    await consumer.stop()
    await consumer.disconnect()

    return responseData

}

module.exports = { produce, consume }