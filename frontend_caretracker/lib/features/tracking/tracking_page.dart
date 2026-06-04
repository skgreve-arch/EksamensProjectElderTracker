import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:frontend_caretracker/features/alarm/alarm_popup.dart';
import 'package:frontend_caretracker/providers/socket_provider.dart';
import 'package:provider/provider.dart';
import 'package:latlong2/latlong.dart';

import '../../shared/models/gps_point.dart';
import '../../core/services/api_service.dart';

class TrackingPage extends StatefulWidget {
  const TrackingPage({super.key});

  @override
  State<TrackingPage> createState() => _TrackingPageState();
}

class _TrackingPageState extends State<TrackingPage> {
  final apiService = ApiService();

  String healthText = 'Unknown';
  bool isCheckingHealth = false;
  bool isLoadingTrackers = false;
  String? trackerLoadError;

  static const List<LatLng> _geoFenceCorners = [
    LatLng(54.911618, 9.788300), // NW
    LatLng(54.911883, 9.789362), // NE
    LatLng(54.911487, 9.789637), // SE
    LatLng(54.911256, 9.788590), // SW
  ];

  static const LatLng _geoFenceCenter = LatLng(54.911561, 9.788972);

  final MapController _mapController = MapController();
  final Map<int, GpsPoint> trackerPositions = {};
  final List<int> trackerIds = [];
  int? selectedTrackerId;
  LatLng mapCenter = _geoFenceCenter;

  Timer? pollingTimer;

  @override
  void initState() {
    super.initState();
    _loadTrackers();
  }

  Future<void> _loadTrackers() async {
    setState(() {
      isLoadingTrackers = true;
      trackerLoadError = null;
    });

    try {
      final trackers = await apiService.getTrackers();
      final ids = <int>{};

      for (final rawTracker in trackers) {
        final trackerId = _parseTrackerId(rawTracker);
        if (trackerId != null) ids.add(trackerId);
      }

      final sortedIds = ids.toList()..sort();
      if (sortedIds.isNotEmpty && selectedTrackerId == null) {
        selectedTrackerId = sortedIds.first;
      }

      setState(() {
        trackerIds.clear();
        trackerIds.addAll(sortedIds);
      });

      if (selectedTrackerId != null) {
        await _fetchLatestGps(selectedTrackerId!);
      }

      _startPolling();
    } catch (error) {
      setState(() {
        trackerLoadError = error.toString();
      });
    } finally {
      setState(() {
        isLoadingTrackers = false;
      });
    }
  }

  int? _parseTrackerId(dynamic tracker) {
    if (tracker is Map<String, dynamic>) {
      final rawId = tracker['id'] ?? tracker['trackerId'] ?? tracker['Tracker_ID'];
      if (rawId is int) return rawId;
      if (rawId is String) return int.tryParse(rawId);
    }
    return null;
  }

