import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  FireIcon,
  CurrencyRupeeIcon,
  DotsVerticalIcon,
  CheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/solid'

import { Link, routes } from '@redwoodjs/router'

export default function ModuleSwitchDrop({
  type,
  id,
  setStatusFun,
  viewUnitStatusA,
  pickCustomViewer,
  filteredUnits,
  pickedValue,
}) {
  return (
    <div className="text-right inline-block ml-2 mt-[px]">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-0 py-0 text-sm font-semibold text-black-500 bg- rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <span className=" text-[12px] tracking-wide text-[#0091ae]  ">
              {type?.toLocaleUpperCase()} Module
            </span>
            <ChevronDownIcon className="w-5 h-5 mr-3 mt-[1px] inline text-[#058527]" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`${
              ['Facing', 'show'].includes(type) ? 'right-0' : 'left-0'
            }  absolute  w-52 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9000]`}
            style={{ 'z-index': '9' }}
          >
            <div className="px-1 py-1 ">
              <>

                <Menu.Item>
                  {({ active }) => (
                    <Link to={routes.constructModule()}>
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setStatusFun('1', 'Construction')
                        }}
                      >
                        <FireIcon
                          className="w-5 h-5 mr-2 text-violet-500"
                          aria-hidden="true"
                        />
                        {'Construction'}{' '}
                      </button>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link to={routes.crmModule()}>
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setStatusFun('1', 'CRM')
                        }}
                      >
                        <FireIcon
                          className="w-5 h-5 mr-2 text-violet-500"
                          aria-hidden="true"
                        />
                        {'CRM'}{' '}
                      </button>
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link to={routes.financeModule()}>
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setStatusFun('1', 'Finance')
                        }}
                      >
                        <FireIcon
                          className="w-5 h-5 mr-2 text-violet-500"
                          aria-hidden="true"
                        />
                        {'Finance'}{' '}
                      </button>
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link to={routes.usersAdmin()}>
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setStatusFun('1', 'HR')
                        }}
                      >
                        <FireIcon
                          className="w-5 h-5 mr-2 text-violet-500"
                          aria-hidden="true"
                        />
                        {'HR'}{' '}
                      </button>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link to={routes.legalModule()}>
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setStatusFun('1', 'Legal')
                        }}
                      >
                        <FireIcon
                          className="w-5 h-5 mr-2 text-violet-500"
                          aria-hidden="true"
                        />
                        {'Legal'}{' '}
                      </button>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link to={routes.home()}>
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setStatusFun('1', 'Projects')
                        }}
                      >
                        <FireIcon
                          className="w-5 h-5 mr-2 text-violet-500"
                          aria-hidden="true"
                        />
                        {'Projects'}{' '}
                      </button>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link to={routes.leadsManager()}>
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setStatusFun('1', 'Sales')
                        }}
                      >
                        <FireIcon
                          className="w-5 h-5 mr-2 text-violet-500"
                          aria-hidden="true"
                        />
                        {'Sales'}{' '}
                      </button>
                    </Link>
                  )}
                </Menu.Item>
              </>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
