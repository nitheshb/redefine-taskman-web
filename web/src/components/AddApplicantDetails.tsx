/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react'

import { Dialog } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import { ArrowCircleDownIcon } from '@heroicons/react/solid'
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

const AddApplicantDetails = ({
  source,
  title,
  leadDetailsObj2,
  selUnitDetails,
  dialogOpen,
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
    setPanCard1(leadDetailsObj2?.customerDetailsObj?.panDocUrl1)
    setPanCard2(leadDetailsObj2?.secondaryCustomerDetailsObj?.panDocUrl2)
    setAadharUrl1(leadDetailsObj2?.customerDetailsObj?.aadharUrl1)
    setAadharUrl2(leadDetailsObj2?.secondaryCustomerDetailsObj?.aadharUrl2)
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

  const downloadImage = (imageUrl, filename) => {
    console.error('Error downloading image:', imageUrl)
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary anchor element
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        // Extract the filename from the URL
        // const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)

        // Set the download attribute and filename
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        console.log('fetcher url ', filename)
        // Simulate a click on the anchor element to start the download
        link.click()

        // Clean up the temporary anchor element
        link.parentNode.removeChild(link)

        // Set the downloaded image URL to display on the page
        setImageUrl(url)
      })
      .catch((error) => {
        console.error('Error downloading image:', error)
      })
  }
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
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [devType, setdevType] = useState(devTypeA[0])
  const [startDate, setStartDate] = useState(new Date())
  const [selRef1, setRefDataFun1] = useState({ label: 'S/O', value: 'S/O' })
  const [selRef2, setRefDataFun2] = useState({ label: 'S/O', value: 'S/O' })

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
    console.log(data)
    setLoading(true)

    const {
      email,
      name,
      mobileNo,
      assignedTo,
      assignedToObj,
      source,
      project,
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

      // proceed to copy
      await addLead(
        orgId,
        leadData,
        user?.email,
        `lead created and assidged to ${assignedTo}`
      )

      await sendWhatAppTextSms(
        mobileNo,
        `Thank you ${name} for choosing the world className ${
          project || 'project'
        }`
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
      setFormMessage('Saved Successfully..!')
      setLoading(false)
    }
  }

  // const { uid } = selUnitDetails
  const uid = selUnitDetails?.uid || selUnitDetails?.id
  const datee = new Date().getTime()
  const initialState = {
    customerName1:
      leadDetailsObj2?.customerDetailsObj?.customerName1 ||
      leadDetailsObj2?.Name ||
      '',
    customerName2:
      leadDetailsObj2?.secondaryCustomerDetailsObj?.customerName2 || '',
    co_Name1: leadDetailsObj2?.customerDetailsObj?.co_Name1 || '',
    co_Name2: leadDetailsObj2?.secondaryCustomerDetailsObj?.co_Name2 || '',
    phoneNo1:
      leadDetailsObj2?.customerDetailsObj?.phoneNo1 ||
      leadDetailsObj2?.Mobile ||
      '',
    phoneNo2: leadDetailsObj2?.secondaryCustomerDetailsObj?.phoneNo2 || '',
    email1:
      leadDetailsObj2?.customerDetailsObj?.email1 ||
      leadDetailsObj2?.Email ||
      '',
    email2: leadDetailsObj2?.secondaryCustomerDetailsObj?.email2 || '',
    dob1: leadDetailsObj2?.customerDetailsObj?.dob1 || datee,
    dob2: leadDetailsObj2?.secondaryCustomerDetailsObj?.dob2 || datee,
    marital1: leadDetailsObj2?.customerDetailsObj?.marital1 || {
      label: 'Married',
      value: 'Married',
    },
    marital2: leadDetailsObj2?.secondaryCustomerDetailsObj?.marital2 || {
      label: 'Married',
      value: 'Married',
    },
    panNo1: leadDetailsObj2?.customerDetailsObj?.panNo1 || '',
    panNo2: leadDetailsObj2?.secondaryCustomerDetailsObj?.panNo2 || '',
    panDocUrl1: leadDetailsObj2?.customerDetailsObj?.panDocUrl1 || '',

    panDocUrl2: leadDetailsObj2?.secondaryCustomerDetailsObj?.panDocUrl2 || '',
    aadharNo1: leadDetailsObj2?.customerDetailsObj?.aadharNo1 || '',
    aadharNo2: leadDetailsObj2?.secondaryCustomerDetailsObj?.aadharNo2 || '',
    aadharUrl1: leadDetailsObj2?.customerDetailsObj?.aadharUrl1 || '',
    aadharUrl2: leadDetailsObj2?.secondaryCustomerDetailsObj?.aadharUrl2 || '',
    occupation1: leadDetailsObj2?.customerDetailsObj?.occupation1 || '',
    companyName1: leadDetailsObj2?.customerDetailsObj?.companyName1 || '',

    occupation2:
      leadDetailsObj2?.secondaryCustomerDetailsObj?.occupation2 || '',
    companyName2:
      leadDetailsObj2?.secondaryCustomerDetailsObj?.companyName2 || '',

    aggrementAddress:
      leadDetailsObj2?.aggrementDetailsObj?.aggrementAddress || '',
    industry: leadDetailsObj2?.industry || '',
    designation: leadDetailsObj2?.designation || '',
    annualIncome: leadDetailsObj2?.annualIncome || '',
    leadSource:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.leadSource
        : '',
    sourceOfPay:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.sourceOfPay
        : '',
    purpose:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.purpose
        : '',
    // leadSource: "",
    // sourceOfPay: "",
    // purpose: "",
    bookingSource: leadDetailsObj2?.bookingSource || '',
    bookedBy:
      leadDetailsObj2?.bookedBy || leadDetailsObj2?.assignedToObj?.label || '',
    purchasePurpose: leadDetailsObj2?.purchasePurpose || '',
  }
  // Custom PAN card validation function
  const isValidPAN = (value) => {
    const regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
    console.log('match value is ', value, value === '', value == undefined)
    if (value === '' || value == undefined) {
      return true
    }
    return regex.test(value)
  }

  const isValidAadhar = (value) => {
    // Aadhar card format: 12 digits
    const regex = /^\d{12}$/
    if (value === '' || value == undefined) {
      return true
    }
    return regex.test(value)
  }
  const validateSchema = Yup.object({
    // customerName1: Yup.string().required('Required'),
    // co_Name1: Yup.string().required('Required'),
    panNo1: Yup.string().test('pan', 'Invalid PAN card number', isValidPAN),
    panNo2: Yup.string().test('pan', 'Invalid PAN card number', isValidPAN),
    // panDocUrl1: Yup.string().required('Required'),
    aadharNo1: Yup.string().test(
      'aadhar',
      'Invalid Aadhar card number',
      isValidAadhar
    ),
    aadharNo2: Yup.string().test(
      'aadhar',
      'Invalid Aadhar card number',
      isValidAadhar
    ),
    // aadharUrl1: Yup.string().required('Required'),
    // occupation1: Yup.string().required('Required'),
    phoneNo1: Yup.string().required('Required'),
    email1: Yup.string().email('Email is invalid'),
    email2: Yup.string().email('Email is invalid'),
    // aggrementAddress: Yup.string().required('Required'),
  })

  const resetter = () => {
    setSelected({})
    setFormMessage('')
  }

  const onSubmit = async (data, resetForm) => {
    console.log('customer details form', data)
    const {
      customerName1,
      co_Name1,
      phoneNo1,
      email1,
      dob1,
      marital1,
      panNo1,
      panDocUrl1,
      aadharNo1,
      aadharUrl1,
      occupation1,
      companyName1,
      customerName2,
      co_Name2,
      phoneNo2,
      email2,
      dob2,
      marital2,
      panNo2,
      panDocUrl2,
      aadharNo2,
      aadharUrl2,
      occupation2,
      companyName2,
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
    const customerDetailsObj = {
      customerName1: customerName1,
      co_Name1: co_Name1,
      phoneNo1: phoneNo1,
      email1: email1,
      dob1: dob1,
      marital1: marital1,
      panNo1: panNo1,
      panDocUrl1: panCard1,
      aadharNo1: aadharNo1,
      aadharUrl1: aadhrUrl1,
      occupation1,
      companyName1,
    }
    const secondaryCustomerDetailsObj = {
      customerName2,
      co_Name2,
      phoneNo2,
      email2,
      dob2,
      marital2,
      panNo2,
      panDocUrl2: panCard2,
      aadharNo2,
      aadharUrl2: aadhrUrl2,
      occupation2,
      companyName2,
    }
    const aggrementDetailsObj = {
      aggrementAddress,
    }

    const xData = {}
    xData[`${uid}${'_source_of_pay'}`] = { self: 20, bank: 80 } // sourceOfPay
    xData[`${uid}${'_otherInfo'}`] = { leadSource, sourceOfPay, purpose }

    const updateDoc = {
      customerDetailsObj,
      secondaryCustomerDetailsObj,
      aggrementDetailsObj,
      ...xData,
      industry,
      designation,
      annualIncome,
    }
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

    // const updatedData = {
    //   ...data,
    // }

    // setLoading(true)
    // addCustomer(
    // orgId,
    //   updatedData,
    //   'nithe.nithesh@gmail.com',
    //   enqueueSnackbar,
    //   resetForm
    // )
    // setLoading(false)
  }
  const handleFileUploadFun = async (file, type) => {
    if (!file) return
    try {
      const uid = uuidv4()
      const storageRef = ref(storage, `/spark_files/${'taskFiles'}_${uid}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100

          setProgress(prog)
          file.isUploading = false
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            // createAttach(orgId, url, by, file.name, id, attachType)
            file.url = url
            // setFiles([...files, file])
            if (type === 'panCard1') {
              setPanCard1(url)
            } else if (type === 'panCard2') {
              setPanCard2(url)
            } else if (type === 'aadharNo1Url') {
              setAadharUrl1(url)
            } else if (type === 'aadharNo2Url') {
              setAadharUrl2(url)
            }
            console.log('file url i s', url,'dd',type,type === 'aadharNo1Url', aadhrUrl1)
            return url
            //  save this doc as a new file in spark_leads_doc
          })
        }
      )
    } catch (error) {
      console.log('upload error is ', error)
    }
  }

  return (
    <>
      <div className="">
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
                validationSchema={validateSchema}
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
                            <div className="rounded-t bg-[#F1F5F9] mb-0 px-3 py-2">
                              <div className="text-center flex justify-between">
                                <p className="text-xs font-extrabold tracking-tight uppercase font-body my-1">
                                  Customer Details
                                </p>
                              </div>
                            </div>
                            <div className="flex-auto">
                              <section className=" lg:px-2 py-4">
                                <div className="flex flex-wrap">
                                  <section
                                    className="w-full flex p-4 rounded-md   mt- bg-[#fff] hover:shadow-2xl"
                                    style={{
                                      boxShadow: '0 1px 12px #f2f2f2',
                                    }}
                                  >
                                    <div className="w-full lg:w-6/12 px-4 border-r">
                                      <div className="w-full flex flex-row">
                                        <div className="w-3 h-3 mt-[16px] rounded-full bg-[#FB6094]  "></div>
                                        <div className="w-2 h-2 ml-[1px] rounded-md mt-[18px] bg-[#FB6094]  "></div>
                                        <div className="w-1 h-1 ml-[1px] rounded-md mr-1 mt-[20px] bg-[#FB6094]  "></div>
                                        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase ">
                                          First Applicant Personal Details
                                        </h6>
                                      </div>
                                      <div className="flex flex-wrap">
                                        <div className="w-full lg:w-12/12 ">
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Customer Name*"
                                              name="customerName1"
                                              type="text"
                                            />
                                          </div>
                                        </div>

                                        <div className="w-full flex flex-row lg:w-12/12">
                                          <section className="mt-4">
                                            <NoBorderDropDown
                                              options={[
                                                { label: 'D/O', value: 'D/O' },
                                                { label: 'S/O', value: 'S/O' },
                                                { label: 'W/O', value: 'W/O' },
                                              ]}
                                              setRefDropFun={setRefDataFun1}
                                              selRefDrop={selRef1}
                                            />
                                          </section>
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Son/Daughter/Wife of"
                                              name="co_Name1"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div className="w-full lg:w-4/12 px-">
                                          <div className="relative w-full mb-3 mt-2">
                                            <PhoneNoField2
                                              label="Phone No"
                                              name="phoneNo1"
                                              type="text"
                                              onChange={(value) => {
                                                // formik.setFieldValue('mobileNo', value.value)
                                              }}
                                              // value={formik.values.mobileNo}
                                              options={{}}
                                            />
                                          </div>
                                        </div>
                                        <div className="w-full lg:w-8/12 pl-4">
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Email"
                                              name="email1"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        {/* </section> */}
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4 mt">
                                      {/* add here */}

                                      <div className="w-full flex flex-row">
                                        <div className="w-3 h-3 mt-[16px] rounded-full bg-[#FB6094]  "></div>
                                        <div className="w-2 h-2 ml-[1px] rounded-md mt-[18px] bg-[#FB6094]  "></div>
                                        <div className="w-1 h-1 ml-[1px] rounded-md mr-1 mt-[20px] bg-[#FB6094]  "></div>
                                        <h6 className="w-full lg:w-12/12 text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                          First Applicant Proofs
                                        </h6>
                                      </div>
                                      <div className="flex flex-wrap">
                                        <div className="w-full lg:w-4/12 mt-[-6px] ">
                                          <div className="relative w-full mb-3 mt-2">
                                            <label
                                              htmlFor={'dob1'}
                                              className="text-gray-500 text-[10px]"
                                            >
                                              Date Of Birth
                                            </label>
                                            <span className="inline">
                                              <DatePicker
                                                className="h-8 outline-none border-t-0 border-l-0 border-r-0 border-gray-500 text-sm border-solid mt-[-4px] pb-1  min-w-[125px]  inline  text-[#0091ae]   lg:w-4/12 w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] "
                                                label="Dated"
                                                name="dob1"
                                                selected={formik.values.dob1}
                                                onChange={(date) => {
                                                  formik.setFieldValue(
                                                    'dob1',
                                                    date.getTime()
                                                  )
                                                  setStartDate(date)
                                                  // console.log(startDate)
                                                }}
                                                timeFormat="HH:mm"
                                                injectTimes={[
                                                  setHours(setMinutes(d, 1), 0),
                                                  setHours(
                                                    setMinutes(d, 5),
                                                    12
                                                  ),
                                                  setHours(
                                                    setMinutes(d, 59),
                                                    23
                                                  ),
                                                ]}
                                                dateFormat="MMMM d, yyyy"
                                              />
                                            </span>
                                          </div>
                                        </div>

                                        <div className="w-full lg:w-8/12 pl-4 ">
                                          {/* <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Marital Status"
                                              name="marital1"
                                              type="text"
                                            />
                                          </div> */}
                                          <section className="mt-4">
                                            <NoBorderDropDown
                                              options={[
                                                {
                                                  label: 'Divorced',
                                                  value: 'Divorced',
                                                },
                                                {
                                                  label: 'Married',
                                                  value: 'Married',
                                                },
                                                {
                                                  label: 'Single',
                                                  value: 'Single',
                                                },
                                              ]}
                                              setRefDropFun={(val) => {
                                                console.log('value is ', val)
                                                formik.setFieldValue(
                                                  'marital1',
                                                  val
                                                )
                                              }}
                                              selRefDrop={
                                                formik.values.marital1
                                              }
                                            />
                                          </section>
                                        </div>
                                      </div>
                                      <div className="w-full flex flex-row">
                                        <div className="  px-">
                                          <div className="relative w-[130px] mb-3 mt-2">
                                            <TextField2
                                              label="PAN No"
                                              name="panNo1"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div className=" ml-3 ">
                                          <div className="relative  mt-5">
                                            <div>
                                              <label
                                                htmlFor="formFile1"
                                                className="form-label cursor-pointer inline-block mb-2  font-regular text-xs bg-[#efef] rounded-2xl px-2 py-1 min-w-[130px] "
                                              >
                                                {`${
                                                  panCard1 === ''
                                                    ? 'Upload'
                                                    : 'Download'
                                                } Pan Card`}
                                              </label>
                                              {panCard1 != '' && (
                                                <button
                                                  onClick={() =>
                                                    downloadImage(
                                                      panCard1,
                                                      'pancard1.PNG'
                                                    )
                                                  }
                                                >
                                                  {' '}
                                                  <ArrowCircleDownIcon className="w-4 h-4 cursor-pointer ml-1 mb-[9px] mr-2 inline-block text-gray-400 " />
                                                </button>
                                              )}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id="formFile1"
                                                onChange={ (e) =>
                                                   handleFileUploadFun(
                                                    e.target.files[0],
                                                    'panCard1'
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="w-full flex flex-row">
                                        {/* <div className="w-full lg:w-8/12 pl-4">
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Aadhar Upload"
                                              name="aadharUrl1"
                                              type="text"
                                            />
                                          </div>
                                        </div> */}
                                        <div className=" ">
                                          <div className="relative w-[130px] mb-3 mt-2">
                                            <TextField2
                                              label="Aadhar No"
                                              name="aadharNo1"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <div className="relative w-full mt-5 ml-3">
                                            <div className=" flex flex-row">
                                              <label
                                                htmlFor="formFile2"
                                                className="form-label cursor-pointer inline-block mb-2  font-regular text-xs bg-[#efef] rounded-2xl px-2 py-1 min-w-[130px]"
                                              >
                                                {`${
                                                  aadhrUrl1 === ''
                                                    ? 'Upload'
                                                    : 'Download'
                                                } Aadhar Card`}
                                              </label>
                                              {aadhrUrl1 != '' && (
                                                <button
                                                  onClick={() =>
                                                    downloadImage(
                                                      aadhrUrl1,
                                                    'Aadhar1.PNG'
                                                    )
                                                  }
                                                >
                                                  {' '}
                                                  <ArrowCircleDownIcon className="w-4 h-4 cursor-pointer ml-1 mb-[9px] mr-2 inline-block text-gray-400 " />
                                                </button>
                                              )}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id="formFile2"
                                                onChange={(e) =>
                                                  handleFileUploadFun(
                                                    e.target.files[0],
                                                    'aadharNo1Url'
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </section>
                                  <section
                                    className="w-full flex p-4 rounded-md   mt-6  bg-[#fff]"
                                    style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                  >
                                    <div className="w-full lg:w-6/12 px-4 border-r-2 ">
                                      <div className="w-full flex flex-row">
                                        <div className="w-3 h-3 mt-[16px] rounded-full bg-[#FB6094]  "></div>
                                        <div className="w-2 h-2 ml-[1px] rounded-md mt-[18px] bg-[#FB6094]  "></div>
                                        <div className="w-1 h-1 ml-[1px] rounded-md mr-1 mt-[20px] bg-[#FB6094]  "></div>
                                        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase ">
                                          Second Applicant Personal Details
                                        </h6>
                                      </div>
                                      <div className="flex flex-wrap">
                                        <div className="w-full lg:w-12/12 ">
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Customer Name*"
                                              name="customerName2"
                                              type="text"
                                            />
                                          </div>
                                        </div>

                                        <div className="w-full  flex flex-row lg:w-12/12">
                                          <section className="mt-4">
                                            <NoBorderDropDown
                                              options={[
                                                { label: 'D/O', value: 'D/O' },
                                                { label: 'S/O', value: 'S/O' },
                                                { label: 'W/O', value: 'W/O' },
                                              ]}
                                              setRefDropFun={setRefDataFun2}
                                              selRefDrop={selRef2}
                                            />
                                          </section>
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Son/Daughter/Wife of"
                                              name="co_Name2"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div className="w-full lg:w-4/12 px-">
                                          <div className="relative w-full mb-3 mt-2">
                                            <PhoneNoField2
                                              label="Phone No"
                                              name="phoneNo2"
                                              type="text"
                                              onChange={(value) => {
                                                // formik.setFieldValue('mobileNo', value.value)
                                              }}
                                              // value={formik.values.mobileNo}
                                              options={{}}
                                            />
                                          </div>
                                        </div>
                                        <div className="w-full lg:w-8/12 pl-4">
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Email"
                                              name="email2"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4 ">
                                      <div className="w-full flex flex-row ">
                                        <div className="w-3 h-3 mt-[16px] rounded-md bg-[#FB6094]  "></div>
                                        <div className="w-2 h-2 ml-[1px] rounded-md mt-[18px] bg-[#FB6094]  "></div>
                                        <div className="w-1 h-1 ml-[1px] rounded-md mr-1 mt-[20px] bg-[#FB6094]  "></div>
                                        <h6 className="w-full lg:w-12/12 text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                          Second Applicant Proofs
                                        </h6>
                                      </div>
                                      <div className="flex flex-wrap">
                                        <div className="w-full lg:w-4/12 mt-[-6px] ">
                                          <div className="relative w-full mb-3 mt-2">
                                            <label
                                              htmlFor={'dob1'}
                                              className="text-gray-500 text-[10px]"
                                            >
                                              Date Of Birth
                                            </label>
                                            <span className="inline">
                                              <DatePicker
                                                className="h-8 outline-none border-t-0 border-l-0 border-r-0 border-gray-500 text-sm border-solid mt-[-4px] pb-1  min-w-[125px]  inline  text-[#0091ae]   lg:w-4/12 w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] "
                                                label="Dated"
                                                name="dob2"
                                                selected={formik.values.dob2}
                                                onChange={(date) => {
                                                  formik.setFieldValue(
                                                    'dob2',
                                                    date.getTime()
                                                  )
                                                  setStartDate(date)
                                                  // console.log(startDate)
                                                }}
                                                timeFormat="HH:mm"
                                                injectTimes={[
                                                  setHours(setMinutes(d, 1), 0),
                                                  setHours(
                                                    setMinutes(d, 5),
                                                    12
                                                  ),
                                                  setHours(
                                                    setMinutes(d, 59),
                                                    23
                                                  ),
                                                ]}
                                                dateFormat="MMMM d, yyyy"
                                              />
                                            </span>
                                          </div>
                                        </div>

                                        <div className="w-full lg:w-8/12 pl-4 ">
                                          <section className="mt-4">
                                            <NoBorderDropDown
                                              options={[
                                                {
                                                  label: 'Divorced',
                                                  value: 'Divorced',
                                                },
                                                {
                                                  label: 'Married',
                                                  value: 'Married',
                                                },
                                                {
                                                  label: 'Single',
                                                  value: 'Single',
                                                },
                                              ]}
                                              setRefDropFun={(val) => {
                                                console.log('value is ', val)
                                                formik.setFieldValue(
                                                  'marital2',
                                                  val
                                                )
                                              }}
                                              selRefDrop={
                                                formik.values.marital2
                                              }
                                            />
                                          </section>
                                        </div>
                                      </div>
                                      <div className="w-full flex flex-row">
                                        <div className="  px-">
                                          <div className="relative w-[130px] mb-3 mt-2">
                                            <TextField2
                                              label="PAN No"
                                              name="panNo2"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div className=" ml-3 ">
                                          <div className="relative  mt-5">
                                            <div>
                                              <label
                                                htmlFor="formFile3"
                                                className="form-label cursor-pointer inline-block mb-2  font-regular text-xs bg-[#efef] rounded-2xl px-2 py-1 min-w-[130px] "
                                              >
                                                {`${
                                                  panCard2 === ''
                                                    ? 'Upload'
                                                    : 'Download'
                                                } Pan Card`}
                                              </label>
                                              {panCard2 != '' && (
                                                <button
                                                  onClick={() =>
                                                    downloadImage(
                                                      panCard2,
                                                      'pancard2.PNG'
                                                    )
                                                  }
                                                >
                                                  {' '}
                                                  <ArrowCircleDownIcon className="w-4 h-4 cursor-pointer ml-1 mb-[9px] mr-2 inline-block text-gray-400 " />
                                                </button>
                                              )}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id="formFile3"
                                                onChange={async (e) => {
                                                  await handleFileUploadFun(
                                                    e.target.files[0],
                                                    'panCard2'
                                                  )
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="w-full flex flex-row">
                                        {/* <div className="w-full lg:w-8/12 pl-4">
                                          <div className="relative w-full mb-3 mt-2">
                                            <TextField2
                                              label="Aadhar Upload"
                                              name="aadharUrl1"
                                              type="text"
                                            />
                                          </div>
                                        </div> */}
                                        <div className=" ">
                                          <div className="relative w-[130px] mb-3 mt-2">
                                            <TextField2
                                              label="Aadhar No"
                                              name="aadharNo2"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <div className="relative w-full mt-5 ml-3">
                                            <div className=" flex flex-row">
                                              <label
                                                htmlFor="formFile4"
                                                className="form-label cursor-pointer inline-block mb-2  font-regular text-xs bg-[#efef] rounded-2xl px-2 py-1 min-w-[130px]"
                                              >
                                                {`${
                                                  aadhrUrl2 === ''
                                                    ? 'Upload'
                                                    : 'Download'
                                                } Aadhar Card`}
                                              </label>
                                              {aadhrUrl2 != '' && (
                                                <button
                                                  onClick={() =>
                                                    downloadImage(
                                                      aadhrUrl2,
                                                      'Aadhar2.PNG'
                                                    )
                                                  }
                                                >
                                                  {' '}
                                                  <ArrowCircleDownIcon className="w-4 h-4 cursor-pointer ml-1 mb-[9px] mr-2 inline-block text-gray-400 " />
                                                </button>
                                              )}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id="formFile4"
                                                onChange={(e) => {
                                                  console.log('iwas clicked aadharno 2')
                                                  handleFileUploadFun(
                                                    e.target.files[0],
                                                    'aadharNo2Url'
                                                  )
                                                }
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </section>
                                </div>

                                {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}
                                <section
                                  className="rounded-md  p-4 mt-6 bg-[#fff]"
                                  style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                >
                                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
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
                                <section
                                  className="rounded-md  p-4 mt-6 bg-[#fff]"
                                  style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                >
                                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                    Professional Information
                                  </h6>
                                  <div className="flex flex-wrap">
                                    <div className="w-full lg:w-4/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Industry"
                                          name="industry"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-4/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Job Designation"
                                          name="designation"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full lg:w-4/12 px-4">
                                      <div className="relative w-full mb-3">
                                        <TextField2
                                          label="Annual Income"
                                          name="annualIncome"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>
                                {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}
                                <section
                                  className="rounded-md  p-4 mt-6 bg-[#fff]"
                                  style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                >
                                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
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
                                {/* <hr className="mt-6 border-b-1 border-blueGray-300" />

                                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                  Source Of Booking
                                </h6>
                                <div className="flex flex-wrap">
                                  <div className="w-full lg:w-12/12 px-4">
                                    <div className="relative w-full mb-3">
                                      <TextField2
                                        label="Source"
                                        name="bookingSource"
                                        type="text"
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full lg:w-12/12 px-4">
                                    <div className="relative w-full mb-3">
                                      <TextField2
                                        label="Booked By"
                                        name="bookedBy"
                                        type="text"
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full lg:w-12/12 px-4">
                                    <div className="relative w-full mb-3">
                                      <TextField2
                                        label="Purpose of purchase"
                                        name="purchasePurpose"
                                        type="text"
                                      />
                                    </div>
                                  </div>
                                </div> */}

                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                              </section>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                    <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse py-3 mr-6 flex flex-col mt-2 z-10 flex flex-row justify-between mt-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                      <button
                        className="bg-green-400 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="submit"
                        disabled={loading}
                      >
                        {'Save'}
                      </button>
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

export default AddApplicantDetails
