import { useState } from 'react'

import { ChatBubble, Edit, Flag } from '@mui/icons-material'
import { Box, Card, Divider, Grid, LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

const RecentActivity = ({ title }) => {
  // change navbar title

  const { t } = useTranslation()
  const [todoEl, setTodoEl] = useState(null)

  return (
    <section className="bg-white rounded  flex flex-col p-4 w-100 ">
      <h5 className="font-bodyLato text-md">{t(title)}</h5>
      <section className="mt-3">
        {recentActivity.map((item, i) => (
          // <ActivityListItem activity={item} key={item.id} />
          <li className="flex flex-row mb-2 pb-2 border-b" key={i}>
            {/* <ChatBubble
              sx={{
                color: 'white',
                fontSize: 16,
              }}
            /> */}
            <section className="flex flex-col">
              <span className="font-bodyLato font-semibold text-xs">
                {item?.title}
              </span>
              <span className="mt-1 font-bodyLato text-[10px] text-[#94A4C4]">
                {item?.date}
              </span>
            </section>
          </li>
        ))}
      </section>
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
export default RecentActivity
