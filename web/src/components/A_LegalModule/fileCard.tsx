import React, { useState, useEffect } from 'react'

import './fileCard.css'

import 'react-circular-progressbar/dist/styles.css'
import { UilTimes } from '@iconscout/react-unicons'
import { motion, AnimateSharedLayout } from 'framer-motion'
import Chart from 'react-apexcharts'
import { CircularProgressbar } from 'react-circular-progressbar'

// parent Card

const FileCardAnim = (props) => {
  const { count, title, projectDetails } = props
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    console.log('projectDetails ', projectDetails)
  }, [])


  return (
    <div>
      {/* <div className="folder"> */}
      {/* <div className="folder-back"> */}
      {/* <p className="files">Files</p> */}
      <div className=" border border-green rounded-xl hover:shadow-lg ml-2 mb-2 mr-2 ">
        <section className=" m-2 flex flex-row w-[1300px] px-2 ">


            <span><img className="h-12 w-12 "src="/folder.png" alt="" /></span>

          <span className="text-md  ml-5 pt-3  text-gray-700 leading-normal ">
            {projectDetails?.projectName}
          </span>
          {/* <div className="text-xs mt-5 border border-black mb-2 text-white-700 font-bold uppercase">
            {"Phase-I"}
          </div> */}

        </section>

        {/* <span style={{ color: 'white' }}>{projectDetails?.projectType?.name}</span> */}


        {/* <div className="text-xs mt-0 mb-2 text-white-700 font-bold uppercase">
            Sale Agreement
          </div> */}
      </div>
      {/* </div> */}
      {/* <div className="paper"></div>
      <div className="paper"></div>
      <div className="paper"></div> */}
      {/* <div className="folder-front"></div>
      <div className="folder-right"></div> */}
      {/* </div> */}
    </div>
  )
}

export default FileCardAnim
