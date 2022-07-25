import React, { useEffect, useRef, useState } from 'react';

import { filterFieldsDay, filterFieldsPeriod, prcocessDataFromJson, tabs } from '../utils';
import DateRangeSelect from '../DateRangeSelect/DateRangeSelect';
import TabSelect from '../TabSelect/TabSelect';
import FiltersSelectTable from '../FiltersSelectTable';
import FilterSelectChart from '../FilterSelectChart';
import Chart from '../Chart';
import TableDay from '../TableDay';
import './App.css'

export interface IData {
  minDate: Date,
  maxDate: Date,
  countries: Array<{ name: string, value: string }>,
  records: IRecord[],
  recordsWorld: IRecord[],
}

export interface IRecord {
  country: string,
  date: Date,
  cases: number,
  deaths: number,
  casesTotal: number,
  deathsTotal: number,
  casesThousand: number,
  deathsThousand: number,
}

interface IAppProps { }

export default function App({ }: IAppProps) {

  // Processed data from API
  const [data, setData] = useState<IData | undefined>(undefined)

  // Date range selecteb by user
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });

  // Tab selected by user
  const [selectedTab, setSelectedTab] = useState('day');

  // Filters user selected for "Statistics per day" tab
  const [countrySelectedDay, setCountrySelectedDay] = useState<string | undefined>(undefined);
  const [filterSelectedDay, setFilterSelectedDay] = useState<string | undefined>(undefined);
  const [filterRangeDay, setFilterRangeDay] = useState<{ min: number | undefined, max: number | undefined }>({ min: undefined, max: undefined })

  // Filters user selected for "Chart" tab
  const [countrySelectedChart, setCountrySelectedChart] = useState<string>('World');
  const [infoSelectedChart, setInfoSelectedChart] = useState<'day' | 'total'>('day');

  // Filters user selected for "Statistics per period" tab
  const [countrySelectedRegion, setCountrySelectedRegion] = useState<string | undefined>(undefined);
  const [filterSelectedPeriod, setFilterSelectedPeriod] = useState<string | undefined>(undefined);
  const [filterRangePeriod, setFilterRangePeriod] = useState<{ min: number | undefined, max: number | undefined }>({ min: undefined, max: undefined });

  const dsRef = useRef;


  useEffect(() => {
    fetch("/covid19/casedistribution/json") // Getting data from API   https://opendata.ecdc.europa.eu added as proxy in package.json to 'fix' CORS problem
      .then((res) => res.json())
      .then((json) => {
        const dataTemp = prcocessDataFromJson(json);
        setData(dataTemp);
        setDateRange({ start: dataTemp.minDate, end: dataTemp.maxDate })
      })
  }, [])

  // Loading screen
  if (!data) return (
    <div className='loading'>
      <div className='spinner-border text-light' />
    </div>
  )

  // Main app
  return (
    <div className='container-md'>
      <DateRangeSelect
        minDate={data.minDate}
        maxDate={data.maxDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <TabSelect
        tabs={tabs()}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <div className='row'>
        <div className='container bg-light text-black rounded d-flex flex-column data-screen'>
          <FiltersSelectTable
            isActive={selectedTab === 'day'}
            countries={data.countries}
            countrySelected={countrySelectedDay}
            setCountrySelected={setCountrySelectedDay}
            filterFields={filterFieldsDay()}
            filterSelected={filterSelectedDay}
            setFilterSelected={setFilterSelectedDay}
            filterRange={filterRangeDay}
            setFilterRange={setFilterRangeDay}
          />

          <FilterSelectChart
            isActive={selectedTab === 'chart'}
            countries={data.countries}
            countrySelected={countrySelectedChart}
            setCountrySelected={setCountrySelectedChart}
            infoSelected={infoSelectedChart}
            setInfoSelected={setInfoSelectedChart}
          />

          <FiltersSelectTable
            isActive={selectedTab === 'period'}
            countries={data.countries}
            countrySelected={countrySelectedRegion}
            setCountrySelected={setCountrySelectedRegion}
            filterFields={filterFieldsPeriod()}
            filterSelected={filterSelectedPeriod}
            setFilterSelected={setFilterSelectedPeriod}
            filterRange={filterRangePeriod}
            setFilterRange={setFilterRangePeriod}
          />
          <div className='row flex-fill'>
            <Chart
              isActive={selectedTab === 'chart'}
              records={data.records}
              recordsWorld={data.recordsWorld}
              dateRange={dateRange}
              countrySelected={countrySelectedChart}
              infoSelected={infoSelectedChart}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
