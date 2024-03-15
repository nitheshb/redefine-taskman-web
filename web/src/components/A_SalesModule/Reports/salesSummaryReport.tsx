import React from 'react'

import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import '../../../styles/myStyles.css'
import StackedLeadsChart from './charts/salesStackedChart'

const rows = [
  {
    id: 1,
    date: '2024-03-11',
    status: 'New',
    name: 'John 1',
    mobile: '1234567890',
    email: 'john@example.com',
    project: 'Project A',
    source: 'Referral',
  },
  {
    id: 2,
    date: '2024-03-10',
    status: 'Contacted',
    name: 'Jane Smith',
    mobile: '9876543210',
    email: 'jane@example.com',
    project: 'Project B',
    source: 'Website',
  },
  {
    id: 3,
    date: '2024-03-09',
    status: 'Pending',
    name: 'Alice Johnson',
    mobile: '5556667777',
    email: 'alice@example.com',
    project: 'Project C',
    source: 'Advertisement',
  },
  {
    id: 4,
    date: '2024-03-08',
    status: 'Closed',
    name: 'Bob Brown',
    mobile: '9998887777',
    email: 'bob@example.com',
    project: 'Project D',
    source: 'Social Media',
  },
  {
    id: 5,
    date: '2024-03-07',
    status: 'New',
    name: 'Eva White',
    mobile: '4443332222',
    email: 'eva@example.com',
    project: 'Project E',
    source: 'Referral',
  },
]

const data1 = ['Inprogress']
const data2 = ['Not Interested']
const data3 = ['Site Visits ']
const data4 = ['Followup']
const data5 = ['Booking']
const data6 = ['Highest volume(24h)']

const totalProfit = '98,6543.53'
const profitPercentage = '24.21%'
const performanceText = 'You have a great Performance'
const avgGrowingData = [
  {
    percentage: '2.34%',
    text: 'Booked',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#cfe5eb',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm1 5.75A.75.75 0 0 1 5.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    percentage: '3.45%',
    text: 'Site Visit',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e2d9f7',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M12 1.69a.494.494 0 0 0-.438-.494 32.352 32.352 0 0 0-7.124 0A.494.494 0 0 0 4 1.689v.567c-.811.104-1.612.24-2.403.406a.75.75 0 0 0-.595.714 4.5 4.5 0 0 0 4.35 4.622A3.99 3.99 0 0 0 7 8.874V10H6a1 1 0 0 0-1 1v2h-.667C3.597 13 3 13.597 3 14.333c0 .368.298.667.667.667h8.666a.667.667 0 0 0 .667-.667c0-.736-.597-1.333-1.333-1.333H11v-2a1 1 0 0 0-1-1H9V8.874a3.99 3.99 0 0 0 1.649-.876 4.5 4.5 0 0 0 4.35-4.622.75.75 0 0 0-.596-.714A30.897 30.897 0 0 0 12 2.256v-.567ZM4 3.768c-.49.066-.976.145-1.458.235a3.004 3.004 0 0 0 1.64 2.192A3.999 3.999 0 0 1 4 5V3.769Zm8 0c.49.066.976.145 1.458.235a3.004 3.004 0 0 1-1.64 2.192C11.936 5.818 12 5.416 12 5V3.769Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    percentage: '1.98%',
    text: 'LeadSources',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e2d9f7',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"
        />
        <path
          fillRule="evenodd"
          d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"
        />
      </svg>
    ),
  },
  {
    percentage: '2.87%',
    text: 'Cost per lead',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ffe0bb',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z"
        />
      </svg>
    ),
  },
]

