from pathlib import Path
api_path = Path('lib/core/services/api_service.dart')
text = api_path.read_text(encoding='utf-8')
text = text.replace("Uri.parse('\x7fbaseUrl/health')", "Uri.parse('$baseUrl/health')")
api_path.write_text(text, encoding='utf-8')
track_path = Path('lib/features/tracking/tracking_page.dart')
text = track_path.read_text(encoding='utf-8')
start = text.find('            Expanded(\n              child: ScatterChart(')
if start == -1:
    raise SystemExit('target not found')
replacement = '''            Expanded(
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
          ],
        ),
      ),
    );
  }
}'''
text = text[:start] + replacement
track_path.write_text(text, encoding='utf-8')
print('success')
