/// Represents a single GPS reading for a tracker.
///
/// Contains the numeric `trackerId` and the latitude/longitude in
/// decimal degrees. This lightweight model is used by mapping and
/// tracking UI to display the latest known position of a device.
class GpsPoint {
  /// Identifier of the tracker this point belongs to.
  final int trackerId;

  /// Latitude in decimal degrees.
  final double lat;

  /// Longitude in decimal degrees.
  final double lon;

  /// Creates a new [GpsPoint].
  const GpsPoint({
    required this.trackerId,
    required this.lat,
    required this.lon,
  });
}
