/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// import { Link, routes } from '@redwoodjs/router'

import { Fragment, useState, useEffect } from 'react'

// import { XIcon } from '@heroicons/react/outline'
import {
  ExclamationCircleIcon,
  ExclamationIcon,
  PhoneIcon,
  ShieldExclamationIcon,
  UserIcon,
} from '@heroicons/react/outline'
import CheckCircleIcon from '@heroicons/react/solid/CheckCircleIcon'
import { Box, LinearProgress, useTheme } from '@mui/material'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { MetaTags } from '@redwoodjs/web'

import LLeadsTableView from 'src/components/LLeadsTableView/LLeadsTableView'
import { USER_ROLES } from 'src/constants/userRoles'
import {
  getCRMCustomerByProject,
  getFinanceTransactionsByStatus,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { CustomSelect } from 'src/util/formFields/selectBoxField'

import CircleProgress from '../Charts_Graphs/CircleProgress'
import LeadScoreProgress from '../Charts_Graphs/leadScoreProgress'
import SemiCircleProgress from '../Charts_Graphs/SemiCircleProgress'
import SmallCircleProgress from '../Charts_Graphs/smallCircle'
import TaskProgress from '../Charts_Graphs/TaskProgress'
import CardItem from '../leadsCard'
import SiderForm from '../SiderForm/SiderForm'

import FinanceTableView from './financeTableView'

const agreementItems = [
  {
    item: 'EC',
    status: 'completed',
  },
  {
    item: 'Customer Approve',
    status: 'completed',
  },
  {
    item: 'Franking Charges',
    status: 'pending',
  },
  {
    item: 'Purchase Stamp Duty',
    status: 'pending',
  },
  {
    item: 'Sign',
    status: 'pending',
  },
  {
    item: 'Save',
    status: 'completed',
  },
  {
    item: 'Share',
    status: 'completed',
  },
]
const loanItems = [
  {
    item: 'KYC',
    status: 'completed',
  },
  {
    item: 'Sanction Letter',
    status: 'completed',
  },
  {
    item: 'Builder Noc',
    status: 'pending',
  },
  {
    item: 'EC',
    status: 'pending',
  },
  {
    item: 'Demand Letter',
    status: 'pending',
  },
  {
    item: 'Receipt',
    status: 'completed',
  },
  {
    item: 'CS',
    status: 'completed',
  },
  {
    item: 'Agreement',
    status: 'completed',
  },
]
const modifyItems = [
  {
    item: 'New Modification',
    status: 'completed',
  },
  {
    item: 'Engineer Approval',
    status: 'completed',
  },
  {
    item: 'Quotation',
    status: 'pending',
  },
  {
    item: 'Cust Approval',
    status: 'pending',
  },
]
const CrmRegisterModeHome = ({ leadsTyper }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false)

  // kanban board
  const [ready, setReady] = useState(false)

  const [addLeadsTypes, setAddLeadsTypes] = useState('')
  const [selUserProfile, setSelUserProfile] = useState({})
  const [leadsFetchedData, setLeadsFetchedData] = useState([])
  const [serialLeadsData, setSerialLeadsData] = useState([])
  const [projectList, setprojectList] = useState([])
  const [transactionData, setTransactionData] = useState({})
  const [selMenTitle, setSelMenuTitle] = useState('agreeement_home')
  const [selMenuItem, setSelMenuItem] = useState(agreementItems)
  const [selSubMenu, setSelSubMenu] = useState('summary')

  const [selSubMenu1, setSelSubMenu1] = useState('summary')

  selSubMenu

  const [value, setValue] = useState('latest')
  const DocumentationHeadA = [
    { lab: 'All Transactions', val: 'all' },
    { lab: 'For onBoarding', val: 'latest' },
    { lab: 'For Agreement', val: 'reviewing' },
    { lab: 'For Registration', val: 'cleared' },
    { lab: 'For Bank Loan', val: 'rejected' },
    { lab: 'For Position', val: 'rejected' },
  ]
  const perResisterTableHeadA = [
    { lab: 'Asset Details', val: 'all' },
    // { lab: 'Welcome Formalities', val: 'latest' },
    { lab: 'Payment Pending', val: 'reviewing' },
    { lab: 'Payment Review', val: 'cleared' },
    { lab: 'Agreement Payment', val: 'cleared' },
    { lab: 'Review Meeting', val: 'rejected' },
    { lab: 'Agreement Doc', val: 'rejected' },
    { lab: 'Agreement Schedule', val: 'rejected' },
    { lab: 'Bank Loan Approval ', val: 'rejected' },
    { lab: 'Modifications', val: 'rejected' },
    // { lab: 'Constuction Progress', val: 'rejected' },
    { lab: 'Legal Review', val: 'rejected' },
    { lab: '', val: 'rejected' },
    { lab: 'Comments', val: 'rejected' },
  ]
  const bookingReviewTableHeadA = [
    { lab: 'Asset Details', val: 'all' },
    // { lab: 'Booking Amont Review', val: 'amount', align: 'right' },
    { lab: 'Formalities', val: 'formalities', align: 'left' },
    // { lab: 'Comments', val: 'comments' },
    // { lab: 'Payment Pending', val: 'reviewing' },
    // { lab: 'KYC', val: 'latest' },
    // { lab: 'Welcome Formalities', val: 'latest' },
    // { lab: 'Payment Schedule', val: 'latest' },
    // { lab: 'Sales Manager', val: 'latest' },
    // { lab: 'Comments', val: 'latest' },
  ]

  const postResisterTableHeadA = [
    { lab: 'Asset Details', val: 'all' },
    { lab: 'Follow up Call', val: 'latest' },
    { lab: 'Payment Pending', val: 'reviewing' },
    { lab: 'Payment Review', val: 'cleared' },
    { lab: 'Bank Pending', val: 'rejected' },
    { lab: 'Bank Review', val: 'rejected' },
    { lab: 'Registration Doc', val: 'rejected' },
    { lab: 'Registration Schedule', val: 'rejected' },
    { lab: 'Position', val: 'rejected' },
    { lab: 'Constuction Progress', val: 'rejected' },
    { lab: 'Queries', val: 'rejected' },
  ]
  const queriesTableHeadA = [
    { lab: 'Asset Details', val: 'all' },
    { lab: 'Category', val: 'latest' },
    { lab: 'Query Description', val: 'reviewing' },
    { lab: 'Assigned To', val: 'cleared' },
    { lab: 'Due Date', val: 'rejected' },
  ]
  const preRegisterDummy = [
    {
      assetName: 'Plot-101',
      ownerName: 'Rajesh',
      ph: '9849000521',
      welcome: '2 days Due',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      upcom: { amount: '₹ 2,00,000', event: '31 Dec' },
      Adoc: { status: 'review', due: '2 days Due' },
      Asch: '31 Dec',
      Rdoc: 'NA',
      RSch: 'NA',
      BL: 'Approved',
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'modificatoin request',
      paymentStatus: 'completed',
    },
    {
      assetName: 'Plot-104',
      ownerName: 'Gopi',
      ph: '9030192920',
      welcome: 'Done',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      upcom: { amount: '₹ 2,00,000', event: '31 Dec' },
      Adoc: { status: 'Done', due: '' },
      Asch: 'Done',
      Rdoc: { status: 'review', due: '2 days Due' },
      RSch: '31 Dec',
      BL: 'Approved',
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'Asset Swap',
      paymentStatus: 'pending',
    },
    {
      assetName: 'Plot-105',
      ownerName: 'Monesh',
      ph: '9030192920',
      welcome: 'Done',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      upcom: { amount: '₹ 2,00,000', event: '31 Dec' },
      Adoc: { status: 'Done', due: '' },
      Asch: 'Done',
      Rdoc: { status: 'review', due: '2 days Due' },
      RSch: '31 Dec',
      BL: 'Approved',
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'Asset Swap',
      paymentStatus: 'pending',
    },
  ]
  const postRegisterDummy = [
    {
      assetName: 'Plot-121',
      ownerName: 'Swethan',
      ph: '9849000521',
      followCall: '2 days Due',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      Bpend: '₹ 0',
      Breviw: '₹ 1,00,000',
      position: { status: 'Registration, Construction', due: '2 days Due' },
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'modificatoin request',
    },
    {
      assetName: 'Plot-124',
      ownerName: 'Anuradha',
      ph: '9030192920',
      followCall: 'Done',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      Bpend: '₹ 0',
      Breviw: '₹ 1,00,000',
      position: { status: 'Registration, Construction', due: '2 days Due' },
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'modificatoin request',
    },
    {
      assetName: 'Plot-145',
      ownerName: 'Monesh',
      ph: '9030192920',
      followCall: 'Done',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      Bpend: '₹ 0',
      Breviw: '₹ 1,00,000',
      position: { status: 'Registration, Construction', due: '2 days Due' },
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'modificatoin request',
    },
  ]
  const queriesDummy = [
    {
      assetName: 'Plot-121',
      ownerName: 'Swethan',
      ph: '9849000521',
      cat: 'Legal',
      desc: 'Request of EC',
      assign: 'Legal Team',
      due: '2 days due',
    },
    {
      assetName: 'Plot-124',
      ownerName: 'Anuradha',
      ph: '9030192920',
      cat: 'Legal',
      desc: 'Request of EC',
      assign: 'Legal Team',
      due: '2 days due',
    },
    {
      assetName: 'Plot-145',
      ownerName: 'Monesh',
      ph: '9030192920',
      cat: 'Legal',
      desc: 'Request of EC',
      assign: 'Legal Team',
      due: '2 days due',
    },
  ]
  const bookingReviewDummy = [
    {
      assetName: 'Plot-121',
      ownerName: 'Swethan',
      ph: '9849000521',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      Bpend: '₹ 0',
      Breviw: '₹ 1,00,000',
      kyc: 'completed',
      welcomeFormalaties: 'Done',
      paymentSchedule: 'Shared',
      saleManagerApproval: 'Done',
      comment: 'na',
    },
    {
      assetName: 'Plot-124',
      ownerName: 'Anuradha',
      ph: '9030192920',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      Bpend: '₹ 0',
      Breviw: '₹ 1,00,000',
      kyc: 'completed',
      welcomeFormalaties: 'Done',
      paymentSchedule: 'Shared',
      saleManagerApproval: 'Done',
      comment: 'na',
    },
    {
      assetName: 'Plot-145',
      ownerName: 'Monesh',
      pend: '₹ 0',
      reviw: '₹ 1,00,000',
      Bpend: '₹ 0',
      Breviw: '₹ 1,00,000',
      kyc: 'completed',
      welcomeFormalaties: 'Done',
      paymentSchedule: 'Shared',
      saleManagerApproval: 'Done',
      comment: 'na',
    },
  ]
  const [tabHeadFieldsA, setTabHeadFields] = useState(DocumentationHeadA)
  const [tableHeadFieldsA, setTableHeadFieldsA] = useState(
    perResisterTableHeadA
  )
  const [tableData, setTableDataA] = useState(preRegisterDummy)

  const [selCategory, setSelCategory] = useState('booking_review')

  const QueriesHeadA = [
    { lab: 'All', val: 'all' },
    { lab: 'Finance', val: 'latest' },
    { lab: 'Legal', val: 'legal' },
    { lab: 'Construction', val: 'cleared' },
    { lab: 'Other', val: 'rejected' },
  ]
  const FinanceHeadA = [
    { lab: 'All', val: 'all' },
    { lab: 'Customer Estimates', val: 'latest' },
    { lab: 'Bank Estimates', val: 'legal' },
    { lab: 'Payment Review', val: 'cleared' },
    { lab: 'Other', val: 'rejected' },
  ]
  const LegalHeadA = [
    { lab: 'All', val: 'all' },
    { lab: 'EC', val: 'latest' },
    { lab: 'Agreement Doc', val: 'legal' },
    { lab: 'Registration Doc', val: 'cleared' },
    { lab: 'Other', val: 'rejected' },
  ]
  const ConstructionHeadA = [
    { lab: 'All', val: 'all' },
    { lab: 'For onBoarding', val: 'latest' },
    { lab: 'For Agreement', val: 'latest' },
    { lab: 'For Registration', val: 'legal' },
    { lab: 'For Bank Loan', val: 'cleared' },
    { lab: 'Other', val: 'rejected' },
  ]

  useEffect(() => {
    getLeadsDataFun()
  }, [])
  useEffect(() => {
    if (selMenTitle === 'agreeement_home') {
      setSelMenuItem(agreementItems)
    } else if (selMenTitle === 'loan_home') {
      setSelMenuItem(loanItems)
    } else {
      setSelMenuItem(modifyItems)
    }
  }, [selMenTitle])

  useEffect(() => {
    // if (selCategory === 'manage') {
    //   setTabHeadFields(DocumentationHeadA)
    // } else if (selCategory === 'Query') {
    //   setTabHeadFields(QueriesHeadA)
    // } else if (selCategory === 'Finance') {
    //   setTabHeadFields(FinanceHeadA)
    // } else if (selCategory === 'Legal') {
    //   setTabHeadFields(LegalHeadA)
    // } else if (selCategory === 'Construction') {
    //   setTabHeadFields(ConstructionHeadA)
    // }

    if (selCategory === 'pre_register') {
      setTableDataA(preRegisterDummy)
      setTableHeadFieldsA(perResisterTableHeadA)
    } else if (selCategory === 'post_register') {
      setTableDataA(postRegisterDummy)
      setTableHeadFieldsA(postResisterTableHeadA)
    } else if (selCategory === 'queries') {
      setTableDataA(queriesDummy)
      setTableHeadFieldsA(queriesTableHeadA)
    } else if (selCategory === 'booking_review') {
      setTableDataA(bookingReviewDummy)
      setTableHeadFieldsA(bookingReviewTableHeadA)
    }
  }, [selCategory])

  const rowsCounter = (parent, searchKey) => {
    return parent.filter((item) => {
      if (searchKey === 'all') {
        return item
      } else if (item.status.toLowerCase() === searchKey.toLowerCase()) {
        console.log('All1', item)
        return item
      }
    })
  }

  const getLeadsDataFun = async () => {
    console.log('login role detials', user)
    const { access, uid } = user

    if (access?.includes('manage_leads')) {
      const unsubscribe = getCRMCustomerByProject(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })
          // setBoardData
          console.log('my Array data is ', usersListA, leadsFetchedData)
          // await serealizeData(usersListA)
          await setLeadsFetchedData(usersListA)
          await console.log('my Array data is set it', leadsFetchedData)
        },
        {
          status: [
            'latest',
            'reviewing',
            'review',
            'cleared',
            'rejected',
            '',
            // 'booked',
          ],
        },
        () => setLeadsFetchedData([])
      )
      return unsubscribe
    } else {
      const unsubscribe = getCRMCustomerByProject(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })
          // setBoardData
          console.log('my Array data is ', usersListA)
          await serealizeData(usersListA)
          await setLeadsFetchedData(usersListA)
        },
        {
          uid: uid,
          status: [
            'new',
            'reviewing',
            'review',
            'cleared',
            'rejected',
            '',
            // 'booked',
          ],
        },
        () => setLeadsFetchedData([])
      )
      return unsubscribe
    }

    // await console.log('leadsData', leadsData)
  }

  const serealizeData = (array) => {
    // let newData =
    const x = [
      'new',
      'review',
      'cleared',
      'rejected',
      '',
      // 'booked',
    ].map((status) => {
      const items = array.filter((data) => data.Status.toLowerCase() == status)

      return { name: status, items }
    })
    setSerialLeadsData(x)
  }

  const selUserProfileF = (title, data) => {
    setAddLeadsTypes(title)
    setisImportLeadsOpen(true)
    setSelUserProfile(data)
  }

  const viewTransaction = (docData, sideViewCategory, sideViewCategory1) => {
    setSelSubMenu(sideViewCategory)
    setSelSubMenu1(sideViewCategory1)
    setTransactionData(docData)
    setisImportLeadsOpen(!isImportLeadsOpen)
    setSelUserProfile(docData)
  }
  return (
    <>
      <div className="bg-white rounded">
        <div className="">
          <div
            className="
            "
          >
            <div className="items-center justify-between rounded-md my-1 py-2 px-2 bg-white ">
              {/* <div>
                <h2 className="text-lg font-semibold text-gray-900 leading-light py-2 ">
                  Accounts Transactions Space
                </h2>
              </div> */}
              <div className="flex flex-row">
                {/* section 1 */}
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <h2 className="headTxt1 font-semibold text-[11px] ml-2">
                      CATEGORY
                    </h2>
                    <span className="headTxt1 font-semibold text-[11px] ml-4 bg-[#d6e9ed] text-[#53a0a3] px-2 rounded-md ">
                      10
                    </span>
                  </div>
                  <section className="flex flex-row justify-between">
                    <section className="flex flex-row mt-2 mr-1  mb-1 leading-7 text-gray-900  rounded-lg  ">
                      {[
                        { count: 2, name: 'BOOKING REVIEW', color: '000000' },
                      ].map((dat, i) => (
                        <div className=" m-1" key={i}>
                          <div
                            key={i}
                            className={`border-[#E5EAF2] rounded-xl border w-30`}
                            onClick={() => setSelCategory('booking_review')}
                          >
                            <section>
                              <div className="px-2 py-2 flex flex-row justify-between">
                                <h3 className=" css-5mn5yy text-sm">
                                  {dat.count}
                                </h3>
                              </div>
                              <div
                                className={`flex flex-row justify-between ${
                                  selCategory === 'booking_review'
                                    ? 'bg-gradient-to-r from-orange-300 to-rose-300'
                                    : 'bg-[#F7F7F7]'
                                }  `}
                                style={{
                                  borderBottomLeftRadius: '12px',
                                  borderBottomRightRadius: '12px',
                                }}
                              >
                                <div className=" flexCenter p-2">
                                  <span
                                    className={`w-2 h-2 rounded-full bg-[#${dat.color}]`}
                                  ></span>
                                  <span
                                    className={`css-1lpgd8m text-[#${dat.color}] text-[10px]`}
                                  >
                                    {dat.name}
                                  </span>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      ))}
                    </section>
                  </section>
                </div>
                <div className="flex flex-col ml-3 mt-2">
                  <section className="flex flex-row justify-between pt-4">
                    <section className="flex flex-row mt-2 mr-1  mb-1 leading-7 text-gray-900  rounded-lg  ">
                      {[
                        { count: 2, name: 'PRE AGREEMENT', color: '000000' },
                      ].map((dat, i) => (
                        <div className=" m-1" key={i}>
                          <div
                            key={i}
                            className=" border-[#E5EAF2] rounded-xl border w-30"
                            onClick={() => setSelCategory('pre_register')}
                          >
                            <section>
                              <div className="px-2 py-2 flex flex-row justify-between">
                                <h3 className=" css-5mn5yy text-sm">
                                  {dat.count}
                                </h3>
                              </div>
                              <div
                                className={`flex flex-row justify-between ${
                                  selCategory === 'pre_register'
                                    ? 'text-black bg-gradient-to-r from-orange-300 to-rose-300'
                                    : 'bg-[#F7F7F7]'
                                }  `}
                                style={{
                                  borderBottomLeftRadius: '12px',
                                  borderBottomRightRadius: '12px',
                                }}
                              >
                                <div className=" flexCenter p-2">
                                  <span
                                    className={`w-2 h-2 rounded-full bg-[#${dat.color}]`}
                                  ></span>
                                  <span
                                    className={`css-1lpgd8m text-[#${dat.color}] text-[10px]`}
                                  >
                                    {dat.name}
                                  </span>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      ))}
                    </section>
                  </section>
                </div>
                {/* <div className="flex flex-col ml-3 mt-2">
                  <section className="flex flex-row justify-between pt-4">
                    <section className="flex flex-row mt-2 mr-1  mb-1 leading-7 text-gray-900  rounded-lg  ">
                      {[
                        { count: 2, name: 'POST REGISTER', color: '209653' },
                      ].map((dat, i) => (
                        <div className=" m-1" key={i}>
                          <div
                            key={i}
                            className=" border-[#E5EAF2] rounded-xl border w-30"
                            onClick={() => setSelCategory('post_register')}
                          >
                            <section>
                              <div className="px-2 py-2 flex flex-row justify-between">
                                <h3 className=" css-5mn5yy text-sm">
                                  {dat.count}
                                </h3>
                              </div>
                              <div
                                className="flex flex-row justify-between bg-[#F7F7F7]"
                                style={{
                                  borderBottomLeftRadius: '12px',
                                  borderBottomRightRadius: '12px',
                                }}
                              >
                                <div className=" flexCenter p-2">
                                  <span
                                    className={`w-2 h-2 rounded-full bg-[#${dat.color}]`}
                                  ></span>
                                  <span
                                    className={`css-1lpgd8m text-[#${dat.color}] text-[10px]`}
                                  >
                                    {dat.name}
                                  </span>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      ))}
                    </section>
                  </section>
                </div> */}
                {/* section 2 */}
                <div className="flex flex-col ml-3 mt-2">
                  <section className="flex flex-row justify-between pt-4">
                    <section className="flex flex-row mt-2 mr-1  mb-1 leading-7 text-gray-900  rounded-lg  ">
                      {[
                        { count: 2, name: 'POST AGREEMENT', color: '000000' },
                      ].map((dat, i) => (
                        <div className=" m-1" key={i}>
                          <div
                            key={i}
                            className=" border-[#E5EAF2] rounded-xl border w-30"
                            onClick={() => setSelCategory('post_register')}
                          >
                            <section>
                              <div className="px-2 py-2 flex flex-row justify-between">
                                <h3 className=" css-5mn5yy text-sm">
                                  {dat.count}
                                </h3>
                              </div>
                              <div
                                className={`flex flex-row justify-between ${
                                  selCategory === 'post_register'
                                    ? 'bg-gradient-to-r from-orange-300 to-rose-300'
                                    : 'bg-[#F7F7F7]'
                                }  `}
                                style={{
                                  borderBottomLeftRadius: '12px',
                                  borderBottomRightRadius: '12px',
                                }}
                              >
                                <div className=" flexCenter p-2">
                                  <span
                                    className={`w-2 h-2 rounded-full bg-[#${dat.color}]`}
                                  ></span>
                                  <span
                                    className={`css-1lpgd8m text-[#${dat.color}] text-[10px]`}
                                  >
                                    {dat.name}
                                  </span>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      ))}
                    </section>
                  </section>
                </div>
                {/* section 3 */}
                <div className="flex flex-col ml-3 mt-6">
                  <section className="flex flex-row justify-between">
                    <section className="flex flex-row mt-2 mr-1  mb-1 leading-7 text-gray-900  rounded-lg  ">
                      {[{ count: 4, name: 'QUERIES', color: 'F59A4C' }].map(
                        (dat, i) => (
                          <div className=" m-1" key={i}>
                            <div
                              key={i}
                              className=" border-[#E5EAF2] rounded-xl border w-30"
                              onClick={() => setSelCategory('queries')}
                            >
                              <section>
                                <div className="px-2 py-2 flex flex-row justify-between">
                                  <h3 className=" css-5mn5yy text-sm">
                                    {dat.count}
                                  </h3>
                                </div>
                                <div
                                  className={`flex flex-row justify-between ${
                                    selCategory === 'queries'
                                      ? 'bg-[#FFD700]'
                                      : 'bg-[#F7F7F7]'
                                  }  `}
                                  style={{
                                    borderBottomLeftRadius: '12px',
                                    borderBottomRightRadius: '12px',
                                  }}
                                >
                                  <div className=" flexCenter p-2">
                                    <span
                                      className={`w-2 h-2 rounded-full bg-[#${dat.color}]`}
                                    ></span>
                                    <span
                                      className={`css-1lpgd8m text-[#${dat.color}] text-[10px]`}
                                    >
                                      {dat.name}
                                    </span>
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        )
                      )}
                    </section>
                  </section>
                </div>
              </div>

              <div className="flex px-6">
                {leadsTyper == 'inProgress' && (
                  <span className="inline-flex p-1 border bg-gray-200 rounded-md">
                    <button
                      className={`px-2 py-1  rounded ${
                        ready ? 'bg-white shadow' : ''
                      }`}
                      onClick={() => setReady(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                        />
                      </svg>
                    </button>
                    <button
                      className={`px-2 py-1  rounded ${
                        !ready ? 'bg-white shadow' : ''
                      }`}
                      onClick={() => setReady(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                <></>
              </div>
            </div>

            <MetaTags title="ExecutiveHome" description="ExecutiveHome page" />

            {!ready && (
              <div className="overflow-hidden  px-1 pb-1 rounded-md">
                <div className="flex flex-col app-bg-white-1  pb-10">
                  <div className="flex flex-row pt-[1px]">
                    <span className="text-lg font-bold app-color-black"></span>
                  </div>

                  {selCategory === 'booking_review' &&
                    leadsFetchedData.map((finData, i) => (
                      <section
                        key={i}
                        className="border mb-1 rounded-sm w-[765px] shadow"
                      >
                        <section className="flex flex-row">
                          <div className="flex flex-row py-2 ml-4 mt- mr-[1px]">
                            <div className="flex flex-col w-[81px] bg-gradient-to-r from-orange-300 to-rose-300 text-black p-2 rounded-md py-4">
                              <span className="font-semibold text-sm app-color-black">
                                {finData?.assetName}
                              </span>
                              <span className="font-normal text-xs app-color-gray-1">
                                Eco Stone
                              </span>
                              {/* <span className="font-normal text-xs app-color-gray-1">
                                  {finData?.ph}
                                </span> */}
                            </div>
                          </div>
                          <div className="flex flex-col-reverse ml-3">
                            <div className="flex flex-wrap  p-1 pl-0 pt-0 pb-0  mb-[16px] bg-[#F1F5F9]">
                              {[
                                {
                                  item: 'Manager Approval',
                                  status: 'completed',
                                },
                                {
                                  item: 'Payment Schedule',
                                  status: 'completed',
                                },

                                {
                                  item: 'Cost Sheet',
                                  status: 'completed',
                                },
                                {
                                  item: 'Welcome Call',
                                  status: 'pending',
                                },
                                { item: 'KYC', status: 'pending' },

                                {
                                  item: 'Bank Loan',
                                  status: 'pending',
                                },
                              ].map((dat, i) => (
                                <span
                                  key={i}
                                  className={`pl-2 pr-1 py-[4px] mr-2  text-[#333] bg-[#${
                                    dat.status === 'completed'
                                      ? 'F1F5F9'
                                      : 'F1F5F9'
                                  }] font-bodyLato text-[10px] flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease`}
                                >
                                  {dat?.item}
                                  {dat?.status === 'completed' && (
                                    <CheckCircleIcon className="w-4 h-4 ml-1 inline text-[#3EE494]" />
                                  )}
                                  {dat?.status === 'pending' && (
                                    <ShieldExclamationIcon className="w-4 h-4 ml-1 inline text-[##8e544d]" />
                                  )}

                                  {/* <button className="bg-transparent hover focus:outline-none">
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="times"
                                      className="w-2 ml-3"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 352 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                      ></path>
                                    </svg>
                                  </button> */}
                                </span>
                              ))}
                            </div>
                            {/* <div className="w-[300px] ml-[150px] h-[1px] bg-[#efefef] mt-2 rounded-xl text-center"></div> */}
                            <div className="flex flex-row justify-between px-2 py-1  text-black   w-[640px]">
                              <section>
                                <span className="font-normal text-sm text-uppercase app-color-gray-1 inline-block max-w-[100px] min-w-[100px] w-[100px] mb-[4px]">
                                  {finData?.ownerName}
                                </span>
                                <span className="font-normal ml-4 text-xs app-color-gray-1 inline-block max-w-[100px] min-w-[100px] w-[100px]">
                                  {finData?.ph}
                                </span>
                              </section>
                              <section className="inline-block max-w-[100px] min-w-[100px] w-[100px]">
                                <span className="font-normal ml-6 text-[10px] app-color-gray-1 text-[#b3b3b3]">
                                  Bal
                                </span>
                                <span className="font-normal ml-2 text-xs app-color-gray-1 text-[#F59A4C]">
                                  {finData?.pending || 0}
                                </span>
                              </section>
                              <section className="inline-block max-w-[400px] min-w-[100px]">
                                <span className="font-normal ml-6 text-[10px] app-color-gray-1 text-[#b3b3b3]">
                                  Review
                                </span>
                                <span className="font-normal ml-2 text-xs app-color-gray-1">
                                  {finData?.reviw || 0}
                                </span>
                              </section>
                              <section className="inline-block max-w-[400px] min-w-[100px] text-right">
                                <span className="font-normal ml-6 text-[10px] app-color-gray-1 text-[#b3b3b3]">
                                  T Cost
                                </span>
                                <span className="font-normal ml-2 text-xs app-color-gray-1 text-right">
                                  {finData?.Breviw || 0}
                                </span>
                              </section>
                            </div>
                          </div>
                        </section>
                      </section>
                    ))}
                  {selCategory === 'pre_register' &&
                    leadsFetchedData.map((finData, i) => {
                      const {
                        uid,
                        assets,
                        customerDetailsObj,
                        customerName1,
                        phoneNo1,
                      } = finData
                      return (
                        <section
                          key={i}
                          className="flex flex-row border mb-1  shadow"
                        >
                          <div className="flex flex-row  mt- mr-[1px]">
                            <div
                              className="flex flex-col w-[181px] bg-gradient-to-r from-orange-300 to-rose-300 text-black p-2 rounded-sm py-4"
                              onClick={() =>
                                viewTransaction(
                                  finData,
                                  'unit_information',
                                  'unit_information'
                                )
                              }
                            >
                              <section className="flex flex-row">
                                <img
                                  className="w-10 h-10 mr-2"
                                  alt=""
                                  src="/apart.svg"
                                ></img>
                                <section className="flex flex-col ml-2 max-w-[100px] ">
                                  <span className="font-semibold text-sm app-color-black">
                                    {finData?.[`${assets[0]}_unitDetails`]
                                      ?.unit_no || ''}
                                  </span>
                                  <span className="text-xs">{customerName1}</span>
                                  <span className="font-normal text-xs app-color-gray-1">
                                    Eco Stone
                                  </span>
                                </section>
                              </section>

                              {/* <span className="font-normal text-xs app-color-gray-1">
                                  {finData?.ph}
                                </span> */}
                            </div>
                          </div>
                          <Box my={2} mx={2}>
                <div className="flex flex-col">
                  {[
                    { item: 'Total', value: 100 },
                    { item: 'Balance', value: 80 },

                  ].map((data, i) => (
                    <div className="flex inline-block mt-2" key={i}>
                      <div className="flex flex-row align-middle justify-between mr-1 w-12">
                        <h6 className="font-bodyLato font-semibold text-xs mt-1">
                          {(data.item)}
                        </h6>
                        <span className="font-bodyLato text-[12px] text-[#94A4C4]"></span>
                      </div>
                      <div className="inline-block ml-2">
                        <LinearProgress
                          sx={{
                            backgroundColor: 'white',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#A798FF',
                            },
                          }}
                          variant="determinate"
                          value={data.value}
                          style={{
                            backgroundColor: '#E5EAF2',
                            borderRadius: '3px',
                            height: '18px',
                            width: '10rem',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
                          {/* <CrmSubMenu
                            selMenuItem={selMenuItem}
                            viewTransaction={viewTransaction}
                            finData={finData}
                            setSelMenuTitle={setSelMenuTitle}
                          /> */}

                          <div>
                            <div className="flex flex-col hover:bg-[#F6F7FF]">
                          <div className="flex flex-wrap  p-1 pl-0 pt-0 pb-0 mt-4  mb-[4px] bg-[#F1F5F9]">
                              {[{
    item: 'Manager Approval',
    status: 'completed',
  },
  {
    item: 'Customer Approval',
    status: 'completed',
  }
]?.map((dat, i) => (
                                <span
                                  key={i}
                                  className={`pl-2 pr-1 py-[4px] mr-2  text-[#333] bg-[#${
                                    dat.status === 'completed'
                                      ? 'F1F5F9'
                                      : 'F1F5F9'
                                  }] flex flex-row justify-between font-bodyLato text-[10px] flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease`}
                                  onClick={() =>
                                    viewTransaction(
                                      finData,
                                      'finance_info',
                                      'finance_info'
                                    )
                                  }
                                >

                                  {dat?.item}
                                  {dat?.status === 'completed' && (
                                    <CheckCircleIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[#3EE494]" />
                                  )}
                                  {dat?.status === 'pending' && (
                                    <ShieldExclamationIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[##8e544d]" />
                                  )}


                                  {/* <button className="bg-transparent hover focus:outline-none">
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="times"
                                      className="w-2 ml-3"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 352 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                      ></path>
                                    </svg>
                                  </button> */}
                                </span>
                              ))}
                            </div>
                            <span
                                  className={`font-normal ml- text-[10px] text-center app-color-gray-1 text-[#435ad9]`}
                                  onClick={() => {
                                    setSelMenuTitle('agreeement_home')
                                  }}
                                >
                                 Cost Sheet Approvals
                                </span>
                            </div>
                          </div>

                          <div className="flex flex-col ml-1 hover:bg-[#F6F7FF]">
                          <div className="flex flex-wrap  p-1 pl-0 pt-0 pb-0 mt-4  mb-[4px] bg-[#F1F5F9]">
                              {[{
    item: 'Agreement Draft',
    status: 'completed',
  },
  {
    item: 'Customer Approval',
    status: 'completed',
  }
]?.map((dat, i) => (
                                <span
                                  key={i}
                                  className={`pl-2 pr-1 py-[4px] mr-2  text-[#333] bg-[#${
                                    dat.status === 'completed'
                                      ? 'F1F5F9'
                                      : 'F1F5F9'
                                  }] font-bodyLato text-[10px] flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease`}
                                  onClick={() =>
                                    viewTransaction(
                                      finData,
                                      'finance_info',
                                      'finance_info'
                                    )
                                  }
                                >
                                  {dat?.item}
                                  {dat?.status === 'completed' && (
                                    <CheckCircleIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[#3EE494]" />
                                  )}
                                  {dat?.status === 'pending' && (
                                    <ShieldExclamationIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[##8e544d]" />
                                  )}

                                  {/* <button className="bg-transparent hover focus:outline-none">
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="times"
                                      className="w-2 ml-3"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 352 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                      ></path>
                                    </svg>
                                  </button> */}
                                </span>
                              ))}
                            </div>
                            <span
                                  className={`font-normal ml- text-[10px] text-center app-color-gray-1 text-[#435ad9]`}
                                  onClick={() => {
                                    setSelMenuTitle('agreeement_home')
                                  }}
                                >
                                  AGREEMENT
                                </span>
                            </div>

                            <div className="flex flex-col ml-1 hover:bg-[#F6F7FF]">
                          <div className="flex flex-wrap  p-1 pl-0 pt-0 pb-0 mt-4  mb-[4px] bg-[#F1F5F9]">
                              {[{
    item: 'Loan KYC',
    status: 'completed',
  },
  {
    item: 'Loan Approval',
    status: 'completed',
  }
]?.map((dat, i) => (
                                <span
                                  key={i}
                                  className={`pl-2 pr-1 py-[4px] mr-2  text-[#333] bg-[#${
                                    dat.status === 'completed'
                                      ? 'F1F5F9'
                                      : 'F1F5F9'
                                  }] font-bodyLato text-[10px] flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease`}
                                  onClick={() =>
                                    viewTransaction(
                                      finData,
                                      'finance_info',
                                      'finance_info'
                                    )
                                  }
                                >
                                  {dat?.item}
                                  {dat?.status === 'completed' && (
                                    <CheckCircleIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[#3EE494]" />
                                  )}
                                  {dat?.status === 'pending' && (
                                    <ShieldExclamationIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[##8e544d]" />
                                  )}

                                  {/* <button className="bg-transparent hover focus:outline-none">
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="times"
                                      className="w-2 ml-3"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 352 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                      ></path>
                                    </svg>
                                  </button> */}
                                </span>
                              ))}
                            </div>
                            <span
                                  className={`font-normal ml- text-[10px] text-center app-color-gray-1 text-[#435ad9]`}
                                  onClick={() => {
                                    setSelMenuTitle('agreeement_home')
                                  }}
                                >
                                  Loan
                                </span>
                            </div>
                            <div className="flex flex-col ml-1 hover:bg-[#F6F7FF]">
                          <div className="flex flex-wrap  p-1 pl-0 pt-0 pb-0 mt-4  mb-[4px] bg-[#F1F5F9]">
                              {[{
    item: 'New Request',
    status: 'completed',
  },
  {
    item: 'Request Approvals',
    status: 'completed',
  }
]?.map((dat, i) => (
                                <span
                                  key={i}
                                  className={`pl-2 pr-1 py-[4px] mr-2  text-[#333] bg-[#${
                                    dat.status === 'completed'
                                      ? 'F1F5F9'
                                      : 'F1F5F9'
                                  }] font-bodyLato text-[10px] flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease`}
                                  onClick={() =>
                                    viewTransaction(
                                      finData,
                                      'finance_info',
                                      'finance_info'
                                    )
                                  }
                                >
                                  {dat?.item}
                                  {dat?.status === 'completed' && (
                                    <CheckCircleIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[#3EE494]" />
                                  )}
                                  {dat?.status === 'pending' && (
                                    <ShieldExclamationIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[##8e544d]" />
                                  )}

                                  {/* <button className="bg-transparent hover focus:outline-none">
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="times"
                                      className="w-2 ml-3"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 352 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                      ></path>
                                    </svg>
                                  </button> */}
                                </span>
                              ))}
                            </div>
                            <span
                                  className={`font-normal ml- text-[10px] text-center app-color-gray-1 text-[#435ad9]`}
                                  onClick={() => {
                                    setSelMenuTitle('agreeement_home')
                                  }}
                                >
                                  Unit Modification
                                </span>
                            </div>
                            <div className="flex flex-col ml-1 hover:bg-[#F6F7FF]">
                          <div className="flex flex-wrap  p-1 pl-0 pt-0 pb-0 mt-4  mb-[4px] bg-[#F1F5F9]">
                              {[{
    item: 'Franking Charges',
    status: 'completed',
  },
  {
    item: 'Stamp Duty',
    status: 'completed',
  }
]?.map((dat, i) => (
                                <span
                                  key={i}
                                  className={`pl-2 pr-1 py-[4px] mr-2  text-[#333] bg-[#${
                                    dat.status === 'completed'
                                      ? 'F1F5F9'
                                      : 'F1F5F9'
                                  }] font-bodyLato text-[10px] flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease`}
                                  onClick={() =>
                                    viewTransaction(
                                      finData,
                                      'finance_info',
                                      'finance_info'
                                    )
                                  }
                                >
                                  {dat?.item}
                                  {dat?.status === 'completed' && (
                                    <CheckCircleIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[#3EE494]" />
                                  )}
                                  {dat?.status === 'pending' && (
                                    <ShieldExclamationIcon className="w-3 h-3 ml-[2px] mt-[2px] inline text-[##8e544d]" />
                                  )}

                                  {/* <button className="bg-transparent hover focus:outline-none">
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="times"
                                      className="w-2 ml-3"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 352 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                      ></path>
                                    </svg>
                                  </button> */}
                                </span>
                              ))}
                            </div>
                            <span
                                  className={`font-normal ml- text-[10px] text-center app-color-gray-1 text-[#435ad9]`}
                                  onClick={() => {
                                    setSelMenuTitle('agreeement_home')
                                  }}
                                >
                                  Charges
                                </span>
                            </div>
                        </section>
                      )
                    })}
                  {selCategory === 'post_register' &&
                    tableData.map((finData, i) => (
                      <section
                        key={i}
                        className="flex flex-row border mb-1 w-[768px] shadow"
                      >
                        <div className="flex flex-row  mr-[1px]">
                          <div className="flex flex-col bg-gradient-to-r from-orange-300 to-rose-300 text-black p-2 rounded-sm py-4">
                            <span className="font-semibold text-sm app-color-black">
                              {finData?.assetName}
                            </span>
                            <span className="font-normal text-xs app-color-gray-1">
                              Eco Stone
                            </span>
                            {/* <span className="font-normal text-xs app-color-gray-1">
                                  {finData?.ph}
                                </span> */}
                          </div>
                        </div>
                        <div className="flex flex-col-reverse ml-3">
                          <div className="flex flex-wrap  p-1 pl-0 pt-0 pb-0  mb-[16px] bg-[#F1F5F9]">
                            {[
                              // { item: 'Share Agreement', status: 'completed' },
                              {
                                item: 'Register Doc Approval',
                                status: 'completed',
                              },

                              {
                                item: 'Register',
                                status: 'pending',
                              },
                              {
                                item: 'Purchase Stamp Duty',
                                status: 'pending',
                              },
                              {
                                item: 'Save',
                                status: 'pending',
                              },
                              { item: 'construct' },
                            ].map((dat, i) => (
                              <span
                                key={i}
                                className={`pl-2 pr-1 py-[4px] mr-2  text-[#333] bg-[#${
                                  dat.status === 'completed'
                                    ? 'F1F5F9'
                                    : 'F1F5F9'
                                }] font-bodyLato text-[10px] flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease`}
                              >
                                {dat?.item}
                                {dat?.status === 'completed' && (
                                  <CheckCircleIcon className="w-4 h-4 ml-1 inline text-[#3EE494]" />
                                )}
                                {dat?.status === 'pending' && (
                                  <ShieldExclamationIcon className="w-4 h-4 ml-1 inline text-[##8e544d]" />
                                )}
                                {/* {dat?.item === 'construct' && (
                                  <div>
                                    <SmallCircleProgress />
                                  </div>
                                )} */}

                                {/* <button className="bg-transparent hover focus:outline-none">
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="times"
                                      className="w-2 ml-3"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 352 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                      ></path>
                                    </svg>
                                  </button> */}
                              </span>
                            ))}
                          </div>
                          {/* <div className="w-[300px] ml-[150px] h-[1px] bg-[#efefef] mt-2 rounded-xl text-center"></div> */}
                          <div className="flex flex-row justify-between  py-2  text-black   w-[640px]">
                            <section>
                              <span className="font-normal font-Playfair text-sm text-uppercase app-color-gray-1 inline-block max-w-[100px] min-w-[100px] w-[100px] mb-[4px]">
                                {finData?.ownerName}
                              </span>
                              <span className="font-normal ml-4 text-xs app-color-gray-1 inline-block max-w-[100px] min-w-[100px] w-[100px]">
                                <PhoneIcon className="w-3 h-3 mr-1 inline text-[##8e544d]" />
                                {finData?.ph}
                              </span>
                            </section>
                            {/* <section className="inline-block max-w-[100px] min-w-[100px] w-[100px]">
                              <span className="font-normal ml-6 text-[10px] app-color-gray-1 text-[#b3b3b3]">
                                Bal
                              </span>
                              <span className="font-normal ml-2 text-xs app-color-gray-1 text-[#F59A4C]">
                                {finData?.pending || 0}
                              </span>
                            </section> */}
                            <section className="inline-block max-w-[400px] min-w-[100px] flex flex-row">
                              <span className="font-normal ml-6  mt-2 text-[10px] app-color-gray-1 text-[#b3b3b3]">
                                Bal
                              </span>
                              <span className="font-normal ml-2 text-sm mt-1 app-color-gray-1">
                                {finData?.reviw || 0}
                              </span>
                              <ShieldExclamationIcon className="w-4 h-4 ml-1  mt-1 inline text-[#83a4f5]" />
                            </section>
                            <section className="inline-block max-w-[400px] min-w-[100px] flex flex-row">
                              <span className="font-normal ml-6 mt-2 text-[10px] app-color-gray-1 text-[#b3b3b3]">
                                Paid
                              </span>
                              <span className="font-normal ml-2 text-sm mt-1 app-color-gray-1">
                                {finData?.pend || 0}
                              </span>
                              {finData?.paymentStatus === 'completed' && (
                                <CheckCircleIcon className="w-4 h-4 ml-1  mt-1 inline text-[#8becbd]" />
                              )}
                              {finData?.paymentStatus === 'pending' && (
                                <ShieldExclamationIcon className="w-4 h-4 ml-1  mt-1 inline text-[##8e544d]" />
                              )}
                            </section>

                            <section className="inline-block max-w-[400px] min-w-[100px] text-right">
                              <span className="font-normal ml-6 text-[10px] app-color-gray-1 text-[#435ad9]">
                                LOAN
                              </span>
                              <span className="font-normal ml-6 text-[10px] app-color-gray-1 text-[#435ad9]">
                                MODIFY
                              </span>
                            </section>
                          </div>
                        </div>
                      </section>
                    ))}
                  {/* <div className="flex flex-row bg-white px-[4px] py-2 relative">
                    <div className="flex w-full  ">
                      <table className="w-full pt-[1px]">
                        <thead className="">
                          <tr className="p-2">
                            <th className="w-2"></th>

                            {tableHeadFieldsA.map((dat, i) => (
                              <th
                                key={i}
                                className={` text-${
                                  dat?.align || 'left'
                                } text-xs app-color-black py-2 whitespace-nowrap px-3`}
                              >
                                <span className="ml-4">{dat.lab}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {/* {!ready && (
              <FinanceTableView
                leadsFetchedData={leadsFetchedData}
                setisImportLeadsOpen={setisImportLeadsOpen}
                selUserProfileF={selUserProfileF}
                leadsTyper={leadsTyper}
              />
            )} */}
          </div>
        </div>
      </div>
      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={'unitDetails_crm_view'}
        customerDetails={selUserProfile}
        widthClass="max-w-7xl"
        transactionData={transactionData}
        unitsViewMode={false}
        selCustomerPayload={selUserProfile}
        selSubMenu={selSubMenu}
        selSubMenu2={selSubMenu1}
      />
    </>
  )
}

export default CrmRegisterModeHome
