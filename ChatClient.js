const net = require('net');
const fs = require('fs');
const readline = require('readline');
const http = require('http');

const SERVER_ADDRESS = 'localhost';
const SERVER_PORT = 12345;
const HTTP_PORT = 8080;

const client = new net.Socket();

client.connect(SERVER_PORT, SERVER_ADDRESS, function() {
    console.log('Connected to server');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(inputLine) {
    if (inputLine.toLowerCase() === '\\upload') {
        selectFileAndTransmit();
    } else if (inputLine.toLowerCase().startsWith('\\download')) {
        const fileName = inputLine.split(' ')[1];
        downloadFile(fileName);
    } else {
        client.write(inputLine);
    }

    if (inputLine.toLowerCase() === 'bye') {
        client.end();
        rl.close();
    }
});

function selectFileAndTransmit() {
    const fileInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    fileInput.question('Enter file path: ', function(filePath) {
        fs.readFile(filePath, function(err, data) {
            if (err) {
                console.error(err);
                fileInput.close();
                return;
            }

            const fileName = filePath.split('/').pop(); // Extract file name from path
            const fileSize = data.length;

            // Construct a buffer containing the file data, filename, and size
            const fileBuffer = Buffer.alloc(fileSize + fileName.length + 2);
            fileBuffer.writeUInt16LE(fileName.length, 0); // Write filename length
            fileBuffer.write(fileName, 2); // Write filename
            data.copy(fileBuffer, fileName.length + 2); // Write file data

            // Send the file buffer to the server using TCP
            client.write(fileBuffer);

            fileInput.close();
        });
    });
}

function downloadFile(fileName) {
    const fileUrl = `http://${SERVER_ADDRESS}:${HTTP_PORT}/download/${fileName}`;
    const fileStream = fs.createWriteStream(fileName);

    http.get(fileUrl, (res) => {
        res.pipe(fileStream);
        res.on('end', () => {
            console.log(`File ${fileName} downloaded successfully`);
        });
    }).on('error', (err) => {
        console.error(`Error downloading file ${fileName}: ${err}`);
    });
}








