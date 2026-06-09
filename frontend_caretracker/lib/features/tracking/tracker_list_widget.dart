import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';

/// Small widget that loads and displays a list of trackers from the API.
///
/// Uses [ApiService.getTrackers] via a [FutureBuilder] and renders a
/// [ListView] of [ListTile] entries. The tracker payloads are treated as
/// loose JSON maps so the widget tolerates a few different backend shapes
/// (e.g. `id` vs `trackerId`, `name` vs `label`).
class TrackerListWidget extends StatelessWidget {
  /// API client used to fetch tracker list.
  final ApiService api = ApiService();

  TrackerListWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<dynamic>>(
      future: api.getTrackers(),
      builder: (context, snapshot) {
        // While waiting for the network call show a spinner
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        // Display error message when the future fails
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }

        // Safely handle null data
        final trackers = snapshot.data ?? [];

        if (trackers.isEmpty) return const Center(child: Text('No trackers'));

        return ListView.builder(
          itemCount: trackers.length,
          itemBuilder: (context, i) {
            // Each tracker is expected to be a map-like JSON object
            final t = trackers[i] as Map<String, dynamic>;

            // Support multiple possible id/name properties coming from backend
            final id = t['id'] ?? t['trackerId'] ?? i;
            final name = t['name'] ?? t['label'] ?? 'Tracker $id';

            return ListTile(
              title: Text(name.toString()),
              subtitle: Text('id: $id'),
            );
          },
        );
      },
    );
  }
}
