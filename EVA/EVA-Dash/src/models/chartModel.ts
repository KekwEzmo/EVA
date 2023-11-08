export enum DayRange {
  Seven,
  Fourteen,
}

export interface TimeModel {
  range: DayRange;
  name: string;
}
