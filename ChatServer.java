import java.io.*;
import java.net.*;

public class ChatServer {
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(12345);
            System.out.println("Server started. Waiting for clients...");

            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connected: " + clientSocket);

            BufferedReader reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter writer = new PrintWriter(clientSocket.getOutputStream(), true);

            BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));

            String inputLine, outputLine;

            while (true) {
                if ((inputLine = reader.readLine()) != null) {
                    System.out.println("Client: " + inputLine);
                }

                outputLine = consoleReader.readLine();
                writer.println(outputLine);

                if (outputLine.equalsIgnoreCase("bye")) {
                    break;
                }
            }

            reader.close();
            writer.close();
            consoleReader.close();
            clientSocket.close();
            serverSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
