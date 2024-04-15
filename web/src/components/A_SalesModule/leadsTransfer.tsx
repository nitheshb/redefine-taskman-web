/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'

import { startOfWeek, startOfDay, startOfMonth, subMonths } from 'date-fns'
import DatePicker from 'react-datepicker'

import { Link } from '@redwoodjs/router'

import { USER_ROLES } from 'src/constants/userRoles'
import {
  getAllProjects,
  getLeadsByDate,
  getLeadsByStatusUser,
  steamUsersListByRole,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import 'flowbite'
import { VerySlimSelectBox } from 'src/util/formFields/slimSelectBoxField'

import DropDownSearchBar from '../dropDownSearchBar'
import LLeadsTableView from '../LLeadsTableView/LLeadsTableView'
import ProjPhaseHome from '../ProjPhaseHome/ProjPhaseHome'

import { Button, Checkbox } from '@mui/material'

import LeadsTransferBody from './leadsTransferBody'

const LeadsTransferHome = ({ project }) => {
  const { user } = useAuth()
  const d = new window.Date()

  const { orgId } = user
  const [customerRawData, setCustomerRawData] = useState([])

  const [isOpenSideView, setIsOpenSideView] = useState(false)

  const [selLeadsOf, setSelLeadsOf] = useState({
    label: 'My Leads',
    value: 'myleads',
  })

  const [selLeadTransferTo, setSelLeadTransferTo] = useState({
    label: 'My Leads',
    value: 'myleads',
  })
  const [fetchLeadsLoader, setFetchLeadsLoader] = useState(true)

  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false)

  const [usersList, setusersList] = useState([])

  const [leadsFetchedRawData, setLeadsFetchedRawData] = useState([])

  const [leadsFetchedData, setLeadsFetchedData] = useState([])

  const [serialLeadsData, setSerialLeadsData] = useState([])

  const [showOnlyDone, setShowOnlyDone] = useState(false)

  const [sourceDateRange, setSourceDateRange] = React.useState(
    startOfDay(d).getTime()
  )
  const [dateRange, setDateRange] = React.useState([null, null])

  const [leadsTyper, setLeadsTyper] = useState('inProgress')
  const [searchKey, setSearchKey] = useState(['new'])
  const [currentStatus, setCurrentStatus] = useState(['new'])
  const archieveFields = ['Dead', 'RNR', 'blocked', 'notinterested', 'junk']
  const statusFields = [
    'new',
    'followup',
    'visitfixed',
    'visitdone',
    'negotiation',
    'reassign',
    'RNR',
    'booked',
  ]

  const [availType, setAvailType] = useState({
    projectName: '',
    uid: '',
    value: '',
  })

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
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })

        setusersList(usersListA)
      },
      (error) => setusersList([])
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    setFetchLeadsLoader(true)
    if (selLeadsOf?.value == 'myleads') {
      const { uid } = user
      getMyLeadsOrAnyUserLeads(uid)
    } else if (selLeadsOf?.value == 'cpleads') {
      // getCpTeamLeads()
    } else if (selLeadsOf?.value == 'teamleads') {
      if (user?.role?.includes(USER_ROLES.ADMIN)) {
        // getAdminAllLeads()
      } else {
        // getMyTeamLeads()
      }
    } else {
      getMyLeadsOrAnyUserLeads(selLeadsOf?.value)
    }
  }, [selLeadsOf])

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

  const serealizeData = (array) => {
    // let newData =
    const x = statusFields.map((status) => {
      const items = array.filter((data) => data.Status.toLowerCase() == status)
      return { name: status, items }
    })
    setSerialLeadsData(x)
  }
  const getMyLeadsOrAnyUserLeads = async (userId) => {
    const { access, uid, orgId } = user
    const unsubscribe = getLeadsByStatusUser(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        // setBoardData
        console.log('my valus are ', usersListA)
        await setLeadsFetchedRawData(usersListA)
        await serealizeData(usersListA)
        // filter_Leads_Projects_Users_Fun()

        await setLeadsFetchedData(usersListA)
      },
      {
        isCp: user?.role?.includes(USER_ROLES.CP_AGENT),
        uid: userId,
        status:
          leadsTyper === 'inProgress'
            ? [
                'new',
                'followup',
                'unassigned',
                'visitfixed',
                'visitcancel',
                '',
                'visitdone',
                'negotiation',
                'reassign',
                'RNR',
                // 'booked',
              ]
            : leadsTyper === 'booked'
            ? ['booked']
            : archieveFields,
      },
      (error) => setLeadsFetchedData([])
    )
    return unsubscribe
  }

  const selProjctFun = (project) => {
    setIsOpenSideView(!isOpenSideView)
    console.log('check it', project)
    setSelLeadsOf(project)
  }

  const selAvailFun = (project) => {
    setAvailType(project)
  }

  return (
    <>
      <section className=" mt-2 mx-2 py-6 mb-8 leading-7 text-gray-900 bg-white  rounded-lg  ">
        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
          <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
            <div className="flex items-center flex-shrink-0  px-0  pl-0   mb-1">
              <Link
                className="flex items-center"
                // to={routes.projectEdit({ uid })}
              >
                <span className="relative z-10 flex items-center w-auto text-md font-bold leading-none pl-0">
                  Leads Transfer
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-1">
            <form className="">
              <div className="flex">
                <div className="relative w-full p-2.5 pb-6 bg-gray-100">
                  <section className="flex flex-col ">
                    <div>Assigned To</div>
                    <VerySlimSelectBox
                      name="project"
                      label=""
                      placeholder="My Leads"
                      className="input w-[30%] "
                      onChange={(value) => {
                        console.log('changed value is ', value.value)
                        selProjctFun(value)
                        // formik.setFieldValue('project', value.value)
                      }}
                      value={selLeadsOf?.value}
                      // options={aquaticCreatures}
                      options={[
                        ...[
                          { label: 'Team Leads', value: 'teamleads' },
                          { label: 'My Leads', value: 'myleads' },
                          { label: 'Cp Leads', value: 'cpleads' },
                        ],
                        ...usersList,
                      ]}
                    />
 <div className=" rounded px-1 mb-3 mt-3">
                        <div>Current Status</div>
                        <div className="sm:flex items-center justify-between rounded">
                          <div className="flex items-center">
                            {[
                              {
                                lab: 'All',
                                val: 'dept_tasks',
                                match: ['completed', 'pending'],
                              },
                              {
                                lab: 'New',
                                val: 'new',
                                match: ['new'],
                              },
                              {
                                lab: 'Followup',
                                val: 'followup',
                                match: ['followup'],
                              },
                              {
                                lab: 'Visit Fixed',
                                val: 'visitfixed',
                                match: ['visitfixed'],
                              },
                              {
                                lab: 'Visit Done',
                                val: 'visitdone',
                                match: ['visitdone'],
                              },
                              {
                                lab: 'Booked',
                                val: 'booked',
                                match: ['booked'],
                              },
                              {
                                lab: 'Not Interested',
                                val: 'notinterested',
                                match: ['notinterested'],
                              },
                            ].map((d, i) => {
                              return (
                                <a
                                  key={i}
                                  className="rounded-full focus:outline-none mr-2"
                                  href="javascript:void(0)"
                                  onClick={() => setCurrentStatus(d.match)}
                                >
                                  <div
                                    className={`px-3 rounded-full pt-[2px] pb-[4px] text-[14px]  ${
                                      currentStatus.includes(d.val)
                                        ? 'bg-gradient-to-r from-violet-200 to-pink-200 scale-105  font-normal'
                                        : 'hover:text-[#027576] hover:bg-[#E7DDFF] bg-[#F2F7FA] text-gray-800  hover:scale-95 font-light'
                                    }`}
                                  >
                                    {d.lab}
                                  </div>
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    <section className="flex flex-row mt-4">
                      <div className=" rounded px-1 mb-3">
                        <div>Covered Status</div>
                        <div className="sm:flex items-center justify-between rounded">
                          <div className="flex items-center">
                            {[
                              {
                                lab: 'All',
                                val: 'dept_tasks',
                                match: ['completed', 'pending'],
                              },
                              {
                                lab: 'New',
                                val: 'new',
                                match: ['new'],
                              },
                              {
                                lab: 'Followup',
                                val: 'followup',
                                match: ['followup'],
                              },
                              {
                                lab: 'Visit Fixed',
                                val: 'visitfixed',
                                match: ['visitfixed'],
                              },
                              {
                                lab: 'Visit Done',
                                val: 'visitdone',
                                match: ['visitdone'],
                              },
                              {
                                lab: 'Booked',
                                val: 'booked',
                                match: ['booked'],
                              },
                              {
                                lab: 'Not Interested',
                                val: 'notinterested',
                                match: ['notinterested'],
                              },
                            ].map((d, i) => {
                              return (
                                <a
                                  key={i}
                                  className="rounded-full focus:outline-none mr-2"
                                  href="javascript:void(0)"
                                  onClick={() => setSearchKey(d.match)}
                                >
                                  <div
                                    className={`px-3 rounded-full pt-[2px] pb-[4px] text-[14px]  ${
                                      searchKey.includes(d.val)
                                        ? 'bg-gradient-to-r from-violet-200 to-pink-200 scale-105  font-normal'
                                        : 'hover:text-[#027576] hover:bg-[#E7DDFF] bg-[#F2F7FA] text-gray-800  hover:scale-95 font-light'
                                    }`}
                                  >
                                    {d.lab}
                                  </div>
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                      <div className=" rounded px-1 mb-3">
                        <div>Current Status</div>
                        <VerySlimSelectBox
                          name="project"
                          label=""
                          placeholder="My Leads"
                          className="input  "
                          onChange={(value) => {
                            console.log('changed value is ', value.value)
                            setSelLeadTransferTo(value)
                            // formik.setFieldValue('project', value.value)
                          }}
                          value={selLeadTransferTo?.value}
                          // options={aquaticCreatures}
                          options={[
                            ...[
                              { label: 'Team Leads', value: 'teamleads' },
                              { label: 'My Leads', value: 'myleads' },
                              { label: 'Cp Leads', value: 'cpleads' },
                            ],
                            ...usersList,
                          ]}
                        />
                      </div>

                      <div className=" rounded px-1 mb-3">
                        <div>Project</div>
                        <VerySlimSelectBox
                          name="project"
                          label=""
                          placeholder="My Leads"
                          className="input  "
                          onChange={(value) => {
                            console.log('changed value is ', value.value)
                            setSelLeadTransferTo(value)
                            // formik.setFieldValue('project', value.value)
                          }}
                          value={selLeadTransferTo?.value}
                          // options={aquaticCreatures}
                          options={[
                            ...[
                              { label: 'Team Leads', value: 'teamleads' },
                              { label: 'My Leads', value: 'myleads' },
                              { label: 'Cp Leads', value: 'cpleads' },
                            ],
                            ...usersList,
                          ]}
                        />
                      </div>

                      
                    </section>

                    <div className="flex justify-between">

  {'Transfer Too'}

  <Button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Apply</Button>


</div>




                    <VerySlimSelectBox
                      name="project"
                      label=""
                      placeholder="My Leads"
                      className="input w-[30%]  "
                      onChange={(value) => {
                        console.log('changed value is ', value.value)
                        setSelLeadTransferTo(value)
                        // formik.setFieldValue('project', value.value)
                      }}
                      value={selLeadTransferTo?.value}
                      // options={aquaticCreatures}
                      options={[
                        ...[
                          { label: 'Team Leads', value: 'teamleads' },
                          { label: 'My Leads', value: 'myleads' },
                          { label: 'Cp Leads', value: 'cpleads' },
                        ],
                        ...usersList,
                      ]}
                    />
                  </section>
                </div>
              </div>
            </form>
          </div>

          <LeadsTransferBody
            leadAssignedTo={selLeadsOf?.value}
            coveredStatus={searchKey}
            currentStatus={currentStatus}
          />
          {selLeadsOf == undefined && (
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
            {!false && (
              <LLeadsTableView
                setFetchLeadsLoader={setFetchLeadsLoader}
                fetchLeadsLoader={fetchLeadsLoader}
                leadsFetchedData={leadsFetchedData}
                setisImportLeadsOpen={setisImportLeadsOpen}
                // selUserProfileF={selUserProfileF}
                leadsTyper={leadsTyper}
                // searchVal={searchValue}
              />
            )}
          </div>
        </div>
      </section>
      {/* <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={addLeadsTypes}
        widthClass="max-w-4xl"
        customerDetails={selUserProfile}
        unitsViewMode={unitsViewMode}
        setUnitsViewMode={setUnitsViewMode}
        setIsClicked={setIsClicked}

      /> */}
    </>
  )
}

export default LeadsTransferHome
