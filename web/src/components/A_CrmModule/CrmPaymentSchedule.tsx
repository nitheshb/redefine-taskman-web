import { useState, useEffect, useRef } from 'react'

// import CountUp, { useCountUp } from 'react-countup'
import { CountUp } from '@eeacms/countup'

import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from 'src/util/computeCsTotals'
import { Switch } from '@headlessui/react'

const CrmUnitPaymentSchedule = ({ selCustomerPayload, assets, totalIs }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [partATotal, setPartA] = useState(0)
  const [partBTotal, setPartB] = useState(0)
  const [unitTotal, setUnitTotal] = useState(0)
  const [unitReceivedTotal, setReceivedTotal] = useState(0)
  const [PSa, setPSa] = useState([])


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
    setReceivedTotal(selCustomerPayload?.T_review?.toLocaleString('en-IN'))
    const paidAmount = selCustomerPayload?.T_review
    let bal = 0
    let leftOver = paidAmount
    let outStanding = 0;
    let z = selCustomerPayload?.fullPs?.map((d1, inx) => {
      bal = leftOver >= d1?.value  ? d1?.value : leftOver
      leftOver = paidAmount - d1?.value > 0 ?paidAmount - d1?.value : 0

      outStanding = bal - d1?.value
      return { ...d1, amt: bal, leftOver, outStanding }
    })
    setPSa(z)
  }, [selCustomerPayload])

  const triggerPaymentScheudlefun = (item)=> {
    // PSa.map((d1))
    return true
  }

  return (
    <>
      <div className="mt-2">
        <section className="mr-2 flex flex-col  ">
          <div>
            <div className="  from-green-50 to-amber-50 border border-[#b9efcd] rounded-md p-3 pb-4">
              <div className="flex flex-row ">
                <img
                  src="https://static.ambitionbox.com/static/benefits/JobTraining.svg"
                  alt=""
                />
                <h1 className=" text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-1 ml-1">
                  Payment Schedule
                </h1>
              </div>
              <table className="w-full mb- ">
                <thead>
                  {' '}
                  <tr className=" h-6 border-b-[0.2px] border-gray-300 h-[51px]">
                    <th className="w-[40%] text-[10px] px-3 text-left text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Particulars
                    </th>
                    {/* <th className="w-[10%] text-[10px] text-right text-gray-400  text-[#823d00]  tracking-wide uppercase">
                      Payment Timeline
                    </th> */}
                    <th className="w-[15%] text-[10px] text-center text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Eligible
                    </th>
                    <th className="w-[15%] text-[10px]  px-2  text-right text-gray-400 text-[#823d00] tracking-wide uppercase ">
                      Total inc GST
                    </th>
                    <th className="w-[15%] text-[10px]  px-2 text-right text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Amount Received
                    </th>
                    <th className="w-[15%] text-[10px]  px-2 text-right text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                     Balance
                    </th>
                    {/* <th className="w-[15%] text-[10px] text-right text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Status
                    </th> */}
                  </tr>
                </thead>

                <tbody>
                  {PSa?.map((d1, inx) => {
                    totalIs = selCustomerPayload?.T_review

                    //      {[].map((d1, inx) => {
                    // totalIs = 0
                    // selCustomerPayload?.[`${assets[0]}_T_review`] - d1?.value
                    return (
                      <tr
                        key={inx}
                        className={`border-b-[0.05px] border-gray-300 py-3 h-[51px] ${
                          !d1?.elgible ? '' : ''
                        } `}
                      >
                        <th className=" text-[13px] text-left text-blue-500 text-[#0c272e] text-[#363ad9] text-[#272991] bg-[#FFF6F4] tracking-wide pl-3 ">
                          <div>
                            {d1?.stage?.label}
                            <div className="text-[9px] text-left text-[#60679f] tracking-wider ">
                              {' '}
                              {d1?.description}
                            </div>
                          </div>
                        </th>

                        <td className="text-[10px] text-center text-gray-800 font-bold bg-[#fffaee]">
                          <span
                            // className={`text-[10px] px-2 py-[2px] rounded-2xl  ${
                            //   !d1?.elgible ? '' : 'bg-[#98ebc9]  '
                            // } `}
                          >

                            <div className="">
                  {/* <span className="text-[10px] mt-1 mr-1">Yes</span> */}
                  <Switch
                    checked={d1?.elgible }
                    onChange={triggerPaymentScheudlefun(d1)}
                    className={`${
                      d1?.elgible  ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        d1?.elgible  ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
                          </span>
                        </td>
                        <td className="text-[12px] text-right text-gray-800 bg-[#F3FFFA] px-2 font-bold ">
                          ₹{d1?.value?.toLocaleString('en-IN')}
                        </td>

                        <td className="text-[12px] text-right text-gray-800 bg-[#FFF6F4] px-2 font-bold">
                          {/* {totalIs > d1?.value?.toLocaleString('en-IN')
                          ? d1?.value?.toLocaleString('en-IN')
                          : 0} */}
                          {/* ₹{d1?.elgible ? totalIs?.toLocaleString('en-IN') : 0} */}
                          ₹{d1?.amt?.toLocaleString('en-IN')}

                        </td>
                        <td className="text-[12px] text-right text-gray-800 bg-[#FFF6F4] px-2 font-bold">

                          {/* ₹{d1?.leftOver?.toLocaleString('en-IN')} */}
                          ₹{d1?.outStanding?.toLocaleString('en-IN')}

                        </td>

                      </tr>
                    )
                  })}

                  <tr className="border-b-[0.05px] border-gray-300 py-3 h-[51px] ">
                    <td className="text-[10px] text-right text-gray-400 "></td>
                    {/* <td className="text-[10px] text-right text-gray-400 "></td> */}
                    <th className="text-[14px] text-left text-gray-800 ">
                      Total Value:
                    </th>
                    <th className="text-[10px] text-right text-gray-800 bg-[#98ebc9] ">
                      <section className="py-1 d-md font-bold text-[14px] text-[#000000e6] leading-none px-2 ">
                        ₹{unitTotal?.toLocaleString('en-IN')}
                      </section>
                    </th>
                    <th className="text-[10px] text-right text-gray-800 bg-[#FFDAD2] ">
                      <section className="py-1 d-md font-bold text-[14px] text-[#000000e6] leading-none px-2 ">
                        ₹{unitReceivedTotal?.toLocaleString('en-IN')}
                      </section>
                    </th>
                    {/* <th className="text-[10px] text-right text-gray-800 ">
                    <section className="py-1 d-md font-bold text-[14px] text-[#000000e6] leading-none">
                    ₹{unitTotal?.toLocaleString('en-IN')}
                  </section>
                    </th> */}
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
