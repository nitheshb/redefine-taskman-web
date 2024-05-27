/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react'

import { Switch } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { ArrowNarrowRightIcon, PlusIcon } from '@heroicons/react/solid'
import { PaperClipIcon, UsersIcon } from '@heroicons/react/solid'
import { TabList } from '@mui/lab'
import { Box, Card, Grid, styled } from '@mui/material'
import { Checkbox } from '@mui/material'
import { startOfDay } from 'date-fns'
import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next' // styled components

import {
  streamGetAllTaskManTasks,
  streamGetAllParticipantTasks,
  steamDepartmentsList,
  getAllProjects,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { supabase } from 'src/context/supabase'
import CSVDownloader from 'src/util/csvDownload'
import {
  formatToPhone,
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  prettyDateTime,
} from 'src/util/dateConverter'
import {
  SlimDateSelectBox,
  SlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'
import uniqueId from 'src/util/generatedId'

import LLeadsTableBody from '../LLeadsTableBody/LLeadsTableBody'

import DropDownSearchBar from './dropDownSearchBar'
import SiderForm from './SiderForm/SiderForm'

const torrowDate = new Date(
  +new Date().setHours(0, 0, 0, 0) + 86400000
).getTime()

const TodoListView = ({
  moduleName,
  taskListA,
  setisImportLeadsOpen,
  selUserProfileF,
  selTaskManObjF,
  leadsFetchedData,
  leadsTyper,
  leadByViewLayout,
  setLeadByViewLayout,
  searchKey,
  setSearchKey,
}) => {
  // change navbar title
  // useTitle('Data Table V1')
  const { user } = useAuth()

  const { orgId } = user
  const d = new window.Date()

  const { t } = useTranslation()
  const [value, setValue] = useState('new')

  const [tableData, setTableData] = useState([])
  const [businessData_F, setBusinessData_F] = useState([])
  const [businessSection_D, setBusinessSection_D] = useState([])
  const [businessData_Filtered, setBusinessData_Filtered] = useState([])
  const [showSettings, setShowSettings] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [selPriority, setSelPriority] = useState('')
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [showOnlyDone, setShowOnlyDone] = useState(false)
  const [customerRawData, setCustomerRawData] = useState([])

  const [sourceDateRange, setSourceDateRange] = useState(
    startOfDay(d).getTime()
  )

  const [personalData_F, setPersonalData_F] = useState([])
  const [personalData_D, setPersonalData_D] = useState([])
  const [ParticipantsData_D, setParticipantsData_D] = useState([])
  const [tabHeadFieldsA, settabHeadFieldsA] = useState([])
  const [isImportLeadsOpen1, setisImportLeadsOpen1] = useState(false)
  const [isClicked, setisClicked] = useState('business_tasks')
  const [subSection, setSubSection] = useState('all_business')
  const [sortType, setSortType] = useState('Latest')
  const [isChecked, setIsChecked] = useState(false)
  const [filUnitsFeedA, setFilUnitsFeedA] = useState([])
  const [deptListA, setDepartListA] = useState([])

  useEffect(() => {
    const unsubscribe = steamDepartmentsList(
      orgId,
      (querySnapshot) => {
        const allSetUp = [
          {
            label: 'All',
            projectName: 'All',
            value: 'any',
          },
        ]

        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        bankA.map((user) => {
          user.label = user?.label
          user.projectName = user?.label
          user.value = user?.value
        })
        console.log('fetched users list is', bankA)
        setDepartListA([...allSetUp, ...bankA])
      },
      (error) => setDepartListA([])
    )

    return unsubscribe
  }, [])
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  useEffect(() => {
    getProjects()
  }, [])

  // const [leadsFetchedData, setLeadsFetchedData] = useState([])
  useEffect(() => {
    getTasksDataFun()
  }, [showCompletedTasks, showOnlyDone])

  useEffect(() => {
    getTasksDataFun()

    // Subscribe to real-time changes in the `${user?.orgId}_accounts` table
    const subscription = supabase
      .from(`maahomes_TM_Tasks`)
      .on('*', (payload) => {
        // When a change occurs, update the 'leadLogs' state with the latest data
        console.log('account records', payload)
        // Check if the updated data has the id 12
        const updatedData = payload.new
        // const oldData = payload.old
        const { id } = payload.old
        const eventType = payload.eventType
        const updatedLeadLogs = [...businessData_F]
        if (
          updatedData.by_uid === user?.uid ||
          updatedData?.to_uid === user?.uid ||
          updatedData?.followersUid.includes(user?.uid)
        ) {
          if (
            updatedData.by_uid === user?.uid &&
            updatedData.to_uid === user?.uid
          ) {
            setPersonalData_F((prevLogs) => {
              const existingLog = prevLogs.find((log) => log.id === id)

              if (existingLog) {
                console.log('Existing record found!')
                if (payload.new.status === 'Done') {
                  const updatedLogs = prevLogs.filter((log) => log.id != id)
                  return [...updatedLogs]
                } else {
                  const updatedLogs = prevLogs.map((log) =>
                    log.id === id ? payload.new : log
                  )
                  return [...updatedLogs]
                }
              } else {
                console.log('New record added!')
                return [...prevLogs, payload.new]
              }
            })
          } else if (updatedData?.followersUid.includes(user?.uid)) {
            setParticipantsData_D((prevLogs) => {
              const existingLog = prevLogs.find((log) => log.id === id)
              if (existingLog) {
                console.log('Existing record found!')
                if (payload.new.status === 'Done') {
                  const updatedLogs = prevLogs.filter((log) => log.id != id)
                  return [...updatedLogs]
                } else {
                  const updatedLogs = prevLogs.map((log) =>
                    log.id === id ? payload.new : log
                  )
                  return [...updatedLogs]
                }
              } else {
                console.log('New record added!')
                return [...prevLogs, payload.new]
              }
            })
          }
          // else if (
          //         eventType == 'UPDATE' &&
          //         oldData?.followersUid.includes(user?.uid) &&
          //         !updatedData?.followersUid.includes(user?.uid)
          //       ) {
          //         setParticipantsData_D((prevLogs) => {
          //           const existingLog = prevLogs.find((log) => log.id === id)
          //           if (existingLog) {
          //             console.log('Existing record found!')
          //             if (payload.new.status === 'Done') {
          //               const updatedLogs = prevLogs.filter((log) => log.id != id)
          //               return [...updatedLogs]
          //             } else {
          //               const updatedLogs = prevLogs.filter((log) => log.id != id)
          //               return [...updatedLogs]
          //               // const updatedLogs = prevLogs.map((log) =>
          //               //   log.id === id ? payload.new : log
          //               // )
          //               return [...updatedLogs]
          //             }
          //           } else {
          //             console.log('New record added!')
          //             return [...prevLogs, payload.new]
          //           }
          //         })
          //       }
          else {
            if (
              updatedData.by_uid === user?.uid ||
              updatedData?.to_uid === user?.uid
            ) {
              setBusinessData_F((prevLogs) => {
                const existingLog = prevLogs.find((log) => log.id === id)

                if (existingLog) {
                  console.log('Existing record found!')
                  if (payload.new.status === 'Done') {
                    const updatedLogs = prevLogs.filter((log) => log.id != id)
                    return [...updatedLogs]
                  } else {
                    const updatedLogs = prevLogs.map((log) =>
                      log.id === id ? payload.new : log
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
  useEffect(() => {
    // first

    // return () => {
    //   second
    // }

    console.log('is my value changed, sortType', sortType, searchText)

    if (subSection == 'all_business') {
      const x = businessData_F.filter(
        (d) =>
          d.priority?.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setBusinessSection_D(x)
      bootBusinessFun(x)
    } else if (subSection == 'assigned_to_me') {
      const x = businessData_F.filter(
        (d) =>
          d.by_uid != user?.uid &&
          d.to_uid === user?.uid &&
          d.priority?.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setBusinessSection_D(x)
      bootBusinessFun(x)
    } else if (subSection == 'created_by_me') {
      const x = businessData_F.filter(
        (d) =>
          d.by_uid === user?.uid &&
          d.to_uid != user?.uid &&
          d.priority?.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setBusinessSection_D(x)
      bootBusinessFun(x)
    } else if (subSection == 'participants') {
      // const x = businessData_F.filter(
      //   (d) =>
      //     d.priority.toLowerCase().includes(selPriority.toLowerCase()) &&
      //     d.title?.toLowerCase().includes(searchText.toLowerCase())
      // )
      setParticipantsData_D(ParticipantsData_D)
      bootBusinessFun(ParticipantsData_D)
    }
  }, [
    businessData_F,
    ParticipantsData_D,
    subSection,
    sortType,
    searchText,
    selPriority,
  ])

  const sortDataFun = (data) => {
    if (sortType === 'Oldest') {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return a.due_date - b.due_date
      })
      setBusinessSection_D(x)
    } else {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return b.due_date - a.due_date
      })
      setBusinessSection_D(x)
    }
  }

  const sortPersonalDataFun = (data) => {
    console.log('personal data is ', sortType)
    if (sortType === 'Oldest') {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return a.due_date - b.due_date
      })
      setPersonalData_D(x)
    } else {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return b.due_date - a.due_date
      })
      setPersonalData_D(x)
    }
  }

  const sortParticipantsDataFun = (data) => {
    console.log('personal data is ', sortType)
    if (sortType === 'Oldest') {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return a.due_date - b.due_date
      })
      setParticipantsData_D(x)
    } else {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return b.due_date - a.due_date
      })
      setParticipantsData_D(x)
    }
  }

  useEffect(() => {
    // bootBusinessFun()
  }, [businessSection_D, sortType, subSection])

  const bootBusinessFun = async (x) => {
    sortDataFun(x)
  }

  const handleSortDrop = (e) => {
    setSortType(e.target.value)
  }

  const getTasksDataFun = async () => {
    console.log('login role detials', user)
    const { uid } = user

    const steamLeadLogs = await streamGetAllTaskManTasks(
      user?.orgId,
      'snap',
      {
        uid,
        statusVAl: showCompletedTasks,
        showOnlyDone: showOnlyDone,
      },
      (error) => []
    )
    const steamParticipantLogs = await streamGetAllParticipantTasks(
      user?.orgId,
      'snap',
      {
        uid,
        statusVAl: showCompletedTasks,
        showOnlyDone: showOnlyDone,
      },
      (error) => []
    )

    const x = await steamLeadLogs.filter(
      (d) =>
        d.by_uid === user?.uid &&
        d.to_uid === user?.uid &&
        d.title?.toLowerCase().includes(searchText.toLowerCase())
    )
    await setPersonalData_F(x)
    const y = await steamLeadLogs.filter(
      (d) =>
        (d.by_uid != user?.uid && d.to_uid === user?.uid) ||
        (d.by_uid === user?.uid && d.to_uid != user?.uid)
    )
    // const z = await steamLeadLogs.filter(
    //   (d) => {
    //     console.log(
    //       'z o is values are',
    //       d.followersUid.includes('adFBX9QVHfbdDbxrH3TPKE3mW4M2'),
    //       d.followersUid
    //     )
    //     if (d.followersUid.includes('adFBX9QVHfbdDbxrH3TPKE3mW4M2')) return d
    //   }
    //   // (d.by_uid != user?.uid && d.to_uid === user?.uid) ||
    //   // (d.by_uid === user?.uid && d.to_uid != user?.uid)
    // )
    const z = await steamParticipantLogs

    await console.log('z o is ', z)
    await setBusinessData_F(y)
    await sortDataFun(y)
    await sortPersonalDataFun(x)
    await sortParticipantsDataFun(z)
    return
  }

  useEffect(() => {
    if (isClicked === 'personal_tasks') {
      const x = personalData_F.filter(
        (d) =>
          d.by_uid === user?.uid &&
          d.to_uid === user?.uid &&
          d.priority.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setPersonalData_D(x)
      sortPersonalDataFun(x)
    } else if (isClicked === 'dept_tasks') {
      setShowSettings(true)
    }
  }, [isClicked, searchText, sortType, selPriority, personalData_F])

  const handleFilterClearFun = async () => {
    setSelPriority('')
    setSearchText('')
  }

  const filterTable = tableData.filter((item) =>
    value !== '' ? item.role.toLowerCase() === value : item.role
  )

  const openingTaskAddWindow = () => {
    console.log('i was clicked')
    setisImportLeadsOpen1(true)
  }

  const changeFun = () => {
    setShowCompletedTasks(!showCompletedTasks)
    setShowOnlyDone(false)
  }
  const selProjctFun = (project) => {
    // setIsOpenSideView(!isOpenSideView)s
    setProjectDetails(project)
  }
  const selDeptFun = (project) => {
    setDeptDetails(project)
  }
  const selAssignedFun = (project) => {
    setAssignedDetails(project)
  }
  const selCreatedFun = (project) => {
    setCreatedByDetails(project)
  }
  const selPriorityFun = (project) => {
    setPriorityDetails(project)
  }
  const [projectDetails, setProjectDetails] = useState({
    projectName: '',
    uid: '',
    value: 'any',
  })
  const [deptDetails, setDeptDetails] = useState({
    deptName: '',
    uid: '',
    value: 'any',
  })
  const [assignedDetails, setAssignedDetails] = useState({
    assignedTo: '',
    uid: '',
    value: 'any',
  })
  const [createdByDetails, setCreatedByDetails] = useState({
    createdBy: '',
    uid: '',
    value: 'any',
  })
  const [priorityDetails, setPriorityDetails] = useState({
    createdBy: '',
    uid: '',
    value: 'any',
  })
  const [availType, setAvailType] = useState({
    projectName: '',
    uid: '',
    value: 'any',
  })
  const priorityListA = [
    {
      label: 'All',
      projectName: 'All',
      value: 'any',
    },
    {
      label: 'Low',
      projectName: 'Low',
      value: 'low',
    },
    {
      label: 'Medium',
      projectName: 'Medium',
      value: 'medium',
    },
    {
      label: 'High',
      projectName: 'High',
      value: 'high',
    },
  ]
  const availAssignedTo = [
    {
      label: 'All',
      projectName: 'All',
      value: 'any',
    },
    {
      label: 'Me',
      projectName: 'Me',
      value: 'me',
    },
    {
      label: 'Others',
      projectName: 'Others',
      value: 'others',
    },
  ]
  const allDepartmentsA = [
    {
      label: 'All',
      projectName: 'All',
      value: 'any',
    },

    {
      label: 'General',
      projectName: 'General',
      value: 'general',
    },
    {
      label: 'Procurement',
      projectName: 'Procurement',
      value: 'procurement',
    },
    {
      label: 'Construction',
      projectName: 'Construction',
      value: 'construction',
    },
    {
      label: 'Marketing',
      projectName: 'Marketing',
      value: 'marketing',
    },
  ]
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
        setCustomerRawData([
          ...[
            {
              label: 'All',
              projectName: 'All',
              value: 'any',
            },
          ],
          ...projects,
        ])
        console.log('project are ', projects)
      },
      () => setCustomerRawData([])
    )
    return unsubscribe
  }
  useEffect(() => {
    filFun()
  }, [
    businessData_F,
    projectDetails,
    deptDetails,
    assignedDetails,
    createdByDetails,
    priorityDetails,
  ])

  const filFun = () => {
    const filData = businessData_F?.filter((da) => {
      const projectMatch =
        projectDetails.value === 'any'
          ? true
          : da?.projectObj == projectDetails.value
      const categoryMatch =
        deptDetails.value === 'any'
          ? true
          : da?.categoryObj?.toLocaleLowerCase() ==
            deptDetails.value?.toLocaleLowerCase()
      const assignedMatch =
        assignedDetails.value === 'any'
          ? true
          : assignedDetails.value === 'me'
          ? da?.to_uid?.toLocaleLowerCase() == user?.uid
          : da?.to_uid?.toLocaleLowerCase() != user?.uid
      const createdByMatch =
        createdByDetails.value === 'any'
          ? true
          : createdByDetails.value === 'me'
          ? da?.by_uid?.toLocaleLowerCase() == user?.uid
          : da?.by_uid?.toLocaleLowerCase() != user?.uid
      const priorityMatch =
        priorityDetails.value === 'any'
          ? true
          : priorityDetails.value === 'high'
          ? da?.priority?.toLocaleLowerCase() == 'high'
          : da?.priority?.toLocaleLowerCase() != 'high'
      return (
        projectMatch &&
        assignedMatch &&
        categoryMatch &&
        createdByMatch &&
        priorityMatch
      )
    })
    setBusinessSection_D(filData)
    // bootBusinessFun(x)
  }
  return (
    <>
      <Box pb={4} className="font-sanF">
        <div className=" w-full font-sanF">
          <div className="bg-white py-4 md:py-7 px-4 md:px-4 xl:px-6 rounded">
            <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 flex flex-col justify-center items-center ">
              <div className="flex items-center flex-shrink-0  px-0  pl-0   mb-1">
                <div
                  className="flex items-center"
                  // to={routes.projectEdit({ uid })}
                >
                  <span className="relative z-10 flex items-center w-auto text-md font-bold leading-none pl-0">
                    Task List
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-1 ">
              {/* <form className=""> */}
              <div className="flex justify-center items-center  flex flex-col">
                <div className="relative  p-2.5 pb-6">
                  <section className=" top-0 left-0  flex flex-row  border bg-white border-[#dddddd] rounded-full custom-shadow">
                    <DropDownSearchBar
                      label={'Project'}
                      type={'All'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selProjctFun}
                      selProjectIs={projectDetails}
                      dropDownItemsA={customerRawData}
                    />
                    <DropDownSearchBar
                      label={'Department'}
                      type={'All'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selDeptFun}
                      selProjectIs={deptDetails}
                      dropDownItemsA={deptListA}
                    />
                    <DropDownSearchBar
                      label={'Assigned To'}
                      type={'All'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selAssignedFun}
                      selProjectIs={assignedDetails}
                      dropDownItemsA={availAssignedTo}
                    />
                    <DropDownSearchBar
                      label={'Created By'}
                      type={'All'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selCreatedFun}
                      selProjectIs={createdByDetails}
                      dropDownItemsA={availAssignedTo}
                    />
                    <DropDownSearchBar
                      label={'Priority'}
                      type={'All'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={[]}
                      pickCustomViewer={selPriorityFun}
                      selProjectIs={priorityDetails}
                      dropDownItemsA={priorityListA}
                    />
                    <button
                      onClick={() => {
                        console.log('clicked')
                      }}
                      className=" mr-4 h-[32px] w-[32px]  mt-[12px] p-[8px] ml-[12px]  text-sm font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                    >
                      <svg
                        aria-hidden="true"
                        className=""
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
              {/* </form> */}
            </div>
            <div className="flex flex-row justify-between border-gray-200 border-b"></div>
            <div
              className={`${
                showSettings ? 'hidden' : ''
              } flex flex-row py-2 justify-between `}
            >
              <div className="flex flex-row w-full">
                <span className="flex ml-2 mr-2 h-[34px] bg-gray-50 border border-gray-300 border-solid box-border w-1/3 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4  mt-[9px] mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    id="globalSearch"
                    placeholder="Search Task title,status... "
                    onChange={(e) => setSearchText(e.target.value)}
                    autoComplete="off"
                    value={searchText}
                    className="w-52 bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900 w-4/5 relative"
                  />
                </span>
                <div className=" mr-2 w-[130px]">
                  <SlimSelectBox
                    name="Priority"
                    placeholder="Priority"
                    label=""
                    className="input "
                    onChange={(value) => {
                      console.log('sel valu s', value)
                      setSelPriority(value.value)
                    }}
                    value={selPriority}
                    options={[
                      { label: 'All Priority', value: '' },
                      { label: 'Low', value: 'low' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'High', value: 'high' },
                    ]}
                  />
                </div>
                <div className="ml-2 py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded max-h-[35px]">
                  <p>Sort By:</p>
                  <select
                    aria-label="select"
                    className="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
                    onChange={(e) => handleSortDrop(e)}
                    value={sortType}
                  >
                    <option className="text-sm text-indigo-800">Oldest</option>
                    <option className="text-sm text-indigo-800">Latest</option>
                  </select>
                </div>

                <div className="flex items-center ml-2 mb-2 h-[31px]">
                  <Checkbox
                    color="primary"
                    checked={showOnlyDone}
                    onClick={() => {
                      setShowCompletedTasks(true)
                      setShowOnlyDone(!showOnlyDone)
                    }}
                  />
                  <label
                    htmlFor="area"
                    className="label font-regular text-[10px] font-bodyLato"
                  >
                    Show Only Completed
                  </label>
                </div>
              </div>
              <span style={{ display: '' }}>
                <CSVDownloader
                  className="mr-6 h-[20px] w-[20px] mt-2"
                  downloadRows={businessData_F}
                  style={{ height: '20px', width: '20px' }}
                />
              </span>
            </div>
            {isClicked === 'dept_tasks' && (
              <div className=" rounded px-1 mt-4 mb-3">
                <div className="sm:flex items-center justify-between bg-white rounded">
                  <div className="flex items-center">
                    {[
                      {
                        lab: 'All',
                        val: 'dept_tasks',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Done',
                        val: '',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Todo',
                        val: 'upcoming',
                        match: ['pending'],
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
                              searchKey.includes(d.match)
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
            )}
            {isClicked === 'business_tasks' && (
              <div className=" rounded px-1 mt-4 mb-3 flex flex-row-reverse justify-between">
                {/* <div className="sm:flex items-center justify-between bg-white rounded">
                  <div className="flex items-center">
                    {[
                      {
                        lab: 'All',
                        val: 'all_business',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Assigned to me',
                        val: 'assigned_to_me',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Created by me',
                        val: 'created_by_me',
                        match: ['pending'],
                      },
                      {
                        lab: 'Participants',
                        val: 'participants',
                        match: ['upcoming'],
                      },
                    ].map((d, i) => {
                      return (
                        <a
                          key={i}
                          className="rounded-full focus:outline-none mr-2"
                          href="javascript:void(0)"
                          onClick={() => setSubSection(d.val)}
                        >
                          <div
                            className={`px-3 rounded-full pt-[2px] pb-[4px] text-[14px]  ${
                              subSection === d.val
                                ? 'bg-gradient-to-r from-violet-200 to-pink-200 scale-105 text-black-900 font-normal'
                                : 'hover:text-[#027576] hover:bg-[#E7DDFF] bg-[#F2F7FA] text-gray-800 hover:scale-95 font-light'
                            }`}
                          >
                            <section className="flex flex-row">
                              {d.lab}
                              {d.val === 'all_business' && (
                                <section className="text-[11px]  ml-1 mt-[3px]">
                                  ({businessData_F.length})
                                </section>
                              )}
                              {d.val === 'assigned_to_me' && (
                                <section className="text-[11px]  ml-1 mt-[4px]">
                                  (
                                  {
                                    businessData_F.filter(
                                      (d) =>
                                        d.by_uid != user?.uid &&
                                        d.to_uid === user?.uid
                                    ).length
                                  }
                                  )
                                </section>
                              )}
                              {d.val === 'created_by_me' && (
                                <section className="text-[11px]  ml-1 mt-[4px]">
                                  (
                                  {
                                    businessData_F.filter(
                                      (d) =>
                                        d.by_uid === user?.uid &&
                                        d.to_uid != user?.uid
                                    ).length
                                  }
                                  ){' '}
                                </section>
                              )}
                              {d.val === 'participants' && (
                                <section className="text-[11px]  ml-1 mt-[4px]">
                                  ({ParticipantsData_D.length})
                                </section>
                              )}
                            </section>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div> */}
                <section className="flex flex-row">
                  {['dept_tasks', 'business_tasks', 'personal_tasks'].includes(
                    isClicked
                  ) && (
                    <button
                      className="w-[104px] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 sm:mt-0 inline-flex items-start justify-start px-2 mb-[4px] mr-2
                 focus:outline-none rounded-full hover:text-[#027576] hover:bg-gradient-to-r from-violet-200 to-pink-200 bg-gradient-to-r from-violet-200 to-pink-200 text-black-900 hover:text-[#025e5e] hover:scale-95 font-light "
                      onClick={() => openingTaskAddWindow()}
                    >
                      <PlusIcon className="w-[13px] h-[13px] mt-[5px] mr-[2px]" />
                      <p className="text-sm text-black-900 font-medium leading-none mt-1">
                        New Task
                      </p>
                    </button>
                  )}
                  <div className="flex flex-row">
                    <span className="text-[10px] mt-1 mr-1">
                      Show Completed
                    </span>
                    <Switch
                      checked={showCompletedTasks}
                      onChange={changeFun}
                      className={`${
                        showCompletedTasks ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          showCompletedTasks ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                </section>
              </div>
            )}
            {((isClicked === 'dept_tasks' && taskListA.length === 0) ||
              (isClicked === 'personal_tasks' && personalData_D.length === 0) ||
              (isClicked === 'business_tasks' &&
                businessSection_D.length === 0)) && (
              <div
                className={`py-8 px-8 flex flex-col items-center bg-red-100 rounded ${
                  isClicked === 'personal_tasks' ? 'mt-[55px]' : ''
                }`}
              >
                <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                  <img
                    className="w-[180px] h-[180px] inline"
                    alt=""
                    src="../note-widget.svg"
                  />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  No Tasks Found
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  <span className="text-blue-600"> Add New Task</span>
                </time>
              </div>
            )}
            {isClicked === 'dept_tasks' && (
              <div className="overflow-x-auto mt-2">
                <table className="w-full whitespace-nowrap">
                  <tbody>
                    {
                      // [
                      //   {
                      //     title: 'Marketing Keynote Presentation1',
                      //     p: 'Urgent',
                      //     date: '04/07',
                      //     due: 'Today',
                      //   },
                      // ]
                      taskListA
                        ?.filter(
                          (d) =>
                            searchKey.includes(d['sts']) ||
                            searchKey.includes('upcoming')
                        )
                        .map((dat, i) => (
                          <tr
                            tabIndex={0}
                            className="focus:outline-none h-16 border border-gray-100 rounded"
                            key={i}
                            onClick={() => {
                              console.log('macho 1', dat?.leadUser, dat)
                              const y = dat.leadUser
                              y.id = dat?.uid
                              console.log('macho 1', y)
                              selUserProfileF('User Profile', y)
                            }}
                          >
                            <td>
                              <div className="ml-5">
                                <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center relative">
                                  {/* <input
                                placeholder="checkbox"
                                type="checkbox"
                                className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                              /> */}
                                  {i + 1}
                                  {/* <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                                <svg
                                  className="icon icon-tabler icon-tabler-check"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path stroke="none" d="M0 0h24v24H0z"></path>
                                  <path d="M5 12l5 5l10 -10"></path>
                                </svg>
                              </div> */}
                                </div>
                              </div>
                            </td>
                            <td className=" max-w-[300px]">
                              <div className="flex items-center ">
                                <div className="flex flex-col">
                                  <p className="text-base max-w-[350px] overflow-ellipsis overflow-hidden font-semibold leading-none text-blue-800 mr-2 mt-2">
                                    {dat?.notes}
                                  </p>
                                  <div className="flex flex-row">
                                    <p className="text-[9px]   leading-none  pr-2 text-green-800  mt-[6px]  py-[4px]  rounded-full   mb-1 mr-2  ">
                                      {dat?.leadUser?.Project?.toUpperCase()}
                                    </p>

                                    {/* <p className="text-[11px]  leading-none text-red-800  mt-1  py-[4px]  rounded-full  text-2xl  mb-1 mr-2  ">
                                  {dat?.pri}
                                </p> */}
                                    <p className="text-[9px]  leading-none text-red-800  mt-[6px] font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                      {dat?.leadUser?.Status?.toUpperCase()}
                                    </p>
                                    <p className="text-[9px]  leading-none text-gray-600  mt-[6px] font-sanF  py-[4px]  rounded-full    mb-1 mr-2  ">
                                      {dat?.sts?.toUpperCase()}
                                    </p>
                                    <p
                                      className={`text-[9px]  leading-none ${
                                        user?.uid == dat?.leadUser?.assignedTo
                                          ? 'text-green-800'
                                          : 'text-red-800 '
                                      }   mt-[6px] font-sanF  py-[4px]  rounded-full    mb-1 mr-2  `}
                                    >
                                      {dat?.leadUser?.assignedToObj?.name?.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                {/*
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M6.66669 9.33342C6.88394 9.55515 7.14325 9.73131 7.42944 9.85156C7.71562 9.97182 8.02293 10.0338 8.33335 10.0338C8.64378 10.0338 8.95108 9.97182 9.23727 9.85156C9.52345 9.73131 9.78277 9.55515 10 9.33342L12.6667 6.66676C13.1087 6.22473 13.357 5.62521 13.357 5.00009C13.357 4.37497 13.1087 3.77545 12.6667 3.33342C12.2247 2.89139 11.6251 2.64307 11 2.64307C10.3749 2.64307 9.77538 2.89139 9.33335 3.33342L9.00002 3.66676"
                              stroke="#3B82F6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M9.33336 6.66665C9.11611 6.44492 8.8568 6.26876 8.57061 6.14851C8.28442 6.02825 7.97712 5.96631 7.66669 5.96631C7.35627 5.96631 7.04897 6.02825 6.76278 6.14851C6.47659 6.26876 6.21728 6.44492 6.00003 6.66665L3.33336 9.33332C2.89133 9.77534 2.64301 10.3749 2.64301 11C2.64301 11.6251 2.89133 12.2246 3.33336 12.6666C3.77539 13.1087 4.37491 13.357 5.00003 13.357C5.62515 13.357 6.22467 13.1087 6.66669 12.6666L7.00003 12.3333"
                              stroke="#3B82F6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg> */}
                              </div>
                            </td>
                            <td className="pl-24">
                              {/* <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M9.16667 2.5L16.6667 10C17.0911 10.4745 17.0911 11.1922 16.6667 11.6667L11.6667 16.6667C11.1922 17.0911 10.4745 17.0911 10 16.6667L2.5 9.16667V5.83333C2.5 3.99238 3.99238 2.5 5.83333 2.5H9.16667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <circle
                              cx="7.50004"
                              cy="7.49967"
                              r="1.66667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></circle>
                          </svg>
                          <p className="text-sm leading-none text-gray-600 ml-2">
                            {dat?.pri}
                          </p>
                        </div> */}
                            </td>
                            <td className="pl-5">
                              <div className="flex flex-col">
                                <p className="text-[12px] leading-none text-blue-600 ml-2">
                                  {dat?.status}
                                </p>
                                <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                  {dat?.leadUser?.Name}
                                </p>
                                {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M7.5 5H16.6667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M7.5 10H16.6667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M7.5 15H16.6667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M4.16669 5V5.00667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M4.16669 10V10.0067"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M4.16669 15V15.0067"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg> */}
                                <p className="text-sm leading-none text-gray-600 ml-2">
                                  {/* {prettyDateTime(dat['schTime'])} */}
                                </p>
                              </div>
                            </td>
                            <td className="pl-5">
                              <div className="flex flex-row">
                                {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M7.5 5H16.6667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M7.5 10H16.6667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M7.5 15H16.6667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M4.16669 5V5.00667"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M4.16669 10V10.0067"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M4.16669 15V15.0067"
                              stroke="#52525B"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg> */}

                                <button className="py-3 px-3 text-[13px] focus:outline-none leading-none text-red-700 rounded">
                                  {Math.abs(
                                    getDifferenceInMinutes(dat['schTime'], '')
                                  ) > 60
                                    ? Math.abs(
                                        getDifferenceInMinutes(
                                          dat['schTime'],
                                          ''
                                        )
                                      ) > 1440
                                      ? `${getDifferenceInDays(
                                          dat['schTime'],
                                          ''
                                        )} Days `
                                      : `${getDifferenceInHours(
                                          dat['schTime'],
                                          ''
                                        )} Hours `
                                    : `${getDifferenceInMinutes(
                                        dat['schTime'],
                                        ''
                                      )} Min`}
                                  {getDifferenceInMinutes(dat['schTime'], '') <
                                  0
                                    ? 'Due'
                                    : 'Left'}
                                  <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                    {prettyDateTime(dat['schTime'])}
                                  </p>
                                </button>
                              </div>
                            </td>
                            {/* <td className="pl-4">

                          <span className="ml-4 px-4 py-[4px] inline-flex text-xs leading-5 font-semibold rounded-full  text-green-800">
                            {dat?.sts}
                          </span>
                        </td> */}
                            {/* <td>
                        <div className="relative px-1">
                          <button
                            className="focus:ring-2 rounded-md focus:outline-none"
                            role="button"
                            aria-label="option"
                          >
                            <ArrowNarrowRightIcon className="w-4 h-4 inline text-[#058527]" />

                          </button>
                          <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden">
                            <div className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white">
                              <p>Edit</p>
                            </div>
                            <div className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white">
                              <p>Delete</p>
                            </div>
                          </div>
                        </div>
                      </td> */}
                          </tr>
                        ))
                    }

                    <tr className="h-3"></tr>
                  </tbody>
                </table>
              </div>
            )}
            {['personal_tasks'].includes(isClicked) &&
              personalData_D?.length > 0 && (
                <div className="overflow-x-auto mt-2 rounded-xl">
                  <table className="w-full whitespace-nowrap">
                    <thead className="">
                      <tr className="tabHeader">
                        <th className="text-left pl-[1rem]">
                          {' '}
                          <span className="headTxt" tabIndex="0" role="button">
                            S.no{' '}
                          </span>
                        </th>
                        <th className="text-left">
                          {' '}
                          <span
                            className="max-w-[300px] headTxt"
                            tabIndex="0"
                            role="button"
                          >
                            Task{' '}
                          </span>
                        </th>
                        <th>
                          {' '}
                          <span
                            className="text-left headTxt"
                            tabIndex="0"
                            role="button"
                          >
                            Created By
                          </span>
                        </th>
                        <th className="pl-6 text-left headTxt">
                          {' '}
                          <span tabIndex="0" role="button">
                            Status{' '}
                          </span>
                        </th>
                        <th className=" text-left pl-[3rem] headTxt">
                          {' '}
                          <span className="" tabIndex="0" role="button">
                            Deadline{' '}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {personalData_D?.map((dat, i) => (
                        <tr
                          tabIndex={0}
                          className="focus:outline-none h-16 border border-gray-100 rounded"
                          key={i}
                          onClick={() => {
                            selTaskManObjF(dat)
                          }}
                        >
                          <td>
                            <div className="ml-5">
                              <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center relative">
                                {i + 1}
                              </div>
                            </div>
                          </td>
                          <td className=" max-w-[300px]">
                            <div className="flex items-center ">
                              <div className="flex flex-col">
                                <span className="relative flex flex-col  group">
                                  <div
                                    className="absolute bottom-0 flex-col items-center hidden mb-4 group-hover:flex"
                                    // style={{  width: '300px' }}
                                    style={{ zIndex: '9' }}
                                  >
                                    <span
                                      className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                      style={{
                                        color: 'black',
                                        background: '#e2c062',
                                        wordWrap: 'break-word',
                                        // maxWidth: '400px',
                                      }}
                                    >
                                      <p
                                        className="break-words"
                                        style={{ wordWrap: 'break-word' }}
                                      >
                                        {dat?.title}
                                      </p>
                                    </span>
                                    <div
                                      className="w-3 h-3  -mt-2 rotate-45 bg-black"
                                      style={{
                                        background: '#e2c062',
                                        marginRight: '12px',
                                      }}
                                    ></div>
                                  </div>
                                  <p className="text-base max-w-[350px] text-[13px] overflow-ellipsis overflow-hidden font-semibold leading-none text-blue-800 mr-2 mt-2">
                                    {dat?.title}
                                  </p>
                                </span>
                                <span className="relative flex flex-col  group">
                                  {dat?.comments?.length > 0 && (
                                    <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px] max-w-[300px] min-w-[300px] overflow-ellipsis overflow-hidden   rounded-full   mb-1 mr-2  ">
                                      {dat?.comments[0]?.msg}
                                    </p>
                                  )}
                                  <div
                                    className="absolute top-0 flex-col items-center hidden mt-6 group-hover:flex"
                                    // style={{  width: '300px' }}
                                    style={{ zIndex: '9' }}
                                  >
                                    <div
                                      className="w-3 h-3 absolute top-1 left-2 -mt-2 mt-2 rotate-45 bg-black"
                                      style={{
                                        background: '#e2c062',
                                        marginRight: '12px',
                                      }}
                                    ></div>
                                    <span
                                      className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                      style={{
                                        color: 'black',
                                        background: '#e2c062',
                                        wordWrap: 'break-word',
                                        // maxWidth: '400px',
                                      }}
                                    >
                                      <p
                                        className="break-words"
                                        style={{ wordWrap: 'break-word' }}
                                      >
                                        {dat?.comments?.length > 0 && (
                                          <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px]    rounded-full   mb-1 mr-2  ">
                                            {dat?.comments[0]?.msg}
                                          </p>
                                        )}
                                      </p>
                                    </span>
                                  </div>
                                </span>
                                <div className="flex flex-row">
                                  <p className="text-[9px]   leading-none  pr-2 text-green-800  mt-[6px]  py-[4px]  rounded-full   mb-1 mr-2  ">
                                    {dat?.priority?.toUpperCase()}
                                  </p>
                                  <section>
                                    <PaperClipIcon className="w-3 h-3 mr-[2px] inline-block text-gray-400 " />
                                  </section>
                                  <p className="text-[9px]  leading-none text-red-800  mt-[6px] font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                    {dat?.attachmentsCount || 0}
                                  </p>
                                  <section>
                                    <UsersIcon className="w-3 h-3 mr-[2px]  inline-block text-gray-400  " />{' '}
                                  </section>
                                  <p className="text-[9px]  leading-none text-red-800  mt-[6px] font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                    {dat?.participantsA?.length || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text">
                            <p className="text-[13px] leading-none text-[#212b36] ">
                              {dat?.by_name}
                            </p>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-col">
                              <span
                                className={`text-[12px] leading-none text-blue-600 ml-2 ${
                                  dat?.status == 'Done' ? 'text-green-600 ' : ''
                                } `}
                              >
                                {dat?.status}
                              </span>
                              <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                {dat?.to_name}
                              </p>

                              <p className="text-sm leading-none text-gray-600 ml-2">
                                {/* {prettyDateTime(dat['schTime'])} */}
                              </p>
                            </div>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-row">
                              <button className="py-3 px-3 text-[13px] focus:outline-none leading-none text-red-700 rounded">
                                {dat?.status != 'Done' && (
                                  <span>
                                    {' '}
                                    {Math.abs(
                                      getDifferenceInMinutes(
                                        dat['due_date'],
                                        ''
                                      )
                                    ) > 60
                                      ? Math.abs(
                                          getDifferenceInMinutes(
                                            dat['due_date'],
                                            ''
                                          )
                                        ) > 1440
                                        ? `${getDifferenceInDays(
                                            dat['due_date'],
                                            ''
                                          )} Days `
                                        : `${getDifferenceInHours(
                                            dat['due_date'],
                                            ''
                                          )} Hours `
                                      : `${getDifferenceInMinutes(
                                          dat['due_date'],
                                          ''
                                        )} Min`}
                                    {getDifferenceInMinutes(
                                      dat['due_date'],
                                      ''
                                    ) < 0
                                      ? 'Due'
                                      : 'Left'}
                                  </span>
                                )}
                                {dat?.status == 'Done' && (
                                  <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                    {prettyDateTime(dat['closedOn'])}
                                  </p>
                                )}
                                <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                  {prettyDateTime(dat['due_date'])}
                                </p>
                              </button>
                            </div>
                          </td>
                          {/* <td className="pl-4">

                          <span className="ml-4 px-4 py-[4px] inline-flex text-xs leading-5 font-semibold rounded-full  text-green-800">
                            {dat?.sts}
                          </span>
                        </td> */}
                          {/* <td>
                        <div className="relative px-1">
                          <button
                            className="focus:ring-2 rounded-md focus:outline-none"
                            role="button"
                            aria-label="option"
                          >
                            <ArrowNarrowRightIcon className="w-4 h-4 inline text-[#058527]" />

                          </button>
                          <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden">
                            <div className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white">
                              <p>Edit</p>
                            </div>
                            <div className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white">
                              <p>Delete</p>
                            </div>
                          </div>
                        </div>
                      </td> */}
                        </tr>
                      ))}

                      <tr className="h-3"></tr>
                    </tbody>
                  </table>
                </div>
              )}
            {['business_tasks'].includes(isClicked) &&
              businessSection_D.length > 0 && (
                <div className="overflow-x-auto mt-2 rounded-xl">
                  <table className="w-full whitespace-nowrap">
                    <thead className="">
                      <tr className="tabHeader">
                        <th className="text-left pl-[1rem]">
                          {' '}
                          <span className="headTxt" tabIndex="0" role="button">
                            S.no {businessSection_D.length}
                          </span>
                        </th>
                        <th className="text-left">
                          {' '}
                          <span
                            className="max-w-[300px] headTxt"
                            tabIndex="0"
                            role="button"
                          >
                            Task{' '}
                          </span>
                        </th>
                        <th>
                          {' '}
                          <span
                            className="text-center headTxt px-3"
                            tabIndex="0"
                            role="button"
                          >
                            Project
                          </span>
                        </th>
                        <th className="text-center">
                          {' '}
                          <span
                            className="text-center headTxt px-3 "
                            tabIndex="0"
                            role="button"
                          >
                            Department
                          </span>
                        </th>
                        <th className="text-center">
                          {' '}
                          <span
                            className="text-center headTxt px-3"
                            tabIndex="0"
                            role="button"
                          >
                            Assigned To
                          </span>
                        </th>
                        <th className="text-center">
                          {' '}
                          <span
                            className=" headTxt px-3"
                            tabIndex="0"
                            role="button"
                          >
                            Created By
                          </span>
                        </th>
                        <th className=" text-left pl-[3rem] headTxt">
                          {' '}
                          <span className="" tabIndex="0" role="button">
                            Deadline{' '}
                          </span>
                        </th>{' '}
                        <th className=" text-left pl-[3rem] headTxt">
                          {' '}
                          <span className="" tabIndex="0" role="button">
                            Priority{' '}
                          </span>
                        </th>
                        <th className="pl-6 text-center headTxt">
                          {' '}
                          <span tabIndex="0" role="button">
                            Status{' '}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessSection_D?.map((dat, i) => (
                        <tr
                          tabIndex={0}
                          className="focus:outline-none h-16 border border-gray-100 rounded"
                          key={i}
                          onClick={() => {
                            selTaskManObjF(dat)
                          }}
                        >
                          <td>
                            <div className="ml-5">
                              <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center relative">
                                {i + 1}
                              </div>
                            </div>
                          </td>
                          <td className=" max-w-[300px]">
                            <div className="flex items-center ">
                              <div className="flex flex-col">
                                <span className="relative flex flex-col  group">
                                  <div
                                    className="absolute bottom-0 flex-col items-center hidden mb-4 group-hover:flex"
                                    // style={{  width: '300px' }}
                                    style={{ zIndex: '9' }}
                                  >
                                    <span
                                      className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                      style={{
                                        color: 'black',
                                        background: '#e2c062',
                                        wordWrap: 'break-word',
                                        // maxWidth: '400px',
                                      }}
                                    >
                                      <p
                                        className="break-words"
                                        style={{ wordWrap: 'break-word' }}
                                      >
                                        {dat?.title}
                                      </p>
                                    </span>
                                    <div
                                      className="w-3 h-3  -mt-2 rotate-45 bg-black"
                                      style={{
                                        background: '#e2c062',
                                        marginRight: '12px',
                                      }}
                                    ></div>
                                  </div>
                                  <p className=" max-w-[300px] text-[12px] overflow-ellipsis overflow-hidden font-semibold leading-none text-blue-800 mr-2 mt-2">
                                    {dat?.title}
                                  </p>
                                </span>
                                <span className="relative flex flex-col  group">
                                  {dat?.comments?.length > 0 && (
                                    <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px] max-w-[300px] min-w-[300px] overflow-ellipsis overflow-hidden   rounded-full   mb-1 mr-2  ">
                                      {dat?.comments[0]?.msg}
                                    </p>
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text px-3 text-center">
                            <p className="text-[13px] leading-none text-[#212b36]">
                              {dat?.projectName}
                            </p>
                          </td>{' '}
                          <td className="text px-3 text-center">
                            <p className="text-[13px] leading-none text-[#212b36]">
                              {dat?.category}
                            </p>
                          </td>{' '}
                          <td className="text px-3 text-center">
                            <p className="text-[13px] leading-none text-[#212b36]">
                              {dat?.to_name}
                            </p>
                          </td>
                          <td className="text px-3 text-center">
                            <p className="text-[13px] leading-none text-[#212b36]">
                              {dat?.by_name}
                            </p>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-row">
                              <button className="py-3 px-3 text-[13px] focus:outline-none leading-none  rounded">
                                <p className="text-[11px] leading-none  ml-2 mt-2">
                                  {prettyDateTime(dat['due_date'])}
                                </p>
                                {dat?.status != 'Done' && (
                                  <span className="text-[10px] leading-none text-green-600 ml-2 mt-2">
                                    {' '}
                                    {Math.abs(
                                      getDifferenceInMinutes(
                                        dat['due_date'],
                                        ''
                                      )
                                    ) > 60
                                      ? Math.abs(
                                          getDifferenceInMinutes(
                                            dat['due_date'],
                                            ''
                                          )
                                        ) > 1440
                                        ? `${getDifferenceInDays(
                                            dat['due_date'],
                                            ''
                                          )} Days `
                                        : `${getDifferenceInHours(
                                            dat['due_date'],
                                            ''
                                          )} Hours `
                                      : `${getDifferenceInMinutes(
                                          dat['due_date'],
                                          ''
                                        )} Min`}
                                    {getDifferenceInMinutes(
                                      dat['due_date'],
                                      ''
                                    ) < 0
                                      ? 'Due'
                                      : 'Left'}
                                  </span>
                                )}
                                {dat?.status == 'Done' && (
                                  <p className="text-[10px] leading-none text-green-600 ml-2 mt-2">
                                    {prettyDateTime(dat['closedOn'])}
                                  </p>
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-row ">
                              <p className="text-[9px]   leading-none  pr-2   py-[4px]  rounded-full   mb-1 mr-2  ">
                                {dat?.priority?.toUpperCase()}
                              </p>
                              <section>
                                <PaperClipIcon className="w-3 h-3 mr-[2px] inline-block text-gray-400 mb-[10px]" />
                              </section>
                              <p className="text-[9px]  leading-none  font-sanF  py-[4px]  rounded-full   mb-1 mr-2  ">
                                {dat?.attachmentsCount || 0}
                              </p>
                              <section>
                                <UsersIcon className="w-3 h-3 mr-[2px]  inline-block text-gray-400 mb-[10px]  " />{' '}
                              </section>
                              <p className="text-[11px]  leading-none mt-[0px] ml-[2px]  font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                {dat?.participantsA?.length || 0}
                              </p>
                            </div>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-col">
                              <span
                                className={`text-[12px] leading-none  ml-2 ${
                                  dat?.status == 'Done' ? 'text-green-600 ' : ''
                                } `}
                              >
                                {dat?.status}
                              </span>

                              <p className="text-sm leading-none text-gray-600 ml-2"></p>
                            </div>
                          </td>
                        </tr>
                      ))}

                      <tr className="h-3"></tr>
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
        {/* <script src="./index.js"></script>
        <style>.checkbox:checked + .check-icon {
  display: flex;
}
</style>
        <script>function dropdownFunction(element) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                let list = element.parentElement.parentElement.getElementsByClassName("dropdown-content")[0];
                list.classList.add("target");
                for (i = 0; i < dropdowns.length; i++) {
                    if (!dropdowns[i].classList.contains("target")) {
                        dropdowns[i].classList.add("hidden");
                    }
                }
                list.classList.toggle("hidden");
            }</script> */}

        {/* <Card
        sx={{
          boxShadow: 4,
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">

              <ul
                className="flex flex-wrap -mb-px "
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                {tabHeadFieldsA.map((d, i) => {
                  return (
                    <li key={i} className="mr-2" role="presentation">
                      <button
                        className={`inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2  hover:text-gray-600 hover:border-blue-600 dark:text-gray-400 dark:hover:text-gray-300  ${
                          value === d.val
                            ? 'border-blue-600 text-gray-800'
                            : 'border-transparent'
                        }`}
                        type="button"
                        role="tab"
                        onClick={() => setValue(d.val)}
                      >
                        {`${d.lab} `}
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {rowsCounter(leadsFetchedData, d.val).length}
                        </span>

                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

          </Grid>
        </Grid>
      </Card> */}
      </Box>
      <SiderForm
        open={isImportLeadsOpen1}
        setOpen={setisImportLeadsOpen1}
        title={'Add Task'}
        // customerDetails={selUserProfile}
        widthClass="max-w-lg"
      />
    </>
  )
}

export default TodoListView

// {todaySch && schFetData.length > 0 && (
//   <TodoListView
//     taskListA={schFetCleanData}
//     setisImportLeadsOpen={undefined}
//     selUserProfileF={undefined}
//     leadsFetchedData={undefined}
//     leadsTyper={undefined}
//   />
// )}
// const [schFetCleanData, setSchFetCleanData] = React.useState([])
// React.useEffect(() => {
//   if (todaySch) {
//     console.log('my value is ', todaySch)
//     const streamedTodo = []
//     setSchFetData(todaySch)
//     const z = todaySch.map((data1) => {
//       data1['staDA'].map((data2) => {
//         const y = data1[data2]
//         y.uid = data1.uid
//         y.leadUser = data1.leadUser
//         streamedTodo.push(y)
//         console.log('my value is 1', y)
//         return y
//       })
//     })
//     setSchFetCleanData(streamedTodo)
//     console.log('my value is 1', z, streamedTodo)
//   } else {
//     console.log('my value is ', todaySch)
//   }
// }, [todaySch])
