
import { Dialog } from '@headlessui/react'
import { useSnackbar } from 'notistack'



import WhatsAppTextQuillForm from './Comps/WhatsAppTextQuill'

const NotificationsSetupForm = ({ title, projectDetails, wbPayload }) => {
  const { enqueueSnackbar } = useSnackbar()

  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-4 sm:px-6  z-10 ">
        <Dialog.Title className=" font-semibold text-xl mr-auto  text-[#053219]">
          {title}
        </Dialog.Title>
        <span className="text-gray-600 text-xs mt-3">
          This is playground to Save and Test whatsapp notifiaction templates
        </span>
      </div>
      <section className="bg-teal-50">
        <WhatsAppTextQuillForm
          projectDetails={projectDetails}
          leadDetailsObj={undefined}
          source={undefined}
          unitDetails={undefined}
          wbPayload={wbPayload}
        />
      </section>
    </div>
  )
}

export default NotificationsSetupForm
