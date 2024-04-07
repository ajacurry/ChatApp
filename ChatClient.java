import java.io.*;
import java.net.*;

public class ChatClient {
private static DataOutputStream DOS = null;
private static DataInputStream DIS = null;
    public static void main(String[] args) {
        try {
           
            Socket socket = new Socket("localhost", 12345);
            DIS = new DataInputStream(socket.getInputStream());//Input stream for file transfer
            DOS = new DataOutputStream(socket.getOutputStream());//output stream for file transfer
            System.out.println("Connected to server.");

            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);

            BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));

            String inputLine;
            String outputLine;

            while (true) {
                outputLine = consoleReader.readLine();
                if(outputLine.contains("\\")){
                    transmitFile(outputLine);
                }
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

    private static void transmitFile(String filePath) {
     try{
        int bytes = 0;
        // Open the File where he located in your pc
        File file = new File(filePath);
        FileInputStream fileInputStream
            = new FileInputStream(file);
 
        // Here we send the File to Server
        DOS.writeLong(file.length());
        // Here we  break file into chunks
        byte[] buffer = new byte[4 * 1024];
        while ((bytes = fileInputStream.read(buffer))
               != -1) {
          // Send the file to Server Socket  
          DOS.write(buffer, 0, bytes);
            DOS.flush();
        }
        // close the file here
        fileInputStream.close();
    }
    catch(Exception e){
        System.out.println("Something went wrong");

    }
    }
    }

