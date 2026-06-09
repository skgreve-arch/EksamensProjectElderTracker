import 'package:flutter/material.dart';
import '../core/services/socket_service.dart';
import '../core/services/api_service.dart';

/// Provider that bridges websocket events into application state.
///
/// - Listens for `alarm` events from [SocketService].
/// - Fetches resident details for the alarm's tracker via [ApiService].
/// - Exposes `latestAlarm`, `alarmResident` and `isLoadingResident` for
///   consumers and notifies listeners on changes.
class SocketProvider extends ChangeNotifier {
  /// Underlying socket client that receives realtime events.
  final SocketService _socketService = SocketService();

  /// API client used to resolve additional details (e.g. resident info).
  final ApiService _apiService = ApiService();

  /// Raw latest alarm payload forwarded from the websocket.
  Map<String, dynamic>? latestAlarm;

  /// Resident details fetched for the latest alarm's tracker id.
  Map<String, dynamic>? alarmResident;

  /// True while fetching `alarmResident` from the backend.
  bool isLoadingResident = false;

  /// Creates the provider and starts the socket connection.
  ///
  /// The provider registers a listener with the socket service that updates
  /// `latestAlarm` when an `alarm` arrives, fetches the resident details and
  /// notifies listeners for UI updates.
  SocketProvider() {
    _socketService.onAlarm = (data) async {
      latestAlarm = data;
      isLoadingResident = true;
      notifyListeners();

      try {
        // Attempt to resolve resident information for the tracker id
        alarmResident = await _apiService.getResidentByTracker(
          data['Tracker_ID'],
        );
      } catch (e) {
        // On error, clear resident info and allow UI to show fallback
        alarmResident = null;
      } finally {
        isLoadingResident = false;
        notifyListeners();
      }
    };

    // Establish the websocket connection immediately
    _socketService.connect();
  }

  /// Clears the current alarm state and notifies listeners.
  void clearAlarm() {
    latestAlarm = null;
    alarmResident = null;
    notifyListeners();
  }

  @override
  void dispose() {
    // Ensure the underlying socket is closed when the provider is disposed
    _socketService.dispose();
    super.dispose();
  }
}
