import React, { ChangeEvent, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import SelectSearch, { fuzzySearch, SelectSearchOption } from 'react-select-search'
import './SelectSearch.css'
import { IFilterSelectedDay } from '../types';
import { filterFieldsDay } from '../utils';

interface IFiltersSelectDayProps {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string | undefined>>,
  filterSelected: IFilterSelectedDay,
  setFilterSelected: React.Dispatch<React.SetStateAction<IFilterSelectedDay>>,
  filterRange: { min: string | undefined, max: string | undefined },
  setFilterRange: React.Dispatch<React.SetStateAction<{ min: string | undefined, max: string | undefined }>>,
}

function FiltersSelectDay({ isActive, countries, countrySelected, setCountrySelected, filterSelected, setFilterSelected, filterRange, setFilterRange }: IFiltersSelectDayProps) {

  const [valueMin, setValueMin] = useState<string | undefined>('');
  const [valueMax, setValueMax] = useState<string | undefined>('');

  const timerMin = useRef<NodeJS.Timeout | undefined>(undefined);
  function handleFilterMinChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/^(\d+((\.\d+)|\.)?)$/)) //   /^(\d+((\.\d+)|\.)?)$/  =>  number || number with dot || number dot number
      setValueMin(event.target.value);
    if (event.target.value === '')
      setValueMin(undefined);

    clearTimeout(timerMin.current)
    if (event.target.value.match(/^(\d+((\.\d+)|\.)?)$/))
      timerMin.current = setTimeout(() => (setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, min: event.target.value } })), 500)
    if (event.target.value === '')
      timerMin.current = setTimeout(() => (setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, min: undefined } })), 500)
  }

  const timerMax = useRef<NodeJS.Timeout | undefined>(undefined);
  function handleFilterMaxChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/^(\d+((\.\d+)|\.)?)$/)) //   /^(\d+((\.\d+)|\.)?)$/  =>  number || number with dot || number dot number
      setValueMax(event.target.value);
    if (event.target.value === '')
      setValueMax(undefined);

    clearTimeout(timerMin.current)
    if (event.target.value.match(/^(\d+((\.\d+)|\.)?)$/))
      timerMax.current = setTimeout(() => (setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, max: event.target.value } })), 500)
    if (event.target.value === '')
      timerMax.current = setTimeout(() => (setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, max: undefined } })), 500)
  }

  if (!isActive) return <></>

  return (
    <>
      <div className='row mt-2'>
        <div className='col-xl-4 col-lg-5 col-md-6 my-1'>
          <SelectSearch
            options={[{ name: '', value: '' }, ...countries]}
            filterOptions={fuzzySearch}
            value={countrySelected}
            search={true}
            placeholder='Country or region'
            onChange={(v: any) => { setCountrySelected(v.length > 0 ? v : undefined) }}
          />
        </div>
        <div className='col-xl-4 col-lg-5 col-md-6 my-1'>
          <SelectSearch
            options={filterFieldsDay}
            value={filterSelected}
            placeholder='Filtering field'
            onChange={(v: any) => { setFilterSelected(v) }}
          />
        </div>
      </div>
      <div className='row mb-2'>
        <div className='col-md-2 col-sm-3 col-4 my-1'>
          <input className='form-control border-dark' placeholder='Min value' value={valueMin ?? ''} onChange={handleFilterMinChange} />
        </div >
        <div className='col-md-2 col-sm-3 col-4 my-1'>
          <input className='form-control border-dark' placeholder='Max value' value={valueMax ?? ''} onChange={handleFilterMaxChange} />
        </div>
        <div className='col-sm-auto col-4 my-1 d-flex'>
          <Button
            className='d-flex'
            variant='outline-secondary'
            onClick={() => {
              if (countrySelected !== 'World')
                setCountrySelected('World');
              if (filterSelected !== undefined)
              setFilterSelected(undefined);
              if (filterRange.min !== undefined || filterRange.max !== undefined)
              setFilterRange({ min: undefined, max: undefined });
              if (valueMin !== undefined)
                setValueMin(undefined)
              if (valueMax !== undefined)
                setValueMax(undefined)
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  )
}

export default React.memo(FiltersSelectDay);
