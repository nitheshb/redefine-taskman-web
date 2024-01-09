/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react'

import { Dialog } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import { ArrowCircleDownIcon, PlusIcon } from '@heroicons/react/solid'
import { setHours, setMinutes } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { Form, Formik, Field } from 'formik'
import { useSnackbar } from 'notistack'
import DatePicker from 'react-datepicker'
import NumberFormat from 'react-number-format'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import { Label, InputField, TextAreaField, FieldError } from '@redwoodjs/forms'
import { useRouterStateSetter } from '@redwoodjs/router/dist/router-context'

import {
  addLead,
  updateLeadCustomerDetailsTo,
  checkIfLeadAlreadyExists,
  getAllProjects,
  steamUsersListByRole,
  updateUnitCustomerDetailsTo,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import {
  sendWhatAppMediaSms,
  sendWhatAppTextSms,
} from 'src/util/axiosWhatAppApi'
import { PhoneNoField } from 'src/util/formFields/phNoField'
import { PhoneNoField2 } from 'src/util/formFields/phNoField2'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { TextField } from 'src/util/formFields/TextField'
import { TextField2 } from 'src/util/formFields/TextField2'

import NoBorderDropDown from './comps/noBorderDropDown'
import Loader from './Loader/Loader'
import { useFileUpload } from './useFileUpload'

const AdditonalBookingDetails = ({
  source,
  title,
  additionalInfo,
  setAdditonalInfo,
  leadDetailsObj2,
  selUnitDetails,
  dialogOpen,
  setShowApplicantEdit,
  setOnStep,
  currentMode,
}) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [uploadedFileLink, handleFileUpload] = useFileUpload()
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [progress, setProgress] = useState(0)
  const [panCard1, setPanCard1] = useState('')
  const [panCard2, setPanCard2] = useState('')
  const [aadhrUrl1, setAadharUrl1] = useState('')
  const [aadhrUrl2, setAadharUrl2] = useState('')

  useEffect(() => {
    console.log('yo yo ', selUnitDetails, leadDetailsObj2)

  }, [])



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
    console.log('new customer object', leadDetailsObj2)
  }, [leadDetailsObj2])

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






  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)







  // const { uid } = selUnitDetails
  const uid = selUnitDetails?.uid || selUnitDetails?.id
  const datee = new Date().getTime()
  const initialState = {

    aggrementAddress:
      leadDetailsObj2?.aggrementDetailsObj?.aggrementAddress || additionalInfo?.aggrementDetailsObj?.aggrementAddress||  '',
    industry: leadDetailsObj2?.industry || additionalInfo?.industry || '',

    leadSource:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.leadSource
        :  additionalInfo?.leadSource || '',
    sourceOfPay:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.sourceOfPay
        : additionalInfo?.sourceOfPay || '',
    purpose:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.purpose
        : additionalInfo?.purpose || '',
    // leadSource: "",
    // sourceOfPay: "",
    // purpose: "",
    bookingSource: leadDetailsObj2?.bookingSource || '',
    bookedBy:
      leadDetailsObj2?.bookedBy || leadDetailsObj2?.assignedToObj?.label || '',
    purchasePurpose: leadDetailsObj2?.purchasePurpose || '',
  }
  // Custom PAN card validation function



  const onSubmit = async (data, resetForm) => {
    console.log('customer details form', data)
    const {

      aggrementAddress,
      industry,
      designation,
      annualIncome,
      leadSource,
      sourceOfPay,
      purpose,
      bookingSource,
      bookedBy,
      purchasePurpose,
    } = data
    const { uid } = selUnitDetails

    const aggrementDetailsObj = {
      aggrementAddress,
    }

    const xData = {}
    xData[`${uid}${'_source_of_pay'}`] = { self: 20, bank: 80 } // sourceOfPay
    xData[`${uid}${'_otherInfo'}`] = { leadSource, sourceOfPay, purpose }

    const updateDoc = {
      aggrementDetailsObj,
      ...xData,
      industry,
      designation,
      annualIncome,
    }
    setAdditonalInfo(updateDoc)
    const { id } = leadDetailsObj2
    console.log('did you find my id', id, leadDetailsObj2)

    if (source === 'fromBookedUnit') {
      updateUnitCustomerDetailsTo(
        orgId,
        id,
        updateDoc,
        'nitheshreddy.email@gmail.com',
        enqueueSnackbar,
        resetForm
      )
    } else {
      updateLeadCustomerDetailsTo(
        orgId,
        id,
        updateDoc,
        'nitheshreddy.email@gmail.com',
        enqueueSnackbar,
        resetForm
      )
    }

    if (currentMode == 'unitBookingMode') {
      setOnStep('booksheet')
    } else if (currentMode == 'unitBlockMode') {
      setOnStep('blocksheet')
    }

  }

  return (
    <>
      <div className="font-['Inter']">
        <div className="z-10">
          {/* <Dialog.Title className=" font-semibold text-xl mr-auto ml-3 text-[#053219]">
          {title}
        </Dialog.Title> */}
        </div>
        <div className="grid gap-8 grid-cols-1">
          <div className="flex flex-col rounded-lg bg-white ">
            <div className="mt-0">
              <Formik
                enableReinitialize={true}
                initialValues={initialState}

                onSubmit={(values, { resetForm }) => {
                  onSubmit(values, resetForm)
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="form">
                      {/* Phase Details */}

                      <section className=" bg-blueGray-50">
                        <div className="w-full mx-auto ">
                          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-[#F9FBFB] border-0">
                            <div className="flex-auto">
                              <section className=" lg:px-2 ">


                                {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}
                                <section
                                  className="rounded-md  p-4 mt-2 bg-[#fff]"
                                  style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                >
                                  <h6 className="text-blueGray-400 text-[13px] mt-3 mb-6 font-bold uppercase">
                                    Agreement Information
                                  </h6>
                                  <div className="flex flex-wrap">
                                    <div className="w-full lg:w-12/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Address"
                                          name="aggrementAddress"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>
                                {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}
                                {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}
                                <section
                                  className="rounded-md  p-4 mt-2 bg-[#fff]"
                                  style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                >
                                  <h6 className="text-blueGray-400  text-[13px] mt-3 mb-6 font-bold uppercase">
                                    Other Information
                                  </h6>
                                  <div className="flex flex-wrap">
                                    <div className="w-full lg:w-12/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="How do you come to know about this project?"
                                          name="leadSource"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-12/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Source of payment/source"
                                          name="sourceOfPay"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-12/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Purpose of purchase"
                                          name="purpose"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>

                                  {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}
                                  <section
                                  className="rounded-md  p-4 mt-2 bg-[#fff]"
                                  style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                >
                                  <h6 className="text-blueGray-400 text-[13px] mt-3 mb-6 font-bold uppercase">
                                    Booked By
                                  </h6>
                                  <div className="flex flex-wrap">
                                    <div className="w-full lg:w-4/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Booked By"
                                          name="industry"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-4/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Booking Date"
                                          name="designation"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-4/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Lead Source"
                                          name="annualIncome"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>

                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                              </section>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                    <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse py-3 mr-6 flex flex-col mt-2 z-10 flex flex-row justify-between mt-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                      {setShowApplicantEdit != undefined && (
                        <button
                          className="bg-red-400 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                          disabled={loading}
                          onClick={() => setShowApplicantEdit(false)}
                        >
                          {'Cancel'}
                        </button>
                      )}


                      <button
className="mb-2  md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
bg-gradient-to-r from-violet-300 to-indigo-300
text-black

border duration-200 ease-in-out
transition
 px-5 py-1 pb-[5px] text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500"
type="submit"
disabled={loading}
// onClick={() => submitFormFun(formik)}
>
{/* {loading && <Loader />} */}
<span>  {'Save'}</span>
</button>
                      {setShowApplicantEdit == undefined && (


<button
className="mb-2 mr-0 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
bg-gradient-to-r from-violet-300 to-indigo-300
text-black

border duration-200 ease-in-out
transition
 px-5 py-1 pb-[5px] text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500"
type="submit"
disabled={loading}
// onClick={() => submitFormFun(formik)}
>
{/* {loading && <Loader />} */}
<span>  {'Save & Next'}</span>
</button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* old form  */}
    </>
  )
}

export default AdditonalBookingDetails