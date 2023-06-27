/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, Fragment } from 'react'

import { Dialog, Listbox, Transition } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import { CalendarIcon, ClockIcon } from '@heroicons/react/outline'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
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
  addLead,
  addTaskBusiness,
  checkIfLeadAlreadyExists,
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
  const [startDate, setStartDate] = useState(setHours(setMinutes(d, 30), 16))
  const [selected1, setSelected1] = useState(people[0])
  const [showEditTask, selShowEditTask] = useState(false)
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
          <div className="mt-2 ">
            <section className=" flex flex-col  pb-3  ">
              <section className="flex flex-col justify-between mb-1">
                <section className="flex flex-row justify-between">
                  <div className="font-md text-xs text-gray-500  tracking-wide">
                    Title
                  </div>
                  <div className="font-md text-xs text-blue-500 text-right tracking-wide ">
                    {taskManObj?.status}
                  </div>
                </section>

                <div className="font-md text-xs mt-1 tracking-wide font-semibold text-slate-900  bg-[#f4e1fc] p-2 rounded-sm">
                  {taskManObj?.title}
                </div>
              </section>
            </section>
          </div>
          <div className="">
            <section className=" flex flex-col  py-1   ">
              <section className="flex flex-col justify-between mb-1">
                <div className="font-md text-xs text-gray-500  tracking-wide">
                  Description
                </div>
                <div className="font-md text-xs mt-1 tracking-wide font-semibold text-[#462c52]  bg-[#f4e1fc] py-2 px-2 rounded-sm">
                  {taskManObj?.desc || 'NA'}
                </div>
              </section>
            </section>
          </div>
          <div className="mt-3 grid grid-cols-2 ">
            <section className=" flex flex-col  py-3 py-0  ">
              <section className="flex flex-col justify-between mb-1">
                <div className="font-md text-xs text-gray-500  tracking-wide">
                  Assigned To
                </div>
                <div className="font-md text-xs mt-1 tracking-wide font-semibold text-[#462c52]  bg-[#f4e1fc] p-2 rounded-sm">
                  {taskManObj?.to_name}
                </div>
              </section>
            </section>
            <section className=" flex flex-col  ml-2 py-3 py-0  ">
              <section className="flex flex-col justify-between mb-1">
                <div className="font-md text-xs text-gray-500  tracking-wide">
                  Assigned By
                </div>
                <div className="font-md text-xs mt-1 tracking-wide font-semibold text-[#462c52]  bg-[#f4e1fc] p-2 rounded-sm">
                  {taskManObj?.by_name || 0}
                </div>
              </section>
            </section>
          </div>
          <div className="grid grid-cols-2 mt-3 pb-4 mb-4 border-b border-[#e5e7f8] rounded-sm">
            <section className=" flex flex-col   py-1   ">
              <section className="flex flex-col justify-between  ">
                <div className="font-md text-xs text-gray-500  tracking-wide">
                  Due Date
                </div>
                <div className="font-md text-xs mt-1 tracking-wide font-semibold text-[#68582e] p-2  bg-[#feeacc] rounded-sm">
                  {prettyDateTime(taskManObj?.due_date)}
                </div>
              </section>
            </section>
            <section className=" flex flex-col  ml-2 py-1  ">
              <section className="flex flex-col justify-between  ">
                <div className="font-md text-xs text-gray-500  tracking-wide">
                  Priority
                </div>
                <div className="font-md text-xs mt-1 tracking-wide font-semibold text-[#68582e] p-2  bg-[#feeacc]">
                  {taskManObj?.priority}
                </div>
              </section>
            </section>
          </div>

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
                  assignedTo: taskManObj?.to_name || '',
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
                            <section className="flex flex-row  pt-2 mb-2">
                              <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>
                              <span className="ml-1 leading-[15px] ">
                                <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                  Business Task<abbr title="required"></abbr>
                                </label>
                              </span>
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
                              <span className="ml-1 ">Add Task & close</span>
                            </button>
                            <button
                              // onClick={() => fAddSchedule()}
                              className={`flex mt-2 ml-4 cursor-pointer rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium    bg-gradient-to-r from-indigo-400 to-cyan-400   hover:shadow-lg blue-bg-gradient`}
                            >
                              <span className="ml-1 ">Add Task</span>
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
