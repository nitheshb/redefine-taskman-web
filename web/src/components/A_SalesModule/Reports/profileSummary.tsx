import React from 'react';
import  { useState } from 'react';
import Chat from './chatSummary';




export default function ProfileSummary() {



  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const handleToggle = () => {
    setIsFollowing(prevState => !prevState);
  };



  

  return (
    <div className='px-44'>


<div className="p-5 bg-white  border-neutral-300 rounded-lg shadow-lg p-5">
    
      <figure>
        <svg className="w-full" preserveAspectRatio="none" width="1113" height="161" viewBox="0 0 1113 161" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_697_201879)">
            <rect x="1" width="1112" height="348" fill="#B2E7FE"></rect>
            <rect width="185.209" height="704.432" transform="matrix(0.50392 0.86375 -0.860909 0.508759 435.452 -177.87)" fill="#FF8F5D"></rect>
            <rect width="184.653" height="378.667" transform="matrix(0.849839 -0.527043 0.522157 0.852849 -10.4556 -16.4521)" fill="#3ECEED"></rect>
            <rect width="184.653" height="189.175" transform="matrix(0.849839 -0.527043 0.522157 0.852849 35.4456 58.5195)" fill="#4C48FF"></rect>
          </g>
          <defs>
            <clipPath id="clip0_697_201879">
              <rect x="0.5" width="1112" height="161" rx="12" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
      </figure>
      
   


<div className="-mt-12 relative flex items-center justify-center">
      <div style={{ position: 'relative' }}>
        <img
          className="h-24 w-24 bottom-4 rounded-full border-4 border-white shadow-lg"
          src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=320&amp;h=320&amp;q=80"
          alt="Image Description"
        />
        <div className="absolute  bottom-1 left-9 w-full flex items-center justify-center">
          <button
            type="button"
            style={{
              width: '1.7rem',
              height: '1.7rem',
              borderRadius: '50%',
              backgroundColor: '#f56565',
              color: '#fff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          
          </button>
        </div>
      </div>
    </div>

      <div className="text-center mt-2">
        <h1 className="text-lg font-semibold text-neutral-200 text-black">James Collins</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">its_james</p>
      </div>
    
        <div className='flex justify-between'>


        <div className="flex mt-4">
        <nav className="flex space-x-4">
          <a href="#" className="text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-200 focus:text-neutral-700 dark:focus:text-neutral-200 focus:outline-none">My Profile</a>
          <a href="#" className="text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-200 focus:text-neutral-700 dark:focus:text-neutral-200 focus:outline-none">Teams</a>
          <a href="#" className="text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-200 focus:text-neutral-700 dark:focus:text-neutral-200 focus:outline-none">Files</a>
          <a href="#" className="text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-200 focus:text-neutral-700 dark:focus:text-neutral-200 focus:outline-none">Connections</a>
        </nav>
      </div>





      

      <div className="text-center flex justify-end mt-4">
      <label htmlFor="toggleFollow" className="inline-flex items-center cursor-pointer">
        <input type="checkbox" id="toggleFollow" className="hidden" checked={isFollowing} onChange={handleToggle} />
        <span className={`bg-blue-500 text-white px-3 py-1 rounded-md transition duration-300 ease-in-out ${isFollowing ? 'hidden' : ''}`}>Follow</span>
        <span className={`bg-red-500 text-white px-3 py-1 rounded-md transition duration-300 ease-in-out ${!isFollowing ? 'hidden' : ''}`}>Unfollow</span>
      </label>
    </div>


        </div>
       




    </div>


    




 


     <div>
      <div>
        <div className="absolute top-0 right-0 p-4">

        </div>
        <div className="p-8 space-y-6 dark:divide-neutral-700">
          <div>
            <h2 className="text-2xl font-bold text-black">About</h2>
          </div>
          <ul className="space-y-2">
            <li>
              <div className="flex items-center text-black">
                <svg
                  className="w-6 h-6 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" />
                </svg>
                <span>Guideline</span>
              </div>
            </li>
            <li>
              <div className="flex items-center text-black">
                <svg
                  className="w-6 h-6 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 10a3 3 0 1 1 0-6a3 3 0 0 1 0 6Z" />
                </svg>
                <span>United Kingdom</span>
              </div>
            </li>
            <li>
              <div className="flex items-center text-black">
                <svg
                  className="w-6 h-6 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Europe/London (GMT)</span>
              </div>
            </li>
            <li>
              <div className="flex items-center text-black">
                <svg
                  className="w-6 h-6 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>james@site.so</span>
              </div>
            </li>
            <li>
              <a
                className="flex items-center text-black hover:text-blue-500 focus:outline-none focus:underline  dark:hover:text-blue-500"
                href="#"
              >
                <svg
                  className="w-6 h-6 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>https://example.so/</span>
              </a>
            </li>
            <li>
              <a
                className="flex items-center text-black hover:text-blue-500 focus:outline-none focus:underline  dark:hover:text-blue-500"
                href="#"
              >
                <svg
                  className="w-6 h-6 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>https://dribbble.com/james/</span>
              </a>
            </li>
            <li>
              <a
                className="flex items-center text-black hover:text-blue-500 focus:outline-none focus:underline  dark:hover:text-blue-500"
                href="#"
              >
                <svg
                  className="w-6 h-6 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>https://producthunt.com/james/</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>






<div>

    </div>


  

    





    





  
    </div>
  );
}

