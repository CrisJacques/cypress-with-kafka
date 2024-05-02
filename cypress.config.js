const { defineConfig } = require("cypress");
const { produce, consume } = require('./cypress/utils/kafka')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        produceMessage({ message, topic }){
          return new Promise(async (resolve) => {
            resolve(produce(message, topic))
          })
        },
        consumeMessage(topic){
          return new Promise(async(resolve) => {
            const res = await consume(topic)
            resolve(res)
          })
        }
      })
    },
  },
});
