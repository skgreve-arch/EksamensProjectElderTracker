import 'package:flutter/material.dart';

import '../../shared/models/report.dart';

/// Displays detailed information for a single `Report`.
///
/// The page shows title, author, creation date, resident name and the
/// report description in a simple vertical layout.
class ReportDetailPage extends StatelessWidget {
  /// Report instance to display.
  final Report report;

  const ReportDetailPage({super.key, required this.report});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(report.title)),

      body: Padding(
        padding: const EdgeInsets.all(20),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title
            Text(
              report.title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 20),

            // Author and timestamp
            Text("Author: ${report.author}"),
            const SizedBox(height: 10),
            Text("Date: ${report.createdAt}"),

            const SizedBox(height: 20),

            // Section header for the description
            const Text(
              "Description",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 10),

            // Resident information
            Text("Resident: ${report.residentName}"),
            const SizedBox(height: 10),

            // The actual report body
            Text(report.description),
          ],
        ),
      ),
    );
  }
}
