import React, { useState } from 'react';
import { Table } from '@tanstack/react-table';

import './TablePagination.css'

export function TablePagination({ table }: { table: Table<any>; }) {

  const [inputPage, setInputPage] = useState<number | ''>(1);

  return (
    <>
      <div style={{ overflowY: 'auto' }}>
        <nav className='my-2'>
          <div className='btn-group user-select-none button-min-width'>

            <button
              className={`btn btn-outline-secondary ${table.getCanPreviousPage() ? '' : 'disabled '}`}
              onClick={(e) => { e.currentTarget.blur(); table.setPageIndex(0) }}
            >&laquo;</button>

            <button
              className={`btn btn-outline-secondary ${table.getCanPreviousPage() ? '' : 'disabled '}`}
              onClick={(e) => { e.currentTarget.blur(); table.previousPage() }}
            >&lsaquo;</button>


            {table.getState().pagination.pageIndex <= 0 ? <button className='btn btn-outline-secondary disabled'></button> : <></>}


            {table.getState().pagination.pageIndex > 0 ?
              <button
                className='btn btn-outline-secondary'
                onClick={(e) => { e.currentTarget.blur(); table.setPageIndex(table.getState().pagination.pageIndex - 1) }}
              >{table.getState().pagination.pageIndex}</button>
              : <></>
            }

            <button className='btn btn-outline-secondary active'>{table.getState().pagination.pageIndex + 1}</button>

            {table.getState().pagination.pageIndex < table.getPageCount() - 1 ?
              <button
                className='btn btn-outline-secondary'
                onClick={(e) => { e.currentTarget.blur(); table.setPageIndex(table.getState().pagination.pageIndex + 1) }}
              >{table.getState().pagination.pageIndex + 2}</button>
              : <></>
            }

            {table.getState().pagination.pageIndex >= table.getPageCount() - 1 ? <button className='btn btn-outline-secondary disabled'></button> : <></>}

            <button
              className={`btn btn-outline-secondary ${table.getCanNextPage() ? '' : 'disabled '}`}
              onClick={(e) => { e.currentTarget.blur(); table.nextPage() }}
            >&rsaquo;</button>

            <button
              className={`btn btn-outline-secondary ${table.getCanNextPage() ? '' : 'disabled '}`}
              onClick={(e) => { e.currentTarget.blur(); table.setPageIndex(table.getPageCount() - 1) }}
            >&raquo;</button>
          </div>
        </nav>
      </div>
      <div className='row my-2'>
        <div className='text-nowrap align-self-center' style={{ width: 'auto' }}><b>Go to page:</b></div>
        <input
          value={inputPage}
          onChange={e => {
            if (e.target.value.match(/^[0-9]+$/) && Number(e.target.value) <= table.getPageCount()) {
              setInputPage(Number(e.target.value))
              table.setPageIndex(Number(e.target.value) - 1)
            }
            if (e.target.value.match(/^[0-9]+$/) && Number(e.target.value) > table.getPageCount()) {
              setInputPage(table.getPageCount())
              table.setPageIndex(table.getPageCount() - 1)
            }
            if (e.target.value === '') setInputPage('')
          }}
          className='border-dark form-control'
          style={{ width: '4rem' }}
        />
        <div className='ms-sm-auto' style={{ width: 'auto' }}>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className='form-select border-dark '
          >
            {[5, 10, 15, 20, 25].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
