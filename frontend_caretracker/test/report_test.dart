import 'package:flutter_test/flutter_test.dart';
import 'package:frontend_caretracker/shared/models/report.dart';

void main() {
  test('Report should store values correctly', () {
    final report = Report(
      id: '1',
      title: 'Alarm Triggered',
      residentName: 'John Jensen',
      author: 'Mikkel',
      description: 'Resident pressed alarm button',
      createdAt: DateTime.now(),
    );

    expect(report.title, 'Alarm Triggered');
    expect(report.residentName, 'John Jensen');
    expect(report.author, 'Mikkel');
    expect(report.description, 'Resident pressed alarm button');
  });
}
