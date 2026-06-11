import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'features/tracking/tracking_page.dart';
import 'features/reporting/reporting_page.dart';
import 'providers/socket_provider.dart';
import 'features/alarm/alarm_popup.dart';

/// HomePage is the top-level screen with a NavigationRail and content area.
///
/// - Shows a `TrackingPage` and a `ReportingPage` in the main content area.
/// - Listens to `SocketProvider` for incoming alarms and displays
///   an `AlarmPopup` when a new alarm arrives.
class HomePage extends StatefulWidget 
{
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> 
{
  /// Index of the currently selected destination in the `NavigationRail`.
  int selectedIndex = 0;

  /// Cached list of pages that correspond to the navigation destinations.
  /// Marked `const` so the widgets are canonical and not recreated.
  final pages = const [TrackingPage(), ReportingPage()];

  // Flag to prevent multiple alarm dialogs from stacking if multiple alarms arrive
  bool _isAlarmDialogShowing = false;

  @override
  Widget build(BuildContext context) 
  {
    // Use Consumer to rebuild when SocketProvider publishes changes
    // (e.g. when an alarm is received).
    return Consumer<SocketProvider>(
      builder: (context, provider, child) 
      {
        // If a new alarm is present, schedule a post-frame callback
        // to show the popup. Doing it post-frame avoids showing dialogs
        // while the widget tree is still building.
        if (provider.latestAlarm != null && !_isAlarmDialogShowing) 
        {
          _isAlarmDialogShowing = true; 
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (!mounted) return;
            AlarmPopup.show(context).then((_) {
              if (mounted) setState(() => _isAlarmDialogShowing = false);
            });
          });
        }

        return Scaffold(
          body: Row(
            children: [
              // Left-side navigation rail for switching pages.
              NavigationRail(
                selectedIndex: selectedIndex,

                // Update local state when the user selects a destination.
                onDestinationSelected: (index) {
                  setState(() {
                    selectedIndex = index;
                  });
                },

                // Show labels for all destinations.
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

              // Visual separator between navigation and content.
              const VerticalDivider(width: 1),

              // Expanded content area shows the currently selected page.
              Expanded(child: pages[selectedIndex]),
            ],
          ),
        );
      },
    );
  }
}
