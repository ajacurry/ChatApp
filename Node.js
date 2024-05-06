const fs = require('fs');
const io = require('socket.io')(3000);

// Handle file upload event
io.on('connection', function(socket){
    console.log('A user is connecting');

    socket.on('upload', function(fileData, filename) {
        // Check if file data and filename are received
        console.log('Received file data:', fileData);
        console.log('Received filename:', filename);

        // Write file data to a file
        var filePath = '/Users/ajabcurry/Desktop/ChatApp/' + filename; // Adjust this path as needed

        // Create a writable stream to write the file data
        var writableStream = fs.createWriteStream(filePath);

        // Write the file data to the writable stream
        writableStream.write(fileData);

        // Close the writable stream
        writableStream.end();

        // Handle stream events
        writableStream.on('finish', function() {
            console.log('File saved successfully');
            // Inform the client about the success
            socket.emit('uploadResult', { message: "success", filename: filename });
        });

        writableStream.on('error', function(err) {
            console.error('Error saving file:', err);
            // Inform the client about the failure
            socket.emit('uploadResult', { message: "failure" });
        });
    });

    socket.on('sendImage', (data) => {
        // Save the received image buffer as a file
        fs.writeFileSync('image.png', data.image);
        
        // Send confirmation message to the client
        socket.emit('imageReceived', { message: 'Image received successfully!' });
    });
});



