import 'dart:convert';
import 'dart:io' show Platform;

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;

class ApiService {
  late final String baseUrl;

  ApiService({String? baseUrlOverride}) {
    if (baseUrlOverride != null) {
      baseUrl = baseUrlOverride;
    } else if (kIsWeb) {
      baseUrl = 'http://localhost:3000';
    } else if (Platform.isAndroid) {
      baseUrl = 'http://10.0.2.2:3000'; // Android emulator -> host machine
    } else {
      baseUrl = 'http://localhost:3000';
    }
  }

  Future<List<dynamic>> getTrackers() async {
    final uri = Uri.parse('\$baseUrl/trackers');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as List<dynamic>;
    }
    throw Exception('Failed to load trackers: \\$uri (status: \\${res.statusCode})');
  }

  Future<Map<String, dynamic>> getHealth() async {
    final uri = Uri.parse('$baseUrl/health');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Failed to fetch health: status \\${res.statusCode}');
  }

  Future<List<dynamic>> getUnassignedTrackers() async {
    final uri = Uri.parse('\$baseUrl/trackers/unassigned');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as List<dynamic>;
    }
    throw Exception('Failed to load unassigned trackers');
  }

  Future<Map<String, dynamic>?> getGpsLatest(int trackerId) async {
    final uri = Uri.parse('\$baseUrl/gps/\$trackerId/latest');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      return json.decode(res.body) as Map<String, dynamic>?;
    }
    if (res.statusCode == 204) return null;
    throw Exception('Failed to load latest GPS for tracker \$trackerId');
  }
}
