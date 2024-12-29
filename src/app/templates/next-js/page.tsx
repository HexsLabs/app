import { Github, Rocket } from 'lucide-react';


const TemplateCard = () => {
  return (
    <div className="bg-black min-h-screen text-white px-6 py-8">
    
      <div className="flex  mb-6">
        {/* Title and Github Icon */}
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold mr-3">NEXT</h1>
          <Github  className="text-gray-400 hover:text-gray-300 text-xl cursor-pointer" />
        </div>

        {/* Deploy Button */}
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center">
          <Rocket  className="mr-2" /> Deploy
        </button>
      </div>

      {/* Main Content */}
      <div>
        <h2 className="text-4xl font-bold mb-8">Next</h2>

        {/* Table-like structure */}
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between items-center border-b border-gray-700 py-3">
              <span>Version</span>
              <span className="bg-gray-700 text-sm px-2 py-1 rounded-lg">v0.36.0</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-3">
              <span>Binary</span>
              <span className="bg-gray-700 text-sm px-2 py-1 rounded-lg">Next</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-3">
              <span>Directory</span>
              <span className="bg-gray-700 text-sm px-2 py-1 rounded-lg">.Next</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-3">
              <span>ENV namespace</span>
              <span className="bg-gray-700 text-sm px-2 py-1 rounded-lg">NEXT</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-3">
              <span>Repository</span>
              <a
                href="https://github.com/akash-network/node"
                className="bg-gray-700 text-sm px-2 py-1 rounded-lg hover:bg-gray-600"
              >
                https://github.com/
              </a>
            </div>
            <div className="flex justify-between items-center py-3">
              <span>Image</span>
              <span className="bg-gray-700 text-sm px-2 py-1 rounded-lg">
                ghcr.io/akash-network/cosmos-omnibus:v1.0.4-akash-v0.36.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
