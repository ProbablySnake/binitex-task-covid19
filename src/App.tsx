import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


export interface IAppProps {
}

export interface IAppState {
  DataisLoaded: boolean,
  items?: { records: Array<any> },
  data?: {
    records: Array<Record>,
    minDate: Date,
    maxDate: Date,
  }
}

interface Record {
  dateRep: Date,
  day: number,
  month: number,
  year: number,
  cases: number,
  deaths: number,
  countriesAndTerritories: string,
  geoId: string,
  countryterritoryCode: string,
  popData2019: number,
  continentExp: string,
  'Cumulative_number_for_14_days_of_COVID-19_cases_per_100000': number,
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
        json.records.map((rawRecord: any, id: number) => {
          records.push({
            dateRep: new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day),
            day: Number(rawRecord.day),
            month: Number(rawRecord.month),
            year: Number(rawRecord.year),
            cases: rawRecord.cases,
            deaths: rawRecord.deaths,
            countriesAndTerritories: rawRecord.countriesAndTerritories,
            geoId: rawRecord.geoId,
            countryterritoryCode: rawRecord.countryterritoryCode,
            popData2019: rawRecord.popData2019,
            continentExp: rawRecord.continentExp,
            'Cumulative_number_for_14_days_of_COVID-19_cases_per_100000': Number(rawRecord['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']),
          });
          if (minDate > new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)) {
            minDate = new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)
          }
          if (maxDate < new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)) {
            maxDate = new Date(rawRecord.year, rawRecord.month - 1, rawRecord.day)
          }
        })

        this.setState({
          data: { records: records, minDate: minDate, maxDate: maxDate },
          DataisLoaded: true
        });
      })
  }

  render() {
    const { DataisLoaded, data } = this.state;
    if (!DataisLoaded) return <div>
      <h1> Pleses wait some time.... </h1> </div>;

    console.log(data);

    return (
      <div className="App">
        <h1> Fetch data from an api in react </h1>
      </div>
    );
  }
}
