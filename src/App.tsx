import { stringify } from 'querystring';
import React from 'react';


export interface IAppProps {
}

export interface IAppState {
  DataisLoaded: boolean,
  items?: { records: Array<any> },
  data?: {
    records: Array<Record>,
    minDate: Date,
    maxDate: Date,
    countries: string[],
  }
}

export interface Record {
  country: string,
  date: Date,
  cases: number,
  casesTotal: number,
  deaths: number,
  deathsTotal: number,
  cumulativeCases: number,
}

export default class App extends React.Component<IAppProps, IAppState> {

  state: IAppState = {
    DataisLoaded: false
  };

  componentDidMount() {
    fetch(
      "/covid19/casedistribution/json")
      .then((res) => res.json())
      .then((json) => {

        let records: Record[] = [];
        let minDate = new Date(json.records[0].year, json.records[0].month - 1, json.records[0].day);
        let maxDate = new Date(json.records[0].year, json.records[0].month - 1, json.records[0].day);
        let casesCounter: any = {};
        let deathsCounter: any = {};
        let countries: string[];
        let prevDate: Date;
        let storedId: number;

        json.records.map((rawRecord: any) => {
          records.push({
            date: new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day),
            cases: rawRecord.cases,
            casesTotal: 0,
            deaths: rawRecord.deaths,
            deathsTotal: 0,
            country: rawRecord.countriesAndTerritories,
            cumulativeCases: Number(rawRecord['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']),
          });
          if (minDate > new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)) {
            minDate = new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)
          }
          if (maxDate < new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)) {
            maxDate = new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)
          }
          casesCounter[rawRecord.countriesAndTerritories] = 0;
          deathsCounter[rawRecord.countriesAndTerritories] = 0;
        })

        countries = Object.getOwnPropertyNames(casesCounter);

        records.sort((a: Record, b: Record) => {
          if (a.date < b.date) return -1
          if (a.date > b.date) return 1
          return 0
        })

        records.map((record: Record, id: number) => {

          casesCounter[record.country] += record.cases;
          deathsCounter[record.country] += record.deaths;
          records[id].casesTotal = casesCounter[record.country];
          records[id].deathsTotal = deathsCounter[record.country];

          if (prevDate !== undefined && prevDate.getTime() === record.date.getTime()) {
            records[storedId] = {
              country: 'World',
              date: record.date,
              cases: records[storedId].cases + record.cases,
              deaths: records[storedId].deaths + record.deaths,
              cumulativeCases: records[storedId].cumulativeCases + record.cumulativeCases,
              casesTotal: records[storedId].casesTotal + casesCounter[record.country],
              deathsTotal: records[storedId].deathsTotal + deathsCounter[record.country],
            }
          } else {
            if (storedId) records[storedId].cumulativeCases = records[storedId].cumulativeCases / countries.length;
            storedId = records.push({
              country: 'World',
              date: record.date,
              cases: record.cases,
              deaths: record.deaths,
              cumulativeCases: record.cumulativeCases,
              casesTotal: casesCounter[record.country],
              deathsTotal: deathsCounter[record.country],
            }) - 1;
            prevDate = record.date;
          }

        });

        records.sort((a: Record, b: Record) => {
          if (a.country < b.country) return -1
          if (a.country > b.country) return 1
          if (a.date < b.date) return -1
          if (a.date < b.date) return 1
          return 0
        })

        countries.sort();
        countries.unshift('World');

        this.setState({
          data: {
            records: records,
            minDate: minDate,
            maxDate: maxDate,
            countries: countries,
          },
          DataisLoaded: true
        });
      })
  }

  render() {
    const { DataisLoaded, data } = this.state;
    if (!DataisLoaded) return <div>
      <h1> Please wait some time.... </h1> </div>;

    if (data)
    console.log(data);

    return (
      <div className="App">
        <h1> Fetch data from an api in react </h1>
      </div>
    );
  }
}
