import java.io.*;
import java.net.*;

public class ChatClient {
    public static void main(String[] args) {
        try {
            Socket socket = new Socket("localhost", 12345);
            System.out.println("Connected to server.");

            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);

            BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));

            String inputLine, outputLine;

            while (true) {
                outputLine = consoleReader.readLine();
                writer.println(outputLine);

                if ((inputLine = reader.readLine()) != null) {
                    System.out.println("Server: " + inputLine);
                }

                if (outputLine.equalsIgnoreCase("bye")) {
                    break;
                }
            }

            reader.close();
            writer.close();
            consoleReader.close();
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
