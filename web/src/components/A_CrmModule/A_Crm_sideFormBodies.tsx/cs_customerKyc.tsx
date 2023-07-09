/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Fragment, useEffect, useState } from 'react'

import { Menu, Transition } from '@headlessui/react'
import {
  ChartPieIcon,
  OfficeBuildingIcon,
  NewspaperIcon,
  UserGroupIcon,
  ScaleIcon,
  PuzzleIcon,
} from '@heroicons/react/outline'
import {
  ChevronDownIcon,
  FireIcon,
  CurrencyRupeeIcon,
  DotsVerticalIcon,
  CheckIcon,
  DocumentTextIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/solid'

import { Link, routes } from '@redwoodjs/router'

import BankSelectionSwitchDrop from 'src/components/A_LoanModule/BankSelectionDroopDown'
import DocRow from 'src/components/LegalModule/Docu_row'
import { USER_ROLES } from 'src/constants/userRoles'
import { useAuth } from 'src/context/firebase-auth-context'
import CostBreakUpSheet from 'src/components/costBreakUpSheet'
import AddApplicantDetails from 'src/components/AddApplicantDetails'

// import BankSelectionSwitchDrop from './BankSelectionDroopDown'

export default function Cs_customerKyc({ type, setStatusFun , selUnitPayload}) {
  const [selLoanBank, setLoanBank] = useState({})
  const [preSanctionReview, SetPreSanctionReview] = useState('In-Review')
  const [postSanctionReview, SetPostSanctionReview] = useState('In-Review')
  const [S1, setS1] = useState(true)
  const [S2, setS2] = useState(true)
  const [S3, setS3] = useState(true)
  const [S4, setS4] = useState(true)
  const [S5, setS5] = useState(true)
  const [S6, setS6] = useState(true)

  const { user } = useAuth()

  if (!user?.role?.includes(USER_ROLES.ADMIN)) {
    return null
  }
  useEffect(() => {
    console.log('yo yo ', selUnitPayload)
   }, [])
  return (
    <section className="bg-white w-full md:px-10 md:mb-20 pb-[250px] overflow-auto no-scrollbar  h-[100%] overflow-y-scroll">
      <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
        {/* <div className="flex p-4 items-center justify-between">
          <div className="flex flex-row">
            <h2 className="font-medium flex-grow">Bank Loan Process</h2>

            <span
              className=" ml-2 text-blue-500 hover:underline"
              onClick={() => {

              }}
            >
              Add Doc
            </span>
          </div>
          <p className="mr4">Date Created</p>

        </div> */}
        <div className="mt-1">
          <div className="p-2 bg-gradient-to-r from-violet-50 to-pink-50 rounded-md flex flex-row justify-between">
            <h2 className="font-medium flex-grow">Customer Kyc</h2>
            <p className="text-md text-[10px] flex-grow text-right">
              Waiting for banker sanction{' '}
            </p>
          </div>
        </div>
      </div>
      <AddApplicantDetails
                  title="Booking Form"
                  selUnitDetails={selUnitPayload}
                  leadDetailsObj2={{}}
                />
    </section>
  )
}
