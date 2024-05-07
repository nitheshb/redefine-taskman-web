import React, { useState } from 'react';

const TabTask = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Tabs */}
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${activeTab === 'tab1' ? 'bg-white text-gray-800 shadow' : 'text-gray-500 bg-gray-100 hover:bg-white'}`}
          onClick={() => setActiveTab('tab1')}
        >
          Tab 1
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${activeTab === 'tab2' ? 'bg-white text-gray-800 shadow' : 'text-gray-500 bg-gray-100 hover:bg-white'}`}
          onClick={() => setActiveTab('tab2')}
        >
          Tab 2
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${activeTab === 'tab3' ? 'bg-white text-gray-800 shadow' : 'text-gray-500 bg-gray-100 hover:bg-white'}`}
          onClick={() => setActiveTab('tab3')}
        >
          Tab 3
        </button>
      </div>

      {/* Tab Content */}
      <div className="border p-4 rounded-b-lg bg-white w-full">
        {activeTab === 'tab1' && <div>Content for Tab 1</div>}
        {activeTab === 'tab2' && <div>Content for Tab 2</div>}
        {activeTab === 'tab3' && <div>Content for Tab 3</div>}
      </div>

      {/* Search Bar */}
      <div className="relative mt-6">
        <input
          type="text"
          className="pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none w-full"
          placeholder="Search destinations"
        />
        <span className="absolute left-0 top-0 flex items-center pl-3">
          <svg className="fill-current text-gray-500 hover:text-blue-500 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            {/* Search Icon */}
            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.34 5.34a1 1 0 0 1-1.42 1.42l-5.33-5.34zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          </svg>
        </span>
      </div>
    </div>
  );
};




export default TabTask