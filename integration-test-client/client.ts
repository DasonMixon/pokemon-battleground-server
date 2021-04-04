import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const client = new ws(process.env.SERVER_SOCKET_ADDRESS);

client.on('message', (data) => {
    console.log(`Data received from server: ${data}`);
});

/*let exitRequested = false;
while(!exitRequested) {
    let answer = input('Enter message event and data to send to server. Type\'ex\' for an example\n');

    if (answer === 'ex') {
        console.log('Format: [event] [data]\n\nExample: message test data');
    } else {
        const trimmed = answer.trim();
        const event = trimmed.substr(0, trimmed.indexOf(' '));
        const data = trimmed.substr(trimmed.indexOf(' ') + 1, trimmed.length - (trimmed.indexOf(' ') + 1));

        client.send({
            event,
            data
        }, (err) => {
            if (err)
                console.log(`Error sending data to server: ${err}`);
        });
    }
}*/