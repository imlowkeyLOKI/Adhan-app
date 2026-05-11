import WidgetKit
import SwiftUI

// Prayer data shared from the main app via App Groups (UserDefaults suite)
struct PrayerEntry: TimelineEntry {
    let date: Date
    let prayers: [(name: String, time: String)]
    let city: String
}

struct AdhanWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> PrayerEntry {
        PrayerEntry(date: Date(), prayers: samplePrayers, city: "")
    }

    func getSnapshot(in context: Context, completion: @escaping (PrayerEntry) -> Void) {
        completion(PrayerEntry(date: Date(), prayers: loadPrayers(), city: loadCity()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerEntry>) -> Void) {
        let entry = PrayerEntry(date: Date(), prayers: loadPrayers(), city: loadCity())
        // Refresh at midnight each day
        let midnight = Calendar.current.startOfDay(for: Date().addingTimeInterval(86400))
        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }

    private func loadPrayers() -> [(name: String, time: String)] {
        // Read prayer times written by the main app into shared UserDefaults (App Group)
        let defaults = UserDefaults(suiteName: "group.com.adhanapp.adhan")
        guard let data = defaults?.data(forKey: "prayerTimes"),
              let decoded = try? JSONDecoder().decode([[String: String]].self, from: data)
        else { return samplePrayers }
        return decoded.compactMap { d in
            guard let name = d["name"], let time = d["time"] else { return nil }
            return (name: name, time: time)
        }
    }

    private func loadCity() -> String {
        let defaults = UserDefaults(suiteName: "group.com.adhanapp.adhan")
        return defaults?.string(forKey: "city") ?? ""
    }

    private var samplePrayers: [(name: String, time: String)] {
        [("Fajr", "5:12 AM"), ("Dhuhr", "1:05 PM"), ("Asr", "4:28 PM"), ("Maghrib", "7:37 PM"), ("Isha", "9:02 PM")]
    }
}

struct AdhanWidgetEntryView: View {
    var entry: PrayerEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            Text("Adhan")
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(Color(hex: "#c8a96e"))

            if !entry.city.isEmpty {
                Text(entry.city)
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "#8a9bb0"))
                    .padding(.bottom, 6)
            } else {
                Spacer().frame(height: 6)
            }

            // Prayer rows
            ForEach(entry.prayers, id: \.name) { prayer in
                HStack {
                    Text(prayer.name)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: "#f0ede8"))
                    Spacer()
                    Text(prayer.time)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#f0ede8"))
                }
                .padding(.vertical, 2)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(Color(hex: "#0f1923"))
    }
}

@main
struct AdhanWidget: Widget {
    let kind: String = "AdhanWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: AdhanWidgetProvider()) { entry in
            AdhanWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Adhan")
        .description("All 5 prayer times for today.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// Hex color helper
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8) & 0xFF) / 255
        let b = Double(int & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
