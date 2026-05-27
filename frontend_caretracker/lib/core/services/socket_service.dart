import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketService {
  late io.Socket socket;

  void connect() {
    socket = io.io(
      'http://localhost:5000/',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .build(),
    );

    socket.onConnect((_) {
      print('Connected to backend');
    });

    socket.on('gps', (data) {
      print('data');
    });

    socket.onDisconnect((_) {
      print('Disconnected');
    });

    socket.onAny((event, data) {
      print('EVENT: $event');
      print('DATA: $data');
    });
  }
}