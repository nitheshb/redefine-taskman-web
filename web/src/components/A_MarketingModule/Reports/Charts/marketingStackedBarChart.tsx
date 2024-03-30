import React, { PureComponent, useEffect, useState } from 'react'

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts'

import { steamLeadsVsSources } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { getLastFourMonths } from 'src/util/getLast6Months'

const data1 = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
]
const CustomBarLabel = ({ x, y, value }) => (
  <text x={x} y={y} fill="#666" textAnchor="right" dy={-6} dx={10}>
    {/* {value} */}
  </text>
)

const StackedBarChart = () => {
  const { user } = useAuth()
  const { orgId } = user
  const demoUrl = 'https://codesandbox.io/s/mixed-bar-chart-q4hgc'
  const [sourceLeads, setSourceLeads] = useState([])
  useEffect(() => {

    getLeadsSourcesDb()
  }, [])

  const getLeadsSourcesDb = async () => {
    const data = await steamLeadsVsSources(
      orgId,
      (doc) => {
        const leadsList = doc.data()
        const leadsListA = []
        console.log('my total fetched list is 3', leadsList)
        Object.entries(leadsList).forEach((entry) => {
          const [key, value] = entry
          leadsListA.push(value)
          console.log('my total fetched list is 3', `${key}: ${value}`)
        })
        setSourceLeads(leadsListA)
      },
      {
        uid: '',
      },
      (error) => setSourceLeads([])
    )
    const timestamp = 1710873000000
    const lastFourMonths = getLastFourMonths(data,timestamp)
    console.log(lastFourMonths)
    setSourceLeads(lastFourMonths)
    console.log('mydata is', data)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={sourceLeads}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="InBooked" stackId="a" fill="#2562EB">
          <LabelList dataKey="InBooked" content={<CustomBarLabel />} />
        </Bar>
        <Bar dataKey="InProgress" stackId="a" fill="#8884d8">
          <LabelList dataKey="InProgress" content={<CustomBarLabel />} />
        </Bar>
        <Bar dataKey="InJunk" stackId="a" fill="#82ca9d">
          <LabelList dataKey="InJunk" content={<CustomBarLabel />} />
        </Bar>
        <Bar dataKey="InNotInterested" stackId="a" fill="#4EDEF1">
          <LabelList dataKey="InNotInterested" content={<CustomBarLabel />} />
        </Bar>
        <Bar dataKey="revisited" stackId="a" fill="#9332EA">
          <LabelList dataKey="revisited" content={<CustomBarLabel />} />
        </Bar>

        <Bar dataKey="counts" fill="#616BF2">
          <LabelList dataKey="counts" content={<CustomBarLabel />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default StackedBarChart
