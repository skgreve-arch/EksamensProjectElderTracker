import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';
import '../../shared/current_user.dart';

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
  final ApiService api = ApiService();
  List<dynamic> residents = [];
  dynamic selectedResident;

  @override
  void initState() {
    super.initState();
    loadResidents();
  }

  Future<void> loadResidents() async {
    try {
      final data = await api.getResidents();

      setState(() {
        residents = data;

        if (residents.isNotEmpty) {
          selectedResident = residents.first;
        }
      });
    } catch (e) {
      print(e);
    }
  }

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

            TextFormField(
              initialValue: CurrentUser.name ?? '',

              readOnly: true,

              decoration: const InputDecoration(labelText: 'Author'),
            ),

            const SizedBox(height: 15),

            DropdownButtonFormField<dynamic>(
              value: selectedResident,

              decoration: const InputDecoration(labelText: 'Resident'),

              items: residents.map((resident) {
                return DropdownMenuItem(
                  value: resident,
                  child: Text(resident['Name']),
                );
              }).toList(),

              onChanged: (value) {
                setState(() {
                  selectedResident = value;
                });
              },
            ),

            const SizedBox(height: 15),

            TextField(
              controller: descriptionController,
              maxLines: 5,
              decoration: const InputDecoration(labelText: "Description"),
            ),

            const SizedBox(height: 30),

            ElevatedButton(
              onPressed: () async {
                try {
                  await api.createReport(
                    residentId: selectedResident['Resident_ID'],
                    userId: CurrentUser.userId!,
                    title: titleController.text,
                    description: descriptionController.text,
                  );

                  print('Report created');

                  Navigator.pop(context);
                } catch (e) {
                  print('ERROR: $e');
                }
              },
              child: const Text("Save Report"),
            ),
          ],
        ),
      ),
    );
  }
}
