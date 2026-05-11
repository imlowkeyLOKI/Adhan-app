import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { AdhanWidget } from './AdhanWidget';
import { buildWidgetData } from '../../src/services/widgetData';

const nameToWidget: Record<string, React.ComponentType<any>> = {
  AdhanWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const data = await buildWidgetData();
      props.renderWidget(
        <AdhanWidget
          prayers={data.prayers}
          date={data.date}
          city={data.city}
        />
      );
      break;
    }
    case 'WIDGET_DELETED':
      break;
    default:
      break;
  }
}
