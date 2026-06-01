import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/socket_provider.dart';
import 'features/tracking/tracking_page.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => SocketProvider(),
      child: const MyApp()
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'CareTrack',

      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),

      home: const TrackingPage(),
    );
  }
}