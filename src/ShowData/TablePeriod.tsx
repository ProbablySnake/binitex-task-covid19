import React, { useEffect, useMemo, useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

import { IRecord, IRecordPeriod, ITablePeriodProps } from '../types';
import { TablePagination } from '../TablePagination/TablePagination';

export default function TablePeriod({ isActive, records, recordsWorld, countries, dateRange, countrySelected, filterSelected, filterRange }: ITablePeriodProps) {

  // const [recordsInPeriod, setRecordsInPeriod] = useState<{ worldR: IRecord[], countriesR: IRecord[] }>({ worldR: [], countriesR: [] })

  const [recordsCalculated, setRecordsCalculated] = useState<IRecordPeriod[]>([])
  const [recordsFiltered, setRecordsFiltered] = useState<IRecordPeriod[]>([]);

  const newCounter = useMemo(() => {
    let counter: { [key: string]: any; } = {};
    countries.forEach(country => {
      counter[country.value] = 0
    });
    return counter;
  }, [])

  useEffect(() => {
    const recordsInPeriod: IRecord[] = [
      ...recordsWorld.filter((record: IRecord) => {
        if (dateRange.start === null || dateRange.end === null) return true
        if (
          dateRange.start.getTime() <= record.date.getTime() && dateRange.end.getTime() >= record.date.getTime() ||
          dateRange.start.getTime() >= record.date.getTime() && dateRange.end.getTime() <= record.date.getTime()
        ) return true
        return false
      }),
      ...records.filter((record: IRecord) => {
        if (dateRange.start === null || dateRange.end === null) return true
        if (
          dateRange.start.getTime() <= record.date.getTime() && dateRange.end.getTime() >= record.date.getTime() ||
          dateRange.start.getTime() >= record.date.getTime() && dateRange.end.getTime() <= record.date.getTime()
        ) return true
        return false
      }),
    ]

    const daysInRange = Math.abs(Math.round((Number(dateRange.end) - Number(dateRange.start)) / (1000 * 3600 * 24))) + 1;
    let totalCasesCounter = { ...newCounter };
    let totalDeathsCounter = { ...newCounter };
    let maxCasesCounter = { ...newCounter };
    let maxDeathsCounter = { ...newCounter };
    let totalCasesThousandCounter = { ...newCounter };
    let totalDeathsThousandCounter = { ...newCounter };
    let maxCasesThousandCounter = { ...newCounter };
    let maxDeathsThousandCounter = { ...newCounter };

    recordsInPeriod.forEach((record: IRecord) => {
      totalCasesCounter[record.country] += record.cases;
      totalDeathsCounter[record.country] += record.deaths;
      maxCasesCounter[record.country] = record.cases > maxCasesCounter[record.country] ? record.cases : maxCasesCounter[record.country];
      maxDeathsCounter[record.country] = record.deaths > maxDeathsCounter[record.country] ? record.deaths : maxDeathsCounter[record.country];
      totalCasesThousandCounter[record.country] = record.casesThousand === 'No pop. data' ? 'No pop. data' : totalCasesThousandCounter[record.country] + record.casesThousand;
      totalDeathsThousandCounter[record.country] = record.deathsThousand === 'No pop. data' ? 'No pop. data' : totalDeathsThousandCounter[record.country] + record.deathsThousand;
      maxCasesThousandCounter[record.country] = record.casesThousand === 'No pop. data' ? 'No pop. data' : maxCasesThousandCounter[record.country] < record.casesThousand ? record.casesThousand : maxCasesThousandCounter[record.country];
      maxDeathsThousandCounter[record.country] = record.deathsThousand === 'No pop. data' ? 'No pop. data' : maxDeathsThousandCounter[record.country] < record.deathsThousand ? record.deathsThousand : maxDeathsThousandCounter[record.country];
    })

    setRecordsCalculated(Object.keys(newCounter).map<IRecordPeriod>((country: string) => ({
      country: country,
      casesTotalPeriod: totalCasesCounter[country],
      deathsTotalPeriod: totalDeathsCounter[country],
      casesAverage: totalCasesCounter[country] / daysInRange,
      deathsAverage: totalDeathsCounter[country] / daysInRange,
      casesMax: maxCasesCounter[country],
      deathsMax: maxDeathsCounter[country],
      casesThousandAverage: totalCasesThousandCounter[country] !== 'No pop. data' ? totalCasesThousandCounter[country] / daysInRange : 'No pop. data',
      deathsThousandAverage: totalDeathsThousandCounter[country] !== 'No pop. data' ? totalDeathsThousandCounter[country] / daysInRange : 'No pop. data',
      casesThousandMax: maxCasesThousandCounter[country],
      deathsThousandMax: maxDeathsThousandCounter[country],
    })))
  }, [dateRange])

  useEffect(() => {
    setRecordsFiltered(
      recordsCalculated
        .filter((record: IRecordPeriod) => {
          if (filterSelected === undefined || filterRange.min === undefined || filterRange.max === undefined) return true
          if (
            filterRange.min <= record[filterSelected] && filterRange.max >= record[filterSelected] ||
            filterRange.min >= record[filterSelected] && filterRange.max <= record[filterSelected]
          ) return true
          return false
        })
    )
  }, [recordsCalculated, countrySelected, filterSelected, filterRange])



  const shortWriting = (info: any) => info.getValue() >= 1000000 ? `${Math.round((info.getValue() / 1000000) * 100) / 100}M` : info.getValue() >= 1000 ? `${Math.round((info.getValue() / 1000) * 100) / 100}K` : info.getValue()

  const columns: ColumnDef<IRecordPeriod>[] = [
    {
      accessorKey: 'country', header: 'Country',
      cell: (info: any) => info.getValue().replaceAll('_', ' '),
    },
    { accessorKey: 'casesTotalPeriod', header: 'Cases total', cell: shortWriting, },
    { accessorKey: 'deathsTotalPeriod', header: 'Deaths total', cell: shortWriting, },
    { accessorKey: 'casesAverage', header: 'Cases average', cell: shortWriting, },
    { accessorKey: 'deathsAverage', header: 'Deaths average', cell: shortWriting, },
    { accessorKey: 'casesMax', header: 'Cases max', cell: shortWriting, },
    { accessorKey: 'deathsMax', header: 'Deaths max', cell: shortWriting, },
    {
      accessorKey: 'casesThousandAverage',
      header: 'Cases ‰ average',
      cell: (info: any) => `${typeof (info.getValue()) === 'number' ? Math.round((info.getValue()) * 1000000) / 1000000 : info.getValue()}`,
    },
    {
      accessorKey: 'deathsThousandAverage',
      header: 'Deaths ‰ average',
      cell: (info: any) => `${typeof (info.getValue()) === 'number' ? Math.round((info.getValue()) * 1000000) / 1000000 : info.getValue()}`,
    },
    {
      accessorKey: 'casesThousandMax',
      header: 'Cases ‰ max',
      cell: (info: any) => `${typeof (info.getValue()) === 'number' ? Math.round((info.getValue()) * 1000000) / 1000000 : info.getValue()}`,
    },
    {
      accessorKey: 'deathsThousandMax',
      header: 'Deaths ‰ max',
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
