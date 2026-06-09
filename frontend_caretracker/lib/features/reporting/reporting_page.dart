import 'package:flutter/material.dart';

import '../../shared/models/report.dart';
import 'report_detail_page.dart';
import 'create_report_page.dart';
import '../../core/services/api_service.dart';

/// Page that lists incident reports and provides quick statistics and
/// navigation for creating or viewing reports.
class ReportingPage extends StatefulWidget {
  const ReportingPage({super.key});

  @override
  State<ReportingPage> createState() => _ReportingPageState();
}

class _ReportingPageState extends State<ReportingPage> {
  /// Local cache of reports displayed in the list.
  final List<Report> reports = [];

  /// API client used to load reports from the backend.
  final ApiService api = ApiService();

  @override
  void initState() {
    super.initState();
    loadReports();
  }

  /// Loads reports from the API and converts them to `Report` objects.
  Future<void> loadReports() async {
    final data = await api.getReports();

    setState(() {
      reports.clear();

      for (final item in data) {
        reports.add(
          Report(
            id: item['ID'].toString(),
            title: item['Title'] ?? '',
            // Some backend responses include nested resident/respondedBy
            residentName: item['resident']?['Name'] ?? '',
            author: item['respondedBy']?['Name'] ?? '',
            description: item['Description'] ?? '',
            createdAt: DateTime.parse(item['Date']),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Reporting")),

      // Button to create a new report; result is appended to the list
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
                  author: result["author"],
                  description: result["description"],
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
            // Top-level statistics cards (placeholders for now)
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
                          Text("", style: TextStyle(fontSize: 24)),
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
                          Text("", style: TextStyle(fontSize: 24)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // List of reports
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
                          // Navigate to the detail page for the selected report
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
