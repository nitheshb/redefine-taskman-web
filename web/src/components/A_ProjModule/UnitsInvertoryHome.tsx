/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'

import { Link } from '@redwoodjs/router'

import { getAllProjects } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import 'flowbite'

import DropDownSearchBar from '../dropDownSearchBar'
import ProjPhaseHome from '../ProjPhaseHome/ProjPhaseHome'
const UnitsInventoryHome = ({ project }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [customerRawData, setCustomerRawData] = useState([])

  const [isOpenSideView, setIsOpenSideView] = useState(false)

  const [projectDetails, setProjectDetails] = useState()

  const [phaseDetails, setPhaseDetails] = useState({
    projectName: '',
    uid: '',
    value: '',
  })

  const [availType, setAvailType] = useState({
    projectName: '',
    uid: '',
    value: '',
  })

  const phasesA = [
    {
      label: 'Phase-I',
      projectName: 'Phase-I',
      value: 'demands',
    },
  ]

  const paymentsA = [
    {
      label: 'Demands',
      projectName: 'Demands',
      value: 'demands',
    },
    {
      label: 'Review',
      projectName: 'review',
      value: 'review',
    },
    {
      label: 'Received',
      projectName: 'received',
      value: 'received',
    },
    {
      label: 'Rejected',
      projectName: 'rejected',
      value: 'rejected',
    },
  ]
  const registerA = [
    {
      label: 'Booking',
      projectName: 'Blocked',
      value: 'booking',
    },
    {
      label: 'Booking',
      projectName: 'Booking',
      value: 'booking',
    },
    {
      label: 'Agreement',
      projectName: 'Agreement',
      value: 'agreement',
    },
    {
      label: 'Registered',
      projectName: 'registered',
      value: 'registered',
    },
    {
      label: 'Rejected',
      projectName: 'Released',
      value: 'rejected',
    },
  ]

  useEffect(() => {
    getProjects()
  }, [])
  const getProjects = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projects.map((user) => {
          user.label = user?.projectName
          user.value = user?.uid
        })
        setCustomerRawData([...projects])
        console.log('project are ', projects)
      },
      () => setCustomerRawData([])
    )
    return unsubscribe
  }
  const selProjctFun = (project) => {
    setIsOpenSideView(!isOpenSideView)
    setProjectDetails(project)
  }
  const selPhaseFun = (project) => {
    setPhaseDetails(project)
  }
  const selAvailFun = (project) => {
    setAvailType(project)
  }

  return (
    <div>
      <section className=" mt-2 mx-2 py-6 mb-8 leading-7 text-gray-900 bg-white  rounded-lg  ">
        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
          <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
            <div className="flex items-center flex-shrink-0  px-0  pl-0   mb-1">
              <Link
                className="flex items-center"
                // to={routes.projectEdit({ uid })}
              >
                <span className="relative z-10 flex items-center w-auto text-md font-bold leading-none pl-0">
                  Inventory
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-1">
            <form className="">
              <div className="flex">
                <div className="relative w-full p-2.5 pb-6">
                  <section className="absolute top-0 left-0  flex flex-row w-full border bg-gray-100  rounded-lg ">
                    <DropDownSearchBar
                      type={'All Projects'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selProjctFun}
                      selProjectIs={projectDetails}
                      dropDownItemsA={customerRawData}
                    />
                    {/* <DropDownSearchBar
                      type={'All Phases'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selPhaseFun}
                      selProjectIs={phaseDetails}
                      dropDownItemsA={phasesA}
                    /> */}
                    <DropDownSearchBar
                      type={'All Status'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selAvailFun}
                      selProjectIs={availType}
                      dropDownItemsA={registerA}
                    />
                    {/* <DropDownSearchBar
                      type={'All Payments'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={filteredUnits}
                      pickCustomViewer={selProjctFun}
                      selProjectIs={projectDetails}
                      dropDownItemsA={paymentsA}
                    /> */}
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-100 "
                      placeholder={` Search Unit No, Customer name, Phone no, Dues, Review...`}
                      required
                    />
                    <button
                      type="submit"
                      className="p-2.5 px-8 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </section>
                </div>
              </div>
            </form>
          </div>
          {projectDetails == undefined && (
            <div className="py-8 px-8 mt-10 flex flex-col items-center bg-red-100 rounded">
              <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                <img
                  className="w-[180px] h-[180px] inline"
                  alt=""
                  src="/templates.svg"
                />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">
                No Units Found
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                <span className="text-blue-600"></span>
              </time>
            </div>
          )}

          <div className="mt-4">
            <ProjPhaseHome
              projectDetails={projectDetails}
              leadDetailsObj={{}}
              source={undefined}
              unitDetails={undefined}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default UnitsInventoryHome
