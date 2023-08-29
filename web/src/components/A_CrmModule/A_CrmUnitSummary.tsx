import { useState, useEffect, useRef } from 'react'

import { ClockIcon } from '@heroicons/react/outline'
import { PDFExport } from '@progress/kendo-react-pdf'

import { steamUnitActivityLog } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { supabase } from 'src/context/supabase'
import { activeLogNameHelper } from 'src/util/activityLogHelper'
import { timeConv } from 'src/util/dateConverter'

import CrmUnitCostSheetView from './CrmCostSheetView'
import CrmUnitPaymentSchedule from './CrmPaymentSchedule'
import CrmPaymentSummary from './CrmPaymentSummary'
import CrmUnitCustomerDetailsView1 from './CrmUnitCustomerDetailsView1'
import CrmUnitDetailsView1 from './CrmUnitDetailsView1'
import CrmUnitFinanceHistory from './CrmUnitFinanceHistory'
import CrmUnitHeader from './CrmUnitHeader'
import CrmUnitPaymentGraph from './CrmUnitPaymentGraph'

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
    console.log('unit dta is ', selUnitPayload, selUnitPayload?.id)
    boot()
    const subscription = supabase
      .from(`${orgId}_unit_logs`)
      .on('*', (payload) => {
        console.log('account records', payload)
        const updatedData = payload.new
        const { uid } = payload.old
        const eventType = payload.eventType
        console.log('account records', updatedData.Uuid, selUnitPayload?.id)

        if (updatedData.Uuid === selUnitPayload?.id) {
          if (updatedData.Uuid === selUnitPayload?.id) {
            console.log('account records', updatedData.Uuid, selUnitPayload?.id)
            setUnitFetchedActivityData((prevLogs) => {
              const existingLog = prevLogs.find((log) => log.uid === uid)
              console.log(
                'account records',
                prevLogs,
                existingLog,
                uid,
                payload.old,
                uid
              )
              if (existingLog) {
                console.log('Existing record found!')
                if (payload.new.status === 'Done') {
                  const updatedLogs = prevLogs.filter((log) => log.uid != uid)
                  return [...updatedLogs]
                } else {
                  const updatedLogs = prevLogs.map((log) =>
                    log.uid === uid ? payload.new : log
                  )
                  return [...updatedLogs]
                }
              } else {
                console.log('New record added!')
                return [...prevLogs, payload.new]
              }
            })
          } else {
            if (
              updatedData.by_uid === user?.uid ||
              updatedData?.to_uid === user?.uid
            ) {
              setUnitFetchedActivityData((prevLogs) => {
                const existingLog = prevLogs.find((log) => log.uid === uid)

                if (existingLog) {
                  console.log('Existing record found!')
                  if (payload.new.status === 'Done') {
                    const updatedLogs = prevLogs.filter((log) => log.uid != uid)
                    return [...updatedLogs]
                  } else {
                    const updatedLogs = prevLogs.map((log) =>
                      log.id === uid ? payload.new : log
                    )
                    return [...updatedLogs]
                  }
                } else {
                  console.log('New record added!')
                  return [...prevLogs, payload.new]
                }
              })
            }
          }
        }
      })
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  const boot = async () => {
    const unsubscribe = steamUnitActivityLog(orgId, {
      uid: selUnitPayload?.id,
      pId: selUnitPayload?.pId,
    })

    const y = await unsubscribe
    setUnitFetchedActivityData(y)
    await console.log('new setup ', unitFetchedActivityData)
    await console.log('new setup ', y)
  }

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
            {unitFetchedActivityData?.length == 0 && (
                    <div className="py-8 px-8 flex flex-col items-center">
                      <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                        <img
                          className="w-[200px] h-[200px] inline"
                          alt=""
                          src="/templates.svg"
                        />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                        Timeline is Empty
                      </h3>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                        This scenario is very rare to view
                      </time>
                    </div>
                  )}
              <div className="col-span-12 space-y-6 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-700">


                {unitFetchedActivityData?.map((data, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400"
                    >
                         <section>
                        <span className="text-xs text-red-900 ">
                          {data?.type?.toUpperCase()}
                        </span>
                        {"/"}
                        <span className="text-xs text-red-900 ">
                          {data?.subtype?.toUpperCase()} {'  '}
                        </span>
                      </section>
                      <section>
                        <span className="text-xs text-red-900 ">
                          {data?.from?.toUpperCase()} {'  '}
                        </span>
                        {'->'}
                        <span className="text-xs text-red-900 ">
                          {data?.to?.toUpperCase()} {'  '}
                        </span>
                      </section>
                      <span className="inline-flex flex-row items-center text-xs font-normal text-gray-500 ">
                        <ClockIcon className=" w-3 h-3 text-gray-300" />
                        <span className="text-gray-400 ml-1 mr-4">
                          {data?.type == 'ph'
                            ? timeConv(Number(data?.time)).toLocaleString()
                            : timeConv(data?.T).toLocaleString()}
                        </span>
                      </span>
                      <span className="inline-flex flex-row items-center text-xs font-normal text-gray-500 ">
                        <span className="text-green-900 ">by:</span>
                        <span className="text-gray-400 ml-1 mr-4">
                          {data?.by}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PDFExport>
  )
}

export default CrmUnitSummary
