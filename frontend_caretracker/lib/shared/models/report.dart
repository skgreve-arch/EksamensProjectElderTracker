/// Lightweight model representing an incident report used throughout the UI.
///
/// Fields mirror the backend payload keys where possible. This class is
/// intentionally small and only contains data needed for display in lists
/// and detail pages.
class Report {
  /// Unique identifier for the report (stringified from backend ID).
  final String id;

  /// Short title for the report.
  final String title;

  /// Resident's display name related to this report.
  final String residentName;

  /// Name of the user who authored or responded to the report.
  final String author;

  /// Longer description or body of the report.
  final String description;

  /// Creation timestamp of the report.
  final DateTime createdAt;

  /// Creates a new [Report].
  const Report({
    required this.id,
    required this.title,
    required this.residentName,
    required this.author,
    required this.description,
    required this.createdAt,
  });
}
