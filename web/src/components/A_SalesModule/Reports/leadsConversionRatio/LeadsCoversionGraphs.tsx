import React from 'react'

import Bargraph from './Bargraph'
import LineGraph from './LineGraph'
import PieChartComp from './PieChart'

const LeadsCoversionGraphs = () => {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'white',
        width: '90vw',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: '25%' }}>
          <div
            style={{ height: '12.5rem', border: '1px solid red' }}
            className="bg-[#397D8A] p-6"
          >
            <span className='text-white text-lg '>Lead Conversion Ratio</span>
            <div className="text-white text-[44px] my-5">17:1</div>
            <div className="text-white text-sm">Bookings vs Qualified</div>

          </div>
          <div
            style={{
              height: '25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              margin: '0.5rem',
            }}
          >
            <div
              style={{
                height: '4rem',
                border: '1px solid red',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                fontSize: '1.3rem',
                width: '100%',
              }}
            >
              <div style={{ border: '1px solid red' }}>Leads</div>
              <div style={{ border: '1px solid red' }}>2,130</div>
            </div>
            <div
              style={{
                height: '4rem',
                border: '1px solid red',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                fontSize: '1.3rem',
                width: '100%',
              }}
            >
              <div style={{ border: '1px solid red' }}>Opportunities</div>
              <div style={{ border: '1px solid red' }}>643</div>
            </div>
            <div
              style={{
                height: '4rem',
                border: '1px solid red',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                fontSize: '1.3rem',
                width: '100%',
              }}
            >
              <div style={{ border: '1px solid red' }}>Negotiation</div>
              <div style={{ border: '1px solid red' }}>501</div>
            </div>
            <div
              style={{
                height: '4rem',
                border: '1px solid red',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                fontSize: '1.3rem',
                width: '100%',
              }}
            >
              <div style={{ border: '1px solid red' }}>Bookings</div>
              <div style={{ border: '1px solid red' }}>295</div>
            </div>
            <div
              style={{
                height: '4rem',
                border: '1px solid red',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                fontSize: '1.3rem',
                width: '100%',
              }}
            >
              <div style={{ border: '1px solid red' }}>Junk</div>
              <div style={{ border: '1px solid red' }}>194</div>
            </div>
          </div>
        </div>
        <div style={{ border: '1px solid red', width: '75%' }}>
          <div style={{ border: '1px solid red', display: 'flex' }}>
            <Bargraph />
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '25%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  border: '1px solid red',
                  width: '100%',
                  height: '12rem',
                  position: 'relative',
                }}
              >
                <PieChartComp />
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
                  30%
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '80%',
                    left: '4.5%',
                    border: '1px solid red',
                    padding: '0 0.5rem',
                    fontSize: '0.9rem',
                    color: '#4fa183',
                  }}
                >
                  Lead-to-Opportunity Ratio
                </div>
              </div>
              <div
                style={{
                  border: '1px solid red',
                  width: '100%',
                  height: '12rem',
                  position: 'relative',
                }}
              >
                <PieChartComp />
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
                  30%
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '80%',
                    left: '5.5%',
                    border: '1px solid red',
                    padding: '0 0.5rem',
                    fontSize: '0.9rem',
                    color: '#4fa183',
                  }}
                >
                  Oppurtunity-to-Win Ratio
                </div>
              </div>
              {/* <div
                style={{
                  border: '1px solid red',
                  width: '100%',
                  height: '10rem',
                }}
              ></div> */}
            </div>
            <div
              style={{
                border: '1px solid red',
                width: '75%',

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  border: '1px solid blue',
                  height: '7rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ border: '1px solid red', height: '30%' }}></div>
                <div style={{ border: '1px solid red' }}>
                  <LineGraph />
                </div>
              </div>
              <div
                style={{
                  border: '1px solid red',
                  height: '7rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ border: '1px solid red', height: '30%' }}></div>
                <div style={{ border: '1px solid red' }}>
                  <LineGraph />
                </div>
              </div>
              <div
                style={{
                  border: '1px solid blue',
                  height: '7rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ border: '1px solid red', height: '30%' }}></div>
                <div style={{ border: '1px solid red' }}>
                  <LineGraph />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadsCoversionGraphs
