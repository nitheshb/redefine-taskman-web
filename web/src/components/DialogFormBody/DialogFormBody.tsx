import { useState, useEffect } from 'react'

import { Dialog } from '@headlessui/react'
import { Add, Remove } from '@mui/icons-material'
import { InputAdornment, TextField as MuiTextField } from '@mui/material'
import { setHours, setMinutes } from 'date-fns'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import DatePicker from 'react-datepicker'
import * as Yup from 'yup'

import { AreaConverter } from 'src/components/AreaConverter'
import Loader from 'src/components/Loader/Loader'
import {
  ChooseOptions,
  chooseAuthorityApproval,
  developmentTypes,
  projectPlans,
  statesList,
  chooseReraApproval,
  approvalAuthority,
} from 'src/constants/projects'
import {
  createProject,
  steamBankDetailsList,
  updateProject,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { CustomRadioGroup } from 'src/util/formFields/CustomRadioGroup'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'
import { TextAreaField } from 'src/util/formFields/TextAreaField'
import { TextField } from 'src/util/formFields/TextField'

import AddBankDetailsForm from '../addBankDetailsForm'

const DialogFormBody = ({ title, dialogOpen, project }) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [selected, setSelected] = useState(
    project?.projectType || projectPlans[0]
  )
  const [devType, setdevType] = useState(
    project?.developmentType || developmentTypes[0]
  )
  const [planningApproval, setPlanningApproval] = useState(
    project?.planningApproval  || 'No'
  )

  const [reraApproval, setReraApproval] = useState(
    project?.reraApproval  || 'No'
  )
  const [addNewBankStuff, setAddNewBankStuff] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openAreaFields, setOpenAreaFields] = useState(false)
  const [bankDetailsA, setBankDetailsA] = useState([])
  const [startDate, setStartDate] = useState(d)
  const [existingBuildBankId, setNowBuilderBankDocId] = useState('')
  const [existingLandBankId, setNowLandLordBankDocId] = useState('')
  const [builerShare, setBuilderShare] = useState(100)
  const [landLordShare, setLandLordShare] = useState(0)
  const [endDate, setEndDate] = useState(d)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setNowBuilderBankDocId(project?.builderBankDocId)
    setNowLandLordBankDocId(project?.landlordBankDocId)
  }, [project?.editMode])

  const EditedLandlord = (e, formik) => {
    //
    console.log(
      'valare',
      e.target.name === 'builderShare' && e.target.value != builerShare,
      e.target.name,
      e.target.value
    )
    if (
      e.target.name === 'builderShare' &&
      e.target.value != builerShare &&
      e.target.value >= 0 &&
      e.target.value <= 100
    ) {
      formik.setFieldValue('builderShare', e.target.value - 0)
      formik.setFieldValue('landlordShare', 100 - e.target.value)
      setBuilderShare(e.target.value)
      setLandLordShare(100 - e.target.value)
      console.log('my eis ', e.target.name)
    } else if (
      e.target.name === 'landlordShare' &&
      e.target.value != landLordShare &&
      e.target.value >= 0 &&
      e.target.value <= 100
    ) {
      formik.setFieldValue('landlordShare', e.target.value - 0)
      formik.setFieldValue('builderShare', 100 - e.target.value - 0)
      setLandLordShare(e.target.value)
      setBuilderShare(100 - e.target.value)
    }
  }
  const EditedBuilderShare = (e) => {
    // e.preventdefault()
    // setLandLordShare(e.target.value)
    // setBuilderShare(100 - e.target.value)
    // console.log('my eis ', e.target.value)
  }

  const onSubmit = async (data, resetForm) => {
    const updatedData = {
      ...data,
      projectType: selected,
      developmentType: devType,
      editMode: true,
    }
    setLoading(true)
    if (project?.editMode) {
      await updateProject(
        orgId,
        project.uid,
        updatedData,
        existingBuildBankId,
        existingLandBankId,
        enqueueSnackbar
      )
    } else {
      await createProject(orgId, updatedData, enqueueSnackbar, resetForm)
    }
    setLoading(false)
  }

  const onAreaClick = () => {
    setOpenAreaFields(!openAreaFields)
  }

  useEffect(() => {
    const unsubscribe = steamBankDetailsList(
      orgId,
      (querySnapshot) => {
        const addNewSetUp = [{ value: 'addNewOption', label: 'Add New' }]
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        bankA.map((user) => {
          user.label = user?.accountName
          user.value = user?.accountNo
        })
        console.log('fetched users list is', bankA)
        setBankDetailsA([...addNewSetUp, ...bankA])
      },
      (error) => setBankDetailsA([])
    )

    return unsubscribe
  }, [])

  const closeAddNewFun = () => {
    setAddNewBankStuff(false)
  }

  const initialState = {
    projectName: project?.projectName || '',
    bmrdaApproval: project?.bmrdaApproval || '',
    bmrdaNo: project?.bmrdaNo || '',
    PlanningApprovalAuthority: project?.PlanningApprovalAuthority || '',
    bmrdaStartDate: project?.bmrdaStartDate || '',
    bmrdaEndDate: project?.bmrdaEndDate || '',
    hdmaApproval: project?.hdmaApproval || '',
    hdmaNo: project?.hdmaNo || '',
    hdmaStartDate: project?.hdmaStartDate || '',
    hdmaEndDate: project?.hdmaEndDate || '',

    builderName: project?.builderName || '',
    builder_bank_details: project?.builder_bank_details || '',
    builderGSTno: project?.builderGSTno || '',
    landlordName: project?.landlordName || '',
    builderBankDocId: project?.builderBankDocId || '',
    landlordBankDocId: project?.landlordBankDocId || '',
    landlord_bank_details: project?.landlord_bank_details || '',
    landlordShare: project?.landlordShare || landLordShare,
    builderShare: project?.builderShare || builerShare,
    area: project?.area || '',
    location: project?.location || '',
    pincode: project?.pincode || '',
    state: project?.state || '',
    city: project?.city || '',
    address: project?.address || '',
    areaTextPrimary: project?.areaTextPrimary || '',
    areaTextSecondary: project?.areaTextSecondary || '',
    areaDropDownPrimary: project?.areaDropDownPrimary || 'acre',
    areaDropdownSecondary: project?.areaDropdownSecondary || 'gunta',
  }

  const createProjectSchema = Yup.object({
    projectName: Yup.string()
      .max(30, 'Must be 30 characters or less')
      .required('Required'),
    builderName: Yup.string()
      .min(3, 'Must be 3 characters or more')
      .required('Required'),
    location: Yup.string().required('Required'),
    pincode: Yup.string()
      .required('Required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .length(6, 'Must be 6 digits'),
    city: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    // landlordShare:
    //   devType.name === 'Joint'
    //     ? Yup.number().required('Required')
    //     : Yup.string().notRequired(),
    // builderShare: Yup.number().required('Required'),
    // builderBankDocId: Yup.string().required('Required'),
    landlordBankDocId:
      devType.name === 'Joint'
        ? Yup.string().required('Required')
        : Yup.string().notRequired(),
  })
  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-2 sm:px-6  z-10 absolute top-0  w-full bg-white py-2">
        <Dialog.Title className=" font-semibold text-xl mr-auto ml-3  font-Playfair tracking-wider">
          {title}
        </Dialog.Title>
      </div>

      <div className="grid  gap-8 grid-cols-1">
        <div className="flex flex-col ">
          <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 m-4 ">
            <CustomRadioGroup
              label="Type"
              value={selected}
              options={projectPlans}
              onChange={setSelected}
            />
          </div>
          <div className="mt-0">
            <Formik
              initialValues={initialState}
              validationSchema={createProjectSchema}
              onSubmit={(values, { resetForm }) => {
                onSubmit(values, resetForm)
              }}
            >
              {(formik) => (
                <Form>
                  <div className="form m-4">
                    <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 ">
                      <p className='text-sm text-gray-800 font-medium'>Project Name*</p>
                      <TextField
                        label=""
                        name="projectName"
                        type="text"
                      />
                      <div className="mb-3">
                        <label
                          htmlFor="area"
                          className="label font-medium text-sm"
                        >
                          Saleable Area*
                        </label>
                        <MuiTextField
                          id="area"
                          className={`w-full bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 mt-1 p-0`}
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                Saleable Area
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <button
                                  type="button"
                                  style={{ marginRight: '-13px' }}
                                  onClick={onAreaClick}
                                  className="border border-green-400 font-semibold text-3xl px-2 bg-green-400 shadow-sm font-medium tracking-wider text-white hover:shadow-lg hover:bg-green-500"
                                >
                                  {openAreaFields ? <Remove /> : <Add />}
                                </button>
                              </InputAdornment>
                            ),
                          }}
                          label=""
                          name="area"
                          type="text"
                          value={formik.values.area}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.area ? (
                          <div className="error-message text-red-700 text-xs p-2">
                            {formik.errors.area}
                            {formik.values.area}
                          </div>
                        ) : null}
                        {openAreaFields && (
                          <AreaConverter
                            formik={formik}
                            hideField={setOpenAreaFields}
                            fieldName="area"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 ">
                      <CustomRadioGroup
                        label="Planning Authority Approval"
                        value={planningApproval}
                        options={chooseAuthorityApproval}
                        onChange={setPlanningApproval}
                      />


                     {planningApproval?.name === 'Yes' &&
                     <>
                     <div className='py-2'>
                      <CustomSelect
                            name="Planning Approval Authority"
                            label={<label className="text-sm text-gray-800 font-medium">Planning Authority</label>}
                            className="input mt-2"
                            onChange={({ value }) => {
                            formik.setFieldValue('PlanningApprovalAuthority', value)
                           }}
                            value={formik.values.PlanningApprovalAuthority}
                            options={approvalAuthority}

                          />
                      </div>




                      <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">





                        <div className="mt-2 w-full">
                          <TextField
                            label={`${formik.values.PlanningApprovalAuthority.value || ''}Approval No*`}
                            name="bmrdaNo"
                            type="text"
                          />
                        </div>
                        <div className="mt-2 w-full">
                          {/*  <TextField
                            label="Start Date*"
                            name="bmrdaStartDate"
                            type="text"
                          />*/}

                          <label className="label font-regular block mb-1">
                          Approval Date*
                          </label>
                          <DatePicker
                            id="bmrdaStartDate"
                            name="bmrdaStartDate"
                            className="pl- px-1 h-8 rounded-md min-w-[200px] inline text-[#0091ae] flex bg-grey-lighter text-grey-darker border border-[#cccccc] px-2"
                            selected={startDate}
                            onChange={(date) => {
                              formik.setFieldValue(
                                'bmrdaStartDate',
                                date.getTime()
                              )
                              setStartDate(date)
                            }}
                            timeFormat="HH:mm"
                            injectTimes={[
                              setHours(setMinutes(d, 1), 0),
                              setHours(setMinutes(d, 5), 12),
                              setHours(setMinutes(d, 59), 23),
                            ]}
                            dateFormat="MMMM d, yyyy"
                          />
                        </div>
                        <div className="mt-2 w-full">
                          {/*<TextField
                            label="End Date*"
                            name="bmrdaEndDate"
                            type="text"
                            />*/}

                          <label className="label font-regular block mb-1">
                            End Date*
                          </label>
                          <DatePicker
                            id="bmrdaEndDate"
                            name="bmrdaEndDate"
                            className="pl- px-1 h-8 rounded-md min-w-[200px] inline text-[#0091ae] flex bg-grey-lighter text-grey-darker border border-[#cccccc] px-2"
                            selected={endDate}
                            onChange={(date) => {
                              formik.setFieldValue(
                                'bmrdaEndDate',
                                date.getTime()
                              )
                              setEndDate(date)
                            }}
                            timeFormat="HH:mm"
                            injectTimes={[
                              setHours(setMinutes(d, 1), 0),
                              setHours(setMinutes(d, 5), 12),
                              setHours(setMinutes(d, 59), 23),
                            ]}
                            dateFormat="MMMM d, yyyy"
                          />
                        </div>
                      </div>
                      </>}
                    </div>

                    <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 ">
                      <CustomRadioGroup
                        label="Rera Approval"
                        value={reraApproval}
                        options={chooseReraApproval}
                        onChange={setReraApproval}
                      />
                     {reraApproval?.name === 'Yes' && <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                        <div className="mt-2 w-full">
                          <TextField
                            label="RERA No*"
                            name="hdmaNo"
                            type="text"
                          />
                        </div>
                        <div className="mt-2 w-full">
                          {/*<TextField
                            label="Start Date*"
                            name="hdmaStartDate"
                            type="text"
                           />*/}

                          <label className="label font-regular block mb-1">
                          Approval Date*
                          </label>
                          <DatePicker
                            id="hdmaStartDate"
                            name="hdmaStartDate"
                            className="pl- px-1 h-8 rounded-md min-w-[200px] inline text-[#0091ae] flex bg-grey-lighter text-grey-darker border border-[#cccccc] px-2"
                            selected={startDate}
                            onChange={(date) => {
                              formik.setFieldValue(
                                'hdmaStartDate',
                                date.getTime()
                              )
                              setStartDate(date)
                            }}
                            timeFormat="HH:mm"
                            injectTimes={[
                              setHours(setMinutes(new Date(), 1), 0),
                              setHours(setMinutes(new Date(), 5), 12),
                              setHours(setMinutes(new Date(), 59), 23),
                            ]}
                            dateFormat="MMMM d, yyyy"
                          />
                        </div>
                        <div className="mt-2 w-full">
                          {/*  <TextField
                            label="End Date*"
                            name="hdmaEndDate"
                            type="text"
                          />*/}

                          <label className="label font-regular block mb-1">
                            End Date*
                          </label>
                          <DatePicker
                            id="hdmaEndDate"
                            name="hdmaEndDate"
                            className="pl- px-1 h-8 rounded-md min-w-[200px] inline text-[#0091ae] flex bg-grey-lighter text-grey-darker border border-[#cccccc] px-2"
                            selected={endDate}
                            onChange={(date) => {
                              formik.setFieldValue(
                                'hdmaEndDate',
                                date.getTime()
                              )
                              setEndDate(date)
                            }}
                            timeFormat="HH:mm"
                            injectTimes={[
                              setHours(setMinutes(d, 1), 0),
                              setHours(setMinutes(d, 5), 12),
                              setHours(setMinutes(d, 59), 23),
                            ]}
                            dateFormat="MMMM d, yyyy"
                          />
                        </div>
                      </div>}
                    </div>
                    <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 ">
                      <CustomRadioGroup
                        label="Development Type"
                        value={devType}
                        options={developmentTypes}
                        onChange={setdevType}
                      />
                      <div className="flex mt-3 mb-3 space-y-2 w-full text-xs">

                        <div className=" mt-2 mr-3 w-full">

                        <MultiSelectMultiLineField
                            label="Builder Bank Account*"
                            name="builderBankDocId"
                            onChange={(payload) => {
                              console.log('changed value is ', payload)
                              const { value, id, accountName } = payload
                              formik.setFieldValue('builderName', accountName)
                              formik.setFieldValue('landlordBankDocId', id)

                              if (value === 'addNewOption') {
                                setAddNewBankStuff(true)
                              }
                              formik.setFieldValue('builderBankDocId', id)
                            }}
                            value={formik.values.builderBankDocId}
                            options={bankDetailsA}
                            setAddNewBankStuff={setAddNewBankStuff}
                          />





                               {/* {formik.errors.builderBankDocId ? (
                             <div className="error-message text-red-700 text-xs p-2">
                             {formik.errors.builderBankDocId}
                                {formik.values.builderBankDocId}
                                  </div>
                               ) : null} */}
                        </div>

                        {devType.name === 'Joint' && (
                          <div className="mt-2 mr-3 w-full py-1">
                            <TextField
                              label="Builder Share*"
                              name="builderShare"
                              value={builerShare}
                              onChange={(e) => EditedLandlord(e, formik)}
                              type="number"
                              id="numberSize"

                              className="border border-gray-300 h-9 p-2 rounded-md w-full"

                            />
                          </div>
                        )}
                      </div>

                      {addNewBankStuff && (
                        <AddBankDetailsForm
                          title={'Add New Account'}
                          dialogOpen={closeAddNewFun}
                          phase={'data'}
                        />
                      )}

                      {devType.name === 'Joint' && (
                        <div className="flex  mb-3 space-y-2 w-full text-xs">
                          <div className=" mt-2 mr-3 w-full">
                            <MultiSelectMultiLineField
                              label="Landlord Bank Account*"
                              name="landlordBankDocId"
                              onChange={(payload) => {
                                console.log('changed value is ', payload)
                                const { value, id, accountName } = payload
                                formik.setFieldValue(
                                  'landlordName',
                                  accountName
                                )
                                formik.setFieldValue('landlordBankDocId', id)

                                console.log('changed value is ', value)

                                if (value === 'addNewOption') {
                                  setAddNewBankStuff(true)
                                }
                                formik.setFieldValue('landlordBankDocId', id)
                              }}
                              value={formik.values.landlordBankDocId}
                              options={bankDetailsA}
                              setAddNewBankStuff={setAddNewBankStuff}
                            />
                            {formik.errors.landlordBankDocId ? (
                              <div className="error-message text-red-700 text-xs p-2">
                                {formik.errors.landlordBankDocId}
                                {formik.values.landlordBankDocId}
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-2 mr-3 w-full py-1">
                            <TextField
                              label="LandLord Share*"
                              name="landlordShare"
                              value={landLordShare}
                              type="number"
                              onChange={(e) => EditedLandlord(e, formik)}
                              className="border border-gray-300 h-9 p-2 rounded-md w-full"
                            />
                          </div>
                        </div>
                      )}


                    </div>
                    <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 ">



                      <div  className='py-2'>
                        <p className="text-sm text-gray-800 font-medium">Project Location Details</p>
                      </div>

                      <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                        <TextField
                          label="Location*"
                          name="location"
                          type="text"
                        />
                        <TextField
                          label="Pincode*"
                          name="pincode"
                          type="text"
                        />
                      </div>
                      <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                        <div className="mt-2 w-full">
                          <TextField label="City*" name="city" type="text" />
                        </div>
                        <div className="w-full">
                          <CustomSelect
                            name="state"
                            label="State*"
                            className="input mt-2"
                            onChange={({ value }) => {
                              formik.setFieldValue('state', value)
                            }}
                            value={formik.values.state}
                            options={statesList}
                          />
                          {/* {formik.errors.state ? (
                            <div className="error-message text-red-700 text-xs p-2">
                              {formik.errors.state}
                              {formik.values.state}
                            </div>
                          ) : null} */}
                        </div>
                      </div>
                      <div className="mt-2 w-full mb-10">
                        <TextAreaField
                          label="Address"
                          name="address"
                          type="text"
                        />
                      </div>


                    </div>
                  </div>
                  <div className="z-10 flex flex-row justify-between mt-4 pb-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                     <div></div>
                      <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse mb-6">
                        <button
                          onClick={() => dialogOpen(false)}
                          type="button"
                          className="mb-4 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                        >
                          {' '}
                          Cancel{' '}
                        </button>
                        <button
                          className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500"
                          type="submit"
                          disabled={loading}
                        >
                          {loading && <Loader />}
                          {project?.editMode ? 'Update' : 'Save'}
                        </button>
                      </div>
                      </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DialogFormBody