  void _startPolling() {
    pollingTimer?.cancel();
    pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (selectedTrackerId != null) {
        _fetchLatestGps(selectedTrackerId!);
      }
    });
  }

  Future<void> _fetchLatestGps(int trackerId) async {
    try {
      final gps = await apiService.getGpsLatest(trackerId);
      if (gps == null) return;

      final latitude = (gps['lat'] as num).toDouble();
      final longitude = (gps['lng'] as num).toDouble();

      setState(() {
        trackerPositions[trackerId] = GpsPoint(
          trackerId: trackerId,
          lat: latitude,
          lon: longitude,
        );
        mapCenter = LatLng(latitude, longitude);
      });
      if (mounted) {
        _mapController.move(mapCenter, 2);
      }
    } catch (error) {
      debugPrint('Failed to fetch GPS for tracker $trackerId: $error');
    }
  }

  bool _isInsideGeoFence(LatLng point) {
    var inside = false;
    for (var i = 0, j = _geoFenceCorners.length - 1;
        i < _geoFenceCorners.length;
        j = i++) {
      final xi = _geoFenceCorners[i].latitude;
      final yi = _geoFenceCorners[i].longitude;
      final xj = _geoFenceCorners[j].latitude;
      final yj = _geoFenceCorners[j].longitude;

      final intersects = ((yi > point.longitude) != (yj > point.longitude)) &&
          (point.latitude <
              (xj - xi) * (point.longitude - yi) / (yj - yi) + xi);
      if (intersects) {
        inside = !inside;
      }
    }
    return inside;
  }

  Future<void> _checkBackendHealth() async {
    setState(() {
      isCheckingHealth = true;
      healthText = 'Checking...';
    });

    try {
      final result = await apiService.getHealth();
      setState(() {
        healthText = 'Backend OK: ${result['status']?.toString() ?? 'unknown'}';
      });
    } catch (error) {
      setState(() {
        healthText = 'Health check failed: $error';
      });
    } finally {
      setState(() {
        isCheckingHealth = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedPosition = selectedTrackerId != null
        ? trackerPositions[selectedTrackerId!]
        : null;
    final isInsideFence = selectedPosition != null
        ? _isInsideGeoFence(LatLng(selectedPosition.lat, selectedPosition.lon))
        : false;

    return Consumer<SocketProvider>(
      builder: (context, provider, child) 
      {

        if (provider.latestAlarm != null) 
        {
          WidgetsBinding.instance.addPostFrameCallback((_) 
          {
            AlarmPopup.show(context);
          });
        }

        return Scaffold(
          appBar: AppBar(
            title: const Text('Tracker Map'),
          ),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                ElevatedButton(
                  onPressed: isCheckingHealth ? null : _checkBackendHealth,
                  child: Text(
                    isCheckingHealth ? 'Checking backend...' : 'Check backend health',
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  healthText,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 20),
                if (isLoadingTrackers)
                  const Center(child: CircularProgressIndicator())
                else if (trackerLoadError != null)
                  Text('Failed to load trackers: $trackerLoadError')
                else
                  Row(
                    children: [
                      const Text('Tracker ID:'),
                      const SizedBox(width: 12),
                      Expanded(
                        child: DropdownButtonFormField<int>(
                          initialValue: selectedTrackerId,
                          items: trackerIds
                          .map(
                            (id) => DropdownMenuItem(
                              value: id,
                              child: Text(id.toString()),
                            ),
                          )
                          .toList(),
                          onChanged: (value) 
                          {
                            if (value == null) return;
                            setState(() 
                            {
                              selectedTrackerId = value;
                            });
                            _fetchLatestGps(value);
                          },
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 10,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Expanded(
                          flex: 2,
                          child: Container(
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.black26),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            clipBehavior: Clip.hardEdge,
                            child: FlutterMap(
                              mapController: _mapController,
                              options: MapOptions(
                                initialCenter: mapCenter,
                                initialZoom: selectedPosition == null ? 18 : 23,
                              ),
                              children: [
                                TileLayer(
                                  urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                  subdomains: const ['a', 'b', 'c'],
                                ),
                                PolygonLayer(
                                  polygons: [
                                    Polygon(
                                      points: _geoFenceCorners,
                                      color: Colors.blue.withValues(alpha: 0.15),
                                      borderColor: Colors.blueAccent,
                                      borderStrokeWidth: 3,
                                    ),
                                  ],
                                ),
                                if (selectedPosition != null)
                                  MarkerLayer(
                                    markers: [
                                      Marker(
                                        width: 48,
                                        height: 48,
                                        point: LatLng(
                                          selectedPosition.lat,
                                          selectedPosition.lon,
                                        ),
                                        child: const Icon(
                                          Icons.location_on,
                                          color: Colors.red,
                                         size: 40,
                                        ),
                                      ),
                                    ],
                                  ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.black26),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.all(12),
                            child: selectedPosition == null 
                            ? const Center(child: Text('No GPS data yet.'))
                            : Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Tracker ${selectedPosition.trackerId}',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text('Latitude: ${selectedPosition.lat}'),
                                Text('Longitude: ${selectedPosition.lon}'),
                                const SizedBox(height: 12),
                                Text(
                                  isInsideFence ? 'Inside geofence' : 'Outside geofence',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: isInsideFence ? Colors.green : Colors.red,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Updated every 5 seconds from Nest API',
                                  style: TextStyle(color: Colors.grey[700]),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    pollingTimer?.cancel();
    super.dispose();
  }
}
