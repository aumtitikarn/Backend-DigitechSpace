import 'chartjs-plugin-datalabels';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    datalabels?: {
      display?: boolean;
      align?: string;
      anchor?: string;
      color?: string;
      font?: {
        size?: number;
      };
      formatter?: (value: number, context: any) => string;
    };
  }
}
