import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

/// Simple WebSocket client used by the dashboard to receive realtime events.
///
/// The service connects to the backend WebSocket server, identifies the
/// client type and forwards incoming `alarm` events to the optional
/// `onAlarm` callback.
class SocketService {
  /// Underlying WebSocket channel instance.
  late WebSocketChannel _channel;

  /// Optional callback invoked when an `alarm` event is received.
  ///
  /// The `data` parameter contains the payload sent by the server and its
  /// shape depends on the backend implementation.
  Function(dynamic data)? onAlarm;

  /// Opens a WebSocket connection and starts listening for server events.
  ///
  /// On connect the client immediately sends an `identify` message so the
  /// server can register the connection as a dashboard client.
  void connect() {
    _channel = WebSocketChannel.connect(Uri.parse('ws://localhost:5000'));

    // Identify as dashboard after connecting
    _channel.sink.add(
      json.encode({
        'event': 'identify',
        'data': {'clientType': 'dashboard'},
      }),
    );

    // Listen for incoming messages and dispatch relevant events.
    _channel.stream.listen(
      (message) {
        final data = json.decode(message);
        final event = data['event'];
        final payload = data['data'];

        print('EVENT: $event - Data: $payload');

        if (event == 'alarm' && onAlarm != null) {
          onAlarm!(payload);
        }
      },
      onDone: () => print('Disconnected'),
      onError: (error) => print('Error: $error'),
    );
  }

  /// Closes the socket connection and releases resources.
  void dispose() {
    _channel.sink.close();
  }
}
