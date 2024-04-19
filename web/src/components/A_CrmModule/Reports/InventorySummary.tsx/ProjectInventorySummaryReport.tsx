import { useState, useEffect } from 'react'

import { Dialog } from '@headlessui/react'
import { Add, Remove } from '@mui/icons-material'
import {
  InputAdornment,
  TextField as MuiTextField,
  Tooltip,
} from '@mui/material'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'

import { AreaConverter } from 'src/components/AreaConverter'
import AssigedToDropComp from 'src/components/assignedToDropComp'
import Loader from 'src/components/Loader/Loader'
import LogSkelton from 'src/components/shimmerLoaders/logSkelton'
import {
  developmentTypes,
  projectPlans,
  statesList,
} from 'src/constants/projects'
import {
  createProject,
  getAllProjects,
  getLeadbyId1,
  steamBankDetailsList,
  steamUsersListByRole,
  updateLeadsLogWithProject,
  updateProject,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import SkeletonLoaderPage from 'src/pages/SkeletonLoader/skeletonLoaderPage'
import CSVDownloader from 'src/util/csvDownload'
import { prettyDate, prettyDateTime } from 'src/util/dateConverter'
import { CustomRadioGroup } from 'src/util/formFields/CustomRadioGroup'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'
import {
  SlimDateSelectBox,
  SlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'
import { TextAreaField } from 'src/util/formFields/TextAreaField'
import { TextField } from 'src/util/formFields/TextField'

const ProjectInventorySummaryReport = ({
  title,
  subtitle,
  leadsLogsPayload,
  dialogOpen,
  setCustomerDetails,
  setisImportLeadsOpen,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const [selectedOption, setSelectedOption] = useState('All')

  const { enqueueSnackbar } = useSnackbar()
  const [usersList, setusersList] = useState([])

  const [leadsData, setLeadsData] = useState([])
  const [loadingIcon, setLoadingIcon] = useState(false)
  const [projectList, setprojectList] = useState([])
  const [leadsFilA, setLeadsFilA] = useState([])
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [selVisitDoneBy, setVisitDoneBy] = useState({
    label: 'All Executives',
    value: 'allexecutives',
  })
  const [selVisitFixedBy, setVisitFixedBy] = useState({
    label: 'All Executives',
    value: 'allexecutives',
  })

  const [selProjectEmpIs, setSelProjectEmp] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })

  useEffect(() => {
    console.log('use effect stuff', leadsLogsPayload)
    getProjectsListFun()
  }, [leadsLogsPayload])

  const getProjectsListFun = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        // setprojectList(projectsListA)
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.uid
        })
        console.log('fetched users list is', projectsListA)

        setprojectList([
          ...projectsListA,
          ...[{ label: 'others', value: 'others' }],
        ])
      },
      (error) => setprojectList([])
    )

    return unsubscribe
  }
  


  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.email
        })
        setusersList(usersListA)
      },
      (error) => setusersList([])
    )

    return unsubscribe
  }, [])

  const selLeadFun = (data) => {
    console.log('data is ', data)
    setisImportLeadsOpen(true)
    setCustomerDetails(data)
  }
  const setNewProject = (leadDocId, value) => {
    setSelProject(value)
  }
  const setVisitDoneByFun = (leadDocId, value) => {
    setVisitDoneBy(value)
  }
  const setVisitFixedByFun = (leadDocId, value) => {
    setVisitFixedBy(value)
  }
  const inventoryListData = [
    {
      unitNo: 'A101',
      unitType: '2BHK',
      unitFacing: 'North',
      unitArea: '950',
      releaseStatus: 'Available',
      pricePerSft: '5000',
      plc: '200',
      dimensions: {
        north: '10m',
        south: '10m',
        east: '8m',
        west: '8m',
      },
      schedule: {
        north: '2m',
        south: '4m',
        east: '7m',
        west: '8m',
      },
      sNo: '001',
      khataha: 'XX123',
      pid: 'PID001',
      unitCost: '5250000',
      unitStatus: 'Ready',
    },
    {
      unitNo: 'B202',
      unitType: '3BHK',
      unitFacing: 'South',
      unitArea: '1200',
      releaseStatus: 'Sold',
      pricePerSft: '6000',
      plc: '250',
      dimensions: {
        north: '12m',
        south: '12m',
        east: '10m',
        west: '10m',
      },
      schedule: {
        north: '25m',
        south: '25m',
        east: '25m',
        west: '5m',
      },
      sNo: '002',
      khataha: 'YY456',
      pid: 'PID002',
      unitCost: '6300000',
      unitStatus: 'Occupied',
    },
  ]
  const filteredInventoryList = inventoryListData.filter((item) => {
    switch (selectedOption) {
      case 'Unit Type':
        return item.unitType === selectedOption
      case 'Unit Facing':
        return item.unitFacing === selectedOption
      case 'Unit Status':
        return item.unitStatus === selectedOption
      case 'Unit Area':
        return item.unitArea === selectedOption
      default:
        return true
    }
  })
  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-4 sm:px-6  z-10 flex flex-row justify-between">
        {/* <Dialog.Title className=" font-semibold text-xl mr-auto ml-3  font-Playfair tracking-wider">
          {subtitle || title} ({leadsFilA.length || 0})
        </Dialog.Title> */}
         {subtitle || title} ({leadsFilA.length || 0})
        <section className="flex flex-row">
          <section className="flex flex-col border ml-2 py-1  px-4 text-xs  rounded-full">
            <AssigedToDropComp
              assignerName={selProjectIs?.label}
              id={'id'}
              align="right"
              setAssigner={setNewProject}
              usersList={[
                ...[{ label: 'All Projects', value: 'allprojects' }],
                ...projectList,
              ]}
            />
            <div className="font-md text-xs text-gray-500 mb-[px] tracking-wide mr-4">
              Project {}
            </div>
          </section>


          <Tooltip title={`Download ${leadsFilA?.length} Row`}>
            {/* <IconButton>
            <FileDownloadIcon />
            <CSVDownloader />
          </IconButton> */}

            <CSVDownloader
              className="mr-6 h-[20px] w-[20px]"
              downloadRows={leadsFilA}
              sourceTab="visitsReport"
              style={{ height: '20px', width: '20px' }}
            />
          </Tooltip>
        </section>
      </div>
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            <table className="min-w-max w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-200 text-gray-900  text-sm leading-normal">
                  <th
                    className="py-3 px-6 text-center border border-black"
                    colSpan="9"
                  >
                    Inventory List By Project
                  </th>
                  <th
                    className="py-3 px-6 text-center border border-black  bg-white"
                    colSpan="4"
                  >
                    Dimensions *(m)
                  </th>
                  <th
                    className="py-3 px-6 text-center border border-black bg-white"
                    colSpan="4"
                  >
                    Schedule
                  </th>
                  <th
                    className="py-3 px-6 text-center border border-black bg-white"
                    colSpan="1"
                  ></th>
                  <th
                    className="py-3 px-6 text-center border border-black bg-white"
                    colSpan="1"
                  ></th>
                  <th
                    className="py-3 px-6 text-center border border-black bg-white"
                    colSpan="1"
                  ></th>
                </tr>
                <tr className="bg-blue-100 text-gray-900  text-sm leading-normal">
                  <th className="py-3 px-6 text-left border border-black">
                    Unit No.
                  </th>
                  <th className="py-3 px-6 text-left border border-black">
                    Unit Type
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    Unit Facing
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    Unit Area
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    Release Status
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    Price Per Sft
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    PLC
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    Unit Cost
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    Unit Status
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    North
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    South
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    East
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    West
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    North
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    South
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    East
                  </th>
                  <th className="py-2 px-3 text-center border border-black">
                    West
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    S No.
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    Khataha
                  </th>
                  <th className="py-3 px-6 text-center border border-black">
                    PID
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-900 text-sm font-light">
                {filteredInventoryList.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-3 px-6 text-left border border-black">
                      {item.unitNo}
                    </td>
                    <td className="py-3 px-6 text-left border border-black">
                      {item.unitType}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.unitFacing}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.unitArea}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.releaseStatus}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.pricePerSft}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.plc}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.unitCost}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.unitStatus}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.dimensions.north}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.dimensions.south}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.dimensions.east}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.dimensions.west}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.schedule.north}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.schedule.south}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.schedule.east}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.schedule.west}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.sNo}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.khataha}
                    </td>
                    <td className="py-3 px-6 text-center border border-black">
                      {item.pid}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-200 text-gray-900  text-sm leading-normal">
                  <td className="py-3 px-6 text-left border border-black">
                    Totals:
                  </td>
                  <td className="py-3 px-6 text-left border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                  <td className="py-3 px-6 text-center border border-black"></td>
                </tr>
              </tbody>
            </table>
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
            {loadingIcon ? (
              <LogSkelton />
            ) : (
              <table className="min-w-full text-center mt-6">
                <thead className="border-b">
                  <tr>
                    {' '}
                    {[
                      { label: 'sNo', id: 'no' },
                      { label: 'Project', id: 'label' },
                      { label: 'Lead Ph', id: 'all' },
                      { label: 'Status', id: 'new' },
                      { label: 'From', id: 'all' },
                      { label: 'To', id: 'all' },
                      { label: 'Source', id: 'new' },
                      { label: 'Visit Fixed On', id: 'new' },
                      { label: 'Visit Fixed By', id: 'new' },
                      { label: 'Visited On', id: 'new' },
                      { label: 'Visit Done By', id: 'new' },
                      { label: 'Executive', id: 'all' },
                      { label: 'Created on', id: 'all' },
                      { label: 'By', id: 'all' },
                    ].map((d, i) => (
                      <th
                        key={i}
                        scope="col"
                        className={`text-sm font-medium text-gray-900 px-6 py-4 ${
                          ['Project', 'Lead Name'].includes(d.label)
                            ? 'text-left'
                            : ''
                        }`}
                      >
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {leadsFilA?.map((data, i) => {
                    return (
                      <tr
                        className={`  ${
                          i % 2 === 0
                            ? 'bg-white border-blue-200'
                            : 'bg-gray-100'
                        }`}
                        key={i}
                        onClick={() => selLeadFun(data)}
                      >
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                          {i + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                          {data?.Project}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap text-left">
                          {data?.Mobile}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Status}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.from}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.coverA?.includes('visitdone')
                            ? 'visitdone'
                            : data?.to}
                        </td>

                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Source}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {prettyDateTime(data?.assignT || data?.Date)}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.visitFixedBy}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Time}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.by}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.assignedToObj?.name}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {prettyDateTime(data?.Date)}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.leadOwner}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="mt-0"></div>
        </div>
      </div>
    </div>
  )
}

export default ProjectInventorySummaryReport
