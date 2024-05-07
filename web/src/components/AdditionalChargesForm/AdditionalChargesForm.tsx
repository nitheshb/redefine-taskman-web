import React, { useEffect, useState } from 'react'

import { Dialog } from '@headlessui/react'
import { Select as SelectMAT, MenuItem } from '@material-ui/core'
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
import { color } from '@mui/system'

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
    console.log('partAData', partAData)
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
    console.log('vale is', value)
    return (
      (options
        ? options.find((option) => option.value === value?.value)
        : '') || ''
    )
  }

  const defaultValueNew = (options, value) => {
    console.log('vale is', value)
    return (
      (options ? options.find((option) => option.value === value) : value) || ''
    )
  }


  /* new-1 */
  // paymentScheduleA
  
  // const columns = [
  //   {
  //     title: 'Charges of For*',
  //     field: 'component',
  //     headerStyle: {
  //       padding: '0.25rem',
        
        
  //     },

  //     cellStyle: {
  //       padding: '0.25rem',
      

  //     },

  //     render: (rowData) => {
  //       return rowData?.component?.label
  //     },
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         // <select
  //         //   value={defaultValue(
  //         //     blocksViewFeature === 'Construction_Other_Charges'
  //         //       ? csConstruAdditionalChargesA
  //         //       : costSheetAdditionalChargesA,
  //         //     value
  //         //   )}
  //         //   onChange={(value_x) => {
  //         //     console.log('onchane ', value_x)
  //         //     onChange(value_x)
  //         //   }}
  //         //   // onChange={(e) => handleEdit(row?.id, 'sex', e.target.value)}>
  //         // >
  //         //   {blocksViewFeature === 'Construction_Other_Charges'
  //         //     ? csConstruAdditionalChargesA
  //         //     : costSheetAdditionalChargesA.map((data, i) => (
  //         //         <option key={i} value={data?.value}>
  //         //           {data?.label}
  //         //         </option>
  //         //       ))}
  //         // </select>
  //         <SelectMAT
  //           defaultValue={'Car Parking'}
  //           // value={'Car Parking'}
  //           onChange={(e) => {
  //             const selectedOptionObject =
  //               blocksViewFeature === 'Construction_Other_Charges'
  //                 ? csConstruAdditionalChargesA
  //                 : costSheetAdditionalChargesA.find(
  //                     (option) => option.value === e.target.value
  //                   )
  //             console.log(
  //               'value is ',
  //               selectedOptionObject,
  //               e.target,
  //               e.target.value,
  //               value,
  //               rowData
  //             )

  //             onChange(selectedOptionObject)
  //           }}
  //         >
  //           {blocksViewFeature === 'Construction_Other_Charges'
  //             ? csConstruAdditionalChargesA
  //             : costSheetAdditionalChargesA.map((option) => (
  //                 <MenuItem key={option.value} value={option.value}>
  //                   {option.label}
  //                 </MenuItem>
  //               ))}
  //         </SelectMAT>
  //         // <Select
  //         //   name="component"
  //         //   onChange={(value_x) => {
  //         //     onChange(value_x)
  //         //   }}
  //         //   options={
  //         //     blocksViewFeature === 'Construction_Other_Charges'
  //         //       ? csConstruAdditionalChargesA
  //         //       : costSheetAdditionalChargesA
  //         //   }
  //         //   value={defaultValue(
  //         //     blocksViewFeature === 'Construction_Other_Charges'
  //         //       ? csConstruAdditionalChargesA
  //         //       : costSheetAdditionalChargesA,
  //         //     value
  //         //   )}
  //         //   className="text-md mr-2"
  //         //   styles={{
  //         //     menu: (provided) => ({
  //         //       ...provided,
  //         //       zIndex: 9999, // Adjust the z-index value as needed
  //         //     }),
  //         //   }}
  //         // />
  //       )
  //     },
  //     // editComponent: ({ value, onChange }) => (
  //     //   <input
  //     //     placeholder="Charges For"
  //     //     className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
  //     //     autoComplete="off"
  //     //     onChange={(e) => onChange(e.target.value)}
  //     //     value={value}
  //     //   />
  //     // ),
  //   },

  //   {
  //     title: 'Units*',
  //     field: 'units',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
        
  //     },
  //     render: (rowData) => rowData?.units?.label,
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <Select
  //           name="Chargesdropdown"
  //           onChange={(value) => {
  //             console.log('onchane ', value)
  //             onChange(value)
  //           }}
  //           options={unitsCancellation}
  //           value={defaultValue(unitsCancellation, value)}
  //           className="text-md mr-2"
  //           styles={{
  //             menu: (provided) => ({
  //               ...provided,
  //               zIndex: 9,
  //               position: 'absolute', 
  //             }),
  //           }}
  //         />
  //       )
  //     },
  //   },
  //   {
  //     title: 'Charges*',
  //     field: 'charges',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
        
  //     },
  //     render: (rowData) =>
  //       rowData?.units?.value === 'percentage'
  //         ? `${rowData?.charges} %`
  //         : `₹ ${rowData?.charges?.toLocaleString('en-IN')}`,
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <input
  //           placeholder="Charges"
  //           className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
  //           autoComplete="off"
  //           onChange={(e) =>
  //             rowData?.units?.value === 'percentage'
  //               ? onChange(
  //                   parseInt(e.target.value) > 100 ? 100 : e.target.value
  //                 )
  //               : onChange(e.target.value)
  //           }
  //           value={value}
  //           type="number"
  //           max="100"
  //         />
  //       )
  //     },
  //   },
  //   {
  //     title: 'GST*',
  //     field: 'gst',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //       border: 'none',
  //     },
  //     render: (rowData) => rowData?.gst?.label,
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <Select
  //           name="Chargesdropdown"
  //           onChange={(value_x) => {
  //             onChange(value_x)
  //           }}
  //           options={gstValesA}
  //           value={defaultValue(gstValesA, value)}
  //           className="text-md mr-2 appearance-none border-none"
  //         />
  //       )
  //     },
  //   },
  //   {
  //     title: 'Description*',
  //     field: 'description',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //       border: 'none',
  //     },
  //     editComponent: ({ value, onChange }) => (
  //       <input
  //         placeholder="Description"
  //         className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
  //         autoComplete="off"
  //         onChange={(e) => onChange(e.target.value)}
  //         value={value}
  //       />
  //     ),
  //   },
  // ]

