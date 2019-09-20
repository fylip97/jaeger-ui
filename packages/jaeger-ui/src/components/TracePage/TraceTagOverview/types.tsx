export type TableSpan = {
  name: string;
  count: number;
  total: number;
  avg: number;
  min: number;
  max: number;
  self: number;
  selfAvg: number;
  selfMin: number;
  selfMax: number;
  percent: number;
  isDetail: boolean;
  parentElement: string;


  colorToPercent: string;

}