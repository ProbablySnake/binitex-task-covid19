import React, { useEffect, useState } from 'react';
import { prcocessDataFromJson } from './utils';

export interface IData {
    minDate: Date,
    maxDate: Date,
    countries: string[],
  records: IRecord[],
  recordsWorldwide: IRecord[],
}

export interface IRecord {
  country: string,
  date: Date,
  cases: number,
  casesTotal: number,
  deaths: number,
  deathsTotal: number,
  popData2019: number,
}

interface IProps { }

export default function App({ }: IProps) {

  const [data, setData] = useState<IData | undefined>(undefined)

  useEffect(() => {
    fetch("/covid19/casedistribution/json") // Getting data from API   https://opendata.ecdc.europa.eu added as proxy in package.json to 'fix' CORS bug
      .then((res) => res.json())
      .then((json) => {
        setData(prcocessDataFromJson(json));
      })
  }, [])

  if (!data) return (
    <div>
      <h1> Loading ... </h1>
    </div>
  )

  console.log(data);

  return (
      <div className="App">
      <h1> Complete </h1>
      </div>
  )
}
