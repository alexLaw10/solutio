import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexFill,
  ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexLegend
} from 'ng-apexcharts';

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  responsive?: ApexResponsive[];
};

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  responsive?: ApexResponsive[];
};

export type DonutOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  responsive: ApexResponsive[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotOptions?: any; // ApexCharts doesn't export ApexPlotOptions type
};
