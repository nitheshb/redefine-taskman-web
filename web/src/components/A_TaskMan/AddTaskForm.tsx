/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, Fragment } from 'react'

import { Dialog, Listbox, Transition } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import { CalendarIcon,  } from '@heroicons/react/outline'
import { CheckIcon, SelectorIcon, FireIcon } from '@heroicons/react/solid'
import Checkbox from '@mui/material/Checkbox'
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
const people = [
  { name: 'Priority 1' },
  { name: 'Priority 2' },
  { name: 'Priority 3' },
  { name: 'Priority 4' },
]
const AddTaskForm = ({ title, dialogOpen }) => {
  const { user } = useAuth()
  const { orgId } = user
  const d = new window.Date()
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [startDate, setStartDate] = useState(setHours(setMinutes(d, 30), 16))
  const [selected1, setSelected1] = useState(people[0])
  const [prior, setPrior] = useState(false)
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

  const aquaticCreatures = [
    { label: 'Select the Project', value: '' },
    { label: 'Subha Ecostone', value: 'subhaecostone' },
    { label: 'Esperanza', value: 'esperanza' },
    { label: 'Nakshatra Township', value: 'nakshatratownship' },
  ]
  // const usersList = [
  //   { label: 'User1', value: 'User1' },
  //   { label: 'User2', value: 'User2' },
  //   { label: 'User3', value: 'User3' },
  // ]

  const budgetList = [
    { label: 'Select Customer Budget', value: '' },
    { label: '5 - 10 Lacs', value: 'Bangalore,KA' },
    { label: '10 - 20 Lacs', value: 'Cochin,KL' },
    { label: '20 - 30 Lacs', value: 'Mumbai,MH' },
    { label: '30 - 40 Lacs', value: 'Mumbai,MH' },
    { label: '40 - 50 Lacs', value: 'Mumbai,MH' },
    { label: '50 - 60 Lacs', value: 'Mumbai,MH' },
    { label: '60 - 70 Lacs', value: 'Mumbai,MH' },
    { label: '70 - 80 Lacs', value: 'Mumbai,MH' },
    { label: '80 - 90 Lacs', value: 'Mumbai,MH' },
    { label: '90 - 100 Lacs', value: 'Mumbai,MH' },
    { label: '1.0 Cr - 1.1 Cr', value: 'Mumbai,MH' },
    { label: '1.1 Cr - 1.2 Cr', value: 'Mumbai,MH' },
    { label: '1.2 Cr - 1.3 Cr', value: 'Mumbai,MH' },
    { label: '1.3 Cr - 1.4 Cr', value: 'Mumbai,MH' },
    { label: '1.4 Cr - 1.5 Cr', value: 'Mumbai,MH' },
    { label: '1.5 + Cr', value: 'Mumbai,MH' },
  ]

  const plans = [
    {
      name: 'Apartment',
      img: '/apart1.svg',
    },
    {
      name: 'Plots',
      img: '/plot.svg',
    },
    {
      name: 'WeekendVillas',
      img: '/weekend.svg',
    },
    {
      name: 'Villas',
      img: '/villa.svg',
    },
  ]

  const devTypeA = [
    {
      name: 'Outright',
      img: '/apart.svg',
    },
    {
      name: 'Joint',
      img: '/apart1.svg',
    },
  ]
  const [takTitle, setTakTitle] = useState('')

  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [devType, setdevType] = useState(devTypeA[0])
  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const typeSel = async (sel) => {
    await console.log('value is', selected)
    await setSelected(sel)
    await console.log('thsi si sel type', sel, selected)
  }
  const devTypeSel = async (sel) => {
    await setdevType(sel)
  }
  const onSubmitFun = async (data, resetForm) => {
    data.due_date = startDate.getTime()
    setLoading(true)
    await addTaskBusiness(orgId, data, user)

    await resetForm()
    await setFormMessage('Task Created..!')
    await setLoading(false)
    return
    const {
      email,
      name,
      mobileNo,
      assignedTo,
      assignedToObj,
      source,
      project,
      projectId,
    } = data
    // updateUserRole(uid, deptVal, myRole, email, 'nitheshreddy.email@gmail.com')

    const foundLength = await checkIfLeadAlreadyExists('spark_leads', mobileNo)
    const leadData = {
      Date: Timestamp.now().toMillis(),
      Email: email,
      Mobile: mobileNo,
      Name: name,
      Note: '',
      Project: project,
      ProjectId: projectId,
      Source: source,
      Status: assignedTo === '' ? 'unassigned' : 'new',
      intype: 'Form',
      assignedTo: assignedToObj?.value || '',
      assignedToObj: {
        department: assignedToObj?.department || [],
        email: assignedToObj?.email || '',
        label: assignedToObj?.label || '',
        name: assignedToObj?.name || '',
        namespace: orgId,
        roles: assignedToObj?.roles || [],
        uid: assignedToObj?.value || '',
        value: assignedToObj?.value || '',
        offPh: assignedToObj?.offPh || '',
      },
      by: user?.email,
    }
    console.log('user is ', user)
    if (foundLength?.length > 0) {
      console.log('foundLENGTH IS ', foundLength)
      setFormMessage('User Already Exists with Ph No')
      setLoading(false)
    } else {
      console.log('foundLENGTH IS empty ', foundLength)
      console.log('add lead obj is ', leadData)
      // proceed to copy
      await addLead(
        orgId,
        leadData,
        user?.email,
        `lead created and assidged to ${assignedTo}`
      )

      await sendWhatAppTextSms(
        mobileNo,
        `Thank you ${name} for choosing the world class ${project || 'project'}`
      )

      // msg2
      await sendWhatAppMediaSms(mobileNo)
      const smg =
        assignedTo === ''
          ? 'You Interested will be addressed soon... U can contact 9123456789 mean while'
          : 'we have assigned dedicated manager to you. Mr.Ram as ur personal manager'

      // msg3
      sendWhatAppTextSms(mobileNo, smg)
      resetForm()
      setFormMessage('Task Created..!')
      setLoading(false)
    }
  }

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
    <div className="h-full flex flex-col pb-6 bg-white shadow-xl overflow-y-scroll no-scrollbar bg-gradient-to-r from-blue-200 to-cyan-200">
      {/* <div className="px-4 sm:px-6  z-10 flex items-center justify-between">
        <Dialog.Title className=" font-semibold text-xl mr-auto ml-3 text-[#053219]">
          {title}
        </Dialog.Title>
      </div> */}
      <div className="">
        <section className="flex flex-row justify-between mx-4 pt-2 pb-2">
          <span className="ml-1 mt-[1px] ">
            <label className="font-semibold text-[#053219]  text-[18px]  mb-1  ">
              {'New Task'} 🍉
              <abbr title="required"></abbr>
            </label>
          </span>
          <section className="flex flex-row justify-between  pt-2 mb-2 ">
            {formMessage === 'Task Created..!' && (
              <p className=" flex text-md text-slate-800 ">
                <img
                  className="w-[18px] h-[18px] inline mr-2"
                  alt=""
                  src="/ok.gif"
                />
                <span className="mt-[.2px] text-[12px]">{formMessage}</span>
              </p>
            )}
          </section>
        </section>
      </div>

      <div className="grid  gap-8 grid-cols-1 ">
        <div className="flex flex-col  ">
          <div className="mt-0">
            {/* new one */}

            <Formik
              initialValues={{
                taskTitle: '',
                taskdesc: '',
                assignedTo: '',
                assignedToObj: {},
                followers: [],
                priorities: '',
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
                  <div className="mt-  rounded-lg bg-white mx-4 py-1">
                    <div className="flex flex-col pt-0 my-10 mx-4 mt-[10px] rounded">
                      <div className="  outline-none">
                        <div className="flex flex-row border-b border-gray border-b pb-1 border-[#edeef0]">
                          <input
                            name="taskTitle"
                            type="text"
                            value={formik.values.taskTitle}
                            onChange={(value) => {
                              console.log('vaue is ', value.target.value)
                              formik.setFieldValue(
                                'taskTitle',
                                value.target.value
                              )
                            }}
                            // value={taskTitle}
                            // onChange={(e) => {
                            //   console.log('any error ', e, e.target.value)

                            //   // if (e.target.value === '') {
                            //   //   setClicked(false)
                            //   //   setHover(true)
                            //   // }
                            //   setAddCommentTitle(e.target.value)
                            // }}
                            placeholder="Things to do"
                            className={`w-full  pb-2 pt-1 outline-none text-[18px] font-bodyLato focus:border-blue-600 hover:border-blue-600  ${
                              true ? ' text-[33475b] ' : ' text-[33475b]'
                            } bg-white`}
                          ></input>
                          <div className="flex flex-row">
                            <input
                              data-bx-id="task-edit-priority-cb"
                              type="checkbox"
                              name="priorities"
                              value={prior}
                              onChange={(value) => {
                                setPrior(!prior)

                                formik.setFieldValue(
                                  'priorities',
                                  prior ? 'high' : 'medium'
                                )
                              }}
                            />

                            <div className="w-[85px] ml-1 mt-[8px] text-sm text-[#00000080]">
                              High Priority
                            </div>
                            <FireIcon
                              className={`w-4 h-4 mt-[11px] ${
                                prior ? 'text-[#f36b00]' : 'text-[#00000080] '
                              } `}
                            />
                          </div>
                        </div>
                        <div className="flex flex-row border-b border-gray border-b pb-1 border-[#edeef0]">
                          <textarea
                            name="taskdesc"
                            type="text"
                            value={formik.values.taskdesc}
                            onChange={(value) => {
                              console.log('vaue is ', value.target.value)
                              formik.setFieldValue(
                                'taskdesc',
                                value.target.value
                              )
                            }}
                            placeholder="Description"
                            className={`w-full h-[170px] pb-2 pt-2 outline-none text-[14px] font-bodyLato focus:border-blue-600 hover:border-blue-600  ${
                              true ? ' text-[33475b] ' : ' text-[33475b]'
                            } bg-white`}
                          ></textarea>
                        </div>
                        <section className="mt-1 px-4 rounded-lg bg-[#f8f9fa] border border-gray-100 ">
                          <section className="flex flex-row mt-3">
                            <label className="label mt-3 w-[92px] font-regular text-[12px] block mb-1 text-gray-700">
                              {'Responsible person*'}
                            </label>

                            <div className="w-full flex flex-col mt-1 ">
                              <CustomSelect
                                name="assignedTo"
                                label=""
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
                          </section>
                          <section className="flex flex-row mt-3">
                            <label className="label mt-3 w-[92px] font-regular text-[12px] block mb-1 text-gray-700">
                              {'Participants'}
                            </label>

                            <div className="w-full flex flex-col mt-1 ">
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
                          </section>

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
                            <div className="w-full flex flex-row my-3 mt-6">
                              {/* <TextField
                              type="file"
                              name="file"
                              label="Add file"
                              className="mt-[-3px] border border-gray-300 w-full rounded h-[36px] pt-0.5 pl-1"
                            /> */}

                              {/* <label
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              htmlFor="file_input"
                            >
                              Upload file
                            </label> */}
                              <input
                                className="block w-full text-sm text-gray-900 border border-blue-300 rounded-sm cursor-pointer bg-blue-50  focus:outline-none "
                                id="file_input"
                                type="file"
                                name="file"
                              />
                            </div>
                          </div>
                        </section>
                        <div className="w-full flex flex-col  ">
                          <CustomSelect
                            name="priorities"
                            label="Priority"
                            className="input mt-"
                            onChange={(value) => {
                              formik.setFieldValue('priorities', value.value)
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
                      {/* <span className="text-[#0091ae]">
                    Save
                    <ArrowRightIcon className="w-5 ml-5" />
                  </span> */}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between mt-4 pb-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                    <section></section>
                    <section className="flex flex-row ">
                      <button
                        // onClick={() => fAddSchedule()}
                        className={`flex mt-2 ml-4 cursor-pointer rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium  text-[#535c69]  bg-[#bbed21]   hover:shadow-lg `}
                      >
                        <span className="ml-1 ">Add Task</span>
                      </button>
                      <button
                        // onClick={() => fAddSchedule()}
                        className={`flex mt-2 ml-4 cursor-pointer rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium  border border-[#c6cdd3] text-[#535b69] hover:shadow-lg   `}
                      >
                        <span className="ml-1 ">
                          Add Task & Create Another one
                        </span>
                      </button>

                      <button
                        // onClick={() => fSetLeadsType('Add Lead')}
                        // onClick={() => cancelResetStatusFun()}
                        className={`flex mt-2 ml- rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium   hover:bg-gray-700 hover:text-white `}
                      >
                        <span className="ml-1 ">Cancel</span>
                      </button>
                    </section>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTaskForm
