from gpiozero import Button
from signal import pause

import websocket
import json
import os

# GPIO pin for button
BUTTON_PIN = 16

# Tracker/device id
TRACKER_ID = 1

# Backend websocket
WS_URL = "ws://YOUR_PC_IP:5000"

# Create button
button = Button(BUTTON_PIN)

# Connect websocket
ws = websocket.WebSocket()
ws.connect(WS_URL)

print("Connected to websocket")
print("Waiting for button press...")

def button_pressed():

    print("ALERT BUTTON PRESSED")

    # Play local alert sound
    os.system(
        "aplay /usr/share/sounds/alsa/Front_Center.wav"
    )

    # Send alert event
    alert_data = {
        "event": "alert",
        "data": {
            "trackerId": TRACKER_ID,
            "status": "ALERT"
        }
    }

    ws.send(json.dumps(alert_data))

    print("Alert sent to backend")

# Trigger when button pressed
button.when_pressed = button_pressed

# Keep script alive
pause()
