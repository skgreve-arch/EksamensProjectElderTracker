import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';

class TrackerListWidget extends StatelessWidget {
  final ApiService api = ApiService();

  TrackerListWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<dynamic>>(
      future: api.getTrackers(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('Error: \\${snapshot.error}'));
        }
        final trackers = snapshot.data ?? [];
        if (trackers.isEmpty) return const Center(child: Text('No trackers'));
        return ListView.builder(
          itemCount: trackers.length,
          itemBuilder: (context, i) {
            final t = trackers[i] as Map<String, dynamic>;
            final id = t['id'] ?? t['trackerId'] ?? i;
            final name = t['name'] ?? t['label'] ?? 'Tracker \$id';
            return ListTile(title: Text(name.toString()), subtitle: Text('id: \\$id'));
          },
        );
      },
    );
  }
}
