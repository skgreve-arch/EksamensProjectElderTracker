import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/socket_provider.dart';

/// Small utility that shows a modal alert when an alarm event arrives.
///
/// The popup reads the latest alarm and resident info from `SocketProvider`
/// and displays a simple dialog with relevant details and an acknowledge
/// button that clears the alarm state.
class AlarmPopup 
{
  /// Displays the alarm dialog.
  ///
  /// `context` is required to find the [SocketProvider] and to show the
  /// dialog. The dialog is modal and cannot be dismissed by tapping outside
  /// (`barrierDismissible: false`) to force the user to acknowledge it.
  static Future<void> show(BuildContext context) 
  {
    return showDialog(
      context: context,
      barrierDismissible: false, // must manually dismiss
      builder: (_) => Consumer<SocketProvider>(
        builder: (context, socketProvider, child) 
        {
          // Latest raw alarm payload from the websocket provider
          final alarm = socketProvider.latestAlarm;
          // Resident details resolved for the alarm's tracker, may be null
          final resident = socketProvider.alarmResident;

          return AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.warning, color: Colors.red),
                SizedBox(width: 8),
                Text('Alarm Triggered!'),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Use null-aware access because the alarm payload can be null
                Text('Tracker ID: ${alarm?['Tracker_ID']}'),
                Text('Time: ${alarm?['Timestamp']}'),
                const Divider(),
                const Text(
                  'Resident Info:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),

                // While loading show a spinner; otherwise show resident info
                if (socketProvider.isLoadingResident)
                  const CircularProgressIndicator()
                else if (resident == null)
                  // Either no resident assigned or the fetch failed
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('No resident assigned to this tracker.'),
                      Text('Or failed to load resident info.'),
                    ],
                  )
                else
                // Display available resident fields. Fields are accessed by
                // string keys because the provider returns raw JSON maps.
                ...[
                  Text('Name: ${resident['Name']}'),
                  if (resident['Address'] != null)
                    Text('Address: ${resident['Address']}'),
                  if (resident['EmergencyContact'] != null)
                    Text('Emergency Contact: ${resident['EmergencyContact']}'),
                  if (resident['HealthStatus'] != null)
                    Text('Health Status: ${resident['HealthStatus']}'),
                ],
              ],
            ),
            actions: [
              TextButton(
                onPressed: () 
                {
                  // Clears the current alarm in the provider and close dialog
                  socketProvider.clearAlarm();
                  Navigator.of(context).pop();
                },
                child: const Text('Acknowledge'),
              ),
            ],
          );
        },
      ),
    );
  }
}
