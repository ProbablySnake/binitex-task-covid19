import { SelectSearchOption } from "react-select-search";

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

export interface IRecordExt extends IRecord {
  popData2019: number;
}

export interface IRecordPeriod {
  country: string,
  casesTotalPeriod: number,
  deathsTotalPeriod: number,
  casesAverage: number,
  deathsAverage: number,
  casesMax: number,
  deathsMax: number,
  casesThousandAverage: number | 'No pop. data',
  deathsThousandAverage: number | 'No pop. data',
  casesThousandMax: number | 'No pop. data',
  deathsThousandMax: number | 'No pop. data',
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

export interface IDateRangeSelectProps {
  minDate: Date,
  maxDate: Date,
  dateRange: { start: Date | null, end: Date | null },
  setDateRange: React.Dispatch<React.SetStateAction<{ start: Date | null, end: Date | null }>>,
}

export interface ITabSelectProps {
  tabs: { name: string, value: string }[],
  selectedTab: string,
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>,
}

export interface IFiltersSelectDayProps {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string | undefined>>,
  filterSelected: IFilterSelectedDay,
  setFilterSelected: React.Dispatch<React.SetStateAction<IFilterSelectedDay>>,
  filterRange: { min: string | undefined, max: string | undefined },
  setFilterRange: React.Dispatch<React.SetStateAction<{ min: string | undefined, max: string | undefined }>>,
}

export interface IFilterSelectChartProps {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string>>,
  infoSelected: 'day' | 'total',
  setInfoSelected: React.Dispatch<React.SetStateAction<'day' | 'total'>>,
}

export interface IFiltersSelectPeriodProps {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string | undefined>>,
  filterSelected: IFilterSelectedPeriod,
  setFilterSelected: React.Dispatch<React.SetStateAction<IFilterSelectedPeriod>>,
  filterRange: { min: string | undefined, max: string | undefined },
  setFilterRange: React.Dispatch<React.SetStateAction<{ min: string | undefined, max: string | undefined }>>,
}

export interface ITableDayProps {
  isActive: boolean,
  records: IRecord[],
  recordsWorld: IRecord[],
  dateRange: { start: Date | null, end: Date | null },
  countrySelected: string | undefined,
  filterSelected: IFilterSelectedDay,
  filterRange: { min: string | undefined, max: string | undefined },
}

export interface IChartProps {
  isActive: boolean,
  records: IRecord[],
  recordsWorld: IRecord[],
  dateRange: { start: Date | null, end: Date | null },
  countrySelected: string,
  infoSelected: 'day' | 'total'
}

export interface ITablePeriodProps {
  isActive: boolean,
  records: IRecord[],
  recordsWorld: IRecord[],
  countries: SelectSearchOption[],
  dateRange: { start: Date | null, end: Date | null },
  countrySelected: string | undefined,
  filterSelected: IFilterSelectedPeriod,
  filterRange: { min: string | undefined, max: string | undefined },
}
