import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export type AdhanWidgetProps = {
  prayers: { name: string; time: string }[];
  date: string;
  city: string;
};

export function AdhanWidget({ prayers, date, city }: AdhanWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        backgroundColor: '#0f1923',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
      }}
    >
      {/* Header */}
      <FlexWidget style={{ flexDirection: 'column', marginBottom: 8 }}>
        <TextWidget
          text="Adhan"
          style={{ fontSize: 13, color: '#c8a96e', fontWeight: 'bold' }}
        />
        <TextWidget
          text={city ? `${date} · ${city}` : date}
          style={{ fontSize: 11, color: '#8a9bb0', marginTop: 2 }}
        />
      </FlexWidget>

      {/* Prayer rows */}
      <FlexWidget style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-evenly' }}>
        {prayers.map(prayer => (
          <FlexWidget
            key={prayer.name}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 2,
            }}
          >
            <TextWidget
              text={prayer.name}
              style={{ fontSize: 13, color: '#f0ede8', fontWeight: '500' }}
            />
            <TextWidget
              text={prayer.time}
              style={{ fontSize: 13, color: '#f0ede8' }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}
