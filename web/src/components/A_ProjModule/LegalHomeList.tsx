import { useState } from 'react'

import { Dialog } from '@headlessui/react'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'

import Loader from 'src/components/Loader/Loader'
import { updateMoreDetails } from 'src/context/dbQueryFirebase'
import { TextAreaField } from 'src/util/formFields/TextAreaField'

import PaymentLeadAccess from '../PaymentScheduleForm/ProjectLeadAccess'
import PlanDiagramView from '../planDiagramView'

const LegalHomeList = ({
  title,
  dialogOpen,
  data,
  setSubView,
  subView,
  source,
  projectDetails,
  pId,
}) => {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async (formData, resetForm) => {
    const updatedData = {
      ...formData,
      editMode: true,
    }
    setLoading(true)
    await updateMoreDetails(data?.phase?.uid, updatedData, enqueueSnackbar)
    setLoading(false)
    resetForm()
    dialogOpen(false)
  }

  const initialState = {
    highlights: data?.phase?.moreDetails?.highlights || '',
    amenities: data?.phase?.moreDetails?.amenities || '',
    remarks: data?.phase?.moreDetails?.remarks || '',
  }

  const schema = Yup.object({
    highlights: Yup.string().required('Required'),
  })

  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-4   z-10">
        {/* <Dialog.Title className=" font-semibold text-xl mr-auto ml-3 text-[#053219]">
          {title}
        </Dialog.Title> */}

        <div className="flex flex-row">
          <div className="mr-4 templateList">
            <div className=" flex">
              <div className="flex flex-col">
                <button
                  className={`templateItem ${
                    subView === 'planDiagram' ? 'hightlightItem' : ''
                  }`}
                  type="button"
                  onClick={() => setSubView('planDiagram')}

                >
                  <span className="pr-1">
                    <svg
                      className="tempalteIcon tempalteIcon"
                      focusable="false"
                      viewBox="0 0 17 21"
                      aria-hidden="true"
                    >
                      <path
                        d="M11.4766 9.90449C12.7564 8.97117 13.5897 7.4607 13.5897 5.75906C13.5897 2.93137 11.2892 0.630859 8.46152 0.630859C5.63383 0.630859 3.33332 2.93137 3.33332 5.75906C3.33332 7.4607 4.16664 8.97117 5.44641 9.90449C2.26516 11.1219 0 14.2063 0 17.8104C0 19.3656 1.26527 20.6309 2.82051 20.6309H14.1025C15.6578 20.6309 16.923 19.3656 16.923 17.8104C16.923 14.2063 14.6579 11.1219 11.4766 9.90449ZM4.8718 5.75906C4.8718 3.77969 6.48215 2.16934 8.46152 2.16934C10.4409 2.16934 12.0512 3.77969 12.0512 5.75906C12.0512 7.73844 10.4409 9.34883 8.46152 9.34883C6.48215 9.34883 4.8718 7.73844 4.8718 5.75906ZM14.1025 19.0924H2.82051C2.11359 19.0924 1.53848 18.5173 1.53848 17.8103C1.53848 13.9929 4.6441 10.8872 8.46156 10.8872C12.279 10.8872 15.3846 13.9929 15.3846 17.8103C15.3846 18.5173 14.8095 19.0924 14.1025 19.0924Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>

                  <span className="pt-[5px]">Legal Docs</span>
                </button>
                <button
                  className={`templateItem ${
                    subView === 'projectApprovals' ? 'hightlightItem' : ''
                  }`}
                  type="button"
                  onClick={() => setSubView('projectApprovals')}

                >
                  <span className="pr-1">
                    <svg
                      className="tempalteIcon"
                      focusable="false"
                      viewBox="0 0 18 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M0.0873592 4.7591C0.0883085 4.76037 0.0891522 4.7618 0.0901366 4.76302C0.0902773 4.76318 0.0903827 4.76339 0.0905234 4.76359L8.73922 15.8656C8.80366 15.9484 8.90133 16 8.99998 16C9.09831 16 9.1958 15.9489 9.26074 15.8656L17.9094 4.76359C17.9096 4.76343 17.9097 4.76322 17.9098 4.76302C17.9108 4.76175 17.9116 4.76037 17.9126 4.7591C18.0253 4.61029 18.0282 4.39171 17.926 4.23943C17.925 4.23796 17.9242 4.23629 17.9232 4.23482L15.1106 0.153184C15.0439 0.0563673 14.9429 0 14.8361 0C13.4028 0 4.33007 0 3.16387 0C3.05706 0 2.95605 0.0563673 2.88933 0.153184L0.0767417 4.23482C0.0757222 4.23629 0.075019 4.23792 0.0739994 4.23943C-0.0293278 4.39331 -0.0240542 4.61196 0.0873592 4.7591ZM7.08957 0.816326H10.9104L12.5979 4.08163H5.40202L7.08957 0.816326ZM5.32045 4.89796H12.6794L8.99994 14.5807L5.32045 4.89796ZM13.448 4.89796H16.8567L10.2017 13.4407L13.448 4.89796ZM4.55191 4.89796L7.79823 13.4407L1.14324 4.89796H4.55191ZM16.9172 4.08163H13.4179L11.7303 0.816326H14.6671L16.9172 4.08163ZM3.3328 0.816326H6.26956L4.58201 4.08163H1.08273L3.3328 0.816326Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>

                  <span className="pt-[5px]">Approval Details</span>
                </button>

              </div>
            </div>
          </div>
          {subView === 'legalTeamAccess' && (
            <PaymentLeadAccess
              title={'Leads Access'}
              data={{ phase: data, project: projectDetails }}
              source={source}
            />
          )}
          {subView === 'projectApprovals' && (
            <PlanDiagramView
              title={'Approvals'}
              data={data}
              blocks={[]}
              pId={pId}
              source={source}
            />
          )}
          {subView === 'planDiagram' && (
            <PlanDiagramView
              title={'Plan Diagram'}
              data={data}
              blocks={[]}
              pId={pId}
              source={source}
            />
          )}
        </div>
        <div className="grid  gap-8 grid-cols-1">
          <div className="flex flex-col m-4">
            <div className="mt-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalHomeList
