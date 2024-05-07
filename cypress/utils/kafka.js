const {Kafka, logLevel} = require("kafkajs")
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const brokers = ["localhost:19092"]
let producer
let consumer

/**
 * Cria e retorna um produtor ou consumidor do Kafka pronto para uso
 * @param {String} topicName - Nome do tópico de interesse
 * @param {String} connectionType - Tipo de conexão ('producer' ou 'consumer')
 * @returns 
 */
async function kafkaConnect(topicName, connectionType){
    const kafka = new Kafka({
        clientId: 'cypress-' + topicName,
        brokers,
        logLevel: logLevel.INFO
    })

    if (connectionType == 'producer'){
        producer = kafka.producer()
        await producer.connect()
    }
    else if (connectionType == 'consumer'){
        consumer = kafka.consumer({groupId: "cypressGroup-" + topicName})
        await consumer.connect()
    }
    else{
        console.log("Parâmetro connectionType com valor não esperado (utilize 'producer' ou 'consumer')")
    }
}


/**
 * Produz uma mensagem no tópico passado por parâmetro
 * @param {Object} messageJson - Mensagem a ser enviada (JSON)
 * @param {String} topicName  - Nome do tópico
 */
async function produce(messageJson, topicName){
    const messageData = () => {
        return {
            key: 'key',
            value: JSON.stringify(messageJson)
        }
    }

    await kafkaConnect(topicName, 'producer')
    
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

    await kafkaConnect(topic, 'consumer')

    await consumer.subscribe({
        topic,
        fromBeginning: false
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