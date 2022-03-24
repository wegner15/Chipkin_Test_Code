var modbus = require("modbus-stream");

modbus.tcp.server({ debug: "server" }, (connection) => {
    connection.writeSingleCoil({ address: 10, value: 8 }, (err, info) => {
        console.log("response", info.response.data);
    });
}).listen(12345, () => {
    modbus.tcp.connect(12345, { debug: "client" }, (err, connection) => {
        connection.on("write-single-coil", (request, reply) => {
            // console.log(request);
            reply([1,2,3])
        });
    });
});