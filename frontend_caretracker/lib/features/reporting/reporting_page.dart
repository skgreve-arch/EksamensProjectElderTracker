import 'package:flutter/material.dart';

import '../../shared/models/report.dart';
import 'report_detail_page.dart';
import 'create_report_page.dart';

class ReportingPage extends StatefulWidget {
  const ReportingPage({super.key});

  @override
  State<ReportingPage> createState() => _ReportingPageState();
}

class _ReportingPageState extends State<ReportingPage> {
  final List<Report> reports = [
    Report(
      id: "1",
      title: "Incident Report #001",
      author: "Mikkel",
      residentName: "Lars",
      trackerId: "2",
      description: "Resident activated emergency button.",
      createdAt: DateTime.now(),
      responseTime: 120,
    ),
    Report(
      id: "2",
      title: "Incident Report #002",
      author: "Anna",
      residentName: "Hans",
      trackerId: "1",
      description: "Resident needed assistance.",
      createdAt: DateTime.now(),
      responseTime: 90,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Reporting")),

      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateReportPage()),
          );

          if (result != null) {
            setState(() {
              reports.add(
                Report(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),

                  title: result["title"],
                  residentName: result["residentName"],
                  trackerId: result["trackerId"],
                  author: result["author"],
                  description: result["description"],
                  responseTime: result["responseTime"],
                  createdAt: DateTime.now(),
                ),
              );
            });
          }
        },

        child: const Icon(Icons.add),
      ),

      body: Padding(
        padding: const EdgeInsets.all(20),

        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: const [
                          Text("Total Alerts"),
                          SizedBox(height: 10),
                          Text("127", style: TextStyle(fontSize: 24)),
                        ],
                      ),
                    ),
                  ),
                ),

                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: const [
                          Text("Avg Response"),
                          SizedBox(height: 10),
                          Text("3m 42s", style: TextStyle(fontSize: 24)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            Expanded(
              child: ListView.builder(
                itemCount: reports.length,

                itemBuilder: (context, index) {
                  final report = reports[index];

                  return Card(
                    child: ListTile(
                      leading: const Icon(Icons.description),

                      title: Text(report.title),

                      subtitle: Text("Created by ${report.author}"),

                      trailing: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ReportDetailPage(report: report),
                            ),
                          );
                        },
                        child: const Text("View"),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
