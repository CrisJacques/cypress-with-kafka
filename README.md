# cypress-with-kafka
Exemplo de uso do Cypress para testes que envolvem interação com filas do Kafka

Requisitos de ambiente:
- Subir um container do RedPanda na porta 19092 (Tem um docker-compose que faz isso aqui: https://docs.redpanda.com/redpanda-labs/docker-compose/single-broker/)
- No console do RedPanda, criar um tópico chamado 'people' (o console do RedPanda fica disponível em localhost:8080 ao rodar o docker-compose acima)
