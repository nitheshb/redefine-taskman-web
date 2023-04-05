import { useState, useEffect } from 'react'

import { Dialog } from '@headlessui/react'
import { Add, Remove } from '@mui/icons-material'
import { InputAdornment, TextField as MuiTextField } from '@mui/material'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'

import { AreaConverter } from 'src/components/AreaConverter'
import Loader from 'src/components/Loader/Loader'
import {
  developmentTypes,
  projectPlans,
  statesList,
} from 'src/constants/projects'
import {
  createProject,
  getLeadbyId1,
  steamBankDetailsList,
  updateLeadsLogWithProject,
  updateProject,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { CustomRadioGroup } from 'src/util/formFields/CustomRadioGroup'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'
import { TextAreaField } from 'src/util/formFields/TextAreaField'
import { TextField } from 'src/util/formFields/TextField'
import { prettyDate } from 'src/util/dateConverter'

const SideVisitLeadsBody = ({ title, leadsLogsPayload, dialogOpen }) => {
  const { user } = useAuth()
  const { orgId } = user

  const { enqueueSnackbar } = useSnackbar()

  const [leadsData, setLeadsData] = useState([])

  useEffect(() => {
    console.log('use effect stuff', leadsLogsPayload)
    leadsSerialDatafun()
  }, [leadsLogsPayload])

  const leadsSerialDatafun = async () => {
    const streamedTodo = []

    const y = await leadsLogsPayload.map(async (logData) => {
      const { Luid } = logData
      const x = await getLeadbyId1(orgId, Luid)

      const { ProjectId, Project, Name, Status } = await x
      // console.log('proj details are', x)
      logData.ProjectName = Project
      logData.Name = Name

      logData.Status = Status
      logData.Time = prettyDate(logData?.T).toLocaleString()
      // console.log('dta is', logData)

      streamedTodo.push(logData)
      return logData
      // updateLeadsLogWithProject(
      //   orgId,
      //   'snap',
      //   {
      //     LeadId: Luid,
      //     pId: ProjectId,
      //   },
      //   (error) => []
      // )
      setLeadsData(streamedTodo)
      console.log('use effect stuff', leadsLogsPayload)
    })

    console.log('what matters', streamedTodo)
    setLeadsData(streamedTodo)
  }
  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-4 sm:px-6  z-10">
        <Dialog.Title className=" font-semibold text-xl mr-auto ml-3  font-Playfair tracking-wider">
          {title}
        </Dialog.Title>
      </div>

      <div className="grid  gap-8 grid-cols-1">
        <div className="flex flex-col m-4">
          <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 ">
            {/* <CustomRadioGroup
              label="Type"
              value={selected}
              options={projectPlans}
              onChange={setSelected}
            /> */}

            <table className="min-w-full text-center mt-6">
              <thead className="border-b">
                <tr>
                  {' '}
                  {[
                    { label: 'sNo', id: 'no' },
                    { label: 'ProjName', id: 'label' },
                    { label: 'Lead Name', id: 'all' },
                    { label: 'Lead Status', id: 'new' },
                    { label: 'From', id: 'all' },
                    { label: 'To', id: 'all' },
                    { label: 'Date', id: 'new' },
                  ].map((d, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`text-sm font-medium text-gray-900 px-6 py-4 ${
                        ['Name'].includes(d.label) ? 'text-left' : ''
                      }`}
                    >
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {leadsLogsPayload?.map((data, i) => {
                  return (
                    <tr
                      className={`  ${
                        i % 2 === 0 ? 'bg-white border-blue-200' : 'bg-gray-100'
                      }`}
                      key={i}
                    >
                      <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                        {i + 1}
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                        {data?.ProjectName}
                      </td>
                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                        {data?.Name}
                      </td>
                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                        {data?.Status}
                      </td>
                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                        {data?.from}
                      </td>
                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                        {data?.to}
                      </td>
                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                        {data?.Time}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-0"></div>
        </div>
      </div>
    </div>
  )
}

export default SideVisitLeadsBody
