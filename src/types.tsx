
export interface IData {
  minDate: Date,
  maxDate: Date,
  countries: Array<{ name: string, value: string }>,
  records: IRecord[],
  recordsWorld: IRecord[],
}

export interface IRecord {
  date: Date,
  country: string,
  cases: number,
  deaths: number,
  casesTotal: number,
  deathsTotal: number,
  casesThousand: number | 'No pop. data',
  deathsThousand: number | 'No pop. data',
}

export type IFilterSelectedDay = (
  'cases' |
  'deaths' |
  'casesTotal' |
  'deathsTotal' |
  'casesThousand' |
  'deathsThousand' |
  undefined
);

export type IFilterSelectedPeriod = (
  'casesTotalPeriod' |
  'deathsTotalPeriod' |
  'casesAverage' |
  'deathsAverage' |
  'casesMax' |
  'deathsMax' |
  'casesThousandAverage' |
  'deathsThousandAverage' |
  'casesThousandMax' |
  'deathsThousandMax' |
  undefined
);
