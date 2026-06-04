import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'features/tracking/tracking_page.dart';
import 'features/reporting/reporting_page.dart';
import 'providers/socket_provider.dart';
import 'features/alarm/alarm_popup.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int selectedIndex = 0;

  final pages = const [TrackingPage(), ReportingPage()];

  @override
  Widget build(BuildContext context) {
    return Consumer<SocketProvider>(
      builder: (context, provider, child) {
        if (provider.latestAlarm != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            AlarmPopup.show(context);
          });
        }
        return Scaffold(
          body: Row(
            children: [
              NavigationRail(
                selectedIndex: selectedIndex,

                onDestinationSelected: (index) {
                  setState(() {
                    selectedIndex = index;
                  });
                },

                labelType: NavigationRailLabelType.all,

                destinations: const [
                  NavigationRailDestination(
                    icon: Icon(Icons.location_on),
                    label: Text('Tracking'),
                  ),

                  NavigationRailDestination(
                    icon: Icon(Icons.description),
                    label: Text('Reports'),
                  ),
                ],
              ),

              const VerticalDivider(width: 1),

              Expanded(child: pages[selectedIndex]),
            ],
          ),
        );
      },
    );
  }
}
