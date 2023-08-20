import { useState, useEffect, useRef } from 'react'

// import CountUp, { useCountUp } from 'react-countup'
import { CountUp } from '@eeacms/countup'

import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from 'src/util/computeCsTotals'

const CrmUnitPaymentSchedule = ({ selCustomerPayload, assets, totalIs }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [partATotal, setPartA] = useState(0)
  const [partBTotal, setPartB] = useState(0)
  const [unitTotal, setUnitTotal] = useState(0)

  console.log('payload is ', selCustomerPayload)
  useEffect(() => {
    const a = selCustomerPayload?.plotCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    const b = selCustomerPayload?.addChargesCS?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selCustomerPayload?.super_built_up_area || selCustomerPayload?.area
          )
        ),
      0
    )
    setPartA(a)
    setPartB(b)
    setUnitTotal(a + b)
  }, [selCustomerPayload])

  return (
    <>
      <div className="mt-2">
        <section className="mr-2 flex flex-col  ">
          <div>
            <div className=" bg-[#FFF5E4] bg-gradient-to-r from-green-50 to-amber-50 border border-[#b9efcd] rounded-md p-3 pb-4">
              <div className="flex flex-row">
                <img
                  src="https://static.ambitionbox.com/static/benefits/JobTraining.svg"
                  alt=""
                />
                <h1 className=" text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-1 ml-1">
                  Payment Schedule
                </h1>
              </div>
              <table className="w-full mb-">
                <thead>
                  {' '}
                  <tr className=" h-6 border-b-[0.2px] border-gray-300">
                    <th className="w-[30%] text-[10px] text-left text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Particulars
                    </th>
                    <th className="w-[15%] text-[10px] text-right text-gray-400  text-[#823d00]  tracking-wide uppercase">
                      Payment Timeline
                    </th>
                    <th className="w-[15%] text-[10px] text-center text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Eligible
                    </th>
                    <th className="w-[15%] text-[10px] text-right text-gray-400 text-[#823d00] tracking-wide uppercase ">
                      Total inc GST
                    </th>
                    <th className="w-[15%] text-[10px] text-right text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Amount Received
                    </th>
                    <th className="w-[15%] text-[10px] text-right text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {selCustomerPayload?.fullPs?.map((d1, inx) => {
                    totalIs = selCustomerPayload?.T_review

                    //      {[].map((d1, inx) => {
                    // totalIs = 0
                    // selCustomerPayload?.[`${assets[0]}_T_review`] - d1?.value
                    return (
                      <tr
                        key={inx}
                        className="border-b-[0.05px] border-gray-300"
                      >
                        <th className=" text-[11px] text-left text-gray-700 ">
                          {d1?.stage?.label}
                        </th>
                        <td className="text-[11px] text-right text-gray-900 ">
                          {d1?.description}
                        </td>
                        <td className="text-[10px] text-center text-gray-800 ">
                          {d1?.elgible ? 'Yes' : 'No'}
                        </td>
                        <td className="text-[12px] text-right text-gray-800 ">
                          ₹{d1?.value?.toLocaleString('en-IN')}
                        </td>

                        <td className="text-[10px] text-right text-gray-800 ">
                          {/* {totalIs > d1?.value?.toLocaleString('en-IN')
                          ? d1?.value?.toLocaleString('en-IN')
                          : 0} */}
                          ₹{d1?.elgible ? totalIs?.toLocaleString('en-IN') : 0}
                        </td>
                      </tr>
                    )
                  })}

                  <tr className="border-b-[0.05px] border-gray-300 ">
                    <th className="text-[10px] text-left text-gray-800 ">
                    Total Value Rs.:
                    </th>
                    <td className="text-[10px] text-right text-gray-400 "></td>
                    <td className="text-[10px] text-right text-gray-400 "></td>
                    <th className="text-[10px] text-right text-gray-800 ">
                    <section className="py-1 d-md font-bold text-[14px] text-[#000000e6] leading-none">
                    ₹{unitTotal?.toLocaleString('en-IN')}
                  </section>
                    </th>
                    <th className="text-[10px] text-right text-gray-800 ">
                    <section className="py-1 d-md font-bold text-[14px] text-[#000000e6] leading-none">
                    ₹{unitTotal?.toLocaleString('en-IN')}
                  </section>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          
          </div>
        </section>
      </div>
    </>
  )
}

export default CrmUnitPaymentSchedule
