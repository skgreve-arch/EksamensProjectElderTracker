import 'dart:convert';
import 'dart:io' show Platform;

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;

/// Lightweight HTTP API client for the backend used by the app.
///
/// This service centralizes URL construction and JSON (de)serialization
/// for common endpoints like trackers, residents, reports and auth.
class ApiService {
  /// Base URL for all API requests.
  late final String baseUrl;

  /// Creates an [ApiService].
  ///
  /// If [baseUrlOverride] is provided it will be used directly. Otherwise
  /// the constructor picks a sensible default depending on the platform:
  /// - Web: `http://localhost:3000`
  /// - Android emulator: `http://10.0.2.2:3000` (maps to host machine)
  /// - Other: `http://localhost:3000`
  ApiService({String? baseUrlOverride}) {
    if (baseUrlOverride != null) {
      baseUrl = baseUrlOverride;
    } else if (kIsWeb) {
      baseUrl = 'http://localhost:3000';
    } else if (Platform.isAndroid) {
      // Android emulator forwards 10.0.2.2 -> host machine localhost
      baseUrl = 'http://10.0.2.2:3000';
    } else {
      baseUrl = 'http://localhost:3000';
    }
  }

  /// GET /trackers
  ///
  /// Returns a decoded JSON list of trackers from the backend.
  Future<List<dynamic>> getTrackers() async {
    final uri = Uri.parse('$baseUrl/trackers');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as List<dynamic>;
    }
    throw Exception(
      'Failed to load trackers: $uri (status: ${res.statusCode})',
    );
  }

  /// GET /health
  ///
  /// Returns a decoded JSON map with service health information.
  Future<Map<String, dynamic>> getHealth() async {
    final uri = Uri.parse('$baseUrl/health');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Failed to fetch health: status ${res.statusCode}');
  }

  /// GET /trackers/unassigned
  ///
  /// Returns a list of trackers that are not assigned to any resident.
  Future<List<dynamic>> getUnassignedTrackers() async {
    final uri = Uri.parse('$baseUrl/trackers/unassigned');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as List<dynamic>;
    }
    throw Exception('Failed to load unassigned trackers');
  }

  /// GET /gps/{trackerId}/latest
  ///
  /// Returns the latest GPS point for a tracker or `null` when no content
  /// is available (204).
  Future<Map<String, dynamic>?> getGpsLatest(int trackerId) async {
    final uri = Uri.parse('$baseUrl/gps/$trackerId/latest');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as Map<String, dynamic>?;
    }
    if (res.statusCode == 204) return null;
    throw Exception('Failed to load latest GPS for tracker $trackerId');
  }

  /// GET /residents/tracker/{trackerId}
  ///
  /// Attempts to find the resident currently associated with `trackerId`.
  /// Returns a decoded map on success, or `null` on failure or when not found.
  Future<Map<String, dynamic>?> getResidentByTracker(int trackerId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/residents/tracker/$trackerId'),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>?;
      }
      return null;
    } catch (e) {
      // Non-fatal: network error or JSON parse error should not crash caller
      print('Error fetching resident for tracker $trackerId: $e');
      return null;
    }
  }

  /// GET /incident
  ///
  /// Loads incident reports from the backend and returns them as a list.
  Future<List<dynamic>> getReports() async {
    final uri = Uri.parse('$baseUrl/incident');

    final res = await http.get(uri);

    if (res.statusCode == 200) {
      return json.decode(res.body);
    }

    throw Exception('Failed to load reports');
  }

  /// POST /incident
  ///
  /// Creates a new incident report for a resident. Throws on non-success
  /// responses. The request body follows the backend field names.
  Future<void> createReport({
    required int residentId,
    required int userId,
    required String title,
    required String description,
  }) async {
    final uri = Uri.parse('$baseUrl/incident');

    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'Resident_ID': residentId,
        'User_ID': userId,
        'Title': title,
        'Description': description,
      }),
    );

    // Useful for debugging during development
    print('STATUS: ${res.statusCode}');
    print('BODY: ${res.body}');

    if (res.statusCode != 201 && res.statusCode != 200) {
      throw Exception(
        'Failed to create report (${res.statusCode}) ${res.body}',
      );
    }
  }

  /// GET /residents
  ///
  /// Returns a list of residents as decoded JSON.
  Future<List<dynamic>> getResidents() async {
    final uri = Uri.parse('$baseUrl/residents');

    final res = await http.get(uri);

    if (res.statusCode == 200) {
      return json.decode(res.body);
    }

    throw Exception('Failed to load residents');
  }

  /// POST /users/login
  ///
  /// Attempts to authenticate with the provided credentials. Returns the
  /// decoded response map on success, or `null` when authentication fails.
  Future<Map<String, dynamic>?> login(String email, String password) async {
    final uri = Uri.parse('$baseUrl/users/login');

    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );

    if (res.statusCode == 201 || res.statusCode == 200) {
      return json.decode(res.body);
    }

    return null;
  }
}
