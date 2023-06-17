import { useState, useEffect, useRef } from 'react'

import { LinearProgress } from '@mui/material'

import { useAuth } from 'src/context/firebase-auth-context'

const CrmPaymentSummary = ({ selCustomerPayload, assets }) => {
  const { user } = useAuth()

  const { orgId } = user

  return (
    <section className="flex flex-col  rounded-md ">
      <>
        <div className="flex flex-col bg-white shadow rounded-md my-1  px-2  py-2 min-w-[180px]">
          <div className="flex flex-row justify-between mx-">
            <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
              ₹{selCustomerPayload?.T_review?.toLocaleString('en-IN')}
            </h6>
            <section className="flex flex-row">
              {/* <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
                {selCustomerPayload?.T_elgible?.toLocaleString('en-IN')}
              </h6> */}
              <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
                ₹{selCustomerPayload?.T_balance?.toLocaleString('en-IN')}
              </h6>
            </section>
          </div>
          <div className="flex flex-row mx-1">
            {[{ item: 'Paid', value: 6 }].map((data, i) => (
              <div
                className=" w-3/4  "
                style={{
                  display: 'inline-block',
                  alignSelf: 'flex-end',
                }}
                key={i}
              >
                <div className="">
                  <LinearProgress
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#A798FF',
                      },
                    }}
                    variant="determinate"
                    value={100}
                    style={{
                      backgroundColor: '#E5EAF2',
                      borderRadius: '3px',
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                      height: `${data.value}px`,
                      width: `100%`,
                    }}
                  />
                </div>
                <div className="flex  justify-left mr-1  mb-1 mt-[4px]">
                  <section className='flex flex-row'>
                  <h6 className="font-bodyLato font-semibold text-xs mt-1">
                    {data.item}

                  </h6>

                  </section>
                </div>
              </div>
            ))}

            {[{ item: 'Due', value: 6 }].map((data, i) => (
              <div
                className=" w-2/4  "
                style={{
                  display: 'inline-block',
                  alignSelf: 'flex-end',
                }}
                key={i}
              >
                <div className="">
                  <LinearProgress
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#E87F7F',
                      },
                    }}
                    variant="determinate"
                    value={100}
                    style={{
                      backgroundColor: '#E87F7F',
                      borderRadius: '3px',
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px',
                      height: `${data.value}px`,
                      width: `100%`,
                    }}
                  />
                </div>
                <div className="flex  justify-end mr-1  mb-1 mt-[4px]">
                  <h6 className="font-bodyLato font-semibold text-xs mt-1">
                    {data.item}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>

      {/* <section className="flex flow-row justify-between mb-1">
        <div className="font-md text-xs text-gray-500  tracking-wide">
          Total Review
        </div>
        <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
          Rs {selCustomerPayload?.T_review?.toLocaleString('en-IN')}
        </div>
      </section>
      <section className="flex flow-row justify-between mb-1">
        <div className="font-md text-xs text-gray-500  tracking-wide">
          Out Standing Balance
        </div>
        <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
          Rs {selCustomerPayload?.T_balance?.toLocaleString('en-IN')}
        </div>
      </section> */}
    </section>
  )
}

export default CrmPaymentSummary
