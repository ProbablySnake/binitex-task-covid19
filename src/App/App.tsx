import React, { useEffect, useState } from 'react';

import { prcocessDataFromJson, tabs } from '../utils';
import { IData, IFilterSelectedDay, IFilterSelectedPeriod } from '../types';
import DateRangeSelect from '../DateRangeSelect/DateRangeSelect';
import TabSelect from '../TabSelect/TabSelect';
import FiltersSelectDay from '../FiltersSelect/FiltersSelectDay';
import FiltersSelectChart from '../FiltersSelect/FiltersSelectChart';
import TableDay from '../ShowData/TableDay';
import Chart from '../ShowData/Chart';

import './App.css'
import FiltersSelectPeriod from '../FiltersSelect/FiltersSelectPeriod';
import TablePeriod from '../ShowData/TablePeriod';

export default function App() {

  // Processed data from API
  const [data, setData] = useState<IData | undefined>(undefined)

  // Date range selecteb by user
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });

  // Tab selected by user
  const [selectedTab, setSelectedTab] = useState('day');

  // Filters user selected for "Statistics per day" tab
  const [countrySelectedDay, setCountrySelectedDay] = useState<string | undefined>('World');
  const [filterSelectedDay, setFilterSelectedDay] = useState<IFilterSelectedDay>(undefined);
  const [filterRangeDay, setFilterRangeDay] = useState<{ min: string | undefined, max: string | undefined }>({ min: undefined, max: undefined })

  // Filters user selected for "Chart" tab
  const [countrySelectedChart, setCountrySelectedChart] = useState<string>('World');
  const [infoSelectedChart, setInfoSelectedChart] = useState<'day' | 'total'>('day');

  // Filters user selected for "Statistics per period" tab
  const [countrySelectedPeriod, setCountrySelectedPeriod] = useState<string | undefined>('World');
  const [filterSelectedPeriod, setFilterSelectedPeriod] = useState<IFilterSelectedPeriod>(undefined);
  const [filterRangePeriod, setFilterRangePeriod] = useState<{ min: string | undefined, max: string | undefined }>({ min: undefined, max: undefined });


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
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <div className='row'>
        <div className='container bg-light text-black rounded d-flex flex-column pb-2'>
          <FiltersSelectDay
            isActive={selectedTab === 'day'}
            countries={data.countries}
            countrySelected={countrySelectedDay}
            setCountrySelected={setCountrySelectedDay}
            filterSelected={filterSelectedDay}
            setFilterSelected={setFilterSelectedDay}
            filterRange={filterRangeDay}
            setFilterRange={setFilterRangeDay}
          />
          <TableDay
            isActive={selectedTab === 'day'}
            records={data.records}
            recordsWorld={data.recordsWorld}
            dateRange={dateRange}
            countrySelected={countrySelectedDay}
            filterSelected={filterSelectedDay}
            filterRange={filterRangeDay}
          />

          <FiltersSelectChart
            isActive={selectedTab === 'chart'}
            countries={data.countries}
            countrySelected={countrySelectedChart}
            setCountrySelected={setCountrySelectedChart}
            infoSelected={infoSelectedChart}
            setInfoSelected={setInfoSelectedChart}
          />
          <Chart
            isActive={selectedTab === 'chart'}
            records={data.records}
            recordsWorld={data.recordsWorld}
            dateRange={dateRange}
            countrySelected={countrySelectedChart}
            infoSelected={infoSelectedChart}
          />

          <FiltersSelectPeriod
            isActive={selectedTab === 'period'}
            countries={data.countries}
            countrySelected={countrySelectedPeriod}
            setCountrySelected={setCountrySelectedPeriod}
            filterSelected={filterSelectedPeriod}
            setFilterSelected={setFilterSelectedPeriod}
            filterRange={filterRangePeriod}
            setFilterRange={setFilterRangePeriod}
          />
          <TablePeriod
            isActive={selectedTab === 'period'}
            records={data.records}
            recordsWorld={data.recordsWorld}
            countries={data.countries}
            dateRange={dateRange}
            countrySelected={countrySelectedPeriod}
            filterSelected={filterSelectedPeriod}
            filterRange={filterRangePeriod}
          />
        </div>
      </div>
    </div>
  )
}
