import React from 'react';

const CrmSummaryTable = () => {

  const summaryReportData = [
    { projectName: 'Nirvana', totalUnits: 50, available: 25, sold: 20, blocked: 3, mortgaged: 2 },
    { projectName: 'Ecotone', totalUnits: 70, available: 40, sold: 25, blocked: 3, mortgaged: 2 },
    { projectName: 'Ecocity', totalUnits: 60, available: 35, sold: 18, blocked: 4, mortgaged: 3 },
  ];

  const inventoryListData = [
    {
      unitNo: 'A101',
      unitType: '2BHK',
      unitFacing: 'North',
      unitArea: '950',
      releaseStatus: 'Available',
      pricePerSft: '5000',
      plc: '200',
      dimensions: {
        north: '10m',
        south: '10m',
        east: '8m',
        west: '8m'
      },
      schedule: {
        north: '2m',
        south: '4m',
        east: '7m',
        west: '8m'
      },
      sNo: '001',
      khataha: 'XX123',
      pid: 'PID001',
      unitCost: '5250000',
      unitStatus: 'Ready'
    },
    {
      unitNo: 'B202',
      unitType: '3BHK',
      unitFacing: 'South',
      unitArea: '1200',
      releaseStatus: 'Sold',
      pricePerSft: '6000',
      plc: '250',
      dimensions: {
        north: '12m',
        south: '12m',
        east: '10m',
        west: '10m'
      },
      schedule: {
        north: '25m',
        south: '25m',
        east: '25m',
        west: '5m'
      },
      sNo: '002',
      khataha: 'YY456',
      pid: 'PID002',
      unitCost: '6300000',
      unitStatus: 'Occupied'
    },
  ];

  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => {
      return acc + (item[key] || 0);
    }, 0);
  };

  const totalUnitsSummary = calculateTotal(summaryReportData, 'totalUnits');
  const totalAvailableSummary = calculateTotal(summaryReportData, 'available');
  const totalSoldSummary = calculateTotal(summaryReportData, 'sold');
  const totalBlockedSummary = calculateTotal(summaryReportData, 'blocked');
  const totalMortgagedSummary = calculateTotal(summaryReportData, 'mortgaged');




  return (
    <div className="bg-white flex justify-start  rounded-lg">
      <div className="overflow-x-auto mx-4">
        <div className="">
          <div className="w-full lg:w-5/6">
            <div className="rounded my-3 overflow-x-auto">
            <p className="font-bold text-black p-1 m-1">CRM Inventory Report</p>

              <table className=" border-collapse">
                <thead>

                <tr className="bg-blue-200 text-gray-900 uppercase text-sm leading-normal"> 
                    <th className="py-3 px-2 text-center border border-black"  colSpan="6">Inventory Summary Report By Project</th>
                  </tr>
           
                  <tr className="bg-white text-gray-900 uppercase text-sm leading-normal"> 
                    <th className="py-3 px-3 text-left border border-black">Project Name</th>
                    <th className="py-3 px-3 text-left border border-black" colSpan="1">Total Units</th>
                    <th className="py-3 px-3 text-center border border-black" colSpan="1">Available</th>
                    <th className="py-3 px-3 text-center border border-black" colSpan="1">Sold</th>
                    <th className="py-3 px-3 text-center border border-black" colSpan="1">Blocked</th>
                    <th className="py-3 px-3 text-center border border-black" colSpan="1">Mortgaged</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900 text-sm font-light"> 
                  {summaryReportData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-3 px-6 text-left border border-black">{item.projectName}</td>
                      <td className="py-3 px-6 text-left border border-black">{item.totalUnits}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.available}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.sold}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.blocked}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.mortgaged}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-200 text-gray-900 uppercase text-sm leading-normal"> 
                    <td className="py-3 px-6 text-left border border-black">Total</td>
                    <td className="py-3 px-6 text-left border border-black">{totalUnitsSummary}</td>
                    <td className="py-3 px-6 text-center border border-black">{totalAvailableSummary}</td>
                    <td className="py-3 px-6 text-center border border-black">{totalSoldSummary}</td>
                    <td className="py-3 px-6 text-center border border-black">{totalBlockedSummary}</td>
                    <td className="py-3 px-6 text-center border border-black">{totalMortgagedSummary}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
              <table className="min-w-max w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-blue-200 text-gray-900 uppercase text-sm leading-normal"> 
                    <th className="py-3 px-6 text-center border border-black" colSpan="9">Inventory List By Project</th>
                    <th className="py-3 px-6 text-center border border-black  bg-white" colSpan="4">Dimensions</th>
                    <th className="py-3 px-6 text-center border border-black bg-white" colSpan="4">Schedule</th>
                    <th className="py-3 px-6 text-center border border-black bg-white" colSpan="1"></th>
                    <th className="py-3 px-6 text-center border border-black bg-white" colSpan="1"></th>
                    <th className="py-3 px-6 text-center border border-black bg-white" colSpan="1"></th>
                  </tr>
                  <tr className="bg-blue-100 text-gray-900 uppercase text-sm leading-normal"> 
                    <th className="py-3 px-6 text-left border border-black">Unit No.</th>
                    <th className="py-3 px-6 text-left border border-black">Unit Type</th>
                    <th className="py-3 px-6 text-center border border-black">Unit Facing</th>
                    <th className="py-3 px-6 text-center border border-black">Unit Area</th>
                    <th className="py-3 px-6 text-center border border-black">Release Status</th>
                    <th className="py-3 px-6 text-center border border-black">Price Per Sft</th>
                    <th className="py-3 px-6 text-center border border-black">PLC</th>
                    <th className="py-3 px-6 text-center border border-black">Unit Cost</th>
                    <th className="py-3 px-6 text-center border border-black">Unit Status</th>
                    <th className="py-2 px-3 text-center border border-black">North</th>
                    <th className="py-2 px-3 text-center border border-black">South</th>
                    <th className="py-2 px-3 text-center border border-black">East</th>
                    <th className="py-2 px-3 text-center border border-black">West</th>
                    <th className="py-2 px-3 text-center border border-black">North</th>
                    <th className="py-2 px-3 text-center border border-black">South</th>
                    <th className="py-2 px-3 text-center border border-black">East</th>
                    <th className="py-2 px-3 text-center border border-black">West</th>
                    <th className="py-3 px-6 text-center border border-black">S No.</th>
                    <th className="py-3 px-6 text-center border border-black">Khataha</th>
                    <th className="py-3 px-6 text-center border border-black">PID</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900 text-sm font-light"> 
                  {inventoryListData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-3 px-6 text-left border border-black">{item.unitNo}</td>
                      <td className="py-3 px-6 text-left border border-black">{item.unitType}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.unitFacing}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.unitArea}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.releaseStatus}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.pricePerSft}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.plc}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.unitCost}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.unitStatus}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.dimensions.north}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.dimensions.south}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.dimensions.east}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.dimensions.west}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.schedule.north}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.schedule.south}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.schedule.east}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.schedule.west}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.sNo}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.khataha}</td>
                      <td className="py-3 px-6 text-center border border-black">{item.pid}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-200 text-gray-900 uppercase text-sm leading-normal"> 
                    <td className="py-3 px-6 text-left border border-black">Total</td>
                    <td className="py-3 px-6 text-left border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                    <td className="py-3 px-6 text-center border border-black"></td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmSummaryTable;
