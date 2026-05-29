import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../shared/models/gps_point.dart';
import '../../core/services/socket_service.dart';

class TrackingPage extends StatefulWidget {
  const TrackingPage({super.key});

  @override
  State<TrackingPage> createState() => _TrackingPageState();
}

class _TrackingPageState extends State<TrackingPage> {

  final List<GpsPoint> points = [];

  final socketService = SocketService();

  @override
  void initState() {
    super.initState();

    socketService.connect();

    /*socketService.socket.on('gps', (data) {

      print(data);

      addPoint(
        data['lat'],
        data['lon'],
      );

    });*/
  }

  void addPoint(double lat, double lon) {

    setState(() {

      points.add(
        GpsPoint(lat: lat, lon: lon),
      );

      if (points.length > 5) {
        points.removeAt(0);
      }
    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tracker'),
      ),

      body: Padding(
        padding: const EdgeInsets.all(20),

        child: ScatterChart(

          ScatterChartData(

            scatterSpots: points.map((point) {

              return ScatterSpot(
                point.lon,
                point.lat,
              dotPainter: FlDotCirclePainter(
                radius: 8,
                ),
              );

            }).toList(),

          ),
        ),
      ),
    );
  }
}