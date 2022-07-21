import { IData, IRecord } from "./App";

export function prcocessDataFromJson({ records: rawRecords }: { records: Array<any> }): IData {

  // Format Array from JSON
  let records = rawRecords.map((rawRecord: any): IRecord => {
    return {
      country: rawRecord.countriesAndTerritories,
      date: new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day),
      cases: rawRecord.cases,
      casesTotal: 0,
      deaths: rawRecord.deaths,
      deathsTotal: 0,
      popData2019: rawRecord.popData2019,
    }
  });

  // Set up counters for counting total cases/deaths (from day 1 to individual record date)
  let casesCounter: { [key: string]: number; } = {};
  records.forEach(element => {
    casesCounter[element.country] = 0
  });
  let deathsCounter = casesCounter;

  let countries = Object.keys(casesCounter) // Getting array of all countries for search aoutocomplete

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
  let recordsWorldwide: Array<IRecord> = [];

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
    records,
    recordsWorldwide
  }
}