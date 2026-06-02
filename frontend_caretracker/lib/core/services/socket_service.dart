import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

class SocketService 
{
  late WebSocketChannel _channel;
  Function(dynamic data)? onAlarm;

  void connect() 
  {
    _channel = WebSocketChannel.connect(
      Uri.parse('ws://localhost:5000'),
    );

    // Identify as dashboard after connecting
    _channel.sink.add(json.encode({
      'event': 'identify',
      'data': {'clientType': 'dashboard'},
    }));

    // Listen for incoming messages
    _channel.stream.listen(
      (message) 
      {
        final data = json.decode(message);
        final event = data['event'];
        final payload = data['data'];

        print('EVENT: $event - Data: $payload');

        if (event == 'alarm' && onAlarm != null) 
        {
          onAlarm!(payload);
        }
      },
      onDone: () => print('Disconnected'),
      onError: (error) => print('Error: $error'),
    );
  }

  void dispose() 
  {
    _channel.sink.close();
  }
}