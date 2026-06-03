import 'package:flutter/material.dart';

import 'features/tracking/tracking_page.dart';
import 'features/reporting/reporting_page.dart';

void main() {
  runApp(const MyApp());
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

      
      home: const ReportingPage(),
    );
  }
}