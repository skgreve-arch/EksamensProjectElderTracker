import 'package:flutter/material.dart';

class CreateReportPage extends StatefulWidget {
  const CreateReportPage({super.key});

  @override
  State<CreateReportPage> createState() => _CreateReportPageState();
}

class _CreateReportPageState extends State<CreateReportPage> {
  final titleController = TextEditingController();
  final authorController = TextEditingController();
  final responseTimeController = TextEditingController();
  final descriptionController = TextEditingController();
  final residentController = TextEditingController();
  final trackerController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Create Report")),

      body: Padding(
        padding: const EdgeInsets.all(20),

        child: Column(
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(labelText: "Title"),
            ),

            const SizedBox(height: 15),

            TextField(
              controller: authorController,
              decoration: const InputDecoration(labelText: "Author"),
            ),

            const SizedBox(height: 15),

            TextField(
              controller: residentController,
              decoration: const InputDecoration(labelText: "Resident")
            ),

            const SizedBox(height: 15),

            TextField(
              controller: trackerController,
              decoration: const InputDecoration(labelText: "Tracker"),
            ),
            const SizedBox(height: 15),

            TextField(
              controller: responseTimeController,
              decoration: const InputDecoration(
                labelText: "Response Time (seconds)",
              ),
            ),

            const SizedBox(height: 15),

            TextField(
              controller: descriptionController,
              maxLines: 5,
              decoration: const InputDecoration(labelText: "Description"),
            ),

            const SizedBox(height: 30),
            
            

            ElevatedButton(
              onPressed: () {
                Navigator.pop(context, {
                  "title": titleController.text,
                  "author": authorController.text,
                  "residentName": residentController.text,
                  "trackerId": trackerController.text,
                  "responseTime":
                      int.tryParse(responseTimeController.text) ?? 0,
                  "description": descriptionController.text,
                });
              },
              child: const Text("Save Report"),
            ),
          ],
        ),
      ),
    );
  }
}
