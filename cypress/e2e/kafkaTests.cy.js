const { faker } = require('@faker-js/faker')
let person, topic

before(() => {
    topic = 'people'

    person = {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        personId: faker.string.uuid()
    }

})

it('Envia mensagem ao tópico', () => {
    cy.log('A mensagem a ser enviada é: ' + JSON.stringify(person))

    cy.kafkaProduce(person, topic).then(() => {
        cy.log('Enviando mensagem ao tópico ' + topic)
    })
})

it('Verifica se mensagem foi enviada com sucesso ao tópico', () => {
    cy.kafkaConsume(topic).then((response) => {
        const expectedMessage = response.find(
            (object) => object.personId === person.personId
        )

        expect(expectedMessage.fullName).to.eq(person.fullName)
        expect(expectedMessage.email).to.eq(person.email)
        expect(expectedMessage.phone).to.eq(person.phone)

    })

})