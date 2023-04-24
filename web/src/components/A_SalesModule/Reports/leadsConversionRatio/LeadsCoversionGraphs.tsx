/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'

import Bargraph from './Bargraph'
import LineGraph from './LineGraph'
import PieChartComp from './PieChart'

const LeadsCoversionGraphs = ({ sourceRawFilData, showDrillDownFun }) => {
  const [show, setShow] = useState(false)

  const [pieVals, setPieVals] = useState({
    val1: 0,
    val2: 0,
    val3: 0,
  })

  useEffect(() => {
    console.log('otttt')
    if (sourceRawFilData && sourceRawFilData.length > 0) {
      console.log('innn')
      const val1 = Math.round(
        (sourceRawFilData.filter((datObj) =>
          [
            'followup',
            'visitfixed',
            'visitdone',
            'booked',
            'negotiation',
          ].includes(datObj?.Status)
        ).length /
          sourceRawFilData.length) *
          100
      )
      const val2 = 100 - val1
      setPieVals({ val1, val2, val3: 50 })
    }
  }, [sourceRawFilData])

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 500)
    return () => {
      setShow(false)
    }
  }, [])

  console.log(pieVals, 'dhvaejfv')

  console.log(show)
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'white',
      }}
    >
      {show && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '15rem' }}>
            <div style={{ height: '12.5rem' }} className="bg-[#397D8A] p-6">
              <span className="text-white text-lg ">Lead Conversion Ratio</span>
              <div className="text-white text-[44px] my-5">
                {`${
                  sourceRawFilData.filter((datObj) =>
                    [
                      'followup',
                      'visitfixed',
                      'visitdone',
                      'booked',
                      'negotiation',
                    ].includes(datObj?.Status)
                  ).length
                }`}
                :{' '}
                {`${
                  sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'booked'
                  ).length
                }`}
              </div>
              <div className="text-white text-sm">Qualified vs Bookings </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              {[
                {
                  stausTitle: 'Leads',
                  data: sourceRawFilData,
                  count: `${sourceRawFilData?.length}`,
                },
                {
                  stausTitle: 'InProgress',
                  data: sourceRawFilData.filter((datObj) =>
                    [
                      'new',
                      'unassigned',
                      'followup',
                      'visitfixed',
                      'visitdone',
                      'negotiation',
                    ].includes(datObj?.Status)
                  ),
                },
                {
                  stausTitle: 'Booked',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'booked'
                  ),
                },
                {
                  stausTitle: 'Not Interested',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'notinterested'
                  ),
                },
                {
                  stausTitle: 'Dead',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'dead'
                  ),
                },

                {
                  stausTitle: 'Junk',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'junk'
                  ),
                },

                // { stausTitle: 'Site Vists', count: '295' },
                // { stausTitle: 'Negotiation', count: '501' },
                // { stausTitle: 'Bookings', count: '295' },
                // { stausTitle: 'Junk', count: '194' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#3C7E7D] my-[0.5px] cursor-pointer"
                  style={{
                    height: '4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    fontSize: '1.3rem',
                    width: '100%',
                  }}
                  onClick={() =>
                    showDrillDownFun(`Total ${item?.stausTitle}`, item?.data)
                  }
                >
                  <div className="text-white">{item?.stausTitle}</div>
                  <div className="text-white">{item?.data?.length}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '50rem' }}>
            <div
              style={{
                backgroundColor: 'white',
                marginLeft: '0.7rem',
                width: 'fit-content',
              }}
            >
              <Bargraph />
            </div>
            <div
              style={{
                padding: '1.5rem',
                width: '52rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '14rem',
                    height: '12rem',
                    position: 'relative',
                    backgroundColor: 'white',
                  }}
                >
                  <PieChartComp pieVal={pieVals.val1} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '39%',
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#4fa183',
                    }}
                  >
                    {pieVals.val1}%
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '80%',
                      left: '4.5%',
                      padding: '0 0.5rem',
                      fontSize: '0.9rem',
                      color: '#4fa183',
                    }}
                    className="bg-[#4DA283]"
                  >
                    <span className="text-white">New Lead-to-Opportunity</span>
                  </div>
                </div>
                <div
                  style={{
                    width: '14rem',
                    height: '12rem',
                    position: 'relative',
                    backgroundColor: 'white',
                  }}
                >
                  <PieChartComp pieVal={pieVals.val2} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '39%',
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#4fa183',
                    }}
                  >
                    {pieVals.val2}%
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '80%',
                      left: '18.5%',
                      padding: '0 0.5rem',
                      fontSize: '0.9rem',
                      color: '#4fa183',
                    }}
                    className="bg-[#4DA283]"
                  >
                    <span className="text-white">New Lead-to-Junk</span>
                  </div>
                </div>
                <div
                  style={{
                    width: '14rem',
                    height: '12rem',
                    position: 'relative',
                  }}
                >
                  <PieChartComp pieVal={pieVals.val3} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '39%',
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#4fa183',
                    }}
                  >
                    {pieVals.val3}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '80%',
                      left: '9%',
                      padding: '0 0.5rem',
                      fontSize: '0.9rem',
                      color: '#4fa183',
                    }}
                    className="bg-[#4DA283]"
                  >
                    <span className="text-white">Oppurtunity-to-Booking</span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: '50rem',

                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      padding: '0.5rem',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: 'black',
                          fontWeight: '600',
                        }}
                      >
                        Daniel
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'grey',
                        }}
                      >
                        SALES MANAGER
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: 'black',
                          textAlign: 'center',
                          fontWeight: '600',
                        }}
                      >
                        3 %
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'grey',
                        }}
                      >
                        CONVERSION RATE
                      </div>
                    </div>
                  </div>
                  <div>
                    <LineGraph />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      padding: '0.5rem',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: 'black',
                          fontWeight: '600',
                        }}
                      >
                        Daniel
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'grey',
                        }}
                      >
                        SALES MANAGER
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: 'black',
                          textAlign: 'center',
                          fontWeight: '600',
                        }}
                      >
                        3 %
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'grey',
                        }}
                      >
                        CONVERSION RATE
                      </div>
                    </div>
                  </div>
                  <div>
                    <LineGraph />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      padding: '0.5rem',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: 'black',
                          fontWeight: '600',
                        }}
                      >
                        Daniel
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'grey',
                        }}
                      >
                        SALES MANAGER
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: 'black',
                          textAlign: 'center',
                          fontWeight: '600',
                        }}
                      >
                        3 %
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'grey',
                        }}
                      >
                        CONVERSION RATE
                      </div>
                    </div>
                  </div>
                  <div>
                    <LineGraph />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsCoversionGraphs
