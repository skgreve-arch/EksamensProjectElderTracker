from pi_connect import PiConnection
import json
import serial
import pynmea2
import time


PORT = "/dev/serial0"

ser = serial.Serial(
    PORT,
    baudrate=115200,
    timeout=1
)

def on_server_message(event, data):
    print("Server sent: {event}: {data}")

# Connect to server
connection = PiConnection(on_message=on_server_message)
connection.start()

while True:

    try:

        line = ser.readline().decode(
            'utf-8',
            errors='ignore'
        ).strip()

        if "GGA" in line:

            msg = pynmea2.parse(line)
            connection.send_gps(msg.latitude, msg.longitude)

            print("GPS sent:", (msg.latitude, msg.longitude))

            time.sleep(5)

    except KeyboardInterrupt:

        connection.stop()

        print("Stopped")

        break

    except Exception as e:

        print("Error:", e)