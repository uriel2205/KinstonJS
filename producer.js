const amqp = require("amqplib");

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']

}

connect();

async function connect(){

    const queue = "MLB";
    const newQueue = "Roles";

    const msgs = [
        {   "name":"Juan Soto", "Equipo":"San Diego Padres"},
        {   "name":"Juan Soto", "Ciudad":"San Diego"},
        {   "name":"Juan Soto", "Edad":"24"},
        {   "name":"Juan Soto", "Rol":"Bateador - RF"},
    ]

    try{

        const conn = await amqp.connect(rabbitSettings);
        console.log("Connection Created...");

        const channel = await conn.createChannel();
        console.log("Channel Created...");

        const res = await channel.assertQueue(queue);
        console.log("Queue Created...");

        for(let msg in msgs){
            await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgs[msg])));
            console.log('Message sent ${queue}');
        }



    } catch(err){
        console.error('Error -> $(err)');
    }
}