import React from 'react'

import { PlusIcon, TrashIcon, SparklesIcon, DocumentIcon, DocumentTextIcon } from '@heroicons/react/outline'

const FileList = ({ files, removeFile }) => {
  const deleteFileHandler = (_name) => {
    removeFile(_name)
    // delete from storage
    // delete from files state
    // axios
    //   .delete(`http://localhost:8080/upload?name=${_name}`)
    //   .then((res) => removeFile(_name))
    //   .catch((err) => console.error(err))
  }
  return (
    <ul className="file-list">
      {files &&
        files.map((file) => (
          <li className="upload-li file-item" key={file.name}>
            <DocumentTextIcon className="w-4 h-4" />
            <p>{file.name}</p>


            <div className="actions">
              <div className="loading"></div>
              {file.isUploading && (
                <SparklesIcon
                  className="w-4 h-4"
                  onClick={() => deleteFileHandler(file.name)}
                />
              )}
              {!file.isUploading && (
                <TrashIcon
                  className="w-4 h-4"
                  onClick={() => deleteFileHandler(file.name)}
                />
              )}
            </div>
          </li>
        ))}
    </ul>
  )
}

export default FileList
