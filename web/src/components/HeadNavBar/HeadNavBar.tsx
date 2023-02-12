/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'

import { Diversity1 } from '@mui/icons-material'
import { Box, Menu, MenuItem, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'

import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/context/firebase-auth-context'
import { logout as logoutAction } from 'src/state/actions/user'

import ModuleSwitchDrop from '../A_SideMenu/modulesSwitchDrop'
const HeadNavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const [filteredUnits, setFilteredUnits] = useState([])
  const [filStatus, setFilStatus] = useState(['available', 'booked', 'blocked'])

  const [selModule, setSelModule] = useState('Projects')

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const handleClose = async (menuItem) => {
    setAnchorEl(null)
    if (menuItem === 'Logout') {
      await dispatch(logoutAction())
      await logout()
    }
  }

  const makeFilterFun = (id, viewModule) => {
    // 'Sales', 'CRM', 'Legal', 'Finance', 'HR'
    setSelModule(viewModule)
    console.log('i was clicked', id, viewModule)
  }

  return (
    <div>
      <div className="flex items-center flex-shrink-0 h-[50px] px-2  pl-0 bg-white bg-opacity-75 ">
        {/* <h1 className="text-lg font-medium">redefine.</h1> */}
        <span
          style={{ marginLeft: '-19px' }}
          className="relative z-10 flex items-center text-md font-extrabold leading-none text-[#141446] select-none pl-0"
        >
          {/* <svg
            className="w-8 h-8 to-indigo-600 "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            // color="#a770ef"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg> */}

          <span className="ml- text-md" style={{ marginLeft: '41px' }}>
            {' '}
            Redefine Erp .
          </span>
          <section className="mt-1">
            <ModuleSwitchDrop
              type={selModule}
              id={'Status'}
              setStatusFun={makeFilterFun}
              filteredUnits={filteredUnits}
              pickedValue={selModule}
            />
          </section>
        </span>

        {/* <a
        className="flex items-center fixe flex-shrink-0 w-full h-16  border-b bg-white"
        href="#"
      >

        <span
          style={{ marginLeft: '10px' }}
          className="relative z-10 flex items-center text-2xl font-extrabold leading-none text-black select-none pl-0"
        >
          <svg
            className="w-8 h-8 to-indigo-600 "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            // color="#a770ef"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span className="ml-1"> Redefine Erp.</span>
        </span>
      </a> */}
        <span
          style={{ marginLeft: '10px' }}
          className="relative z-10 flex items-center text-2xl font-extrabold leading-none text-black select-none pl-0 ml-4"
        ></span>
        <button className="flex items-center justify-center h-10 px-4 ml-auto "></button>
        <button className="flex items-center justify-center h-10 text-sm font-medium "></button>
        <Box
          sx={{
            cursor: 'pointer',
          }}
          display="flex"
          component="span"
          onClick={handleClick}
        >
          <button className="relative ml-2 text-sm focus:outline-none group  items-center justify-center h-10 text-sm font-medium">
            <div className="flex items-center justify-between w-6 mr-2 rounded ">
              <svg
                width="30"
                fill="currentColor"
                height="30"
                className="text-gray-800"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path>
              </svg>
            </div>
          </button>
          <section className="mr-3">
            <div className="text-gray-800 text-sm"> {user?.displayName}</div>
            <div className="h-[14px] text-xs  text-gray-500">
              {user?.orgName || user?.orgId} - {user?.role?.[0]}
            </div>
          </section>
          {/* <Box display="flex" flexDirection="column" mr={2}>
            <Typography variant="body2" className="text-sm">
              {user?.displayName}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {user?.orgName || user?.orgId} - {user?.role?.[0]}
            </Typography>
          </Box> */}
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link to={routes.profile()}>Profile</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={() => handleClose('Logout')}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default HeadNavBar
