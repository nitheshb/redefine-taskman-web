import { useState, useEffect } from 'react'

import { ChatBubble, Edit, Flag } from '@mui/icons-material'
import { Box, Card, Divider, Grid, LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useAuth } from 'src/context/firebase-auth-context'

const TaskProgress = ({ userTodayPerfA }) => {
  // change navbar title

  const { t } = useTranslation()
  const { user } = useAuth()
  const { orgId, uid, name } = user

  return (
    <section className="bg-white rounded  flex flex-col p-4 w-100 ">
      <h5>{t('Task Progress')}</h5>

      <Box mt={2}>
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">{t('New')}</h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.new_comp || 0}/{userTodayPerfA?.new}
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          value={userTodayPerfA?.new_comp || 0 / userTodayPerfA?.new || 0}
          color="inherit"
          style={{
            backgroundColor: '#E5EAF2',
            borderRadius: '3px',
            height: '4px',
            color: '#FD396D',
          }}
        />
      </Box>
      <Box mt={3}>
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">
            {t('Followup')}
          </h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.followup_comp || 0}/{userTodayPerfA?.followup}
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          color="info"
          value={
            userTodayPerfA?.followup_comp || 0 / userTodayPerfA?.followup || 0
          }
          style={{
            backgroundColor: '#E5EAF2',
            borderRadius: '3px',
            height: '4px',
          }}
        />
      </Box>

      <Box mt={3}>
        {/* <FlexBox mb={1} alignItems="center" justifyContent="space-between">
        <h6>{t('Illustrations')}</h6>
        <span color="text.disabled">2/7</span>
      </FlexBox> */}
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">
            {t('Visits Fixed')}
          </h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.visitfixed_comp || 0}/{userTodayPerfA?.visitfixed}
          </span>
        </div>
        <LinearProgress
          value={
            userTodayPerfA?.visitfixed_comp ||
            0 / userTodayPerfA?.visitfixed ||
            0
          }
          color="warning"
          variant="determinate"
          style={{
            backgroundColor: '#E5EAF2',
            borderRadius: '3px',
            height: '4px',
            color: '#FFE91F',
          }}
        />
      </Box>

      <Box mt={3}>
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">
            {t('Negotiation')}
          </h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.negotiation_comp || 0}/
            {userTodayPerfA?.negotiation}
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          value={
            userTodayPerfA?.negotiation_comp ||
            0 / userTodayPerfA?.negotiation ||
            0
          }
          color="success"
          style={{
            borderRadius: '3px',
            height: '4px',
            color: '#FD396D',
            backgroundColor: '#E5EAF2',
          }}
        />
      </Box>
    </section>
  )
}

const recentActivity = [
  {
    id: 1,
    title: 'Karen leave some comments on Konsep Ilustrasi',
    date: 'Aug 10',
    Icon: ChatBubble,
  },
  {
    id: 2,
    title: 'Karen change project info on Project Homepage',
    date: 'Aug 10',
    Icon: Edit,
  },
  {
    id: 3,
    title: 'Andrea change the due date of Project Homepage',
    date: 'Aug 10',
    Icon: Flag,
  },
]
const todoList = [
  {
    id: 1,
    title: 'Create Minimal Logo',
    date: 'Due In 2 Days',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Stock Market Exchange',
    date: 'Due In 3 Days',
    status: 'Processing',
  },
  {
    id: 3,
    title: 'Shopping & Groccery',
    date: 'Due In 5 days',
    status: 'Pending',
  },
  {
    id: 4,
    title: 'Football Match',
    date: 'Due In 1 Day',
    status: 'Completed',
  },
  {
    id: 5,
    title: 'Stock Market Exchange',
    date: 'Due In 3 Days',
    status: 'Processing',
  },
]
const conversationList = [
  {
    name: 'Ella knox',
    lastMsg: 'Hi. Our deadlines are.....',
    image: '/static/avatar/070-man-15.svg',
    time: '11:50pm',
  },
  {
    name: 'Sean mila',
    lastMsg: 'Hi. Our deadlines are.....',
    image: '/static/avatar/069-woman-15.svg',
    time: '11:40pm',
  },
  {
    name: 'Taylor Swift',
    lastMsg: 'Hi. Our deadlines are.....',
    image: '/static/avatar/067-man-14.svg',
    time: '11:30pm',
  },
  {
    name: 'Ella knox',
    lastMsg: 'Hi. Our deadlines are.....',
    image: '/static/avatar/070-man-15.svg',
    time: '11:50pm',
  },
  {
    name: 'Sean mila',
    lastMsg: 'Hi. Our deadlines are.....',
    image: '/static/avatar/069-woman-15.svg',
    time: '11:40pm',
  },
]
export default TaskProgress
