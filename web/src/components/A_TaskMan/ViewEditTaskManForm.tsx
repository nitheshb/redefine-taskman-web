/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, Fragment } from 'react'

import { Dialog, Listbox, Transition } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone'
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone'
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'
import ScheduleSendTwoToneIcon from '@mui/icons-material/ScheduleSendTwoTone'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import { setHours, setMinutes } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { Form, Formik } from 'formik'
import DatePicker from 'react-datepicker'
import NumberFormat from 'react-number-format'
import Select from 'react-select'
import * as Yup from 'yup'

import { Label, InputField, TextAreaField, FieldError } from '@redwoodjs/forms'
import { useRouterStateSetter } from '@redwoodjs/router/dist/router-context'

import {
  AddCommentTaskManData,
  CompleteTaskManData,
  addLead,
  addTaskBusiness,
  checkIfLeadAlreadyExists,
  editTaskManData,
  getAllProjects,
  steamUsersListByRole,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  sendWhatAppMediaSms,
  sendWhatAppTextSms,
} from 'src/util/axiosWhatAppApi'
import { PhoneNoField } from 'src/util/formFields/phNoField'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'
import { TextField } from 'src/util/formFields/TextField'
import { TextField2 } from 'src/util/formFields/TextField2'

const customStyles = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 25,
    padding: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    alignItems: 'initial',
    paddingTop: 0,
    padding: 0,
    paddingLeft: 5,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 5,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    marginTop: 4,
    marginBottom: 8,
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: 14,
    marginTop: 3,
  }),
  menu: (provided) => ({ ...provided, marginTop: 0, zIndex: 9999 }),
}
import Loader from '../Loader/Loader'

import { prettyDateTime } from 'src/util/dateConverter'

import { formatFileSize } from 'react-papaparse'

