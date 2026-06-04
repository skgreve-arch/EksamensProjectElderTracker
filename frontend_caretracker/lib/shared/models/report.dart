class Report {
  final String id;
  final String title;
  final String residentName;
  final String trackerId;
  final String author;
  final String description;
  final DateTime createdAt;

  Report({
    required this.id,
    required this.title,
    required this.residentName,
    required this.trackerId,
    required this.author,
    required this.description,
    required this.createdAt,
  });
}