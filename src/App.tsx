import React from 'react';

import { prcocessDataFromJson } from './utils';

export interface IAppProps {
}

export interface IAppState {
  DataisLoaded: boolean,
  data?: {
    minDate: Date,
    maxDate: Date,
    countries: string[],
    records: Record[],
    recordsWorldwide: Record[],
  }
}

export interface Record {
  country: string,
  date: Date,
  cases: number,
  casesTotal: number,
  deaths: number,
  deathsTotal: number,
  popData2019: number,
}

export default class App extends React.Component<IAppProps, IAppState> {

  state: IAppState = {
    DataisLoaded: false
  };

  componentDidMount() {
    fetch("/covid19/casedistribution/json") // Getting data from API   https://opendata.ecdc.europa.eu added as proxy in package.json to 'fix' CORS bug
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          data: prcocessDataFromJson(json),
          DataisLoaded: true
        });
      })
  }

  render() {
    const { DataisLoaded, data } = this.state;
    if (!DataisLoaded) return <div>
      <h1> Please wait some time.... </h1> </div>;

    if (data)
    // console.log(data);

    return (
      <div className="App">
        <h1> Fetch data from an api in react </h1>
      </div>
    );
  }
}
