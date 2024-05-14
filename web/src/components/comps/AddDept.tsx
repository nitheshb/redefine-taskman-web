import { useState } from 'react'

import { Form, Formik, Field } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'

import { useParams } from '@redwoodjs/router'

import Loader from 'src/components/Loader/Loader'
import { addBankAccount, addDepartment, addVirtualAccount } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { TextField } from 'src/util/formFields/TextField'
import { GoodString } from 'src/util/dateConverter'

const AddTaskDeptForm = ({ title, dialogOpen, phase: bankData }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { uid } = useParams()

  const onSubmit = async (data, resetForm) => {
    console.log('data is ', data, data.deptName)
    const updatedData = {
      label: GoodString(data.deptName),
      value: data.deptName.toLowerCase()
    }

    setLoading(true)
    await addDepartment(
      orgId,
      updatedData,
      'nithe.nithesh@gmail.com',
      'virtural Creation'
    )
    await setLoading(false)

  }

  const initialState = {
    deptName: bankData?.accountName || '',
  }

  const validateSchema = Yup.object({
    deptName: Yup.string()
      .max(60, 'Must be 60 characters or less')
      .required('Department Name Required'),
  })

  const submitFormFun = (formik) => {
    formik.handleSubmit()
  }

  return (
    <div className="h-full flex flex-col py-2 bg-white shadow-xl m-3 mx-0 rounded-md">
      <div className="grid gap-8 grid-cols-1">
        <div className="flex flex-col rounded-lg bg-white m-4">
          <div className="mt-0">
            <Formik
              initialValues={initialState}
              validationSchema={validateSchema}
              onSubmit={(values, { resetForm }) => {
                onSubmit(values, resetForm)
              }}
            >
              {(formik) => (
                <Form>
                  <div className="form">
                    {/* Phase Details */}
                    <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 px-4 ">
                      <div className="flex flex-col mt-3 mb-3 space-y-2 w-full text-xs">
                        <div className="mt-2 mr-3 w-full">
                          <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                            <TextField
                              label="Department Name*"
                              name="deptName"
                              type="text"
                            />
                          </div>
                          <div className="flex flex-col mt-2  ">
                            <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
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
                                type="button"
                                disabled={loading}
                                onClick={() => submitFormFun(formik)}
                              >
                                {loading && <Loader />}
                                {bankData?.editMode ? 'Update' : 'Add'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default AddTaskDeptForm
