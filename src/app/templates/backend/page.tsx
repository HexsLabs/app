import React from 'react';

const Backend = () => {
  const items = [
    'Version',
    'Binary',
    'Directory',
    'ENV Namespace',
    'Repository',
    'Image'
  ];

  return (
    <div className="bg-[#1F1F23] text-white p-4 w-11/12 rounded-2xl ml-10 mt-44">
      <h2 className="text-2xl font-medium mb-6">Backend</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item} className="text-gray-400 cursor-pointer hover:text-white transition-colors">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Backend;