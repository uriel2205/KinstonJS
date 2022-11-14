const amqp = require("amqplib");

const rabbitSettings = [{
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']      
},{
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5673,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']}]


connect();

async function connect(){

    const queue = "MLB";
    const Equipo = "San Diego Padres"
    for(i=0;i<rabbitSettings.length;i++){
        try{

            const conn = await amqp.connect(rabbitSettings[i]);
            console.log("Connection created...");
    
            const channel = await conn.createChannel();
            console.log("Channel created...");
    
            const res = await channel.assertQueue(queue);
            console.log("Queue created...");
    
            console.log('Waiting for messages from ${Equipo}');
            channel.consume(queue, message => {
                let MLB = JSON.parse(message.content.toString());
                console.log('MLB received ${MLB.name}');
                console.log(MLB);
    
                if(MLB.Equipo == Equipo){
                    channel.ack(message);
                    console.log("Message deleted from the queues... \n");
    
                } else{
                    console.log("This message is not for me , I wont delete it");
                }
    
             
            })
            break
        } catch(err){
            console.error('Error -> $(err)');
        }
        
    }
}
