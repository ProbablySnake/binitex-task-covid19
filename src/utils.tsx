import { IData, IRecord } from "./App/App";

interface IRecordExt extends IRecord {
  popData2019: number;
}

export function prcocessDataFromJson({ records: rawRecords }: { records: Array<any> }): IData {

  // Format Array from JSON
  let records = rawRecords.map((rawRecord: any): IRecordExt => {
    return {
      country: rawRecord.countriesAndTerritories,
      date: new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day),
      cases: rawRecord.cases,
      deaths: rawRecord.deaths,
      casesTotal: 0,
      deathsTotal: 0,
      casesThousand: rawRecord.cases / rawRecord.popData2019 * 1000,
      deathsThousand: rawRecord.deaths / rawRecord.popData2019 * 1000,
      popData2019: rawRecord.popData2019,
    }
  });

  // Set up counters for counting total cases/deaths (from day 1 to individual record date)
  let casesCounter: { [key: string]: number; } = {};
  records.forEach(element => {
    casesCounter[element.country] = 0
  });
  let deathsCounter = casesCounter;

  // Getting array of all countries and regions for search aoutocomplete (foramt {name, value} is required for SelectSearch component)
  let countries = Object.keys(casesCounter).map((country: string) => { return { name: country.replaceAll('_', ' '), value: country } })
  countries.unshift({ name: 'World', value: 'World' })

  // sorting by date
  records.sort((a: IRecord, b: IRecord) => {
    if (a.date < b.date) return -1
    if (a.date > b.date) return 1
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
  let recordsWorldwide: Array<IRecordExt> = [];

  let currentDate = new Date(0); // records will be summed by dates, so I have to know currend date

  for (const record of records) {
    if (currentDate.getTime() !== record.date.getTime()) {  // if new day started pushing new record in array
      currentDate = record.date; // updating currentDate
      recordsWorldwide.push({
        country: 'World',
        date: record.date,
        cases: record.cases,
        casesTotal: record.casesTotal,
        deaths: record.deaths,
        deathsTotal: record.deathsTotal,
        casesThousand: 0,
        deathsThousand: 0,
        popData2019: record.popData2019,
      });
      continue;
    }
    let id = recordsWorldwide.length - 1;  // when it's the same day add numbers to existing record
    recordsWorldwide[id] = {
      ...recordsWorldwide[id],
      cases: record.cases + recordsWorldwide[id].cases,
      casesTotal: record.casesTotal + recordsWorldwide[id].casesTotal,
      deaths: record.deaths + recordsWorldwide[id].deaths,
      deathsTotal: record.deathsTotal + recordsWorldwide[id].deathsTotal,
      popData2019: record.popData2019 + recordsWorldwide[id].popData2019,
    }
  }

  //returning data
  return {
    minDate,
    maxDate,
    countries,
    records: records.map((record: IRecordExt) => {
      return {
        country: record.country,
        date: record.date,
        cases: record.cases,
        deaths: record.deaths,
        casesTotal: record.casesTotal,
        deathsTotal: record.deathsTotal,
        casesThousand: record.casesThousand,
        deathsThousand: record.deathsThousand,
      }
    }),
    recordsWorldwide: recordsWorldwide.map((record: IRecordExt) => {
      return {
        country: record.country,
        date: record.date,
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

export function tabs() {
  return [
    { name: 'Day statistics', value: 'day' },
    { name: 'Chart', value: 'chart' },
    { name: 'Period statistics', value: 'period' },
  ];
}

export function filterFieldsDay() {
  return [
    { name: 'Cases', value: 'cases' },
    { name: 'Deaths', value: 'deaths' },
    { name: 'Cases total', value: 'casesTotal' },
    { name: 'Deaths total', value: 'deathsTotal' },
    { name: 'Cases per 1000 inhabitants', value: 'casesThousand' },
    { name: 'Deaths per 1000 inhabitants', value: 'deathsThousand' },
  ]
}

export function filterFieldsPeriod() {
  return [
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
  ]
}