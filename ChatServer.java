import java.io.*;
import java.net.*;

public class ChatServer {
    private static DataOutputStream DOS = null;
    private static DataInputStream DIS = null;
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(12345);
            System.out.println("Server started. Waiting for clients...");

            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connected: " + clientSocket);
            DIS = new DataInputStream(
                clientSocket.getInputStream());
            DOS = new DataOutputStream(
                clientSocket.getOutputStream());

            BufferedReader reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter writer = new PrintWriter(clientSocket.getOutputStream(), true);

            BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));

            String inputLine, outputLine;

            while (true) {
                if ((inputLine = reader.readLine()) != null) {
                    if(inputLine.contains("\\")){
                        transmitReceive(inputLine);
                    }

                    System.out.println("Client: " + inputLine);
                }

                outputLine = consoleReader.readLine();
                writer.println(outputLine);

                if (outputLine.equalsIgnoreCase("bye")) {
                    break;
                }
            }
            DIS.close();
            DOS.close();
            reader.close();
            writer.close();
            consoleReader.close();
            clientSocket.close();
            serverSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private static void transmitReceive(String fileName){
        try{
            
            int bytes = 0;
        FileOutputStream fileOutputStream = new FileOutputStream(fileName);
        System.out.println("Trying to read");
        System.out.println(DIS.readLong());
        long size = DIS.readLong(); // read file size
        System.out.println("File read");
        byte[] buffer = new byte[4 * 1024];
        while (size > 0 && (bytes = DIS.read(buffer, 0,(int)Math.min(buffer.length, size)))!= -1) {
            // Here we write the file using write method
            fileOutputStream.write(buffer, 0, bytes);
            System.out.println("File written");

            size -= bytes; // read upto file size
        }
        // Here we received file
        System.out.println("File is Received");
        System.out.println(DIS.readLong());
        fileOutputStream.close();

        }
        catch(IOException e){
            //System.out.println("Something went wrong on server end");

        }
    }
}
