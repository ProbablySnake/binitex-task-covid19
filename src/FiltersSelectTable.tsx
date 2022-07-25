import React, { ChangeEvent } from 'react'
import { Button } from 'react-bootstrap'
import SelectSearch, { fuzzySearch, SelectSearchOption } from 'react-select-search'
import './SelectSearch.css'

interface IFiltersSelectTableProps {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string | undefined>>,
  filterFields: SelectSearchOption[],
  filterSelected: string | undefined,
  setFilterSelected: React.Dispatch<React.SetStateAction<string | undefined>>,
  filterRange: { min: number | undefined, max: number | undefined },
  setFilterRange: React.Dispatch<React.SetStateAction<{ min: number | undefined, max: number | undefined }>>,
}

export default function FiltersSelectTable({ isActive, countries, countrySelected, setCountrySelected, filterFields, filterSelected, setFilterSelected, filterRange, setFilterRange }: IFiltersSelectTableProps) {


  function handleFilterMinChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/^[0-9]+$/))
      setFilterRange((prev: { min: number | undefined, max: number | undefined }) => { return { ...prev, min: Number(event.target.value) } });
  }

  function handleFilterMaxChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/^[0-9]+$/))
      setFilterRange((prev: { min: number | undefined, max: number | undefined }) => { return { ...prev, max: Number(event.target.value) } });
  }

  if (!isActive) return <></>

  return (
    <div className='row my-2'>
      <div className='col-xl-4 col-lg-5 col-md-6 my-1'>
        <SelectSearch
          options={countries}
          filterOptions={fuzzySearch}
          value={countrySelected}
          search={true}
          placeholder='Country or region'
          onChange={(v: any) => { setCountrySelected(v) }}
        />
      </div>
      <div className='col-xl-4 col-lg-5 col-md-6 my-1'>
        <SelectSearch
          options={filterFields}
          value={filterSelected}
          placeholder='Filtering field'
          onChange={(v: any) => { setFilterSelected(v) }}
        />
      </div>
      <div className='col-md-2 col-sm-3 col-4 my-1'>
        <input className='form-control border-dark' placeholder='Min value' value={filterRange.min ?? ''} onChange={handleFilterMinChange} />
      </div >
      <div className='col-md-2 col-sm-3 col-4 my-1'>
        <input className='form-control border-dark' placeholder='Max value' value={filterRange.max ?? ''} onChange={handleFilterMaxChange} />
      </div>
      <div className='col-sm-auto col-4 my-1 ms-auto d-flex justify-content-end'>
        <Button
          className='d-flex'
          variant='outline-dark'
          onClick={() => {
            setCountrySelected(undefined);
            setFilterSelected(undefined);
            setFilterRange({ min: undefined, max: undefined });
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}