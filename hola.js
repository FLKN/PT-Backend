var http = require('http');
var server = http.createServer();
function control(petic, resp) {
	resp.writeHead(200, {'content-type': 'text/plain'});
	resp.write('Hola, GIT bebe!');
	resp.end();
}
server.on('request', control);
server.listen(9090); //a peticion de Marcos, por si falla