import { domainToASCII } from 'url'
const people = [
  { name: 'Priority 1' },
  { name: 'Priority 2' },
  { name: 'Priority 3' },
  { name: 'Priority 4' },
]
const ViewEditTaskManForm = ({ title, dialogOpen, taskManObj }) => {
  const { user } = useAuth()
  const { orgId } = user
  const d = new window.Date()
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [myTaskObj, setMyTaskObj] = useState([])
  const [startDate, setStartDate] = useState(setHours(setMinutes(d, 30), 16))
  const [selected1, setSelected1] = useState(people[0])
  const [showEditTask, selShowEditTask] = useState(false)
  const [addCommentTitle, setAddCommentTitle] = useState('')
  const [addCommentPlusTask, setAddCommentPlusTask] = useState(false)
  const [closeTask, setCloseTask] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(usersListA)
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA)

        setusersList(usersListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])
  useEffect(() => {
    setMyTaskObj(taskManObj?.comments || [])
  }, [taskManObj])

  useEffect(() => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(projectsListA)
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        console.log('fetched users list is', projectsListA)
        setprojectList(projectsListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])

  const [takTitle, setTakTitle] = useState('')

  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})

  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const onSubmitFun = async (data, resetForm) => {
    console.log('edit task and button', taskManObj)
    data.id = taskManObj.id
    await editTaskManData(orgId, data, user)
    await setFormMessage('Task Created..!')

    return
    data.due_date = startDate.getTime()
    setLoading(true)
    await addTaskBusiness(orgId, data, user)

    await resetForm()
    await setFormMessage('Saved Successfully..!')
    await setLoading(false)
    return
  }
  useEffect(() => {
    console.log('selcted taskmANOBJ IS', taskManObj)
    setStartDate(taskManObj?.due_date)
  }, [])

  const validate = Yup.object({
    name: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Name is Required'),
    // lastName: Yup.string()
    //   .max(20, 'Must be 20 characters or less')
    //   .required('Required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),

    // password: Yup.string()
    //   .min(6, 'Password must be at least 6 charaters')
    //   .required('Password is required'),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref('password'), null], 'Password must match')
    //   .required('Confirm password is required'),
    // mobileNo
    mobileNo: Yup.string()
      .required('Phone number is required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),

    // deptVal: Yup.string()
    //   // .oneOf(['Admin', 'CRM'], 'Required Dept')
    //   .required('Req Dept'),
    // myRole: Yup.string()
    //   //  .oneOf(['Admin', 'CRM'], 'DEPT IS REQ')
    //   .required('Required Role'),
  })
  const resetter = () => {
    setSelected({})
    setFormMessage('')
  }
  const setTitleFun = (e) => {
    console.log('title value is', e.target.value)
    setTakTitle(e.target.value)
  }
  return (
    <div className="h-full flex flex-col pb-6 bg-white shadow-xl overflow-y-scroll">
      {/* <div className="px-4 sm:px-6  z-10 flex items-center justify-between">
        <Dialog.Title className=" font-semibold text-xl mr-auto ml-3 text-[#053219]">
          {title}
        </Dialog.Title>
      </div> */}
      <div className="bg-gradient-to-r from-blue-200 to-cyan-200">
        <section className="flex flex-row mx-4 py-4">
          <span className="ml-2 mt-[1px] ">
            <label className="font-semibold text-[#053219]  text-[18px]  mb-1  ">
              {'Task'} 🍉
              <abbr title="required"></abbr>
            </label>
          </span>
        </section>
      </div>

      {!showEditTask && (
        <div className="py-3 px-3 m-4 mt-2 rounded-lg border border-gray-100 ">
          <section className="flex flex-col justify-between">

            <div
              className={`${
                taskManObj?.status === 'Done'
                  ? 'cursor-not-allowed '
                  : 'cursor-pointer'
              }  mt-1 block w-full`}
              onClick={() => {}}
            >
              <label className="inline-flex items-center">
                {taskManObj?.status != 'Done' && (
                  <span
                    className="px-[2px] py-[2px]  rounded-full border border-2 cursor-pointer text-[#cdcdcd] hover:text-green-800 hover:border-green-700 hover:bg-green-100"
                    // onClick={() => doneFun(data)}
                    // onClick={() => closeTaskFun(data)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2 w-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
                {taskManObj?.status === 'Done' && (
                  <CheckCircleIcon className="w-4 h-4 inline text-[#058527]" />
                )}
                <div
                  className={`${
                    taskManObj?.status === 'Done'
                      ? 'line-through'
                      : 'cursor-pointer'
                  }  ml-2 text-[14px] inline font-bodyLato font-brand tracking-wider text-[#0091ae]`}
                  onClick={() => {
                    // if (taskManObj?.status === 'InProgress') {
                    //   setAddTaskCommentObj(data)
                    // }
                  }}
                >
                  <span className="block pb-[3px]">{taskManObj?.title}</span>
                </div>
              </label>
            </div>
            <section className="flex flex-row justify-between pb-3 border-b border-gray-200 ml-1 mb-1">
              <span className="text-[#7e92a2] ml-1 text-[13px]">
                {' '}
                {/* <svg
                viewBox="0 0 12 12"
                className="notes_icon inline w-2 h-2 mr-1"
                aria-label="2 comments"
              >
                <g fill="none" fillRule="evenodd">
                  <path
                    fill="currentColor"
                    fillRule="nonzero"
                    d="M9.5 1A1.5 1.5 0 0 1 11 2.5v5A1.5 1.5 0 0 1 9.5 9H7.249L5.28 10.97A.75.75 0 0 1 4 10.44V9H2.5A1.5 1.5 0 0 1 1 7.5v-5A1.5 1.5 0 0 1 2.5 1h7zm0 1h-7a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5H5v1.836L6.835 8H9.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"
                  ></path>
                </g>
              </svg>{' '} */}
                <span className="ml-4">{taskManObj?.desc}</span>
              </span>
              <span> {/* {prettyDateTime(commentObj?.t)} */}</span>
            </section>
            <section className="flex flex-row ml-1 mt-3 justify-between">
            <div className="relative flex flex-col  group">
                <div
                  className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
                  // style="z-index: 9999;"
                >

                  <div
                    className="w-3 h-3  -mt-2 rotate-45 bg-black"
                    // style="background: rgb(226, 192, 98); margin-right: 12px;"
                  ></div>
                </div>
                <span className="font-thin text-violet-800   font-bodyLato text-[12px] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className="inline mr-1"
                  >
                    <path
                      d="M9.357 1C10.264 1 11 1.736 11 2.643V6.07c0 .436-.173.854-.481 1.162L7.232 10.52a1.643 1.643 0 01-2.323 0L1.48 7.09c-.64-.64-.64-1.68.001-2.322L4.768 1.48C5.076 1.173 5.494 1 5.93 1h3.427zm-.07.91H5.93a.805.805 0 00-.569.235L2.145 5.362a.805.805 0 000 1.138L5.5 9.855a.805.805 0 001.138 0l3.217-3.217a.805.805 0 00.236-.569V2.713a.804.804 0 00-.804-.804zM7.364 3.726a.91.91 0 110 1.818.91.91 0 010-1.818z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>

                  <span className="text mr-1 text-violet-800">To:</span>
                  {taskManObj?.to_email}
                </span>
              </div>
              <span className="text-xs font-bodyLato  font-normal text-[#b03d32] text-gray-500  ">
                <div className="flex flex-row">
                  <div className="relative flex flex-col  group">

                    <span className="font-bodyLato flex flex-row text-violet-900">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="calendar_icon inline mr-1 mt-[2px]"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.5 1h-7A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7A1.5 1.5 0 0011 9.5v-7A1.5 1.5 0 009.5 1zM2 2.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7zM8.75 8a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM3.5 4a.5.5 0 000 1h5a.5.5 0 000-1h-5z"
                          fill="currentColor"
                        ></path>
                      </svg>

                      <span className="italic">{taskManObj?.priority} </span>
                    </span>
                  </div>
                </div>
              </span>

            </section>
            <section className="flex flex-row ml-1 mt-2 justify-between pb-4 border-b border-gray-200">
            <div className="relative flex flex-col  group">
                <div
                  className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
                  // style="z-index: 9999;"
                >

                  <div
                    className="w-3 h-3  -mt-2 rotate-45 bg-black"
                    // style="background: rgb(226, 192, 98); margin-right: 12px;"
                  ></div>
                </div>
                <span className="font-thin text-[#867777]   font-bodyLato text-[12px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className="inline mr-1"
                  >
                    <path
                      d="M9.357 1C10.264 1 11 1.736 11 2.643V6.07c0 .436-.173.854-.481 1.162L7.232 10.52a1.643 1.643 0 01-2.323 0L1.48 7.09c-.64-.64-.64-1.68.001-2.322L4.768 1.48C5.076 1.173 5.494 1 5.93 1h3.427zm-.07.91H5.93a.805.805 0 00-.569.235L2.145 5.362a.805.805 0 000 1.138L5.5 9.855a.805.805 0 001.138 0l3.217-3.217a.805.805 0 00.236-.569V2.713a.804.804 0 00-.804-.804zM7.364 3.726a.91.91 0 110 1.818.91.91 0 010-1.818z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text mr-1 text-gray-700">By:</span>
                  {taskManObj?.by_email}
                </span>
              </div>
              <span className="text-xs font-bodyLato  font-normal text-[#b03d32] text-gray-500  ">
                <div className="flex flex-row">
                  <div className="relative flex flex-col  group">

                    <span className="font-bodyLato flex flex-row text-violet-900">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="calendar_icon inline mr-1 mt-[2px]"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.5 1h-7A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7A1.5 1.5 0 0011 9.5v-7A1.5 1.5 0 009.5 1zM2 2.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7zM8.75 8a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM3.5 4a.5.5 0 000 1h5a.5.5 0 000-1h-5z"
                          fill="currentColor"
                        ></path>
                      </svg>

                      <span className="italic">{prettyDateTime(taskManObj?.due_date)} </span>
                    </span>
                  </div>
                </div>
              </span>

            </section>
            <section className="mt-4 ml-2 w-full flex flex-row min-h-[36px]">
              <input
                // onChange={setTakTitle()}
                // autoFocus
                name="commentTitle"
                type="text"
                value={addCommentTitle}
                onChange={(e) => {
                  console.log('any error ', e, e.target.value)

                  // if (e.target.value === '') {
                  //   setClicked(false)
                  //   setHover(true)
                  // }
                  setAddCommentTitle(e.target.value)
                }}
                placeholder="Type Comment"
                className={`w-full  pb-1 pt-1 outline-none text-sm font-bodyLato focus:border-blue-600 hover:border-blue-600  border-b border-[#cdcdcd]${
                  true ? ' text-[33475b] ' : ' text-[33475b]'
                } bg-white`}
              ></input>

              {!addCommentPlusTask && (
                <button
                  type="submit"
                  onClick={() => {
                    if (
                      addCommentTitle === 'undefined' ||
                      addCommentTitle === ''
                    ) {
                      // cancelResetStatusFun()
                      setError(true)
                    }
                    if (
                      !error &&
                      !(
                        addCommentTitle === 'undefined' ||
                        addCommentTitle === ''
                      )
                    ) {
                      // addTaskCommentFun(data)
                      // addCommentTitle
                      const x = [
                        {
                          typ: 'text',
                          msg: addCommentTitle,
                          by: user?.displayName,
                          T: Timestamp.now().toMillis(),
                        },
                      ]
                      const newCommentA = [...x, ...(myTaskObj || [])]
                      const dta = taskManObj
                      setMyTaskObj(newCommentA)
                      dta.comments = newCommentA
                      AddCommentTaskManData(orgId, dta, user)
                      setAddCommentTitle('')
                    }
                  }}
                  className={`flex mt-2 ml-4 cursor-pointer rounded-xs text-bodyLato items-center  pl-1 h-[28px] pr-1 rounded py-1 text-xs font-medium  ${
                    addCommentTitle === 'undefined' || addCommentTitle === ''
                      ? ''
                      : 'bg-[#21C55D]'
                  }  `}
                >
                  <span className="text-md">
                    {/* {(addCommentTitle === 'undefined' ||
                      addCommentTitle === '') && <CloseTwoToneIcon />} */}
                    {!closeTask &&
                      !addCommentPlusTask &&
                      !(
                        addCommentTitle === 'undefined' ||
                        addCommentTitle === ''
                      ) && <SendTwoToneIcon />}{' '}
                    {closeTask &&
                      !(
                        addCommentTitle === 'undefined' ||
                        addCommentTitle === ''
                      ) && <CheckTwoToneIcon />}
                    {/* {closeTask && (
                <span className="text-[#4b4a4a]">Close This Task </span>
              )}{' '}
              {addCommentPlusTask && (
                <>
                  & <span className="text-[#4b4a4a]">Create New Task</span>
                </>
              )} */}
                  </span>
                </button>
              )}
            </section>

            <ol className="relative border-gray-200 ">
              {myTaskObj?.map((commentObj, k) => {
                return (
                  <li
                    key={k}
                    className={`ml-2 mt-4 text-[13px] text-[#7E92A2] tracking-wide ${
                      myTaskObj?.length - 1 === k ? 'mb-1' : ''
                    }`}
                  >
                    <section className="flex flex-row justify-between">
                      <span className="text-[12px] font-semibold text-violet-900">
                        {' '}
                        <svg
                          viewBox="0 0 12 12"
                          className="notes_icon inline w-3 h-3 mr-1 "
                          aria-label="2 comments"
                        >
                          <g fill="none" fillRule="evenodd">
                            <path
                              fill="currentColor"
                              fillRule="nonzero"
                              d="M9.5 1A1.5 1.5 0 0 1 11 2.5v5A1.5 1.5 0 0 1 9.5 9H7.249L5.28 10.97A.75.75 0 0 1 4 10.44V9H2.5A1.5 1.5 0 0 1 1 7.5v-5A1.5 1.5 0 0 1 2.5 1h7zm0 1h-7a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5H5v1.836L6.835 8H9.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"
                            ></path>
                          </g>
                        </svg>{' '}
                        {commentObj?.msg}
                      </span>
                    </section>
                    <section className="flex flex-row justify-between border-b border-gray-100 ml-5">
                      <span className="font-thin text-[#867777]   font-bodyLato text-[12px]  ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="8"
                          viewBox="0 0 12 12"
                          className="inline mr-1"
                        >
                          <path
                            d="M9.357 1C10.264 1 11 1.736 11 2.643V6.07c0 .436-.173.854-.481 1.162L7.232 10.52a1.643 1.643 0 01-2.323 0L1.48 7.09c-.64-.64-.64-1.68.001-2.322L4.768 1.48C5.076 1.173 5.494 1 5.93 1h3.427zm-.07.91H5.93a.805.805 0 00-.569.235L2.145 5.362a.805.805 0 000 1.138L5.5 9.855a.805.805 0 001.138 0l3.217-3.217a.805.805 0 00.236-.569V2.713a.804.804 0 00-.804-.804zM7.364 3.726a.91.91 0 110 1.818.91.91 0 010-1.818z"
                            fill="currentColor"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                        {commentObj?.by}
                      </span>
                      <span className="text-[8px] text-orange-700">
                        {' '}
                        {prettyDateTime(commentObj?.T)}
                      </span>
                    </section>
                  </li>
                )
              })}
            </ol>
          </section>



          <div className="my-2  grid grid-cols-2 mt-4 border-t border-[#e5e7f8]">
            <button
              className="mb-2 md:mb-0 mr-2 hover:scale-110 focus:outline-none              hover:bg-green-100


                                  h-8
                                  border duration-200 ease-in-out
                                  border-green-700 transition
                                   px-5  text-sm shadow-sm font-medium tracking-wider text-black rounded-sm hover:shadow-lg hover:bg-green-500"
              onClick={() => {
                selShowEditTask(!showEditTask)
              }}
              // disabled={loading}
            >
              Edit
            </button>
            <button
              className="mb-2 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-green-700
                                  bg-green-700
                                  text-teal-100
                                  h-8
                                  border duration-200 ease-in-out
                                  border-green-700 transition
                                   px-5  text-sm shadow-sm font-medium tracking-wider text-white rounded-sm hover:shadow-lg hover:bg-green-500"
              onClick={() => {
                // setActionMode('unitBookingMode')
                CompleteTaskManData(orgId, taskManObj, user)
              }}
              // disabled={loading}
            >
              Done Task
            </button>
          </div>
        </div>
      )}

      {showEditTask && (
        <div className="grid  gap-8 grid-cols-1">
          <div className="flex flex-col  rounded-lg bg-white  ">
            <div className="mt-0">
              {/* new one */}
              <Formik
                enableReinitialize={true}
                initialValues={{
                  taskTitle: taskManObj?.title || '',
                  taskdesc: taskManObj?.desc || '',
                  assignedTo: taskManObj?.to_uid || '',
                  assignedToObj:
                    {
                      uid: taskManObj?.to_uid,
                      email: taskManObj?.to_email,
                      name: taskManObj?.to_name,
                    } || {},
                  followers: [],
                  priorities: taskManObj?.priority || '',
                  file: '',
                }}
                // validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  console.log('ami submitted', values)
                  console.log('ami submitted 1', values.assignedTo === '')
                  onSubmitFun(values, resetForm)
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="mt-">
                      <div className="flex flex-col pt-0 my-10 mx-4 mt-[10px] rounded ">
                        <div className="  outline-none">
                          {/* <textarea
                        // onChange={setTakTitle()}
                        value={takTitle}
                        onChange={(e) => setTitleFun(e)}
                        placeholder="Task Title"
                        className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded  "
                      ></textarea> */}
                          <section className="mt-1 px-4 rounded-lg bg-white border border-gray-100  ">
                            <section className="flex flex-row justify-between  pt-2 mb-2 h-[34px]">
                              <div className="flex flex-row">
                                <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>
                                <span className="ml-1 leading-[15px] ">
                                  <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                    Task Details<abbr title="required"></abbr>
                                  </label>
                                </span>
                              </div>
                              {formMessage === 'Task Created..!' && (
                                <p className=" flex text-md text-slate-800 ">
                                  <img
                                    className="w-[18px] h-[18px] inline mr-2"
                                    alt=""
                                    src="/ok.gif"
                                  />
                                  <span className="mt-[.2px] text-[12px]">
                                    {formMessage}
                                  </span>
                                </p>
                              )}
                            </section>

                            <div className=" space-y-2 w-full text-xs mt-4">
                              <TextField
                                label="Task Title*"
                                name="taskTitle"
                                type="text"
                              />
                            </div>
                            <div className=" space-y-2 w-full text-xs mt-3">
                              <TextField
                                label="Task Description"
                                name="taskdesc"
                                onChange={formik.handleChange}
                                type="text"
                              />
                            </div>
                            <div className="w-full flex flex-col mt-3">
                              <CustomSelect
                                name="assignedTo"
                                label="Assigned To*"
                                className="input mt-"
                                onChange={(value) => {
                                  formik.setFieldValue(
                                    'assignedTo',
                                    value.value
                                  )
                                  console.log(
                                    'sele value si ',
                                    value.value,
                                    taskManObj?.to_name
                                  )
                                  formik.setFieldValue('assignedToObj', value)
                                }}
                                value={formik.values.assignedTo}
                                // options={aquaticCreatures}
                                options={usersList}
                              />

                              <p
                                className="text-sm text-red-500 hidden mt-3"
                                id="error"
                              >
                                Please fill out this field.
                              </p>
                            </div>
                            <div className="w-full flex flex-col mt-3">
                              <span></span>
                              <label className="label font-regular text-[12px] block mb-1 text-gray-700">
                                Participants
                              </label>
                              <Select
                                isMulti
                                placeholder="Add Participants"
                                name="followers"
                                onChange={(value) => {
                                  // const {uid, name} = value
                                  console.log('followers are', value)

                                  formik.setFieldValue('followers', [value])
                                }}
                                options={usersList}
                                value={formik.values.followers[0] || []}
                                className="basic-multi-select w-full"
                                classNamePrefix="myselect"
                                styles={customStyles}
                              />

                              <p
                                className="text-sm text-red-500 hidden mt-3"
                                id="error"
                              >
                                Please fill out this field.
                              </p>
                            </div>
                            <div className="md:flex flex-row md:space-x-4 mt-3 w-full text-xs mt-3 ">
                              {/* <div className="mb-3 space-y-2 w-full text-xs mt-">
                            <TextField label="Size*" name="size" type="text" />
                          </div> */}
                              <div className="flex flex-col">
                                <label className="label font-regular text-[12px] block mb-1 text-gray-700">
                                  Due Date
                                </label>
                                <div className="bg-green border  pl-2 rounded flex flex-row h-[32px] ">
                                  <CalendarIcon className="w-4  inline text-[#058527]" />
                                  <span className="inline">
                                    <DatePicker
                                      className="mt-[5px] pl- px-2  inline text-sm "
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                      showTimeSelect
                                      timeFormat="HH:mm"
                                      injectTimes={[
                                        setHours(setMinutes(d, 1), 0),
                                        setHours(setMinutes(d, 5), 12),
                                        setHours(setMinutes(d, 59), 23),
                                      ]}
                                      dateFormat="MMMM d, yyyy h:mm aa"
                                    />
                                  </span>
                                </div>
                              </div>
                              <div className="w-full flex flex-col ">
                                <CustomSelect
                                  name="priorities"
                                  label="Priority"
                                  className="input mt-"
                                  onChange={(value) => {
                                    formik.setFieldValue(
                                      'priorities',
                                      value.value
                                    )
                                  }}
                                  value={formik.values.priorities}
                                  // options={aquaticCreatures}
                                  options={[
                                    { label: 'Low', value: 'low' },
                                    { label: 'Medium', value: 'medium' },
                                    { label: 'High', value: 'high' },
                                  ]}
                                />
                                <p
                                  className="text-sm text-red-500 hidden mt-3"
                                  id="error"
                                >
                                  Please fill out this field.
                                </p>
                              </div>
                            </div>
                            <div className="w-full flex flex-row my-3">
                              <TextField
                                type="file"
                                name="file"
                                label="Add file"
                                className="mt-[-3px] border border-gray-300 w-full rounded h-[36px] pt-0.5 pl-1"
                              />
                            </div>
                          </section>
                        </div>
                        {/* <span className="text-[#0091ae]">
                    Save
                    <ArrowRightIcon className="w-5 ml-5" />
                  </span> */}

                        <div className="flex flex-row justify-between mt-4">
                          <section></section>
                          <section className="flex flex-row ">
                            <button
                              // onClick={() => fAddSchedule()}
                              className={`flex mt-2  cursor-pointer rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium  bg-gradient-to-r from-indigo-400 to-cyan-400   hover:shadow-lg blue-bg-gradient  `}
                            >
                              <span className="ml-1 ">Edit Task & close</span>
                            </button>
                            <button
                              // onClick={() => fAddSchedule()}
                              className={`flex mt-2 ml-4 cursor-pointer rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium    bg-gradient-to-r from-indigo-400 to-cyan-400   hover:shadow-lg blue-bg-gradient`}
                            >
                              <span className="ml-1 ">Edit Task</span>
                            </button>

                            <button
                              // onClick={() => fSetLeadsType('Add Lead')}
                              // onClick={() => cancelResetStatusFun()}
                              className={`flex mt-2 ml-4 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white `}
                            >
                              <span className="ml-1 ">Cancel</span>
                            </button>
                          </section>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewEditTaskManForm
