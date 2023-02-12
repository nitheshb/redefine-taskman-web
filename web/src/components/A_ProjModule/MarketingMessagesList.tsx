/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react'

import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline'
import { useSnackbar } from 'notistack'

import {
  deleteBankAccount,
  steamBankDetailsList,
  steamVirtualAccountsList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import SiderForm from '../SiderForm/SiderForm'
import PencilIcon from '@heroicons/react/solid/PencilIcon'

const MarkeingMessagesList = ({ title, pId, data }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [bankDetialsA, setGetBankDetailsA] = useState([])

  const [sliderInfo, setSliderInfo] = useState({
    open: false,
    title: 'Bank Account',
    sliderData: {},
    widthClass: 'max-w-xl',
  })



  return (
    <>
      <div className="w-full  flex flex-row">
        <div className="lg:col-span-2 mr-4">
          <div>
          <section className="m-4 inline-block">
                  <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
            <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Sales Templates"}</h2>

                    <div className=" justify-between mb-4">
                      {[{'btnTxt': 'On Lead Arrival', 'target': 'Sales Executive' },{'btnTxt': 'On Lead Assign', 'target': 'Sales Executive' }].map((data, i)=> (
                      <section>
                      <div className='flex flex-row justify-between'>
                      <section className="flex  mt-[18px]">
                              <button>
                                <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                  <PencilIcon
                                    className="h-3 w-3 mr-1"
                                    aria-hidden="true"
                                  />
                                 {data?.btnTxt}
                                </span>
                              </button>
                            </section>

                            <section className="flex  mt-[18px]">
                                <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                                  {data?.target}
                                </span>
                            </section>
                      </div>
                      </section>))}

                    </div>
                  </div>
                </section>
          </div>
          <div>

          </div>
        </div>
        <section className="m-4 inline-block">
                  <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
            <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"CRM Templates"}</h2>

            <div className=" justify-between mb-4">
                      {[{'btnTxt': 'On Booking', 'target': 'CRM Executive' },{'btnTxt': 'On Payment Request', 'target': 'CRM Executive' }, ,{'btnTxt': 'On Payment Receival', 'target': 'CRM Executive' } ,{'btnTxt': 'On Payment Receival', 'target': 'Customer' }].map((data, i)=> (
                      <section>
                      <div className='flex flex-row justify-between'>
                      <section className="flex  mt-[18px]">
                              <button>
                                <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                  <PencilIcon
                                    className="h-3 w-3 mr-1"
                                    aria-hidden="true"
                                  />
                                 {data?.btnTxt}
                                </span>
                              </button>
                            </section>

                            <section className="flex  mt-[18px]">
                                <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                                  {data?.target}
                                </span>
                            </section>
                      </div>
                      </section>))}

                    </div>
                  </div>
                </section>

                <section className="m-4 inline-block">
                  <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
            <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Finance Templates"}</h2>

            <div className=" justify-between mb-4">
                      {[{'btnTxt': 'On Lead Arrival', 'target': 'Sales Executive' },{'btnTxt': 'On Lead Assign', 'target': 'Sales Executive' }].map((data, i)=> (
                      <section>
                      <div className='flex flex-row justify-between'>
                      <section className="flex  mt-[18px]">
                              <button>
                                <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                  <PencilIcon
                                    className="h-3 w-3 mr-1"
                                    aria-hidden="true"
                                  />
                                 {data?.btnTxt}
                                </span>
                              </button>
                            </section>

                            <section className="flex  mt-[18px]">
                                <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                                  {data?.target}
                                </span>
                            </section>
                      </div>
                      </section>))}

                    </div>
                  </div>
                </section>
      </div>

    </>
  )
}

export default MarkeingMessagesList
