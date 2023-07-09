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
import CostBreakUpSheet from 'src/components/costBreakUpSheet'
import DocRow from 'src/components/LegalModule/Docu_row'
import { USER_ROLES } from 'src/constants/userRoles'
import { useAuth } from 'src/context/firebase-auth-context'

import CSBody from './cs_body'
import { getPhasesByProject } from 'src/context/dbQueryFirebase'

// import BankSelectionSwitchDrop from './BankSelectionDroopDown'

export default function CSManagerApprovalBody({
  type,
  setStatusFun,
  selUnitPayload,
}) {
  const [selLoanBank, setLoanBank] = useState({})
  const [preSanctionReview, SetPreSanctionReview] = useState('In-Review')
  const [postSanctionReview, SetPostSanctionReview] = useState('In-Review')
  const [S1, setS1] = useState(true)
  const [S2, setS2] = useState(true)
  const [S3, setS3] = useState(true)
  const [S4, setS4] = useState(true)
  const [addiChargesObj, setAddiChargesObj] = useState({})
  const [costSheetA, setCostSheetA] = useState([])
  const [selPhaseObj, setSelPhaseObj] = useState({})
  const { user } = useAuth()
  const [phases, setPhases] = useState([])
  const [phasesList, setPhasesList] = useState([])
  if (!user?.role?.includes(USER_ROLES.ADMIN)) {
    return null
  }
  useEffect(() => {
    console.log('unit details', selUnitPayload)
    getPhases(selUnitPayload)
  }, [])
  const getPhases = async (projectDetails) => {


    try {
      const unsubscribe = getPhasesByProject(
        orgId,
        selUnitPayload?.pId,
        (querySnapshot) => {
          const phases = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.data()
          )
          setPhases(phases)

          phases.map((user) => {
            user.name = user.phaseName
            user.label = user.phaseName
            user.value = user.uid
          })
          setPhasesList(phases)
          if (phases.length > 0) {
            // setSelPhaseName(phases?.[0].phaseName)
            // setSelPhaseIs(phases?.[0].uid)
            // setSelPhaseObj(phases?.[0])
            setSelPhaseObj(phases?.[0])
          }
          console.log('myphases are', phases)
        },
        (e) => {
          console.log('error at getPhases', e)
          setPhases([])
        }
      )
      return unsubscribe
    } catch (error) {
      console.log('error at getting phases', error)
    }
  }
  return (
    <div className="card mr-10 nunF">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p className="font-bold uppercase text-[#1f2f3e] mb-[2px] text-[11px]">
            Customer Details
          </p>

          <span>Harsha</span>
          <span>8722-198-016</span>
        </div>
        <div className="flex flex-col text-right">
          <div className="flex-row font-bold uppercase text-[#1f2f3e] text-[10px]">
            Unit No: <span className="text-[#848789] ml-[1px]">1</span>
          </div>
          <div className="flex-row font-bold uppercase text-[#1f2f3e] text-[10px]">
            Survey No:<span className="text-[#848789] ml-[1px]">1</span>
          </div>
          <div className="flex-row font-bold uppercase text-[#1f2f3e] text-[10px]">
            Katha Id: <span className="text-[#848789] ml-[1px]">1</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row border-y border-[#ededed] py-[18px] mt-[12px] justify-between">
        <div className="min-w-[120px]">
          <p className="text-title text-xs font-bold uppercase">Invoice No</p>
          <span className=" text-content3 text-[#848789]">go157864</span>
        </div>
        <div className="min-w-[120px]">
          <p className="text-title text-xs font-bold uppercase">Booking Date</p>
          <span className="text-content3 text-[#848789]">26-July-2023</span>
        </div>
        <div className="min-w-[120px]">
          <p className="text-title text-xs font-bold uppercase">
            payment Status
          </p>
          <span className="text-content3 text-[#848789]">go157864</span>
        </div>
        <div className="min-w-[120px] text-right">
          <p className="text-title text-xs font-bold uppercase">Total Amount</p>
          <span className=" text-medium text-content3 text-[#848789]">
            go157864
          </span>
        </div>
      </div>
      <CSBody
        csMode="plot_cs"
        costSheetA={costSheetA}
        selUnitDetails={selUnitPayload}
        setCostSheetA={setCostSheetA}
        setSelPhaseObj={setSelPhaseObj}
        selPhaseObj={selPhaseObj}
        setAddiChargesObj={setAddiChargesObj}
      />
    </div>
  )
}
