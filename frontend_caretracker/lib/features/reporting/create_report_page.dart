import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';
import '../../shared/current_user.dart';

/// Page used to create a new incident report.
///
/// The form fetches the resident list from the API and allows the user to
/// enter a title and description. The author is pre-filled from
/// [CurrentUser]. On submit the page calls [ApiService.createReport].
class CreateReportPage extends StatefulWidget {
  const CreateReportPage({super.key});

  @override
  State<CreateReportPage> createState() => _CreateReportPageState();
}

class _CreateReportPageState extends State<CreateReportPage> {
  /// Controllers for the text inputs.
  final titleController = TextEditingController();
  final responseTimeController = TextEditingController();
  final descriptionController = TextEditingController();

  /// API client used to load residents and submit the report.
  final ApiService api = ApiService();

  /// Resident list loaded from the backend and the currently selected one.
  List<dynamic> residents = [];
  dynamic selectedResident;

  @override
  void initState() {
    super.initState();
    loadResidents();
  }

  @override
  void dispose() {
    // Dispose controllers to free resources.
    titleController.dispose();
    responseTimeController.dispose();
    descriptionController.dispose();
    super.dispose();
  }

  /// Loads residents from the backend and sets an initial selection when
  /// the list is not empty.
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
      // Log and continue - UI will show empty dropdown
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
            // Title input
            TextField(
              controller: titleController,
              decoration: const InputDecoration(labelText: "Title"),
            ),

            const SizedBox(height: 15),

            // Author is read-only and pre-filled from CurrentUser
            TextFormField(
              initialValue: CurrentUser.name ?? '',
              readOnly: true,
              decoration: const InputDecoration(labelText: 'Author'),
            ),

            const SizedBox(height: 15),

            // Resident selector populated from the API call
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

            // Description input
            TextField(
              controller: descriptionController,
              maxLines: 5,
              decoration: const InputDecoration(labelText: "Description"),
            ),

            const SizedBox(height: 30),

            ElevatedButton(
              onPressed: () async {
                // Submit the filled form to the backend
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
                  // Show or log error on failure
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
