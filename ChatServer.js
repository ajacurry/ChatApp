const fs = require('fs');
const http = require('http');
const net = require('net');

const FILE_DIRECTORY = 'received_files/';
const HTTP_PORT = 8080;

// Create an HTTP server to serve files for download
const httpServer = http.createServer((req, res) => {
    const filePath = FILE_DIRECTORY + req.url.slice(1); // Remove leading slash from URL
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (err) => {
        console.error('Error reading file:', err);
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    });

    fileStream.pipe(res);
});

httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server started on port ${HTTP_PORT}`);
});

// Create a TCP server for client communication
const server = net.createServer((socket) => {
    console.log('Client connected: ' + socket.remoteAddress + ':' + socket.remotePort);

    const reader = socket;

    reader.setEncoding('utf-8');

    reader.on('data', (data) => {
        const inputLine = data.trim();

        if (inputLine === '\\upload') {
            receiveFile(reader);
        } else if (inputLine === '\\download') {
            const fileName = inputLine.split(' ')[1];
            downloadFile(fileName, socket);
        } else {
            console.log('Client: ' + inputLine);
        }

        if (inputLine.toLowerCase() === 'bye') {
            socket.end();
        }
    });

    reader.on('end', () => {
        console.log('Client disconnected');
    });

    function receiveFile(reader) {
        reader.pause();
        reader.once('data', (fileName) => {
            fileName = fileName.trim();
            const fileSize = parseInt(reader.read(8).toString('utf-8').trim(), 10);
    
            fs.mkdir(FILE_DIRECTORY, { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
    
                const fileStream = fs.createWriteStream(FILE_DIRECTORY + fileName);
    
                let remainingBytes = fileSize;
                reader.on('data', (chunk) => {
                    const chunkLength = chunk.length;
                    if (chunkLength <= remainingBytes) {
                        fileStream.write(chunk);
                        remainingBytes -= chunkLength;
                    } else {
                        fileStream.write(chunk.slice(0, remainingBytes));
                        reader.unshift(chunk.slice(remainingBytes));
                        fileStream.end();
                        console.log('File received successfully: ' + fileName);
                        reader.resume();
                    }
                });
            });
        });
    }

    function downloadFile(fileName, socket) {
        const filePath = FILE_DIRECTORY + fileName;
        const fileExists = fs.existsSync(filePath);

        if (!fileExists) {
            socket.write(`File ${fileName} not found`);
            return;
        }

        // Notify the client that the file is being sent
        socket.write(`Sending ${fileName}\n`);

        // Read the file and send it to the client
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('data', (chunk) => {
            socket.write(chunk);
        });

        fileStream.on('end', () => {
            socket.write('\nFile transmission complete\n');
        });

        fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            socket.write('Error reading file\n');
        });
    }
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(12345, () => {
    console.log('Server started. Waiting for clients...');
});



