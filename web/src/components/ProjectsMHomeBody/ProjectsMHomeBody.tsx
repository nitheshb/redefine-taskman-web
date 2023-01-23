// import { useState } from 'react'
// import PhaseDetailsCard from '../PhaseDetailsCard/PhaseDetailsCard'

import { PencilIcon, EyeIcon } from '@heroicons/react/outline'
import { Box, LinearProgress, useTheme } from '@mui/material'
import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

import { Link, routes } from '@redwoodjs/router'

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
    colors: [theme.palette.primary.main],
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
        borderRadius: 6,
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
  // }
  const chartSeries = data.series
  return (
    <div>
      <Link to={routes.projectEdit({ uid })}>
        <section className="py-6 mb-1 leading-7 text-gray-900 bg-white rounded-md  hover:text-blue-600 hover:bg-[#fcf8f2] transition duration-300 ease-in-out cursor-pointer">
          <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
            <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
              <div className="flex items-center flex-shrink-0  px-0  pl-0 border-b border-grey  mb-2">
                <Link
                  className="flex items-center"
                  to={routes.projectEdit({ uid })}
                >
                  <img className="w-10 h-10" alt="" src="/apart.svg"></img>
                  <span className="relative z-10 flex items-center w-auto text-2xl font-bold leading-none pl-0 mt-[8px]">
                    {projectName}
                  </span>
                </Link>
                <section className="flex ml-auto mt-[8px]">
                  {!isEdit && (
                    <>
                      <Link to={routes.projectEdit({ uid })}>
                        <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-pink-800 bg-pink-200 rounded-full">
                          <EyeIcon
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          Detail View
                        </span>
                      </Link>
                    </>
                  )}
                  {isEdit && (
                    <>
                      <Link to={routes.projectEdit({ uid })}>
                        <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-pink-800 bg-pink-200 rounded-full">
                          <EyeIcon
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          Approval Details
                        </span>
                      </Link>
                      <Link to={routes.projectEdit({ uid })}>
                        <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-pink-800 bg-pink-200 rounded-full">
                          <EyeIcon
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          Bank Details
                        </span>
                      </Link>
                      <Link to={routes.projectEdit({ uid })}>
                        <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-pink-800 bg-pink-200 rounded-full">
                          <EyeIcon
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          Broucher
                        </span>
                      </Link>
                      <Link to={routes.projectEdit({ uid })}>
                        <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-pink-800 bg-pink-200 rounded-full">
                          <EyeIcon
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          Plan Diagram
                        </span>
                      </Link>
                    </>
                  )}
                  <button onClick={onSliderOpen}>
                    <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      Edit
                    </span>
                  </button>
                </section>
              </div>
              <div className="flex  w-full my-2">
                {aprtConfig.map((data, i) => {
                  return (
                    <span key={i} className="inline-flex mr-4">
                      <span className="text-sm  font-light  font text-gray-700 ">
                        {' '}
                        {data.k}:{'  '}
                      </span>
                      <span className="text-sm ml-1 font-semibold">
                        {' '}
                        {data.v}
                      </span>
                    </span>
                  )
                })}
              </div>
            </div>

            <section className="flex flex-row  mr-1   leading-7 text-gray-900  rounded-lg mt-4 ">
              <div className=" w-60">
                <div className="MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1fwf2za-MuiPaper-root-MuiCard-root">
                  <div className="flex flex-row justify-between">
                    <div className=" css-19otv5r">
                      <svg
                        className="svgIcon text-[15px] text-[#2499EF]"
                        focusable="false"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.28393 6.3137H2.55761C3.61128 6.3137 4.47337 7.17579 4.47337 8.22946V17.8083C4.47337 18.862 3.61128 19.724 2.55761 19.724H2.28393C1.23026 19.724 0.368164 18.862 0.368164 17.8083V8.22946C0.368164 7.17579 1.23026 6.3137 2.28393 6.3137V6.3137ZM9.94698 0.566406C11.0007 0.566406 11.8627 1.4285 11.8627 2.48217V17.8083C11.8627 18.862 11.0007 19.724 9.94698 19.724C8.89331 19.724 8.03122 18.862 8.03122 17.8083V2.48217C8.03122 1.4285 8.89331 0.566406 9.94698 0.566406ZM17.61 11.5136C18.6637 11.5136 19.5258 12.3757 19.5258 13.4294V17.8083C19.5258 18.862 18.6637 19.724 17.61 19.724C16.5564 19.724 15.6943 18.862 15.6943 17.8083V13.4294C15.6943 12.3757 16.5564 11.5136 17.61 11.5136V11.5136Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <h6 className="font-bodyLato font-semibold text-sm">
                      {'Sold'}
                    </h6>
                  </div>
                  <Box mt={1} mb={2}>
                    <div className="flex flex-row align-middle justify-between">
                      <h6 className="font-bodyLato font-semibold text-sm"></h6>
                      <span className="font-bodyLato text-[12px] text-[#94A4C4]">
                        {30}
                      </span>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      color="info"
                      value={30}
                      style={{
                        backgroundColor: '#E5EAF2',
                        borderRadius: '3px',
                        height: '4px',
                      }}
                    />
                  </Box>

                  <div className="flex flex-row justify-between">
                    <h3 className=" css-5mn5yy text-md">87</h3>
                    <div className="flex flex-col">
                      <div className=" flexCenter">
                        <div className=" css-16rhdfd">
                          <svg
                            className="svgIcon text-[#2CC5BD] text-[14px] "
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            data-testid="ArrowUpwardIcon"
                          >
                            <path d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                          </svg>
                        </div>
                        <span className="css-1lpgd8m">₹ 45,29,66,922</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <small
                      className=" css-17tn7gx"
                      style={{ marginTop: '0px' }}
                    >
                      Units
                    </small>
                    <div className=" flexCenter">
                      <span className="css-1lpgd8m">sqft 12,234,34</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-60 ml-2">
                <div className="MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1fwf2za-MuiPaper-root-MuiCard-root">
                  <div className="flex flex-row justify-between">
                    <div className=" css-19otv5r">
                      <svg
                        className="svgIcon text-[15px] text-[#2499EF]"
                        focusable="false"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.28393 6.3137H2.55761C3.61128 6.3137 4.47337 7.17579 4.47337 8.22946V17.8083C4.47337 18.862 3.61128 19.724 2.55761 19.724H2.28393C1.23026 19.724 0.368164 18.862 0.368164 17.8083V8.22946C0.368164 7.17579 1.23026 6.3137 2.28393 6.3137V6.3137ZM9.94698 0.566406C11.0007 0.566406 11.8627 1.4285 11.8627 2.48217V17.8083C11.8627 18.862 11.0007 19.724 9.94698 19.724C8.89331 19.724 8.03122 18.862 8.03122 17.8083V2.48217C8.03122 1.4285 8.89331 0.566406 9.94698 0.566406ZM17.61 11.5136C18.6637 11.5136 19.5258 12.3757 19.5258 13.4294V17.8083C19.5258 18.862 18.6637 19.724 17.61 19.724C16.5564 19.724 15.6943 18.862 15.6943 17.8083V13.4294C15.6943 12.3757 16.5564 11.5136 17.61 11.5136V11.5136Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <h6 className="font-bodyLato font-semibold text-sm">
                      {'Available'}
                    </h6>
                  </div>
                  <Box mt={1} mb={2}>
                    <div className="flex flex-row align-middle justify-between">
                      <h6 className="font-bodyLato font-semibold text-sm"></h6>
                      <span className="font-bodyLato text-[12px] text-[#94A4C4]">
                        {30}
                      </span>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      color="info"
                      value={30}
                      style={{
                        backgroundColor: '#E5EAF2',
                        borderRadius: '3px',
                        height: '4px',
                      }}
                    />
                  </Box>

                  <div className="flex flex-row justify-between">
                    <h3 className=" css-5mn5yy text-md">87</h3>
                    <div className="flex flex-col">
                      <div className=" flexCenter">
                        <div className=" css-16rhdfd">
                          <svg
                            className="svgIcon text-[#2CC5BD] text-[14px] "
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            data-testid="ArrowUpwardIcon"
                          >
                            <path d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                          </svg>
                        </div>
                        <span className="css-1lpgd8m">₹ 45,29,66,922</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <small
                      className=" css-17tn7gx"
                      style={{ marginTop: '0px' }}
                    >
                      Units
                    </small>
                    <div className=" flexCenter">
                      <span className="css-1lpgd8m">sqft 12,234,34</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-60 ml-2">
                <div className="MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1fwf2za-MuiPaper-root-MuiCard-root">
                  <div className="flex flex-row justify-between">
                    <div className=" css-19otv5r">
                      <svg
                        className="svgIcon text-[15px] text-[#2499EF]"
                        focusable="false"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.28393 6.3137H2.55761C3.61128 6.3137 4.47337 7.17579 4.47337 8.22946V17.8083C4.47337 18.862 3.61128 19.724 2.55761 19.724H2.28393C1.23026 19.724 0.368164 18.862 0.368164 17.8083V8.22946C0.368164 7.17579 1.23026 6.3137 2.28393 6.3137V6.3137ZM9.94698 0.566406C11.0007 0.566406 11.8627 1.4285 11.8627 2.48217V17.8083C11.8627 18.862 11.0007 19.724 9.94698 19.724C8.89331 19.724 8.03122 18.862 8.03122 17.8083V2.48217C8.03122 1.4285 8.89331 0.566406 9.94698 0.566406ZM17.61 11.5136C18.6637 11.5136 19.5258 12.3757 19.5258 13.4294V17.8083C19.5258 18.862 18.6637 19.724 17.61 19.724C16.5564 19.724 15.6943 18.862 15.6943 17.8083V13.4294C15.6943 12.3757 16.5564 11.5136 17.61 11.5136V11.5136Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <h6 className="font-bodyLato font-semibold text-sm">
                      {'Total'}
                    </h6>
                  </div>
                  <Box mt={1} mb={2}>
                    <div className="flex flex-row align-middle justify-between">
                      <h6 className="font-bodyLato font-semibold text-sm"></h6>
                      <span className="font-bodyLato text-[12px] text-[#94A4C4]">
                        {30}
                      </span>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      color="info"
                      value={30}
                      style={{
                        backgroundColor: '#E5EAF2',
                        borderRadius: '3px',
                        height: '4px',
                      }}
                    />
                  </Box>

                  <div className="flex flex-row justify-between">
                    <h3 className=" css-5mn5yy text-md">87</h3>
                    <div className="flex flex-col">
                      <div className=" flexCenter">
                        <div className=" css-16rhdfd">
                          <svg
                            className="svgIcon text-[#2CC5BD] text-[14px] "
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            data-testid="ArrowUpwardIcon"
                          >
                            <path d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                          </svg>
                        </div>
                        <span className="css-1lpgd8m">₹ 45,29,66,922</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <small
                      className=" css-17tn7gx"
                      style={{ marginTop: '0px' }}
                    >
                      Units
                    </small>
                    <div className=" flexCenter">
                      <span className="css-1lpgd8m">sqft 12,234,34</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1fwf2za-MuiPaper-root-MuiCard-root ml-2"
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
                    height={130}
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                  />
                </Box>
              </div>
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