/* new-1 */


const columns = [
  {
    title: 'Charges of For*',
    field: 'component',
    headerStyle: {
      padding: '0.25rem',
    },
    cellStyle: {
      padding: '0.25rem',
    },
    render: (rowData) => {
      return rowData?.component?.label;
    },
    editComponent: ({ value, onChange, rowData }) => {
      return (
 
        <select
          name="Chargesdropdown"
          onChange={(e) => {
            const selectedOptionObject =
              blocksViewFeature === 'Construction_Other_Charges'
                ? csConstruAdditionalChargesA
                : costSheetAdditionalChargesA.find(
                    (option) => option.value === e.target.value
                  );
            onChange(selectedOptionObject);
          }}
          value={value}
          className="text-md mr-2 appearance-none border-none pr-8 border-transparent focus:outline-none focus:border-none"
          style={{
            fontSize: '14px',
            marginRight: '8px',
          }}
        >
          {blocksViewFeature === 'Construction_Other_Charges'
            ? csConstruAdditionalChargesA.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : costSheetAdditionalChargesA.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
        </select>
        
      );
    },
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
        <select
          name="Chargesdropdown"
          onChange={(e) => {
            console.log('onchange ', e.target.value);
            onChange(e.target.value);
          }}
          value={value}
          className="text-md mr-2 appearance-none border-none pr-8 border-transparent focus:outline-none focus:border-none"
          style={{
            fontSize: '14px',
            marginRight: '8px',
          }}
        >
          {unitsCancellation.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
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
          className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
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
      );
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
      border: 'none',
    },
    render: (rowData) => rowData?.gst?.label,
    editComponent: ({ value, onChange, rowData }) => {
      return (
        <div className="relative">
          <select
            name="Chargesdropdown"
            onChange={(e) => {
              onChange(e.target.value);
            }}
            value={value}
            className="text-md mr-2 appearance-none border-none pr-8 border-transparent focus:outline-none focus:border-none"
            style={{ paddingRight: '2.5rem', width: '100%' }}
          >
            {gstValesA.map((option) => (
              <option key={option.value} value={option.value}
              
              className="text-md border-none bg-white hover:bg-gray-100 focus:bg-gray-200"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 fill-current text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 12l-6-6h12l-6 6z"
              />
            </svg>
          </div>
        </div>
      );
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
      border: 'none',
    },
    editComponent: ({ value, onChange }) => (
      <input
        placeholder="Description"
        className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    ),
  },
];



// PartAColumns
  
  // const partAcolumns = [
  //   {
  //     title: 'Charges part a  For*',
  //     field: 'component',
  //     headerStyle: {
  //       padding: '0.25rem',
  //       color: 'red',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //       color: 'red',
  //     },
  //     render: (rowData) => {
  //       return rowData?.component?.label
  //     },
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <Select
  //           name="component"
  //           onChange={(value_x) => {
  //             onChange(value_x)
  //           }}
  //           options={
  //             blocksViewFeature === 'Construction_Other_Charges'
  //               ? csPartATax
  //               : csPartATax
  //           }
  //           value={defaultValue(
  //             blocksViewFeature === 'Construction_Other_Charges'
  //               ? csPartATax
  //               : csPartATax,
  //             value
  //           )}
  //           className="text-md mr-2"
  //         />
  //       )
  //     },
  //     // editComponent: ({ value, onChange }) => (
  //     //   <input
  //     //     placeholder="Charges For"
  //     //     className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
  //     //     autoComplete="off"
  //     //     onChange={(e) => onChange(e.target.value)}
  //     //     value={value}
  //     //   />
  //     // ),
  //   },
  //   {
  //     title: 'GST*',
  //     field: 'gst',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //     },
  //     render: (rowData) => rowData?.gst?.label,
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <Select
  //           name="Chargesdropdown"
  //           onChange={(value_x) => {
  //             onChange(value_x)
  //           }}
  //           options={gstValesPartA}
  //           value={defaultValue(gstValesPartA, value)}
  //           className="text-md mr-2"
  //         />
  //       )
  //     },
  //   },
  // ]



  const partAcolumns = [
    {
      title: 'Charges part a For*',
      field: 'component',
      headerStyle: {
        padding: '0.25rem',
        color: 'red',
      },
      cellStyle: {
        padding: '0.25rem',
        color: 'red',
      },
      render: (rowData) => rowData?.component?.label,
      editComponent: ({ value, onChange, rowData }) => (
        <Select
          name="component"
          onChange={(value_x) => {
            onChange(value_x);
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
      ),
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
      editComponent: ({ value, onChange, rowData }) => (
        <Select
          name="Chargesdropdown"
          onChange={(value_x) => {
            onChange(value_x);
          }}
          options={gstValesPartA}
          value={defaultValue(gstValesPartA, value)}
          className="text-md mr-2"
        />
      ),
    },
  ];






  // partC columns

  // Part - C

  // const partCcolumns = [
  //   {
  //     title: 'Charges For*',
  //     field: 'component',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //     },
  //     render: (rowData) => {
  //       return rowData?.component?.label
  //     },
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <Select
  //           name="component"
  //           onChange={(value_x) => {
  //             onChange(value_x)
  //           }}
  //           options={
  //             blocksViewFeature === 'Construction_Other_Charges'
  //               ? csConstruAdditionalChargesA
  //               : costSheetPartcChargesA
  //           }
  //           value={defaultValue(
  //             blocksViewFeature === 'Construction_Other_Charges'
  //               ? csConstruAdditionalChargesA
  //               : costSheetPartcChargesA,
  //             value
  //           )}
  //           className="text-md mr-2"
  //         />
  //       )
  //     },
  //     // editComponent: ({ value, onChange }) => (
  //     //   <input
  //     //     placeholder="Charges For"
  //     //     className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
  //     //     autoComplete="off"
  //     //     onChange={(e) => onChange(e.target.value)}
  //     //     value={value}
  //     //   />
  //     // ),
  //   },
  //   {
  //     title: 'Units*',
  //     field: 'units',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //     },
  //     render: (rowData) => rowData?.units?.label,
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <Select
  //           name="Chargesdropdown"
  //           onChange={(value) => {
  //             onChange(value)
  //           }}
  //           options={unitsCancellation}
  //           value={defaultValue(unitsCancellation, value)}
  //           className="text-md mr-2"
  //         />
  //       )
  //     },
  //   },
  //   {
  //     title: 'Charges*',
  //     field: 'charges',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //     },
  //     render: (rowData) =>
  //       rowData?.units?.value === 'percentage'
  //         ? `${rowData.charges} %`
  //         : `₹ ${rowData?.charges?.toLocaleString('en-IN')}`,
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <input
  //           placeholder="Charges"
  //           className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
  //           autoComplete="off"
  //           onChange={(e) =>
  //             rowData?.units?.value === 'percentage'
  //               ? onChange(
  //                   parseInt(e.target.value) > 100 ? 100 : e.target.value
  //                 )
  //               : onChange(e.target.value)
  //           }
  //           value={value}
  //           type="number"
  //           max="100"
  //         />
  //       )
  //     },
  //   },
  //   {
  //     title: 'GST*',
  //     field: 'gst',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //     },
  //     render: (rowData) => rowData?.gst?.label,
  //     editComponent: ({ value, onChange, rowData }) => {
  //       return (
  //         <Select
  //           name="Chargesdropdown"
  //           onChange={(value_x) => {
  //             onChange(value_x)
  //           }}
  //           options={gstValesA}
  //           value={defaultValue(gstValesA, value)}
  //           className="text-md mr-2"
  //         />
  //       )
  //     },
  //   },
  //   {
  //     title: 'Description*',
  //     field: 'description',
  //     headerStyle: {
  //       padding: '0.25rem',
  //     },
  //     cellStyle: {
  //       padding: '0.25rem',
  //     },
  //     editComponent: ({ value, onChange }) => (
  //       <input
  //         placeholder="Description"
  //         className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
  //         autoComplete="off"
  //         onChange={(e) => onChange(e.target.value)}
  //         value={value}
  //       />
  //     ),
  //   },
  // ]


  // Define your table columns
const partCcolumns = [
  {
    title: 'Charges box For*', // Apply styling for header if needed
    field: 'component',
    headerStyle: {
      padding: '0.25rem', // Example of header styling
    },
    cellStyle: {
      padding: '0.25rem', // Example of cell styling
    },
    render: (rowData) => {
      return rowData?.component?.label;
    },
    editComponent: ({ value, onChange, rowData }) => {
      return (
        <select
          name="component"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          className="text-md mr-2 appearance-none border-none pr-8 border-transparent focus:outline-none focus:border-none"
          style={{
            fontSize: '14px', // Example of styling for the select element
            marginRight: '8px', // Example of styling for the select element
            // Add any other styles you need for the select element
          }}
        >
          {/* Add options dynamically based on your data */}
          {blocksViewFeature === 'Construction_Other_Charges'
            ? csConstruAdditionalChargesA.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : costSheetPartcChargesA.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
        </select>
      );
    },
  },
  {
    title: 'Units*', // Apply styling for header if needed
    field: 'units',
    headerStyle: {
      padding: '0.25rem', // Example of header styling
    },
    cellStyle: {
      padding: '0.25rem', // Example of cell styling
    },
    render: (rowData) => rowData?.units?.label,
    editComponent: ({ value, onChange, rowData }) => {
      return (
        <select
          name="Chargesdropdown"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          className="text-md mr-2 appearance-none border-none pr-8 border-transparent focus:outline-none focus:border-none"
          style={{
            fontSize: '14px', // Example of styling for the select element
            marginRight: '8px', // Example of styling for the select element
            // Add any other styles you need for the select element
          }}
        >
          {/* Add options dynamically based on your data */}
          {unitsCancellation.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    },
  },
  {
    title: 'Charges*', // Apply styling for header if needed
    field: 'charges',
    headerStyle: {
      padding: '0.25rem', // Example of header styling
    },
    cellStyle: {
      padding: '0.25rem', // Example of cell styling
    },
    render: (rowData) =>
      rowData?.units?.value === 'percentage'
        ? `${rowData.charges} %`
        : `₹ ${rowData?.charges?.toLocaleString('en-IN')}`,
    editComponent: ({ value, onChange, rowData }) => {
      return (
        <input
          placeholder="Charges"
          className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
          autoComplete="off"
          onChange={(e) =>
            rowData?.units?.value === 'percentage'
              ? onChange(parseInt(e.target.value) > 100 ? 100 : e.target.value)
              : onChange(e.target.value)
          }
          value={value}
          type="number"
          max="100"
          // Apply styling for input if needed
        />
      );
    },
  },

  // {
  //   title: 'GST*', // Apply styling for header if needed
  //   field: 'gst',
  //   headerStyle: {
  //     padding: '0.25rem', // Example of header styling
  //   },
  //   cellStyle: {
  //     padding: '0.25rem', // Example of cell styling
  //   },
  //   render: (rowData) => rowData?.gst?.label,
  //   editComponent: ({ value, onChange, rowData }) => {
  //     return (
  //       <select
  //         name="Chargesdropdown"
  //         onChange={(e) => onChange(e.target.value)}
  //         value={value}
  //         className="text-md mr-2"
  //         style={{
  //           fontSize: '14px', // Example of styling for the select element
  //           marginRight: '8px', // Example of styling for the select element
  //           // Add any other styles you need for the select element
  //         }}
  //       >
  //         {/* Add options dynamically based on your data */}
  //         {gstValesA.map((option) => (
  //           <option key={option.value} value={option.value}>
  //             {option.label}
  //           </option>
  //         ))}
  //       </select>
  //     );
  //   },
  // },

  {
    title: 'GST*',
    field: 'gst',
    headerStyle: {
      padding: '0.25rem',
      width: '150px', // Example width
      // Add any other header styles you need
    },
    cellStyle: {
      padding: '0.25rem',
      width: '150px', // Example width
      // Add any other cell styles you need
    },
    render: (rowData) => rowData?.gst?.label,
    editComponent: ({ value, onChange, rowData }) => {
      return (
        <select
          name="Chargesdropdown"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          className="text-md mr-2 appearance-none border-none pr-8 border-transparent focus:outline-none focus:border-none"
          style={{
            fontSize: '14px',
            marginRight: '8px',
            width: '150px', // Example width
            // Add any other styles you need for the select element
          }}
        >
          {/* Add options dynamically based on your data */}
          {gstValesA.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    },
  },
  

  {
    title: 'Description*', // Apply styling for header if needed
    field: 'description',
    headerStyle: {
      padding: '0.25rem', // Example of header styling
    },
    cellStyle: {
      padding: '0.25rem', // Example of cell styling
    },
    editComponent: ({ value, onChange }) => (
      <input
        placeholder="Description"
        className="w-full min-w-full flex bg-grey-lighter text-grey-darker focus:outline-none rounded-md h-10 px-2"
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        // Apply styling for input if needed
      />
    ),
  },
];




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
  const [data1, setData] = useState([
    { id: 1, name: 'John Doe', sex: 'Male', class: '10th' },
    { id: 2, name: 'Jane Smith', sex: 'Female', class: '12th' },
  ])

  const handleEdit = (id, field, value) => {
    setData(
      data.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const genders = ['Male', 'Female', 'Other']
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

      {/* <table>
        <thead>
          {partAcolumns?.map((rowDa, i) => (
            <tr key={i}>
              <th>{rowDa?.title}</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {partAData.map((row) => (
            <tr key={row?.id}>
              <td>
                <input
                  type="text"
                  value={row?.component?.label}
                  onChange={(e) => handleEdit(row?.id, 'name', e.target.value)}
                />
              </td>
              <td>
                <select
                  value={row?.gst?.label}
                  onChange={(e) => handleEdit(row?.id, 'sex', e.target.value)}
                >
                  {gstValesA.map((data, i) => (
                    <option key={i} value={data?.value}>
                      {data?.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={row?.class}
                  onChange={(e) => handleEdit(row.id, 'class', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}


<section className="ml-4 text-md font-[500]">Part-A</section>


<table className="w-full border-collapse">
  <thead className="bg-white">
    {partAcolumns?.map((rowDa, i) => (
      <tr key={i}>
        <th className="p-2  border-t border-r border-b border-gray-300 px-4 py-2  text-gray-400 text-left text-sm">{rowDa?.title}</th>
      </tr>
    ))}
  </thead>
  <tbody>
    {partAData.map((row) => (
      <tr key={row?.id} className="border-t-2">
        <td className="p-2 border-t border-r border-b border-gray-300 px-4 py-2">
          <input
            type="text"
            value={row?.component?.label}
            onChange={(e) => handleEdit(row?.id, 'name', e.target.value)}
            className="w-full px-2 py-1  border rounded-md focus:outline-none border-none"
          />
        </td>
        <td className="p-2 border-t border-r border-b border-gray-300 px-4 py-2">
          <select
            value={row?.gst?.label}
            onChange={(e) => handleEdit(row?.id, 'sex', e.target.value)}
            className="w-full px-2 py-1  rounded-md focus:outline-none"
          >
            {gstValesA.map((data, i) => (
              <option key={i} value={data?.value}>
                {data?.label}
              </option>
            ))}
          </select>
        </td>
        <td className="p-2 border-t border-r border-b border-gray-300 px-4 py-2">
          <input
            type="text"
            value={row?.class}
            onChange={(e) => handleEdit(row.id, 'class', e.target.value)}
            className="w-full px-2 py-1  rounded-md focus:outline-none "
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>




      


      {/* <table className="min-w-full divide-y ">
      <thead className="">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-t border-r border-b border-gray-300  tracking-wider"
              style={column.headerStyle}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {partAData.map((row, rowIndex) => (
          <tr key={rowIndex} className="bg-white">
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="px-6 py-4 whitespace-nowrap"
                style={column.cellStyle}
              >
                {column.editComponent ? (
                  column.editComponent({
                    value: row[column.field],
                    onChange: (value) => handleEdit(row.id, column.field, value),
                    rowData: row,
                  })
                ) : (
                  column.render ? column.render(row) : row[column.field]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table> */}


<section className="ml-4 text-md font-[500]">Part-B</section>


<table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-sm font-medium text-gray-500  tracking-wider"
              style={column.headerStyle}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {partAData.map((row, rowIndex) => (
          <tr key={rowIndex} className="bg-white">
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="px-6 py-4 whitespace-nowrap border-none" 
                style={column.cellStyle}
              >
                {column.editComponent ? (
                  column.editComponent({
                    value: row[column.field],
                    onChange: (value) => handleEdit(row.id, column.field, value),
                    rowData: row,
                  })
                ) : (
                  column.render ? column.render(row) : row[column.field]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>








      

      {/* <div className=" min border border-radius-4">
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
            search: false,
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
      </div> */}

      {/* part b */}


      <section className="ml-4 text-md font-[500]">Part-C</section>
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
         {/* <section className="ml-4 text-md font-[500]">Part-B</section> */}
{/*           
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
                search: false,
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
          </div> */}


          
          
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


    

      
        <table className="min-w-full divide-y divide-gray-200">
      <thead className="">
        <tr>
          {partCcolumns.map((column, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-sm font-medium text-gray-500  tracking-wider"
              style={column.headerStyle}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {partCData.map((row, rowIndex) => (
          <tr key={rowIndex} className="bg-white">
            {partCcolumns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="px-6 py-4 whitespace-nowrap "
                style={column.cellStyle}
              >
                {column.editComponent ? (
                  column.editComponent({
                    value: row[column.field],
                    onChange: (value) => handleEdit(row.id, column.field, value),
                    rowData: row,
                  })
                ) : (
                  column.render ? column.render(row) : row[column.field]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
        

         
        {/* <section className="ml-4 text-md font-[500]">Part-C</section> */}

        {/* <div className=" min">
          
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
              search: false,
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
        </div>  */}

      </div>
    </section>
  )
}

export default AdditionalChargesForm