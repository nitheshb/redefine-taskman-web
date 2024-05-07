import React, { useState } from 'react';
import './EditableTable1.css'; // Import CSS file for styling

const EditableTable = () => {
  const [tableData, setTableData] = useState([
    { id: 1, name: '', dropdownValue: '' } // Initial row
  ]);
  const [invalidRows, setInvalidRows] = useState([]); // State to store invalid rows

  const addRow = () => {
    setTableData([...tableData, { id: tableData.length + 1, name: '', dropdownValue: '' }]);
  };

  const handleChange = (id, key, value) => {
    setTableData(tableData.map(row => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const validate = () => {
    const invalidRows = tableData.filter(row => row.name.trim() === '' || row.dropdownValue === '');
    setInvalidRows(invalidRows.map(row => row.id)); // Store IDs of invalid rows
    return invalidRows.length === 0; // Return true if no invalid rows
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log('Table data:', tableData);
      // Process the data
    } else {
      alert('Please fill in all fields before adding a new row.');
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dropdown</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(row => (
            <tr key={row.id} className={invalidRows.includes(row.id) ? 'invalid-row' : ''}>
              <td>
                <input
                  type="text"
                  value={row.name}
                  onChange={e => handleChange(row.id, 'name', e.target.value)}
                />
              </td>
              <td>
                <select
                  value={row.dropdownValue}
                  onChange={e => handleChange(row.id, 'dropdownValue', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default EditableTable;
