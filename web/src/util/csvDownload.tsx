import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useCSVDownloader } from 'react-papaparse'

import { prettyDate, prettyDateTime } from './dateConverter'

export default function CSVDownloader({
  downloadRows,
  fromLeadsBank = false,
  sourceTab,
}) {
  const { CSVDownloader, Type } = useCSVDownloader()
  console.log('i was clicked')
  let downloadData
  if (fromLeadsBank) {
    downloadData = downloadRows.map((item) => {
      return {
        ...item,
        cT: prettyDateTime(item.cT),
      }
    })
  }

  if (sourceTab == 'visitsReport') {
    downloadRows = downloadRows.map((item) => {
      return {
        Project: item.Project,
        Name: item.Name,
        Mobile: item.Mobile?.toString(),
        Status: item.Status,
        from: item.from,
        to: item?.coverA?.includes('visitdone') ? 'visitdone' : item?.to,
        Source: item?.Source,
        Assigned_to: item?.assignedToObj?.name,
        Date: item.Time,
        Visit_Fixed_On: prettyDate(item?.assignT || item?.Date),
        Visited_On: item.Time,
        Visit_Fixed_By:  item?.by,
        Executive: item?.leadOwner

      }
    })
  }

  return (
    <CSVDownloader
      type={Type.Button}
      filename={'filename'}
      bom={true}
      data={fromLeadsBank ? downloadData : downloadRows}
    >
      <Tooltip title={`Download ${downloadRows?.length} Rows`}>
        <IconButton>
          {/* style={{ background: '#f9f9f9' }} */}
          <DownloadTwoToneIcon style={{ height: '20px', width: '20px' }} />
        </IconButton>
      </Tooltip>
    </CSVDownloader>
  )
}
