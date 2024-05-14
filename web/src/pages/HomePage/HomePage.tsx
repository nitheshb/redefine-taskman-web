import { useState, useEffect } from 'react'

// import { ResponsiveBar } from '@nivo/bar'
import { EyeIcon, PencilIcon } from '@heroicons/react/outline'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CountUp from 'react-countup'
import NumberFormat from 'react-number-format'

import { usePageLoadingContext } from '@redwoodjs/router'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import MarkeingMessagesList from 'src/components/A_ProjModule/MarketingMessagesList'
import ProjectReportsBody from 'src/components/A_ProjModule/ProjectReports'
import ProjectsTaskHome from 'src/components/A_ProjModule/ProjTaskHome'
import SlimSideMenuBar from 'src/components/A_SideMenu/slimSideMenu'
import AllBankDetailsView from 'src/components/All_BankDetailsView'
import { CountUpComp } from 'src/components/comps/countUpComp'
import { IndianCurrencyCounter } from 'src/components/comps/countUpRupeeComp'
import HeadSideBarDetailView from 'src/components/HeadDetailSideBar'
import HeadSideBarDetailView2 from 'src/components/HeadDetailSideBar2'
import HeadNavBar2 from 'src/components/HeadNavBar/HeadNavBar2'
import ProjectsUnitInventory from 'src/components/projectUnitsInventory'
import {
  getAllProjects,
  getSalesReportsData,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import DummyBodyLayout from '../../components/DummyBodyLayout/DummyBodyLayout'
import HeadNavBar from '../../components/HeadNavBar/HeadNavBar'
import HeadSideBar from '../../components/HeadSideBar/HeadSideBar'
import ProjectsMHomeBody from '../../components/ProjectsMHomeBody/ProjectsMHomeBody'
import SiderForm from '../../components/SiderForm/SiderForm'

const HomePage = () => {
  const { user } = useAuth()
  const { orgId } = user || {}
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
  const [project, setProject] = useState({})
  const handleNewProjectClose = () => setIsNewProjectOpen(false)
  const handleEditProjectClose = () => setIsEditProjectOpen(false)
  const [projects, setProjects] = useState([])
  const [salesReportsDbData, setSalesReportsDbData] = useState([])
  const [viewable, setViewable] = useState('Home')
  const { loading } = usePageLoadingContext()
  const [selModule, setSelModule] = useState('Projects')

  const getProjects = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setProjects(projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }

  const getSalesReportsDataFun = async () => {
    const unsubscribe = getSalesReportsData(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setSalesReportsDbData(projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }

  useEffect(() => {
    getProjects()
    getSalesReportsDataFun()
  }, [])

  return (
    <>
      {loading && <div>Loading...</div>}
      <div className="flex w-screen h-screen text-gray-700">
        <div className="flex flex-col flex-grow">
          <div className="flex overflow-y-hidden flex-row overflow-auto h-[100vh]   text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            <div className="flex-grow   items-center overflow-y-auto no-scrollbar  h-[98%]  px-300  pt-300">
              <HeadNavBar2 selModule={selModule} setSelModule={setSelModule} />
              <ProjectsTaskHome leadsTyper={undefined} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
