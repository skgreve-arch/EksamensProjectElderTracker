import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_caretracker/features/auth/login_page.dart';

void main() {

  testWidgets(
    'Login page contains email and password fields',
    (WidgetTester tester) async {

      await tester.pumpWidget(
        const MaterialApp(
          home: LoginPage(),
        ),
      );

      expect(find.text('CareTrack Login'), findsOneWidget);

      expect(find.text('Email'), findsOneWidget);

      expect(find.text('Password'), findsOneWidget);
    },
  );

}