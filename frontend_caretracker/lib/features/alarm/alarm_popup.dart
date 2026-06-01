import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/socket_provider.dart';

class AlarmPopup extends StatelessWidget 
{
  const AlarmPopup({super.key});

  void _showAlarmDialog(BuildContext context, Map<String, dynamic> alarm) 
  {
    showDialog(
      context: context,
      barrierDismissible: false, // must manually dismiss
      builder: (_) => Consumer<SocketProvider>(
        builder: (context, socketProvider, child) 
        {
          final alarm = socketProvider.latestAlarm;
          final resident = socketProvider.alarmResident;

          return AlertDialog(
            title: const Row(
              children: 
              [
                Icon(Icons.warning, color: Colors.red),
                SizedBox(width: 8),
                Text('Alarm Triggered!'),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: 
              [
                Text('Tracker ID: ${alarm?['Tracker_ID']}'),
                Text('Time: ${alarm?['Timestamp']}'),
                const Divider(),
                const Text('Resident Info:', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                if (socketProvider.isLoadingResident)
                  const CircularProgressIndicator()
                else if (resident == null) 
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const 
                    [
                      Text('No resident assigned to this tracker.'),
                      Text('Or failed to load resident info.'),
                    ],
                  )
                else
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
            actions: 
            [
              TextButton(
                onPressed: () 
                {
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

  @override
  Widget build(BuildContext context) 
  {
    return Consumer<SocketProvider>(
      builder: (context, socketProvider, child) 
      {
        // Show popup whenever a new alarm comes in
        if (socketProvider.latestAlarm != null) 
        {
          WidgetsBinding.instance.addPostFrameCallback((_) 
          {
            _showAlarmDialog(context, socketProvider.latestAlarm!);
          });
        }

        return Scaffold(
          appBar: AppBar(title: const Text('Senior Tracker Dashboard')),
          body: const Center(
            child: Text('Dashboard'),
          ),
        );
      },
    );
  }
}