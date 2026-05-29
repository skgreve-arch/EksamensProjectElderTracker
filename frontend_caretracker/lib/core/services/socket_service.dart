import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

class SocketService 
{
  late WebSocketChannel channel;

  void connect() 
  {
    channel = WebSocketChannel.connect(
      Uri.parse('ws://YOUR_SERVER_IP:5000'),
    );

    // Identify as dashboard after connecting
    channel.sink.add(json.encode({
      'event': 'identify',
      'data': {'clientType': 'dashboard'},
    }));

    // Listen for incoming messages
    channel.stream.listen(
      (message) 
      {
        final data = json.decode(message);
        final event = data['event'];
        final payload = data['data'];

        print('EVENT: $event');
        print('DATA: $payload');

        if (event == 'alarm') 
        {
          onAlarm(payload);
        }
      },
      onDone: () => print('Disconnected'),
      onError: (error) => print('Error: $error'),
    );
  }

  void onAlarm(dynamic data) 
  {
    print('ALARM from tracker ${data['Tracker_ID']} at ${data['Timestamp']}');
    // trigger your popup here
  }

  void dispose() 
  {
    channel.sink.close();
  }
}