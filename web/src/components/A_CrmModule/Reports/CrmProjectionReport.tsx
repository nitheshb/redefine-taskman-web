import React, { useState } from 'react';


{/* frist capitalize all letters */}

const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

{/* date */}
const getDateForWeek = (weekNumber) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfWeek = new Date(firstDayOfMonth);
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (weekNumber - 1) * 7);

  const day = String(firstDayOfWeek.getDate()).padStart(2, '0');
  const month = String(firstDayOfWeek.getMonth() + 1).padStart(2, '0');
  const year = firstDayOfWeek.getFullYear();

  return `${day}-${month}-${year}`;

};


{/* dummy data */}

const reportData = [
  {
    id: 1,
    projectName: 'Eco stone',
    soldUnits: 3,
    totalAmount: 1001010,
    monthly: {
      april: 25000,
      may: 25000,
      june: 10925500,
    },
    weekly: {
      week1: 5000,
      week2: 6000,
      week3: 7000,
      week4: 8000,
      week5: 9000,
    },
    oldDue: 150000,
  },
  {
    id: 2,
    projectName: 'green gardens',
    soldUnits: 5,
    totalAmount: 2002020,
    monthly: {
      april: 35000,
      may: 45000,
      june: 11925500,
    },
    weekly: {
      week1: 7000,
      week2: 8000,
      week3: 9000,
      week4: 10000,
      week5: 11000,
    },
    oldDue: 200000,
  },
];

const CrmProjectionReport = () => {
  const [filter, setFilter] = useState('');
  const [dataView, setDataView] = useState('monthly');

  const filteredData = reportData.filter((item) => {
    return (
      (!filter || item.soldUnits === parseInt(filter)) &&
      (dataView === 'monthly' || dataView === 'weekly')
    );
  });

  const handleChangeView = (view) => {
    setDataView(view);
  };

  return (
    <div className='p-4 m-1 bg-white rounded-lg'>
      <div className='flex justify-between'>
        <div>
          <h2 className='mb-4 text-lg font-semibold text-black leading-light'>CRM Projection Report</h2>
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>{/*Text */}</label>
          <select
            id='view'
            className='shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={dataView}
            onChange={(e) => handleChangeView(e.target.value)}
          >
            <option value='monthly'>Monthly</option>
            <option value='weekly'>Weekly</option>
           {/*<option value=''>Anually</option>
            <option value=''>Quarterly</option>
            <option value=''>Halferly</option>*/}
          </select>
        </div>
      </div>
      <table className='min-w-full bg-white border border-black'>
        <thead>
          <tr
            className={
              dataView === 'monthly'
                ? 'bg-orange-200 text-gray-600 text-sm leading-normal border border-black'
                : 'bg-green-200 text-gray-600 text-sm leading-normal border border-black'
            }
          >
            <th className='py-3 px-6 text-center border border-black' colSpan='1'></th>
            <th className='py-3 px-6 text-center border border-black' colSpan='1'></th>
            <th className='py-3 px-6 text-center border border-black' colSpan='1'></th>
            {dataView === 'weekly' && <th className='py-3 px-6 text-center border border-black' colSpan='4'>Weekly</th>}
            {dataView === 'monthly' && <th className='py-3 px-6 text-center border border-black' colSpan='3'>Monthly</th>}
            <th className='py-3 px-6 text-center border border-black' colSpan='1'></th>
          </tr>
          <tr className='bg-blue-200 text-gray-600 text-sm leading-normal'>
            <th className='py-3 px-3 text-left border border-black'>Project Name</th>
            <th className='py-3 px-6 text-left border border-black'>Sold Units</th>
            <th className='py-3 px-6 text-right border border-black'>Total Amount</th>
            {dataView === 'monthly' ? (
              <>
                <th className='py-3 px-6 text-right border border-black'>June</th>
                <th className='py-3 px-6 text-right border border-black'>May</th>
                <th className='py-3 px-6 text-right border border-black'>April</th>
              </>
            ) : (
              <>
                <th className='py-3 px-6 text-right border border-black'>
                  Week 1 <br /> ({getDateForWeek(1)})
                </th>
                <th className='py-3 px-6 text-right border border-black'>
                  Week 2 <br /> ({getDateForWeek(2)})
                </th>
                <th className='py-3 px-6 text-right border border-black'>
                  Week 3 <br /> ({getDateForWeek(3)})
                </th>
                <th className='py-3 px-6 text-right border border-black'>
                  Week 4 <br /> ({getDateForWeek(4)})
                </th>
              </>
            )}
            <th className='py-3 px-6 text-right border border-black'>Old Due</th>
          </tr>
        </thead>
        <tbody className='text-gray-600 text-sm font-light'>
          <tr className='bg-gray-100'>
            <td colSpan={dataView === 'monthly' ? 7 : 6} className='border border-black'></td>
          </tr>
          {filteredData.map((data, index) => {
            let totalAmount = 0;
            if (dataView === 'monthly') {
              totalAmount = data.monthly.june + data.monthly.may + data.monthly.april;
            } else {
              totalAmount = data.weekly.week1 + data.weekly.week2 + data.weekly.week3 + data.weekly.week4;
            }
            const oldDue = data.oldDue * (dataView === 'monthly' ? 0.5 : 0.7);
            return (
              <tr key={index} className='border-b border-gray-200 hover:bg-gray-100'>
                <td className='py-3 px-6 text-left whitespace-nowrap border border-black'>{capitalizeFirstLetter(data.projectName)}</td>
                <td className='py-3 px-6 text-left border border-black'>{data.soldUnits}</td>
                <td className='py-3 px-6  border text-right border-black'>{totalAmount.toLocaleString('en-IN')}</td>
                {dataView === 'monthly' ? (
                  <>
                    <td className='py-3 px-6 text-right border border-black'>{data.monthly.june.toLocaleString('en-IN')}</td>
                    <td className='py-3 px-6 text-right border border-black'>{data.monthly.may.toLocaleString('en-IN')}</td>
                    <td className='py-3 px-6 text-right border border-black'>{data.monthly.april.toLocaleString('en-IN')}</td>
                  </>
                ) : (
                  <>
                    <td className='py-3 px-6 text-right border border-black'>{data.weekly.week1.toLocaleString('en-IN')}</td>
                    <td className='py-3 px-6 text-right border border-black'>{data.weekly.week2.toLocaleString('en-IN')}</td>
                    <td className='py-3 px-6 text-right border border-black'>{data.weekly.week3.toLocaleString('en-IN')}</td>
                    <td className='py-3 px-6 text-right border border-black'>{data.weekly.week4.toLocaleString('en-IN')}</td>
                  </>
                )}
                <td className='py-3 px-6 text-right border border-black'>{oldDue.toLocaleString('en-IN')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CrmProjectionReport;
