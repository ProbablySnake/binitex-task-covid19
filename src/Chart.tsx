import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { IRecord } from './App/App'

interface ICharProps {
  isActive: boolean,
  records: IRecord[],
  recordsWorld: IRecord[],
  dateRange: { start: Date | null, end: Date | null },
  countrySelected: string,
  infoSelected: 'day' | 'total'
}

export default function Chart({ isActive, records, recordsWorld, dateRange, countrySelected, infoSelected }: ICharProps) {

  const [recordsFiltered, setRecordsFiltered] = useState<IRecord[] | undefined>(undefined);

  useEffect(() => {
    setRecordsFiltered(() => {
      if (countrySelected === 'World') {
        return recordsWorld.filter((record: IRecord) => {
          if (dateRange.start === null || dateRange.end === null) return true
          if (dateRange.start.getTime() <= record.date.getTime() && dateRange.end.getTime() >= record.date.getTime()) return true
          return false
        }).sort((a: IRecord, b: IRecord) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0)
      }
      return records.filter((record: IRecord) => {
        if (countrySelected === record.country && (!dateRange.start || !dateRange.end)) return true
        if (dateRange.start && dateRange.end) if (countrySelected === record.country && (dateRange.start.getTime() <= record.date.getTime() && dateRange.end.getTime() >= record.date.getTime())) return true
        return false
      }).sort((a: IRecord, b: IRecord) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0)
    })
  }, [countrySelected, dateRange])

  if (!isActive) return <></>

  return (
    <>
      <div style={{ height: '10%' }} />
      <div style={{ height: '90%', overflow: 'hidden' }} >
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={recordsFiltered}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="2">
                <stop offset="5%" stopColor="#f4e066" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f4e066" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="2">
                <stop offset="5%" stopColor="#d84951" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#d84951" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              interval={1000}
              tickFormatter={() => ''}
            />
            <YAxis
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              labelFormatter={(date: Date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()}`}
              animationDuration={200}
            />
            <Area type="monotone" dataKey={infoSelected === 'day' ? 'cases' : 'casesTotal'} stroke="#CFBF09" fillOpacity={1} fill="url(#colorUv)" />
            <Area type="monotone" dataKey={infoSelected === 'day' ? 'deaths' : 'deathsTotal'} stroke="#d84951" fillOpacity={1} fill="url(#colorPv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}