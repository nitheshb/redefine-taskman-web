import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  searchValue,
  searchData as searchResponse,
} from 'src/state/actions/search'
import { Link, routes } from '@redwoodjs/router'
import { getLeadsByPhoneNo } from 'src/context/dbQueryFirebase'
import Loader from 'src/components/Loader/Loader'
import { RootStateOrAny, useSelector } from 'react-redux'


export const GlobalSearchBar = (props) => {
  const [searchKey, setSearchKey] = useState<string>(
    props.searchVal ? props.searchVal : ''
  )
  // const searchValue = useSelector((state: RootStateOrAny) => state?.search)
  const [searchData, setSearchData] = useState([])

  const [showLoader, setshowLoader] = useState<boolean>(false)

  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false)
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const searchKeyField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    getSearchData(val)
  }
  // useEffect(()=>{

  // })
  const getSearchData = async (val) => {
    setSearchKey(val)

    if (val.trim() && val.length >= 10) {
      dispatch(searchValue(val))
      setShowSearchDropdown(true)
      setshowLoader(true)
      // let res
      const orgId = user?.orgId
      const res = await getLeadsByPhoneNo(orgId, { search: val })
      console.log(res)
      setSearchData(res)
      dispatch(searchResponse({ ...res[0], id: 'dkcjbkdjbadkj' }))
      setshowLoader(false)
      // setTimeout(() => {
      //   setSearchData([
      //     {
      //       customerName: 'Raghu',
      //       sales: '/admin/leads-manager',
      //     },
      //     {
      //       customerName: 'Raghu',
      //       sales: '/admin/leads-manager',
      //       finance: '/admin/leads-manager',
      //     },
      //   ])
      //   setshowLoader(false)
      // }, 2000)
    }
  }
  let refContainer = React.useRef(null)
  const handleClickOutside = (event) => {
    if (event.target.id === 'globalSearch') {
      return
    } else if (
      refContainer.current !== null &&
      !refContainer.current.contains(event.target)
    ) {
      setShowSearchDropdown(false)
      setshowLoader(false)
      setSearchData([])
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
  }, [])
  return (
    <span className="ml-5 bg-gray-50 border border-gray-300 border-solid box-border w-1/3 rounded-r-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 absolute mt-2 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
      <input
        type="text"
        id="globalSearch"
        placeholder="Search Unit No, Customer name, Phone no, Dues, Review..."
        onChange={searchKeyField}
        autoComplete="off"
        // value={searchKey}
        className="ml-6 w-52 bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900 w-4/5 relative"
      />
      {showSearchDropdown && (
        <div ref={refContainer}>
          {showLoader ? (
            <div
              style={{ width: '31.5%' }}
              className="z-10 absolute bg-white border border-gray-300 border-solid box-border rounded-r-lg p-2 min-h-[75px]"
            >
              <div className="flex justify-center">
                <Loader texColor="text-black" size="h-8 w-8" />
              </div>
            </div>
          ) : (
            // console.log(searchData)
            // {console.log(searchData)}
            <div
              style={{ width: '31.5%' }}
              className="z-10 absolute bg-white border border-gray-300 border-solid box-border rounded-r-lg min-h-[75px]"
            >
              {searchData.length
                ? searchData.map((item, index) => {
                    return (
                      <div className="m-1">
                        <span>{item.Name}</span>
                        <div className="mt-2">
                          {/* {item.sales && ( */}
                          <Link
                            to={routes.leadsManager({
                              type: 'inProgress',
                              clicked: Math.random(),
                            })}
                            className="text-lg underline mr-10 text-indigo-700"
                            id="testing"
                          >
                            Sales
                          </Link>
                          <Link
                            to={routes.crmModule()}
                            className="text-lg underline mr-10 text-indigo-700"
                          >
                            CRM
                          </Link>
                          {/* )} */}
                          {/* {item.finance && ( */}
                          <Link
                            to={routes.financeModule()}
                            className="text-lg underline mr-10 text-indigo-700"
                          >
                            Finance
                          </Link>
                          {/* )} */}
                          {/* {item.legal && ( */}
                          <Link
                            to={routes.legalModule()}
                            className="text-lg underline mr-10 text-indigo-700"
                          >
                            Legal
                          </Link>

                          {/* )} */}
                          {/* {item.construction && ( */}
                          {/* <Link
                                  to={routes.leadsManager()}
                                  className="text-lg underline mr-10 text-indigo-700"
                                >
                                  Construction {'   '}
                                </Link> */}
                          {/* )} */}
                        </div>
                        {searchData.length - 1 !== index && <hr></hr>}
                      </div>
                    )
                  })
                : null}
            </div>
          )}
        </div>
      )}
    </span>
  )
}
