/* eslint-disable react/jsx-key */
// src/App.js
import React from 'react'

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

const data = [{
  id: "728ed52f",
  amount: 100,
  status: "pending",
  email: "m@example.com",
},]

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  // Add more columns as needed
]

function AdvancedDataTableTest() {
  return (
    <div className="App">
      <h1>Advanced React Table Example</h1>
      <AdvancedDataTable columns={columns} data={data} />
    </div>
  )
}

export default AdvancedDataTableTest

// src/AdvancedDataTable.js


export function AdvancedDataTable({ columns, data }) {


  return (
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}


