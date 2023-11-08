import { DayRange, TimeModel } from "../models/chartModel";

export function getTimeRange(): TimeModel[] {
  return [
    { range: DayRange.Seven, name: "7 days" },
    { range: DayRange.Fourteen, name: "14 days" },
  ];
}

export function getChart1Points(range: DayRange): any[] {
  switch (range) {
    case DayRange.Seven:
      return chart1Points_7D;
    case DayRange.Fourteen:
      return chart1Points_14D
    default:
      return [];
  }
}

export function getChart2Points(range: DayRange): any[] {
  switch (range) {
    case DayRange.Seven:
      return chart2Points_7D;
    case DayRange.Fourteen:
      return chart2Points_14D;
    default:
      return [];
  }
}

const chart1Points_7D = [
  { x: new Date("01/01"), y: 18000 },
  { x: new Date("01/06"), y: 14000 },
  { x: new Date("01/11"), y: 19000 },
  { x: new Date("01/16"), y: 13000 },
  { x: new Date("01/21"), y: 21000 },
  { x: new Date("01/26"), y: 18000 },
  { x: new Date("01/31"), y: 23000 },
];

const chart2Points_7D = [
  { x: new Date("01/01"), y: 8000 },
  { x: new Date("01/06"), y: 10000 },
  { x: new Date("01/11"), y: 100 },
  { x: new Date("01/16"), y: 9000 },
  { x: new Date("01/21"), y: 11000 },
  { x: new Date("01/26"), y: 7000 },
  { x: new Date("01/31"), y: 7200 },
];


const chart1Points_14D = [
  { x: new Date("01/01"), y: 12000 },
  { x: new Date("01/06"), y: 35000 },
  { x: new Date("01/11"), y: 23123 },
  { x: new Date("01/16"), y: 45654 },
  { x: new Date("01/21"), y: 23122 },
  { x: new Date("01/26"), y: 15500 },
  { x: new Date("01/31"), y: 23123 },
];

const chart2Points_14D = [
  { x: new Date("01/01"), y: 15000 },
  { x: new Date("01/06"), y: 43000 },
  { x: new Date("01/11"), y: 35000 },
  { x: new Date("01/16"), y: 25000 },
  { x: new Date("01/21"), y: 15000 },
  { x: new Date("01/26"), y: 15000 },
  { x: new Date("01/31"), y: 23122 },
];