const SalesSummaryReport = () => {
  return (
    <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  px-4">
      <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  px-4">
        <div className="m-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row flex-wrap">
              <div className="bg-[#fff] rounded-lg shadow-xl  ">
                {/* Block 1 */}
                <div className="flex flex-col h-full">
                  <div className="card-block1 flex justify-between mb-8">
                    <div className="flex-1 mr-4  p-4">
                      <div>
                        <section className="text-black  font-weight-[600] mt-1 mb-2">
                          Total Leads
                        </section>

                        <span>12 January 2023 - 12 January 2024</span>
                      </div>
                      <div className="inline-flex mt-8">
                        <p className="text-3xl font-bold">₹{totalProfit}</p>
                        <span className="p-3 pl-4 font-medium">
                          {profitPercentage}
                        </span>
                      </div>
                      <p className="p-0 cursor-pointer">
                        <span className="border p-1 border-gray-300 text-black m-1 rounded-tl-2xl rounded-br-2xl rounded-tr-2xl font-medium text-sm">
                          {performanceText}
                        </span>
                      </p>
                    </div>
                    <div className="flex-1 bg-green-200 rounded-lg p-4">
                      <p>Graph</p>
                    </div>
                  </div>

                  {/*  card-block2 */}
                  <div className=" flex flex-wrap">
                    {avgGrowingData.map((data, index) => (
                      <div
                        key={index}
                        className={`flex-1 p-4 ${
                          index !== avgGrowingData.length - 1
                            ? 'border-r border-gray-300'
                            : ''
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {data.icon}
                          <p className="ml-2">{data.text}</p>
                        </div>
                        <p className="font-bold text-xl">{data.percentage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* section 2 */}
              <div className="bg-[#fff]  rounded-lg shadow-xl min-h-[340px] min-w-[200px] ml-2">
                {/* Block 2 */}
                <div className="w-full flex">
                  <div className="bg-[#fff] rounded-lg  min-h-[175px] min-w-[100px] row-span-1">
                    {/* Block Blue 1 */}
                    <p
                      className="crnsr-text pl-2 py-2"
                      style={{ fontWeight: '600', fontSize: '1.1rem' }}
                    >
                      Leads
                    </p>
                    <div className="flex flex-row gap-3 p-4 pt-2">
                      {/* inner block1 */}
                      <div className="bg-[#ffe0bb] rounded-lg shadow-xl min-h-[150px] min-w-[100px]">
                        {data1.map((item, index) => (
                          <div
                            key={index}
                            className="relative flex flex-col justify-between h-full"
                          >
                            <div className="flex justify-between p-2">
                              <p className="text-black">Leads</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4 absolute right-2 top-2"
                                style={{
                                  backgroundColor: 'white',
                                  borderRadius: '50%',
                                }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="flex justify-start p-2">
                              <p>$16,987 6</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Row 2 */}
                      <div className="grid grid-cols-1 gap-x-2 gap-y-2 grid-rows-1 grid-flow-row-dense">
                        <div className="bg-[#ffe0bb] rounded-lg shadow-xl min-h-[150px] min-w-[100px]">
                          {data1.map((item, index) => (
                            <div
                              key={index}
                              className="relative flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$16,987 6</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#cfe5eb] rounded-lg shadow-xl min-h-[130px] min-w-[100px]">
                          {data2.map((item, index) => (
                            <div
                              key={index}
                              className=" flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 mt-1 ml-2 right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$6,000</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* inner block2 */}
                      <div className="grid gap-x-2 gap-y-2">
                        <div className="bg-[#e2d9f7] rounded-lg shadow-xl min-h-[80px] min-w-[100px]">
                          {data3.map((item, index) => (
                            <div
                              key={index}
                              className="relative flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$11,000</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-[#d2f2fa] rounded-lg shadow-xl min-h-[80px] min-w-[100px]">
                          {data4.map((item, index) => (
                            <div
                              key={index}
                              className=" flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$3,765</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-[#f7f6b9] rounded-lg shadow-xl min-h-[80px] min-w-[100px]">
                          {data5.map((item, index) => (
                            <div
                              key={index}
                              className="relative flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$2,567</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* section - 2 */}
            <section className="w-full border-[#e7e5eb] bg-white rounded-lg p-4">
              <div className="flex flex-col"></div>
              <section className="flex flex-row justify-between">
                 <article className='flex flex-col'>
                  <div className="text-[#1f2937]">Revenue</div>
                  <div className="text-[#1f2937] font-[700] text-2xl mt-2">₹62,820.59</div>
                  <div className="text-[#EF4444] text-xs mt-1">0.2% less than the previous 30 days</div>
                  </article>
                 <article>date</article>
              </section>

              <div className="w-full h-[400px] mt-4">
              <section className="flex flex-row justify-between">
              <article></article>
                 <article className='flex flex-row mr-2 mb-3'>
                  <section className="flex flex-row">
                  <div className="text-[#1f2937] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#9333ea]"></div>
                  <div className="text-[#4b5563] text-xs"> This month</div>
                  </section>
                  <section className="flex flex-row">
                  <div className="text-[#2563eb] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#2563eb]"></div>
                  <div className="text-[#4b5563] text-xs" > Last month</div>
                  </section>
                  </article>
              </section>
                <StackedLeadsChart />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesSummaryReport
