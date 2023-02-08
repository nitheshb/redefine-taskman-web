// import { useState } from 'react'
// import PhaseDetailsCard from '../PhaseDetailsCard/PhaseDetailsCard'

import { PencilIcon, EyeIcon } from '@heroicons/react/outline'
import { UilUsdSquare, UilMoneyWithdrawal } from '@iconscout/react-unicons'
import { Box, LinearProgress, useTheme } from '@mui/material'
import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

import { Link, routes } from '@redwoodjs/router'

import Card2 from '../A_ProjModule/Comps/Card2'
import ProjectProgressDisplayCard from '../A_ProjModule/Comps/ProjectProgressDisplayCard'
import CircleProgress from '../Charts_Graphs/CircleProgress'
import PieChartProject from '../comps/pieChartProject'
import ProjectStatsCard from '../ProjectStatsCard/ProjectStatsCard'

const ProjectsMHomeBody = ({ project, onSliderOpen = () => {}, isEdit }) => {
  const {
    totalEstValue,
    totalPlotArea,
    totalValue,
    soldValue,
    availValue,
    bookValue,
    blockValue,
    holdValue,
    totalArea,
    soldArea,
    availArea,
    bookArea,
    blockArea,
    holdArea,
    totalUnitCount,
    soldUnitCount,
    availableCount,
    bookUnitCount,
    blockUnitCount,
    area,
    builderName,
    location,
    projectName,
    projectType,
    uid = 0,
  } = project

  const aprtConfig = [
    { k: 'Builder', v: builderName, pic: '/builder2.png' },
    { k: 'Type', v: projectType?.name, pic: '/a1.png' },
    { k: 'Location', v: location, pic: '/map.png' },
    { k: 'Area', v: `${totalArea} sqft`, pic: '/x.png' },
    { k: 'Phases', v: 0, pic: '/p1.png' },
  ]

  const areaFeedData = [
    { k: 'Total', v: totalPlotArea, pic: '' },
    { k: 'Sold', v: soldArea, pic: '' },
    { k: 'Booked', v: bookArea || 0, pic: '' },
    { k: 'Available', v: availArea || 0, pic: '' },
    { k: 'Hold', v: blockArea || 0, pic: '' },
  ]
  const unitFeedData = [
    { k: 'Total', v: totalUnitCount || 0, pic: '' },
    { k: 'Sold', v: soldUnitCount || 0, pic: '' },
    { k: 'Booked', v: bookUnitCount || 0, pic: '' },
    { k: 'Available', v: availableCount || 0, pic: '' },
    { k: 'Hold', v: blockUnitCount || 0, pic: '' },
  ]
  const valueFeedData = [
    { k: 'Total', v: totalEstValue || 0, pic: '' },
    { k: 'Sold', v: soldValue || 0, pic: '' },
    { k: 'Booked', v: bookValue || 0, pic: '' },
    { k: 'Collected', v: availValue || 0, pic: '' },
    { k: 'Blocked', v: blockValue || 0, pic: '' },
  ]
  const data = {
    series: [
      {
        name: 'Spent',
        data: [22, 80, 36, 50, 60, 30],
      },
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
  }
  const theme = useTheme()
  const { t } = useTranslation()
  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    colors: ['#5928E5'],
    dataLabels: {
      enabled: false,
    },
    // fill: { opacity: 1 },
    grid: {
      show: false,
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: data.categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '60%',
        rangeBarOverlap: false,
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val) => `$${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 550,
        options: {
          chart: {
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            labels: {
              show: false,
            },
          },
          yaxis: {
            show: true,
            labels: {
              style: {
                colors: theme.palette.text.disabled,
                fontFamily: theme.typography.fontFamily,
                fontWeight: 500,
              },
            },
          },
        },
      },
    ],
  }

  // const [unitsView, setUnitsView] = useState(false)
  // const [areaView, setAreaView] = useState(false)
  // const [valueView, setValueView] = useState(false)

  // const [selbg, setSelbg] = useState('')
  // const [seldata, setSeldata] = useState('')
  // const [selkind, setSelkind] = useState('')
  // const [selcurrency, setSelcurrency] = useState('')

  // const [areabg, setAreabg] = useState('')
  // const [areaData, setAreaData] = useState('')
  // const [areakind, setAreakind] = useState('')
  // const [areaCurrency, setareaCurrency] = useState('')

  // const [valuebg, setValuebg] = useState('')
  // const [valuedata, setValuedata] = useState('')
  // const [valueKind, setValueKind] = useState('')
  // const [valueCurrency, setValueCurrency] = useState('')
  // const displayDetailView = (state, bgColor, data, kind, currency) => {
  //   // console.log('am i clicked')
  //   console.log('check')
  //   setUnitsView(!unitsView)
  //   setSelbg(bgColor)
  //   setSeldata(data)
  //   setSelkind(kind)
  //   setSelcurrency(currency)
  // }
  // const areaDetailView = (state, bgColor, data, kind, currency) => {
  //   // console.log('am i clicked')
  //   console.log('check')
  //   setAreaView(state)
  //   setAreabg(bgColor)
  //   setAreaData(data)
  //   setAreakind(kind)
  //   setareaCurrency(currency)
  // }
  // const valueDetailView = (state, bgColor, data, kind, currency) => {
  //   // console.log('am i clicked')
  //   console.log('check')
  //   setValueView(state)
  //   setValuebg(bgColor)
  //   setValuedata(data)
  //   setValueKind(kind)
  //   setValueCurrency(currency)
  const chartSeries = data.series
  return (
    <div className="px-4 pb-[0.1px]">
      <Link to={routes.projectEdit({ uid })}>
        <section className=" mb-1 leading-7 text-gray-900 bg-[#E9E9F2] rounded-md  hover:text-blue-600 hover:bg-[#E9E9F2] transition duration-300 ease-in-out cursor-pointer">
          <div className="box-border  max-w-full ">
            <section className="flex flex-row  mr-1   text-gray-900  rounded-lg ">
              <div className="w-60">
                <div className="MuiPaper-elevation  MuiPaper-elevation1 MuiCard-root css-1fwf2za-MuiPaper-root-MuiCard-root bg-[#A798FF]">
                  <Box mt={1} mb={1}>
                    <div className="flex flex-col align-middle justify-between">
                      <Link
                        className="flex flex-col items-center"
                        to={routes.projectEdit({ uid })}
                      >
                        <img
                          className="w-10 h-10"
                          alt=""
                          src="/apart.svg"
                        ></img>
                        <span className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 mt-[8px]">
                          {projectName}
                        </span>
                      </Link>
                    </div>

                    {/* <section className="flex flex-row justify-between mt-4">
                      <span className="text-sm  font-light  font text-gray-700 ">
                        {projectType?.name}
                      </span>
                      <span className="text-sm  font-light  font text-gray-700 ">
                        {builderName}
                      </span>
                    </section> */}
                    <section className="flex flex-row justify-between mt-2">
                      <span className="text-sm  font-light  font text-gray-700 ">
                        {location}
                      </span>
                      <span className="text-sm  font-light  font text-gray-700 ">
                        {totalArea} sqft
                      </span>
                    </section>
                  </Box>
                </div>
              </div>
              <Box mt={2} mx={2}>
                <div className="flex flex-col">
                  {[
                    { item: 'Total', value: 100 },
                    { item: 'Available', value: 80 },
                    { item: 'Sold', value: 20 },
                    { item: 'Blocked', value: 0 },
                  ].map((data, i) => (
                    <div className="flex inline-block mt-2" key={i}>
                      <div className="flex flex-row align-middle justify-between mr-1 w-12">
                        <h6 className="font-bodyLato font-semibold text-xs mt-1">
                          {t(data.item)}
                        </h6>
                        <span className="font-bodyLato text-[12px] text-[#94A4C4]"></span>
                      </div>
                      <div className="inline-block ml-2">
                        <LinearProgress
                          sx={{
                            backgroundColor: 'white',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#A798FF',
                            },
                          }}
                          variant="determinate"
                          value={data.value}
                          style={{
                            backgroundColor: '#E5EAF2',
                            borderRadius: '3px',
                            height: '18px',
                            width: '10rem',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
              <div className="w-[1px] my-10 bg-[#DEDEE0]"></div>

              <div className="flex flex-col bg-">
                {/* <div className="bg-[#2499ef] rounded px-2 w-full mx-2 mr-4 mt-2">Total</div> */}
                <div className="flex flex-row">
                  <div className=" w-60">
                    <Card2
                      title={'Available'}
                      color={{
                        backGround:
                          'linear-gradient(180deg, #E9E9F2 0%, #E9E9F2 100%)',
                        // boxShadow: '0px 10px 20px 0px #e0c6f5',
                        height: '114%',
                      }}
                      count={availableCount}
                      area={availArea}
                      amount={availValue}
                      barValue={
                        ((availableCount || 0) / (totalUnitCount || 0)) * 100
                      }
                      value={'25970'}
                      png={UilUsdSquare}
                      series={[
                        {
                          name: 'Sales',
                          data: [31, 40, 28, 51, 42, 109, 100],
                        },
                      ]}
                    />
                  </div>
                  <div className="w-[1px] my-10 bg-[#DEDEE0]"></div>
                  <div className=" w-60 ">
                    <Card2
                      title={'Sold'}
                      color={{
                        backGround:
                          'linear-gradient(180deg, #E9E9F2 0%, #E9E9F2 100%)',
                        boxShadow: '0px 10px 20px 0px #e0c6f5',
                        height: '115%',
                      }}
                      count={soldUnitCount || 0}
                      area={soldArea}
                      amount={soldValue}
                      barValue={
                        (soldUnitCount || 0 / totalUnitCount || 0) * 100
                      }
                      value={'25970'}
                      png={UilUsdSquare}
                      series={[
                        {
                          name: 'Sales',
                          data: [31, 40, 28, 51, 42, 109, 100],
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* <div
                className="MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1fwf2za-MuiPaper-root-MuiCard-root ml-2 bg-[#f3f5ff]"
                style={{ paddingBottom: '0px' }}
              >
                <Box
                  sx={{
                    '& .apexcharts-tooltip *': {
                      fontFamily: theme.typography.fontFamily,
                      fontWeight: 500,
                    },
                    '& .apexcharts-tooltip': {
                      boxShadow: 0,
                      borderRadius: 4,
                      alignItems: 'center',
                      '& .apexcharts-tooltip-text-y-value': {
                        color: 'primary.main',
                      },
                      '& .apexcharts-tooltip.apexcharts-theme-light': {
                        border: `1px solid ${theme.palette.divider}`,
                      },
                      '& .apexcharts-tooltip-series-group:last-child': {
                        paddingBottom: 0,
                      },
                    },
                  }}
                >
                  <Chart
                    height={99}
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                  />
                </Box>
              </div> */}
            </section>
            {false && (
              <div className="grid grid-cols-3 gap-7 mt-10">
                <span
                // onClick={() =>
                //   displayDetailView(
                //     !unitsView,
                //     '#ebf9f9',
                //     projectFeedData,
                //     'Units',
                //     false
                //   )
                // }
                >
                  <ProjectStatsCard
                    kind="Units"
                    iconP="/m2.png"
                    feedData={unitFeedData}
                    bg="#ebf9f9"
                    currency={false}
                    projectData={project}
                  />
                </span>

                <span>
                  <ProjectStatsCard
                    kind="Values"
                    iconP="/m4.png"
                    feedData={valueFeedData}
                    bg="#f3f5ff"
                    currency={true}
                    projectData={project}
                  />
                </span>
                <span>
                  <ProjectStatsCard
                    kind="Area"
                    iconP="/m4.png"
                    feedData={areaFeedData}
                    bg="#f3f5ff"
                    currency={true}
                  />
                </span>

                {/* <span>
              <section className="flex " style={{ height: '270px' }}>
                <PieChartProject />
              </section>
            </span> */}
              </div>
            )}
            {/* {unitsView && (
            <div className="grid grid-cols-1 gap-7 mt-10">
              <PhaseDetailsCard
                kind={selkind}
                feedData={seldata}
                bg={selbg}
                currency={selcurrency}
              />
            </div>
          )}
          {areaView && (
            <div className="grid grid-cols-1 gap-7 mt-10">
              <PhaseDetailsCard
                kind={areakind}
                feedData={areaData}
                bg={areabg}
                currency={areaCurrency}
              />
            </div>
          )}
          {valueView && (
            <div className="grid grid-cols-1 gap-7 mt-10">
              <PhaseDetailsCard
                kind={valueKind}
                feedData={valuedata}
                bg={valuebg}
                currency={valueCurrency}
              />
            </div>
          )} */}
          </div>
        </section>
      </Link>
    </div>
  )
}

export default ProjectsMHomeBody
