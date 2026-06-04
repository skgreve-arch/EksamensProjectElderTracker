import websocket
import json
import os
import threading
import time

ID_FILE = 'tracker_id.txt'
SERVER_URL = 'ws://10.176.69.106:5000'

class PiConnection:
    def __init__(self, on_message=None):
        self.tracker_id = None
        self.ws = None
        self.connected = False
        self.on_message_callback = on_message
        self._stop_event = threading.Event()

    def _load_tracker_id(self):
        if os.path.exists(ID_FILE):
            with open(ID_FILE, 'r') as f:
                content = f.read().strip()
                if content.isdigit():
                    self.tracker_id = int(content)
                    print(f'Loaded tracker ID: {self.tracker_id}')
                    return True
        return False

    def _save_tracker_id(self, tracker_id):
        with open(ID_FILE, 'w') as f:
            f.write(str(tracker_id))
        self.tracker_id = tracker_id
        print(f'Saved tracker ID: {tracker_id}')

    def _get_local_ip(self):
        import socket
        try:
            # Connects to 8.8.8.8 only to find it's own ip
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            return '0.0.0.0'

    # Sends payload to socket server
    def _send(self, event, data):
        if self.ws and self.connected:
            payload = json.dumps({'event': event, 'data': data})
            self.ws.send(payload)

    def _on_open(self, ws):
        self.connected = True
        print('Connected to server')

        if self._load_tracker_id():
            # Already registered — identify
            self._send('identify', {
                'clientType': 'pi',
                'Tracker_ID': self.tracker_id,
            })
        else:
            # New pi — register
            self._send('register', {
                'IP': self._get_local_ip(),
                'Port': 8000,
            })

    def _on_message(self, ws, message):
        try:
            data = json.loads(message)
            event = data.get('event')
            payload = data.get('data')

            if event == 'registered':
                self._save_tracker_id(payload['Tracker_ID'])
                print(f'Registered successfully with ID {self.tracker_id}')

            elif event == 'identified':
                print(f'Identified successfully as tracker {self.tracker_id}')

            elif event == 'error':
                print(f'Server error: {payload}')
                # If tracker ID not found in DB, delete local file and re-register
                if 'not found' in str(payload).lower():
                    print('Deleting local ID file and re-registering...')
                    if os.path.exists(ID_FILE):
                        os.remove(ID_FILE)
                    self.tracker_id = None
                    self._send('register', {
                        'IP': self._get_local_ip(),
                    })

            elif event == 'connected':
                print('Welcome message received from server')

            # Pass any other events to the main program
            if self.on_message_callback:
                self.on_message_callback(event, payload)

        except json.JSONDecodeError:
            print(f'Failed to parse message: {message}')

    def _on_error(self, ws, error):
        print(f'WebSocket error: {error}')
        self.connected = False

    def _on_close(self, ws, close_status_code, close_msg):
        print('Disconnected from server')
        self.connected = False

    def send_gps(self, lat, lon):
        if not self.connected or not self.tracker_id:
            print("Not ready to send GPS - not connected or identified yet")
            return
        self._send('gps', {'lat': lat, 'lng': lon})

    def send_alarm(self):
        if not self.connected or not self.tracker_id:
            print("Not ready to send alarm - not connected or identified yet")
            return
        self._send('alarm', {})

    def send_battery(self, battery_level):
        if not self.connected or not self.tracker_id:
            print("Not ready to send battery - not connected or identified yet")
            return
        self._send('battery', {'battery': battery_level})


    def connect(self):
        while not self._stop_event.is_set():
            try:
                self.ws = websocket.WebSocketApp(
                    SERVER_URL,
                    on_open=self._on_open,
                    on_message=self._on_message,
                    on_error=self._on_error,
                    on_close=self._on_close,
                )
                self.ws.run_forever()
            except Exception as e:
                print(f'Connection failed: {e}')

            if not self._stop_event.is_set():
                print('Reconnecting in 5 seconds...')
                time.sleep(5)

    def start(self):
        thread = threading.Thread(target=self.connect, daemon=True)
        thread.start()
        print('Connection manager started')

    def stop(self):
        self._stop_event.set()
        if self.ws:
            self.ws.close()
