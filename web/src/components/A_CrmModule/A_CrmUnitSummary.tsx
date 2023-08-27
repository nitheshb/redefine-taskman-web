import { useState, useEffect, useRef } from 'react'

import { PDFExport } from '@progress/kendo-react-pdf'

import { useAuth } from 'src/context/firebase-auth-context'

import CrmUnitCostSheetView from './CrmCostSheetView'
import CrmUnitPaymentSchedule from './CrmPaymentSchedule'
import CrmPaymentSummary from './CrmPaymentSummary'
import CrmUnitCustomerDetailsView1 from './CrmUnitCustomerDetailsView1'
import CrmUnitDetailsView1 from './CrmUnitDetailsView1'
import CrmUnitFinanceHistory from './CrmUnitFinanceHistory'
import CrmUnitHeader from './CrmUnitHeader'
import CrmUnitPaymentGraph from './CrmUnitPaymentGraph'
import { steamUnitActivityLog } from 'src/context/dbQueryFirebase'

const CrmUnitSummary = ({
  selCustomerPayload: selUnitPayload,
  assets,
  totalIs,
  unitTransactionsA,
}) => {
  const { user } = useAuth()
  const pdfUnitSummaryComp = useRef(null)
  const { orgId } = user
  const [unitFetchedActivityData, setUnitFetchedActivityData] = useState([])

  useEffect(() => {
    console.log('unit dta is ', selUnitPayload)
    const unsubscribe = steamUnitActivityLog(
      orgId,
      (doc) => {
        const usersList = doc.data()
        const usersListA = []

        Object.entries(usersList).forEach((entry) => {
          const [key, value] = entry
          usersListA.push(value)
        })
        setUnitFetchedActivityData(usersListA)
      },
      {
        uid: selUnitPayload?.id,
        pId: selUnitPayload?.pId
      },
      (error) => setUnitFetchedActivityData([])
    )
  }, [])

  return (
    <PDFExport paperSize="A4" margin="1cm" ref={pdfUnitSummaryComp}>
      <div className="py-1 px-1 m-2 mt-[1px] rounded-lg border border-gray-100 h-[100%] overflow-y-scroll overflow-auto no-scrollbar">
        {/* customer details */}
        {/* Unit details */}
        {/* payment schedule */}
        {/* Finance History */}
        {/* Payment Summay */}
        {/* Unit Position Summary */}
        <div className="flex flex-row">
          <div className="w-full">
            {/* customer details */}
            <div className="flex flex-row justify-between text-end items-end mr-2">
              <div className="flex flex-row">
                <div>
                  <CrmUnitPaymentGraph
                    selCustomerPayload={selUnitPayload}
                    assets={assets}
                  />
                </div>
                <div className="ml-1">
                  <CrmPaymentSummary
                    selCustomerPayload={selUnitPayload}
                    assets={assets}
                  />
                </div>
              </div>
              <div
                className=" flex flex-row justify-end items-center align-middle text-blue-500 text-xs cursor-pointer hover:underline"
                onClickCapture={() => {
                  pdfUnitSummaryComp.current.save()
                }}
              >
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 pr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  <span className="text-[11px]">CUSTOMER SUMMARY</span>
                </>
              </div>
            </div>

            {/* <CrmUnitHeader projectDetails={selUnitPayload} /> */}

            {/* 1 } customer details */}
            {/* Unit details */}

            {/* <CrmUnitCustomerDetailsView1
          Name={selUnitPayload?.customerName1}
          Mobile={selUnitPayload?.phoneNo1}
          netTotal={12345}
          selCustomerPayload={selUnitPayload}
          assets={assets}
        /> */}
            {/* Payment Summay */}

            {/* Unit Position Summary */}
            {/* payment schedule */}
            <div>
              <CrmUnitCostSheetView
                selCustomerPayload={selUnitPayload}
                assets={assets}
                totalIs={totalIs}
              />
            </div>
          </div>
          <div className="rounded w-[500px] ml-2 bg-[#fff] mt-1 px-4 py-3">
            <span className="text-[20px] text-[#10153e] font-bold">
              Activity
            </span>
            <div className="relative col-span-12 px-4 space-y-2 sm:col-span-9 mt-3">
              <div className="col-span-12 space-y-6 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-700">

{unitFetchedActivityData?.map((d, i)=>{
   return <div key = {i} className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400">
    <p className="text-[#10153e] text-[14px]">
      Pellentesque feugiat ante at nisl efficitur,
    </p>
    <time className="text-xs tracki uppercase dark:text-gray-400">
      Dec 2020
    </time>
  </div>
})}
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400">
                  <p className="text-[#10153e] text-[14px]">
                    Pellentesque feugiat ante at nisl efficitur,
                  </p>
                  <time className="text-xs tracki uppercase dark:text-gray-400">
                    Dec 2020
                  </time>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400">
                  <p className="text-[#10153e] text-[14px]">
                    Morbi vulputate aliquam libero non dictum.
                  </p>
                  <time className="text-xs tracki uppercase dark:text-gray-400">
                    Jul 2019
                  </time>
                </div>
                <div className="flex flex-col mt-1 sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400">
                  <p className="text-[#10153e] text-[14px]">Unit Booked On</p>
                  <time className="text-xs tracki uppercase dark:text-gray-400">
                    Jan 2016
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PDFExport>
  )
}

export default CrmUnitSummary
