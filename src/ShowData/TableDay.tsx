import React, { useEffect, useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

import { IRecord, ITableDayProps } from '../types';
import { TablePagination } from '../TablePagination/TablePagination';

export default function TableDay({ isActive, records, recordsWorld, dateRange, countrySelected, filterSelected, filterRange }: ITableDayProps) {

  const [recordsFiltered, setRecordsFiltered] = useState<IRecord[]>([]);

  useEffect(() => {
    setRecordsFiltered(() => {
      if (countrySelected === 'World') {
        return recordsWorld
          // filtering based on date range
          .filter((record: IRecord) => {
            if (dateRange.start === null || dateRange.end === null) return true
            if (
              dateRange.start.getTime() <= record.date.getTime() && dateRange.end.getTime() >= record.date.getTime() ||
              dateRange.start.getTime() >= record.date.getTime() && dateRange.end.getTime() <= record.date.getTime()  // will work fine with min and max dates flipped
            ) return true
            return false
          })
          .filter((record: IRecord) => {
            if (filterSelected === undefined || filterRange.min === undefined || filterRange.max === undefined) return true
            if (
              filterRange.min <= record[filterSelected] && filterRange.max >= record[filterSelected] ||
              filterRange.min >= record[filterSelected] && filterRange.max <= record[filterSelected]  // will work fine with min and max flipped
            ) return true
            return false
          })
          // making sure records are in hronological order
          .sort((a: IRecord, b: IRecord) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0)
      }

      return records
        // filtering out countries
        .filter((record: IRecord) => {
          if (countrySelected === record.country || countrySelected === undefined) return true
          return false
        })
        // filtering based on date range
        .filter((record: IRecord) => {
          if (dateRange.start === null || dateRange.end === null) return true
          if (
            dateRange.start.getTime() <= record.date.getTime() && dateRange.end.getTime() >= record.date.getTime() ||
            dateRange.start.getTime() >= record.date.getTime() && dateRange.end.getTime() <= record.date.getTime()  // will work fine with min and max dates flipped
          ) return true
          return false
        })
        .filter((record: IRecord) => {
          if (filterSelected === undefined || filterRange.min === undefined || filterRange.max === undefined) return true
          if (
            filterRange.min <= record[filterSelected] && filterRange.max >= record[filterSelected] ||
            filterRange.min >= record[filterSelected] && filterRange.max <= record[filterSelected]  // will work fine with min and max flipped
          ) return true
          return false
        })
        // making sure records are in hronological order
        .sort((a: IRecord, b: IRecord) => a.date.getTime() < b.date.getTime() ? -1 : a.date.getTime() > b.date.getTime() ? 1 : 0)
    })
  }, [countrySelected, dateRange, filterSelected, filterRange])



  const shortWriting = (info: any) => info.getValue() >= 1000000 ? `${Math.round((info.getValue() / 1000000) * 100) / 100}M` : info.getValue() >= 1000 ? `${Math.round((info.getValue() / 1000) * 100) / 100}K` : info.getValue()

  const columns: ColumnDef<IRecord>[] = [
    {
      accessorKey: 'date', header: 'Date',
      cell: (info: any) => `${info.getValue().getFullYear()}/${info.getValue().getMonth() + 1 < 10 ? '0' : ''}${info.getValue().getMonth() + 1}/${info.getValue().getDate() < 10 ? '0' : ''}${info.getValue().getDate()}`,
    },
    {
      accessorKey: 'country', header: 'Country',
      cell: (info: any) => info.getValue().replaceAll('_', ' '),
    },
    { accessorKey: 'cases', header: 'Cases', cell: shortWriting, },
    { accessorKey: 'deaths', header: 'Deaths', cell: shortWriting, },
    { accessorKey: 'casesTotal', header: 'Cases total', cell: shortWriting, },
    { accessorKey: 'deathsTotal', header: 'Deaths total', cell: shortWriting, },
    {
      accessorKey: 'casesThousand', header: 'Cases ‰',
      cell: (info: any) => `${typeof (info.getValue()) === 'number' ? Math.round((info.getValue()) * 1000000) / 1000000 : info.getValue()}`,
    },
    {
      accessorKey: 'deathsThousand', header: 'Deaths ‰',
      cell: (info: any) => `${typeof (info.getValue()) === 'number' ? Math.round((info.getValue()) * 1000000) / 1000000 : info.getValue()}`,
    },
  ];

  const table = useReactTable({
    data: recordsFiltered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

  if (!isActive) return <></>
  if (table.getRowModel().rows.length === 0) return <div className='flex-fill align-self-center text-center'><strong>Nothing found</strong></div>

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table className='table text-nowrap'>
          <thead>
            <tr>
              {table.getFlatHeaders().map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'text-center cursor-pointer select-none'
                            : 'text-center',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ˄',
                          desc: ' ˅',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id} >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} className='text-center'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} />
    </div >
  )
}
