import 'package:flutter/material.dart';

class AlarmPopup extends StatelessWidget 
{
  final String trackerId;
  final String timestamp;

  const AlarmPopup({super.key, required this.trackerId, required this.timestamp});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('ALARM!'),
      content: Text('Tracker $trackerId triggered an alarm at $timestamp'),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('OK'),
        ),
      ],
    );
  }
}