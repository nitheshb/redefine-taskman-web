import React, { useEffect, useState } from 'react'

import { Dialog } from '@headlessui/react'
import { Alert, AlertTitle } from '@mui/lab'
import { useSnackbar } from 'notistack'
import Select from 'react-select'

import { MaterialCRUDTable } from 'src/components/MaterialCRUDTable'
import {
  costSheetAdditionalChargesA,
  csConstruAdditionalChargesA,
  csPartATax,
  gstValesPartA,
  gstValesA,
  unitsCancellation,
  costSheetPartcChargesA,
} from 'src/constants/projects'
import {
  addPhaseAdditionalCharges,
  addPhasePartAtax,
  updatePhaseAdditionalCharges,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

const AdditionalChargesForm = ({ title, data, source, blocksViewFeature }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [tableData, setTableData] = useState([])
  const [partAData, setPartAData] = useState([])
  const [partCData, setPartCData] = useState([])
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [editOpitionsObj, setEditOptions] = useState({})
  const [editOpitionsObjPartA, setEditOptionsPartA] = useState({})
  const [editOpitionsObjPartC, setEditOptionsPartC] = useState({})

  useEffect(() => {
    if (source === 'projectManagement') {
      setEditOptions({
        onRowAdd: async (newData) => await handleRowAdd(newData),
        onRowUpdate: async (newData, oldData) =>
          await handleRowUpdate(newData, oldData),
        onRowDelete: async (oldData) => await handleRowDelete(oldData),
      })
    }
  }, [source, data, tableData])

  useEffect(() => {
    if (source === 'projectManagement') {
      setEditOptionsPartC({
        onRowAdd: async (newData) => await handleRowAddPartC(newData),
        onRowUpdate: async (newData, oldData) =>
          await handleRowUpdatePartC(newData, oldData),
        onRowDelete: async (oldData) => await handleRowDeletePartC(oldData),
      })
    }
  }, [source, data, tableData, partCData])
  useEffect(() => {
    if (source === 'projectManagement') {
      setEditOptionsPartA({
        onRowAdd: async (newData) => await handleRowAddPartA(newData),
        onRowUpdate: async (newData, oldData) =>
          await handleRowUpdatePartA(newData, oldData),
        onRowDelete: async (oldData) => await handleRowDeletePartA(oldData),
      })
    }
  }, [source, data, tableData, partAData])

  useEffect(() => {
    const { phase } = data

    const { additonalChargesObj, ConstructOtherChargesObj } = phase
    const x =
      blocksViewFeature === 'Construction_Other_Charges'
        ? ConstructOtherChargesObj
        : additonalChargesObj
    setTableData(x)
    setPartAData(phase?.partATaxObj || [])
    setPartCData(phase?.partCTaxObj || [])

    console.log('phase is ', phase, x)
  }, [data, blocksViewFeature])

  const { enqueueSnackbar } = useSnackbar()
  const defaultValue = (options, value) => {
    return (
      (options
        ? options.find((option) => option.value === value?.value)
        : '') || ''
    )
  }
  // paymentScheduleA
  const columns = [
    {
      title: 'Charges For*',
      field: 'component',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => {
        return rowData?.component?.label
      },
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="component"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={
              blocksViewFeature === 'Construction_Other_Charges'
                ? csConstruAdditionalChargesA
                : costSheetAdditionalChargesA
            }
            value={defaultValue(
              blocksViewFeature === 'Construction_Other_Charges'
                ? csConstruAdditionalChargesA
                : costSheetAdditionalChargesA,
              value
            )}
            className="text-md mr-2"
          />
        )
      },
      // editComponent: ({ value, onChange }) => (
      //   <input
      //     placeholder="Charges For"
      //     className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
      //     autoComplete="off"
      //     onChange={(e) => onChange(e.target.value)}
      //     value={value}
      //   />
      // ),
    },
    {
      title: 'Units*',
      field: 'units',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.units?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value) => {
              onChange(value)
            }}
            options={unitsCancellation}
            value={defaultValue(unitsCancellation, value)}
            className="text-md mr-2"
          />
        )
      },
    },
    {
      title: 'Charges*',
      field: 'charges',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) =>
        rowData?.units?.value === 'percentage'
          ? `${rowData?.charges} %`
          : `₹ ${rowData?.charges?.toLocaleString('en-IN')}`,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <input
            placeholder="Charges"
            className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
            autoComplete="off"
            onChange={(e) =>
              rowData?.units?.value === 'percentage'
                ? onChange(
                    parseInt(e.target.value) > 100 ? 100 : e.target.value
                  )
                : onChange(e.target.value)
            }
            value={value}
            type="number"
            max="100"
          />
        )
      },
    },
    {
      title: 'GST*',
      field: 'gst',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.gst?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={gstValesA}
            value={defaultValue(gstValesA, value)}
            className="text-md mr-2"
          />
        )
      },
    },
    {
      title: 'Description*',
      field: 'description',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      editComponent: ({ value, onChange }) => (
        <input
          placeholder="Description"
          className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      ),
    },
  ]

  // partA columns
  const partAcolumns = [
    {
      title: 'Charges For*',
      field: 'component',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => {
        return rowData?.component?.label
      },
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="component"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={
              blocksViewFeature === 'Construction_Other_Charges'
                ? csPartATax
                : csPartATax
            }
            value={defaultValue(
              blocksViewFeature === 'Construction_Other_Charges'
                ? csPartATax
                : csPartATax,
              value
            )}
            className="text-md mr-2"
          />
        )
      },
      // editComponent: ({ value, onChange }) => (
      //   <input
      //     placeholder="Charges For"
      //     className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
      //     autoComplete="off"
      //     onChange={(e) => onChange(e.target.value)}
      //     value={value}
      //   />
      // ),
    },
    {
      title: 'GST*',
      field: 'gst',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.gst?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={gstValesPartA}
            value={defaultValue(gstValesPartA, value)}
            className="text-md mr-2"
          />
        )
      },
    },
  ]

  // partC columns
  const partCcolumns = [
    {
      title: 'Charges For*',
      field: 'component',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => {
        return rowData?.component?.label
      },
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="component"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={
              blocksViewFeature === 'Construction_Other_Charges'
                ? csConstruAdditionalChargesA
                : costSheetPartcChargesA
            }
            value={defaultValue(
              blocksViewFeature === 'Construction_Other_Charges'
                ? csConstruAdditionalChargesA
                : costSheetPartcChargesA,
              value
            )}
            className="text-md mr-2"
          />
        )
      },
      // editComponent: ({ value, onChange }) => (
      //   <input
      //     placeholder="Charges For"
      //     className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
      //     autoComplete="off"
      //     onChange={(e) => onChange(e.target.value)}
      //     value={value}
      //   />
      // ),
    },
    {
      title: 'Units*',
      field: 'units',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.units?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value) => {
              onChange(value)
            }}
            options={unitsCancellation}
            value={defaultValue(unitsCancellation, value)}
            className="text-md mr-2"
          />
        )
      },
    },
    {
      title: 'Charges*',
      field: 'charges',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) =>
        rowData?.units?.value === 'percentage'
          ? `${rowData.charges} %`
          : `₹ ${rowData?.charges?.toLocaleString('en-IN')}`,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <input
            placeholder="Charges"
            className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
            autoComplete="off"
            onChange={(e) =>
              rowData?.units?.value === 'percentage'
                ? onChange(
                    parseInt(e.target.value) > 100 ? 100 : e.target.value
                  )
                : onChange(e.target.value)
            }
            value={value}
            type="number"
            max="100"
          />
        )
      },
    },
    {
      title: 'GST*',
      field: 'gst',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.gst?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={gstValesA}
            value={defaultValue(gstValesA, value)}
            className="text-md mr-2"
          />
        )
      },
    },
    {
      title: 'Description*',
      field: 'description',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      editComponent: ({ value, onChange }) => (
        <input
          placeholder="Description"
          className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      ),
    },
  ]

  const errors = (formData) => {
    //validating the data inputs
    const errorList = []
    if (!formData.component) {
      errorList.push("Try Again, You didn't enter the Charges For field")
    }
    if (!formData.units) {
      errorList.push("Try Again, You didn't enter the Units field")
    }
    if (!formData.charges) {
      errorList.push("Try Again, You didn't enter the Charges field")
    }
    if (!formData.gst) {
      errorList.push("Try Again, You didn't enter the gst field")
    }

    // if (!formData.description) {
    //   errorList.push("Try Again, description field can't be blank")
    // }
    return errorList
  }
  const partAerrors = (formData) => {
    //validating the data inputs
    const errorList = []
    if (!formData.component) {
      errorList.push("Try Again, You didn't enter the Charges For field")
    }

    if (!formData.gst) {
      errorList.push("Try Again, You didn't enter the gst field")
    }

    return errorList
  }
  //function for updating the existing row details
  const handleRowUpdate = async (newData, oldData) => {
    const { uid, additonalChargesObj } = data?.phase || {}

    console.log('check this stuff', tableData, additonalChargesObj)
    const c = await tableData.map((e) => {
      console.log(e.myId, oldData.myId, e.myId === oldData.myId)
      if (e.myId === oldData.myId) {
        return newData
      }
      return e
    })
    console.log('check this stuff', tableData, c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      blocksViewFeature === 'Construction_Other_Charges'
        ? 'ConstructOtherChargesObj'
        : 'additonalChargesObj',
      enqueueSnackbar
    )
  } //function for updating the existing row details
  const handleRowUpdatePartA = async (newData, oldData) => {
    const { uid, additonalChargesObj } = data?.phase || {}

    console.log('check this stuff', partAData, additonalChargesObj)
    const c = await partAData.map((e) => {
      console.log(
        'check this stuff',
        e.myId,
        oldData.myId,
        e.myId === oldData.myId,
        newData
      )
      if (e.myId === oldData.myId) {
        return newData
      }
      return e
    })
    console.log('check this stuff', tableData, c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partATaxObj',
      enqueueSnackbar
    )
  }

  //function for updating the existing row details
  const handleRowUpdatePartC = async (newData, oldData) => {
    const { uid, additonalChargesObj } = data?.phase || {}

    console.log('check this stuff', partAData, additonalChargesObj)
    const c = await partAData.map((e) => {
      console.log(
        'check this stuff',
        e.myId,
        oldData.myId,
        e.myId === oldData.myId,
        newData
      )
      if (e.myId === oldData.myId) {
        return newData
      }
      return e
    })
    console.log('check this stuff', tableData, c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partCTaxObj',
      enqueueSnackbar
    )
  }

  //function for deleting a row
  const handleRowDelete = async (oldData) => {
    const { uid } = data?.phase || {}
    const c = tableData.filter((e) => e.myId != oldData.myId)
    console.log('check this stuff', c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      blocksViewFeature === 'Construction_Other_Charges'
        ? 'ConstructOtherChargesObj'
        : 'additonalChargesObj',
      enqueueSnackbar
    )
    // await deleteAdditionalCharge(oldData?.uid, enqueueSnackbar)
  } //function for deleting a row
  const handleRowDeletePartA = async (oldData) => {
    const { uid } = data?.phase || {}
    const c = partAData.filter((e) => e.myId != oldData.myId)
    console.log('check this stuff', c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partATaxObj',
      enqueueSnackbar
    )
    // await deleteAdditionalCharge(oldData?.uid, enqueueSnackbar)
  } //function for deleting a row
  const handleRowDeletePartC = async (oldData) => {
    const { uid } = data?.phase || {}
    const c = partAData.filter((e) => e.myId != oldData.myId)
    console.log('check this stuff', c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partCTaxObj',
      enqueueSnackbar
    )
    // await deleteAdditionalCharge(oldData?.uid, enqueueSnackbar)
  }

  //function for adding a new row to the table
  const handleRowAdd = async (newData) => {
    setIserror(false)
    setErrorMessages([])
    const errorList = errors(newData)
    if (errorList.length < 1) {
      const { projectId, uid } = data?.phase || {}

      const additonalChargesObj = {
        ...newData,
      }
      // await createAdditonalCharges(additonalChargesObj, enqueueSnackbar)
      await addPhaseAdditionalCharges(
        orgId,
        uid,
        additonalChargesObj,
        blocksViewFeature === 'Construction_Other_Charges'
          ? 'ConstructOtherChargesObj'
          : 'additonalChargesObj',
        enqueueSnackbar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }
  //function for adding a new row to the table
  const handleRowAddPartA = async (newData) => {
    console.log('newData is', newData)
    setIserror(false)
    setErrorMessages([])
    const errorList = partAerrors(newData)
    if (errorList.length < 1) {
      console.log('newData is inside yo', newData)
      const { projectId, uid } = data?.phase || {}

      const additonalChargesObj = {
        ...newData,
      }
      // await createAdditonalCharges(additonalChargesObj, enqueueSnackbar)
      await addPhasePartAtax(
        orgId,
        uid,
        additonalChargesObj,
        'partATaxObj',
        enqueueSnackbar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }

  //function for adding a new row to the table
  const handleRowAddPartC = async (newData) => {
    setIserror(false)
    setErrorMessages([])
    const errorList = errors(newData)
    if (errorList.length < 1) {
      const { projectId, uid } = data?.phase || {}

      const additonalChargesObj = {
        ...newData,
      }
      // await createAdditonalCharges(additonalChargesObj, enqueueSnackbar)
      await addPhaseAdditionalCharges(
        orgId,
        uid,
        additonalChargesObj,
        'partCTaxObj',
        enqueueSnackbar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }
  return (
    <section>
      <div className=" min border border-radius-4">
        <MaterialCRUDTable
          title=""
          columns={partAcolumns}
          data={partAData}
          options={{
            headerStyle: {
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderBottomWidth: '2px',
              background: '#f8fafd',
              fontWeight: '600px',
              padding: '13px',
            },
            actionsColumnIndex: -1,
            paging: false,
            doubleHorizontalScroll: true,
            position: 'absolute',
          }}
          style={{
            padding: '0px 20px',
            borderRadius: '0px',
            boxShadow: 'none',
            fontSize: '12px',
          }}
          actionsCellStyle={{
            width: 'auto',
            justifyCenter: 'center',
          }}
          source={source}
          editable={editOpitionsObjPartA}
        />
      </div>

      {/* part b */}
      <div className="h-full shadow-xl flex flex-col  mb-6 bg-[#F1F5F9] rounded-t overflow-y-scroll">
        <div className="z-10">
          {/* <Dialog.Title className="font-semibold text-xl mr-auto ml-3 text-[#053219]">
          {title}
        </Dialog.Title> */}
          {/* <span className="mr-auto ml-3  text-md font-extrabold tracking-tight uppercase font-body ">
          {blocksViewFeature === 'Construction_Other_Charges'
            ? 'Construction Other Charges (section B)'
            : 'Plot Other Charges (section B)'}
        </span> */}

          <div className=" min">
            <MaterialCRUDTable
              title=""
              columns={columns}
              data={tableData}
              options={{
                headerStyle: {
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  borderBottomWidth: '2px',
                  background: '#f8fafd',
                  fontWeight: '600px',
                  padding: '13px',
                },
                actionsColumnIndex: -1,
                paging: false,

                doubleHorizontalScroll: true,
                position: 'absolute',
              }}
              style={{
                padding: '0px 20px',
                borderRadius: '0px',
                boxShadow: 'none',
                fontSize: '12px',
              }}
              actionsCellStyle={{
                width: 'auto',
                justifyCenter: 'center',
              }}
              source={source}
              editable={editOpitionsObj}
            />
          </div>
          <div>
            {iserror && (
              <Alert severity="error">
                <AlertTitle>ERROR</AlertTitle>
                {errorMessages.map((msg, i) => {
                  return <div key={i}>{msg}</div>
                })}
              </Alert>
            )}
          </div>
        </div>

        <div className=" min">
          <MaterialCRUDTable
            title=""
            columns={partCcolumns}
            data={partCData}
            options={{
              headerStyle: {
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                borderBottomWidth: '2px',
                background: '#f8fafd',
                fontWeight: '600px',
                padding: '13px',
              },
              actionsColumnIndex: -1,
              paging: false,

              doubleHorizontalScroll: true,
              position: 'absolute',
            }}
            style={{
              padding: '0px 30px',
              borderRadius: '0px',
              boxShadow: 'none',
              fontSize: '12px',
            }}
            actionsCellStyle={{
              width: 'auto',
              justifyCenter: 'center',
            }}
            source={source}
            editable={editOpitionsObjPartC}
          />
        </div>
      </div>
    </section>
  )
}

export default AdditionalChargesForm
