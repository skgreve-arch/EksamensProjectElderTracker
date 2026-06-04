from gpiozero import Button
from signal import pause
from pi_connect import PiConnection
import time
import serial
import pynmea2


PORT = "/dev/serial0"
BUTTON_PIN = 16

# GPS
ser = serial.Serial(
    PORT,
    baudrate=115200,
    timeout=1
)

def on_server_message(event, data):
    print(f'Server sent: {event} -> {data}')

# Connect to server
connection = PiConnection(on_message=on_server_message)
connection.start()
time.sleep(2)

# Button setup
button = Button(BUTTON_PIN)

def button_pressed():
    print("Alert button pressed")
    connection.send_alarm()
    print("Alert sent to backend")

button.when_pressed = button_pressed

print("Tracker running...")

while True:
    try:
        line = ser.readline().decode('utf-8', errors='ignore').strip()

        if "GGA" in line:
            try:
                msg = pynmea2.parse(line)
                if msg.latitude != 0.0 and msg.longitude != 0.0:
                    connection.send_gps(msg.latitude, msg.longitude)
                    print("GPS sent:", (msg.latitude, msg.longitude))
                else:
                    print("Waiting for GPS fix...")
            except pynmea2.ParseError:
                print("Failed to parse GPS line, skipping...")
            time.sleep(5)

    except KeyboardInterrupt:
        connection.stop()
        print("Stopped")
        break
