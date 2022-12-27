/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// import { Link, routes } from '@redwoodjs/router'

import { Fragment, useState, useEffect } from 'react'

// import { XIcon } from '@heroicons/react/outline'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { MetaTags } from '@redwoodjs/web'

import LLeadsTableView from 'src/components/LLeadsTableView/LLeadsTableView'
import { USER_ROLES } from 'src/constants/userRoles'
import { getFinanceTransactionsByStatus } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { CustomSelect } from 'src/util/formFields/selectBoxField'

import CircleProgress from '../Charts_Graphs/CircleProgress'
import SemiCircleProgress from '../Charts_Graphs/SemiCircleProgress'
import CardItem from '../leadsCard'
import SiderForm from '../SiderForm/SiderForm'

import FinanceTableView from './financeTableView'

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
    { lab: 'Booking Amont Review', val: 'cleared' },
    { lab: 'Payment Pending', val: 'reviewing' },
    { lab: 'KYC', val: 'latest' },
    { lab: 'Welcome Formalities', val: 'latest' },
    { lab: 'Payment Schedule', val: 'latest' },
    { lab: 'Sales Manager', val: 'latest' },
    { lab: 'Comments', val: 'latest' },
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
      pend: 'Rs 0',
      reviw: 'Rs 1,00,000',
      upcom: { amount: 'Rs 2,00,000', event: '31 Dec' },
      Adoc: { status: 'review', due: '2 days Due' },
      Asch: '31 Dec',
      Rdoc: 'NA',
      RSch: 'NA',
      BL: 'Approved',
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'modificatoin request',
    },
    {
      assetName: 'Plot-104',
      ownerName: 'Gopi',
      ph: '9030192920',
      welcome: 'Done',
      pend: 'Rs 0',
      reviw: 'Rs 1,00,000',
      upcom: { amount: 'Rs 2,00,000', event: '31 Dec' },
      Adoc: { status: 'Done', due: '' },
      Asch: 'Done',
      Rdoc: { status: 'review', due: '2 days Due' },
      RSch: '31 Dec',
      BL: 'Approved',
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'Asset Swap',
    },
    {
      assetName: 'Plot-105',
      ownerName: 'Monesh',
      ph: '9030192920',
      welcome: 'Done',
      pend: 'Rs 0',
      reviw: 'Rs 1,00,000',
      upcom: { amount: 'Rs 2,00,000', event: '31 Dec' },
      Adoc: { status: 'Done', due: '' },
      Asch: 'Done',
      Rdoc: { status: 'review', due: '2 days Due' },
      RSch: '31 Dec',
      BL: 'Approved',
      cPrg: 'In Progress',
      Queries: { count: 2, due: '1 days Due' },
      others: 'Asset Swap',
    },
  ]
  const postRegisterDummy = [
    {
      assetName: 'Plot-121',
      ownerName: 'Swethan',
      ph: '9849000521',
      followCall: '2 days Due',
      pend: 'Rs 0',
      reviw: 'Rs 1,00,000',
      Bpend: 'Rs 0',
      Breviw: 'Rs 1,00,000',
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
      pend: 'Rs 0',
      reviw: 'Rs 1,00,000',
      Bpend: 'Rs 0',
      Breviw: 'Rs 1,00,000',
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
      pend: 'Rs 0',
      reviw: 'Rs 1,00,000',
      Bpend: 'Rs 0',
      Breviw: 'Rs 1,00,000',
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
  const [tabHeadFieldsA, setTabHeadFields] = useState(DocumentationHeadA)
  const [tableHeadFieldsA, setTableHeadFieldsA] = useState(
    perResisterTableHeadA
  )
  const [tableData, setTableDataA] = useState(preRegisterDummy)

  const [selCategory, setSelCategory] = useState('pre_register')

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
      setTableDataA(queriesDummy)
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
      const unsubscribe = getFinanceTransactionsByStatus(
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
      const unsubscribe = getFinanceTransactionsByStatus(
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

  const viewTransaction = (docData) => {
    setTransactionData(docData)
    setisImportLeadsOpen(!isImportLeadsOpen)
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
                        { count: 2, name: 'BOOKING REVIEW', color: '209653' },
                      ].map((dat, i) => (
                        <div className=" m-1" key={i}>
                          <div
                            key={i}
                            className=" border-[#E5EAF2] rounded-xl border w-30"
                            onClick={() => setSelCategory('booking_review')}
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
                </div>
                <div className="flex flex-col ml-3 mt-2">
                  <section className="flex flex-row justify-between pt-4">
                    <section className="flex flex-row mt-2 mr-1  mb-1 leading-7 text-gray-900  rounded-lg  ">
                      {[
                        { count: 2, name: 'PRE AGREEMENT', color: '209653' },
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
                        { count: 2, name: 'POST AGREEMENT', color: '209653' },
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

                  <div className="flex flex-row bg-white px-[4px] py-2 relative">
                    <div className="flex w-full  ">
                      <table className="w-full pt-[1px]">
                        <thead className="">
                          <tr className="p-2">
                            <th className="w-2"></th>

                            {tableHeadFieldsA.map((dat, i) => (
                              <th
                                key={i}
                                className="text-left text-xs app-color-black py-2 whitespace-nowrap px-3"
                              >
                                <span className="ml-4">{dat.lab}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="p-2">
                          {tableData.map((finData, i) => (
                            <tr
                              className="app-border-1 border-y border-slate-200 "
                              key={i}
                              onClick={() => viewTransaction(finData)}
                            >
                              <td className="pl-3 ">
                                <div className="flex justify-center text-right items-center rounded-md w-2 h-8 app-bg-yellow-2 app-color-yellow-1 text-xs font-semibold">
                                  {i + 1}
                                </div>
                                {/* <div
                                className={`${
                                  finData?.status === 'cleared'
                                    ? 'bg-green-700'
                                    : finData?.status === 'rejected'
                                    ? 'bg-yellow-600'
                                    : 'bg-violet-600'
                                }   w-24 text-xs font-semibold px-3 py-0.5 rounded-br-md rounded-tl-md text-white`}
                              >
                                {finData?.status?.toLocaleUpperCase()}
                              </div> */}
                              </td>
                              <td>
                                <div className="flex flex-row py-2 ml-4">
                                  <div className="mr-2 w-[3px] rounded-2xl  bg-violet-300 "></div>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-sm app-color-black">
                                      {finData?.assetName}
                                    </span>
                                    <span className="font-normal text-xs app-color-gray-1">
                                      {finData?.ownerName}
                                    </span>
                                    <span className="font-normal text-xs app-color-gray-1">
                                      {finData?.ph}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="flex flex-row ml-4 py-2">
                                  <div className="mr-2 w-[3px] rounded-2xl bg-violet-300  "></div>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-sm app-color-black">
                                      {finData?.welcome}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="text-right">
                                <span className="text-right font-semibold text-sm app-color-gray-1 mr-4">
                                  {finData?.pend}
                                </span>
                              </td>
                              <td className="text-right">
                                <span className="text-right font-semibold text-sm app-color-gray-1 mr-4">
                                  {finData?.reviw}
                                </span>
                              </td>
                              <td className="text-right">
                                <div className="flex flex-col">
                                  <span className="text-right font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.upcom?.amount}
                                  </span>
                                  <span className="text-right font-normal text-[10px] app-color-gray-1 mr-4">
                                    {finData?.upcom?.event}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.Adoc?.status}
                                  </span>
                                  <span className="text-center font-normal text-[10px] app-color-gray-1 mr-4">
                                    {finData?.Adoc?.due}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.Asch}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.Rdoc?.status}
                                  </span>
                                  <span className="text-center font-normal text-[10px] app-color-gray-1 mr-4">
                                    {finData?.Rdoc?.due}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.RSch}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.BL}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.cPrg}
                                  </span>
                                </div>
                              </td>

                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.Queries?.count}
                                  </span>
                                  <span className="text-center font-normal text-[10px] app-color-gray-1 mr-4">
                                    {finData?.Queries?.due}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="flex flex-col">
                                  <span className="text-center font-semibold text-sm app-color-gray-1 mr-4">
                                    {finData?.others}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
        title={'Transaction'}
        customerDetails={selUserProfile}
        widthClass="max-w-md"
        transactionData={transactionData}
      />
    </>
  )
}

export default CrmRegisterModeHome
