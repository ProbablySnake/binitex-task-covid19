import { IData, IRecord } from "./types";

interface IRecordExt extends IRecord {
  popData2019: number;
}
export function prcocessDataFromJson({ records: rawRecords }: { records: Array<any> }): IData {

  // Format Array from JSON
  let records = rawRecords.map((rawRecord: any): IRecordExt => {
    return {
      date: new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day),
      country: rawRecord.countriesAndTerritories,
      cases: rawRecord.cases,
      deaths: rawRecord.deaths,
      casesTotal: 0,
      deathsTotal: 0,
      casesThousand: rawRecord.popData2019 > 0 ? rawRecord.cases / rawRecord.popData2019 * 1000 : 'No pop. data',
      deathsThousand: rawRecord.popData2019 > 0 ? rawRecord.deaths / rawRecord.popData2019 * 1000 : 'No pop. data',
      popData2019: rawRecord.popData2019,
    }
  });

  // Set up counters for counting total cases/deaths (from day 1 to individual record date)
  let casesCounter: { [key: string]: number; } = {};
  records.forEach(element => {
    casesCounter[element.country] = 0
  });
  let deathsCounter = { ...casesCounter };

  // Getting array of all countries and regions for search aoutocomplete (foramt {name, value} is required for SelectSearch component)
  let countries = Object.keys(casesCounter).map((country: string) => { return { name: country.replaceAll('_', ' '), value: country } })
  countries.unshift({ name: 'World - combined info', value: 'World' })

  // sorting by date
  records.sort((a: IRecord, b: IRecord) => {
    if (a.date.getTime() < b.date.getTime()) return -1
    if (a.date.getTime() > b.date.getTime()) return 1
    return 0
  })

  // getting min/max dates for datepicker
  let minDate = records[0].date;
  let maxDate = records[records.length - 1].date;

  // actualy counting totals and saving them
  for (let i = 0; i < records.length; i++) {
    casesCounter[records[i].country] += records[i].cases;
    deathsCounter[records[i].country] += records[i].deaths;
    records[i].casesTotal = casesCounter[records[i].country];
    records[i].deathsTotal = deathsCounter[records[i].country];
  }

  // creating separate records table for worldwide statistics
  let recordsWorld: Array<IRecordExt> = [];

  let currentDate = new Date(0); // records will be summed by dates, so I have to know currend date

  for (const record of records) {
    if (currentDate.getTime() !== record.date.getTime()) {  // if new day started pushing new record in array
      currentDate = record.date; // updating currentDate
      recordsWorld.push({
        date: record.date,
        country: 'World',
        cases: record.cases,
        casesTotal: 0,
        deaths: record.deaths,
        deathsTotal: 0,
        casesThousand: 0,
        deathsThousand: 0,
        popData2019: record.popData2019,
      });
      continue;
    }
    let id = recordsWorld.length - 1;  // when it's the same day add numbers to existing record
    recordsWorld[id] = {
      ...recordsWorld[id],
      cases: record.cases + recordsWorld[id].cases,
      deaths: record.deaths + recordsWorld[id].deaths,
      popData2019: record.popData2019 + recordsWorld[id].popData2019,
    }
  }

  // some countries don't have records for every date, so you can't just sum totals
  // counting totals for world
  let casesCounterW = 0;
  let deathsCounterW = 0;
  recordsWorld = recordsWorld.map((record: IRecordExt) => {
    casesCounterW += record.cases;
    deathsCounterW += record.deaths;
    return { ...record, casesTotal: casesCounterW, deathsTotal: deathsCounterW }
  })

  //returning data
  return {
    minDate,
    maxDate,
    countries,
    records: records.map((record: IRecordExt) => {
      return {
        date: record.date,
        country: record.country,
        cases: record.cases,
        deaths: record.deaths,
        casesTotal: record.casesTotal,
        deathsTotal: record.deathsTotal,
        casesThousand: record.casesThousand,
        deathsThousand: record.deathsThousand,
      }
    }),
    recordsWorld: recordsWorld.map((record: IRecordExt) => {
      return {
        date: record.date,
        country: record.country,
        cases: record.cases,
        deaths: record.deaths,
        casesTotal: record.casesTotal,
        deathsTotal: record.deathsTotal,
        casesThousand: record.cases / record.popData2019 * 1000,
        deathsThousand: record.deaths / record.popData2019 * 1000,
      }
    }),
  }
}

export const tabs = [
  { name: 'Day statistics', value: 'day' },
  { name: 'Chart', value: 'chart' },
  { name: 'Period statistics', value: 'period' },
];

export const filterFieldsDay = [
  { name: 'Cases', value: 'cases' },
  { name: 'Deaths', value: 'deaths' },
  { name: 'Cases total', value: 'casesTotal' },
  { name: 'Deaths total', value: 'deathsTotal' },
  { name: 'Cases per 1000 (‰) inhabitants', value: 'casesThousand' },
  { name: 'Deaths per 1000 (‰) inhabitants', value: 'deathsThousand' },
];

export const filterFieldsPeriod = [
  { name: 'Cases total', value: 'casesTotalPeriod' },
  { name: 'Deaths total', value: 'deathsTotalPeriod' },
  { name: 'Cases average', value: 'casesAverage' },
  { name: 'Deaths average', value: 'deathsAverage' },
  { name: 'Cases maximal', value: 'casesMax' },
  { name: 'Deaths maximal', value: 'deathsMax' },
  { name: 'Average cases per 1000 inhabitants', value: 'casesThousandAverage' },
  { name: 'Average deaths per 1000 inhabitants', value: 'deathsThousandAverage' },
  { name: 'Maximal cases per 1000 inhabitants', value: 'casesThousandMax' },
  { name: 'Maximal deaths per 1000 inhabitants', value: 'deathsThousandMax' },
];
