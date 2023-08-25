/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react'

import {
  PaperClipIcon,
  PlusCircleIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/outline'
import PencilIcon from '@heroicons/react/solid/PencilIcon'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import { startOfDay } from 'date-fns'
import { useSnackbar } from 'notistack'

import { sourceListItems } from 'src/constants/projects'
import {
  deleteBankAccount,
  steamBankDetailsList,
  steamUsersList,
  steamVirtualAccountsList,
  streamGetAllParticipantTasks,
  streamGetAllTaskManTasks,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { supabase } from 'src/context/supabase'
import { sendWhatAppTextSms1 } from 'src/util/axiosWhatAppApi'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  prettyDateTime,
} from 'src/util/dateConverter'
import {
  SlimSelectBox,
  VerySlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'

import SiderForm from '../SiderForm/SiderForm'

import SourceAddTemplate from './SourceAddTemplate'

const ProjectReportsBody = ({ title, pId, data }) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [testPhNo, setTestPhNo] = useState('')
  const [wbSelPayload, setWbSelPayload] = useState({})
  const [selCat, setSelCat] = useState('enquiry_journey_status')
  const [leadsFetchedData, setLeadsFetchedData] = useState([])

  const [tableData, setTableData] = useState([])
  const [businessData_F, setBusinessData_F] = useState([])
  const [businessSection_D, setBusinessSection_D] = useState([])
  const [businessData_Filtered, setBusinessData_Filtered] = useState([])
  const [showSettings, setShowSettings] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [selPriority, setSelPriority] = useState('')
  const [selTaskDispType, setSelTaskDispType] = useState('todo_tasks')
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [showOnlyDone, setShowOnlyDone] = useState(false)
  const [isViewTaskMan, setisViewTaskMan] = useState(false)
  const [selTaskMan, setSelTaskMan] = useState({})

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

  const [selUserId, setSelUserId] = useState(user?.uid)
  const [selUserObj, setSelUserObj] = useState(user)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  // const [leadsFetchedData, setLeadsFetchedData] = useState([])
  useEffect(() => {
    getTasksDataFun()
  }, [showCompletedTasks, showOnlyDone, selUserId])
  useEffect(() => {
    console.log('user is ', user)
  }, [user])

  useEffect(() => {
    getTasksDataFun()

    // Subscribe to real-time changes in the `${orgId}_accounts` table
    const subscription = supabase
      .from(`maahomes_TM_Tasks`)
      .on('*', (payload) => {
        // When a change occurs, update the 'leadLogs' state with the latest data
        console.log('account records', payload)
        // Check if the updated data has the id 12
        const updatedData = payload.new
        const { id } = payload.old
        const updatedLeadLogs = [...businessData_F]
        if (
          updatedData.by_uid === selUserId ||
          updatedData?.to_uid === selUserId ||
          updatedData?.followersUid.includes(selUserId)
        ) {
          if (
            updatedData.by_uid === selUserId &&
            updatedData.to_uid === selUserId
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
          } else {
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
          d.by_uid != selUserId &&
          d.to_uid === selUserId &&
          d.priority?.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setBusinessSection_D(x)
      bootBusinessFun(x)
    } else if (subSection == 'created_by_me') {
      const x = businessData_F.filter(
        (d) =>
          d.by_uid === selUserId &&
          d.to_uid != selUserId &&
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
    selTaskDispType,
    subSection,
    sortType,
    searchText,
    selPriority,
    selUserId,
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
      orgId,
      'snap',
      {
        uid,
        statusVAl: showCompletedTasks,
        showOnlyDone: showOnlyDone,
      },
      (error) => []
    )
    const steamParticipantLogs = await streamGetAllParticipantTasks(
      orgId,
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
        d.by_uid === selUserId &&
        d.to_uid === selUserId &&
        d.title?.toLowerCase().includes(searchText.toLowerCase())
    )
    await setPersonalData_F(x)
    const y = await steamLeadLogs.filter(
      (d) =>
        (d.by_uid != selUserId && d.to_uid === selUserId) ||
        (d.by_uid === selUserId && d.to_uid != selUserId)
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
    //   // (d.by_uid != selUserId && d.to_uid === selUserId) ||
    //   // (d.by_uid === selUserId && d.to_uid != selUserId)
    // )
    const z = await steamParticipantLogs

    await console.log('z o is c ', y)
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
          d.by_uid === selUserId &&
          d.to_uid === selUserId &&
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

  // get list of all employees

  useEffect(() => {
    getLeadsDataFun()
  }, [])
  const getLeadsDataFun = async () => {
    const unsubscribe = steamUsersList(
      orgId,
      async (querySnapshot) => {
        const usersListA = await querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        await usersListA.sort((a, b) => {
          console.log('am it', b)
          return a.name.localeCompare(b.name)
        })
        await setLeadsFetchedData(usersListA)
      },
      () => setLeadsFetchedData([])
    )
    return unsubscribe
  }

  return (
    <>
      <div className="flex overflow-x-auto ml-2 border-b pb-2">
        <section className="mt-4">Templates</section>
        {[
          { label: 'Task Man', value: 'enquiry_journey_status' },
          { label: 'Project Finance', value: 'CRM_status' },
          { label: 'Sale Projections', value: 'Legal_status' },
        ].map((data, i) => {
          return (
            <section
              key={i}
              className="flex  mt-[18px]"
              onClick={() => {
                console.log('am i clicked', data.value)
                setSelCat(data.value)
              }}
            >
              <button>
                <span
                  className={`flex ml-2 items-center h-6 px-3 text-xs  ${
                    selCat === data.value
                      ? 'font-normal text-green-800 bg-[#FFEDEA]'
                      : 'font-normal text-black-100 bg-[#f0f8ff]'
                  }  rounded-full`}
                >
                  {/* <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" /> */}
                  <img alt="" src="/temp2.png" className="h-3 w-3 mr-1" />
                  {data?.label}
                </span>
              </button>
            </section>
          )
        })}
      </div>
      {selCat === 'enquiry_journey_status' && (
        <div className="w-full flex  flex-row">
          <section className="m-2 w-[200px] min-h-[400px]">
            <div className="bg-[#FFEDEA] p-4 px-2 rounded-xl shadow-md shadow-neutral-200 ">
              <h2 className="text-sm font-semibold pb-2 border-b border-grey px-2">
                {'Employees'}
              </h2>
              <span className="text-[10px] ml-2 ">Super User</span>
              {leadsFetchedData
                .filter((d) => d.department == 'admin')
                ?.map((data, i) => (
                  <section
                    key={i}
                    className={` cursor-pointer flex flex-row ${
                      selUserId === data?.uid
                        ? 'bg-red-800 text-white rounded-xl'
                        : ''
                    }`}
                    onClick={() => {
                      console.log('user is ', data)
                      setSelUserObj(data)
                      setSelUserId(data?.uid)
                    }}
                  >
                    <section className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                      <div className="flex flex-row ">
                        <div className="rounded-sm h-5 w-5 mt-2 flex flex-shrink-0 justify-center items-center text-xs relative">
                          {/* {i + 1} */}
                        </div>
                        <div className=" w-7 h-7 mr-2 mt-[5px] rounded-full ">
                          <img src="/avatar_1.png" alt="" className="mr-2" />
                        </div>
                        <div className="flex flex-col">
                          <span className="leading-[19px] font-bold text-[12px]">
                            {data.name}
                          </span>
                          <span className="leading-[12px]">
                            {data?.roles[0]}
                          </span>{' '}
                        </div>
                      </div>
                    </section>
                  </section>
                ))}
              <div className="text-[10px] ml-2 ">Marketing</div>
              {leadsFetchedData
                .filter((d) => d.department == 'marketing')
                ?.map((data, i) => (
                  <section
                    key={i}
                    className={` cursor-pointer flex flex-row ${
                      selUserId === data?.uid
                        ? 'bg-red-800 text-white rounded-xl'
                        : ''
                    }`}
                    onClick={() => {
                      console.log('user is ', data)
                      setSelUserObj(data)
                      setSelUserId(data?.uid)
                    }}
                  >
                    <section className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                      <div className="flex flex-row ">
                        <div className="rounded-sm h-5 w-5 mt-2 flex flex-shrink-0 justify-center items-center text-xs relative">
                          {/* {i + 1} */}
                        </div>
                        <div className=" w-7 h-7 mr-2 mt-[5px] rounded-full ">
                          <img src="/avatar_1.png" alt="" className="mr-2" />
                        </div>
                        <div className="flex flex-col">
                          <span className="leading-[19px] font-bold text-[12px]">
                            {data.name}
                          </span>
                          <span className="leading-[12px]">
                            {data?.roles[0]}
                          </span>{' '}
                        </div>
                      </div>
                    </section>
                  </section>
                ))}
              <div className="text-[10px] ml-2 ">Sales</div>
              {leadsFetchedData
                .filter((d) =>(d.department == 'sales' && d?.roles[0] != 'cp-agent'))
                ?.map((data, i) => (
                  <section
                    key={i}
                    className={` cursor-pointer flex flex-row ${
                      selUserId === data?.uid
                        ? 'bg-red-800 text-white rounded-xl'
                        : ''
                    }`}
                    onClick={() => {
                      console.log('user is ', data)
                      setSelUserObj(data)
                      setSelUserId(data?.uid)
                    }}
                  >
                    <section className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                      <div className="flex flex-row ">
                        <div className="rounded-sm h-5 w-5 mt-2 flex flex-shrink-0 justify-center items-center text-xs relative">
                          {/* {i + 1} */}
                        </div>
                        <div className=" w-7 h-7 mr-2 mt-[5px] rounded-full ">
                          <img src="/avatar_1.png" alt="" className="mr-2" />
                        </div>
                        <div className="flex flex-col">
                          <span className="leading-[19px] font-bold text-[12px]">
                            {data.name}
                          </span>
                          <span className="leading-[12px]">
                            {data?.roles[0]}
                          </span>{' '}
                        </div>
                      </div>
                    </section>
                  </section>
                ))}
              <div className="text-[10px] ml-2 ">Crm</div>
              {leadsFetchedData
                .filter((d) => d.department == 'crm')
                ?.map((data, i) => (
                  <section
                    key={i}
                    className={` cursor-pointer flex flex-row ${
                      selUserId === data?.uid
                        ? 'bg-red-800 text-white rounded-xl'
                        : ''
                    }`}
                    onClick={() => {
                      console.log('user is ', data)
                      setSelUserObj(data)
                      setSelUserId(data?.uid)
                    }}
                  >
                    <section className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                      <div className="flex flex-row ">
                        <div className="rounded-sm h-5 w-5 mt-2 flex flex-shrink-0 justify-center items-center text-xs relative">
                          {i + 1}
                        </div>
                        <div className=" w-7 h-7 mr-2 mt-[5px] rounded-full ">
                          <img src="/avatar_1.png" alt="" className="mr-2" />
                        </div>
                        <div className="flex flex-col">
                          <span className="leading-[19px] font-bold text-[12px]">
                            {data.name}
                          </span>
                          <span className="leading-[12px]">
                            {data?.roles[0]}
                          </span>{' '}
                        </div>
                      </div>
                    </section>
                  </section>
                ))}
            </div>
          </section>

          {/* row 2 */}
          <section className="m-2 mx-0 w-full">
            <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
              <section className="flex flex-row justify-between">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                  {`${selUserObj?.name || selUserObj?.displayName} Tasks`}
                </h2>
                <div className=" mr-2 w-[180px]">
                  <VerySlimSelectBox
                    name="Priority"
                    placeholder="Priority"
                    label=""
                    className="input text-semibold"
                    onChange={(value) => {
                      console.log('sel valu s', value)
                      setSelTaskDispType(value.value)
                      if (value.value === 'only_completed') {
                        setShowOnlyDone(true)
                      } else if (value.value === 'todo_tasks') {
                        setShowOnlyDone(false)
                        setShowCompletedTasks(false)
                      } else {
                        setShowOnlyDone(false)
                        setShowCompletedTasks(true)
                      }
                      // setSelProject(value)
                      // formik.setFieldValue('project', value.value)
                    }}
                    value={selTaskDispType}
                    // options={aquaticCreatures}
                    options={[
                      { label: 'All Tasks', value: '' },
                      { label: 'Incompleted Tasks', value: 'todo_tasks' },
                      { label: 'Completed Tasks', value: 'only_completed' },
                    ]}
                  />
                </div>
              </section>
              {/* <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b">
                    <th></th>
                    <th className="text-left p-[10px] pr-[12px] pl-0 text-xs text-green-800 ">
                      Marketing
                    </th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table> */}
              {((isClicked === 'dept_tasks' && taskListA.length === 0) ||
                (isClicked === 'personal_tasks' &&
                  personalData_D.length === 0) ||
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
                    No Tasks Found for{' '}
                    <span className="text-blue-600">{selUserObj?.name}</span>
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    <span className="text-blue-600">
                      {' '}
                      {selUserObj?.roles?.length > 0
                        ? selUserObj?.roles[0] === 'admin'
                          ? 'Super User'
                          : selUserObj?.roles[0]
                        : selUserObj?.department}
                    </span>
                  </time>
                </div>
              )}
              {['business_tasks'].includes(isClicked) &&
                businessSection_D.length > 0 && (
                  <div className="overflow-x-auto mt-2 rounded-xl">
                    <table className="w-full whitespace-nowrap">
                      <thead className="">
                        <tr className="tabHeader bg-[#FFEDEA]">
                          <th className="text-left pl-[1rem]">
                            {' '}
                            <span
                              className="headTxt"
                              tabIndex="0"
                              role="button"
                            >
                              S.no
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
                        {businessSection_D?.map((dat, i) => (
                          <tr
                            tabIndex={0}
                            className="focus:outline-none h-16 border border-gray-100 rounded"
                            key={i}
                            onClick={() => {
                              setisViewTaskMan(true)
                              setSelTaskMan(dat)
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
                                  <p className="text-base max-w-[350px] text-[13px] overflow-ellipsis overflow-hidden font-semibold leading-5 text-blue-800 mr-2 mt-2">
                                    {dat?.title}
                                  </p>
                                  {dat?.comments?.length > 0 && (
                                    <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px]    rounded-full   mb-1 mr-2  ">
                                      {dat?.comments[0]?.msg}
                                    </p>
                                  )}
                                  <div className="flex flex-row mt-[2px]">
                                    <p className="text-[9px]   leading-none  pr-2 text-green-800 ]  py-[4px]  rounded-full   mb-1 mr-2  mt-[2px] ">
                                      {dat?.priority?.toUpperCase()}
                                    </p>
                                    <section>
                                      <PaperClipIcon className="w-3 h-3 mr-[2px] inline-block text-gray-400 mb-[10px]" />
                                    </section>
                                    <p className="text-[9px]  leading-none text-green-800   font-sanF  py-[4px]  rounded-full   mb-1 mr-4 mt-[1px] font-bold text-[11px] ">
                                      {dat?.attachmentsCount || 0}
                                    </p>
                                    <section>
                                      <UsersIcon className="w-3 h-3 mr-[2px]  inline-block text-gray-400 mb-[10px]  " />{' '}
                                    </section>
                                    <p className="text-[9px]  leading-none text-green-800   font-sanF  py-[4px]  rounded-full   mb-1 mr-4 mt-[1px] font-bold text-[11px]">
                                      {dat?.participantsA?.length || 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text">
                              <p className="text-[13px] leading-none text-[#212b36]">
                                {dat?.by_name}
                              </p>
                            </td>
                            <td className="pl-5">
                              <div className="flex flex-col">
                                <p className="text-[12px] leading-none text-blue-600 ml-2">
                                  {dat?.status}
                                </p>
                                <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                  {dat?.to_name}
                                </p>
                                <p className="text-sm leading-none text-gray-600 ml-2"></p>
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
                                    <p className="text-[11px] leading-none text-green-600 ml-2 mt-2">
                                      {prettyDateTime(dat['closedOn'])}
                                    </p>
                                  )}
                                  <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                    {prettyDateTime(dat['due_date'])}
                                  </p>
                                </button>
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
          </section>
        </div>
      )}

      <SiderForm
        open={isOpenSideView}
        setOpen={setIsOpenSideView}
        title={'Notification Setup'}
        widthClass="max-w-md"
        wbPayload={wbSelPayload}
      />
      <SiderForm
        open={isViewTaskMan}
        setOpen={setisViewTaskMan}
        title={'view_task_man'}
        taskManObj={selTaskMan}
        widthClass="max-w-4xl"
      />
    </>
  )
}

export default ProjectReportsBody
