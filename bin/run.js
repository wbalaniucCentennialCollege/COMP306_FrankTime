'use strict'

const request = require('superagent');
const service = require("../server/service");
const http = require("http");

const server = http.createServer(service);
// server.listen(4010);
server.listen(); // Dynamically selects port.

server.on('listening', function() {
    console.log(`FRANK-time is listening on ${server.address().port} in ${service.get('env')} mode. `);

    // Announce ourselves to the main application
    const announce = () => {
        request.put(`http://127.0.0.1:4000/service/time/${server.address().port}`, (err, res) => {
            if(err) {
                console.log(err);
                console.log("Error connecting to FRANK");
                return;
            }

            console.log(res.body);
        });
    };

    announce();
    // Periodically call this function again to inform main applciation it is still alive
    setInterval(announce, 15*1000); // Every 15 seconds;
});