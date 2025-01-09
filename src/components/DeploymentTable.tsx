import React from "react";
import Image from "next/image";

export const DeploymentTable = () => {
  return (
    <div>
      <div className="bg-[#101012] rounded-t-lg p-3 mb-7">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex items-center cursor-pointer text-white">
            Asset
            {/* <ChevronDown className="ml-1 h-4 w-4" /> */}
          </div>
          <div className="flex items-center text-white">
            Duration{" "}
            <span className="text-xs ml-1">
              {/* <Repeat size={14} style={{ transform: 'rotate(90deg)' }} /> */}
            </span>
          </div>
          {/* <div className="flex items-center cursor-pointer text-white">
            Location 
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="flex items-center cursor-pointer text-white">
            Origin 
            <ChevronDown className="ml-1 h-4 w-4" />
          </div> */}
          <div className="flex items-center text-white">
            LID
            {/* <span className="text-xs ml-1"> 
              <Repeat size={14} style={{ transform: 'rotate(90deg)' }} /></span> */}
          </div>
          <div className="flex items-center text-white">
            Pricing/hr
            {/* <span className="text-xs ml-1"> 
              <Repeat size={14} style={{ transform: 'rotate(90deg)' }} /></span> */}
          </div>
          <div className="flex items-center text-white">
            Consumption
            {/* <span className="text-xs ml-1"> 
              <Repeat size={14} style={{ transform: 'rotate(90deg)' }} /></span> */}
          </div>
        </div>
      </div>


      <div className="bg-[#101012] rounded-b-lg">
        {deployments.map((deployment) => (
          <div
            key={deployment.id}
            className="grid grid-cols-5 gap-4 p-3 hover:bg-zinc-800/20"
          >
            <div className="flex items-center gap-2">
              <Image src="ram.svg" alt="dasboard-logo" width={18} height={18} />
              {deployment.asset}
              <span className="h-3 w-3 rounded-full">
                {deployment.status === "error" ? (
                  // <TriangleAlert size={18} className="bg-[#FF000033] text-[#FF5F5F] rounded-md" /> // Add the red color here
                  <Image
                    src="redAlert.svg"
                    alt="dasboard-logo"
                    width={50}
                    height={50}
                  />
                ) : (
                  <Image
                    src="check.svg"
                    alt="dasboard-logo"
                    width={50}
                    height={50}
                  />
                )}
              </span>
            </div>
            <div className="text-gray-300 flex ">
              {" "}
              <Image
                src="timer.svg"
                alt="dasboard-logo"
                width={15}
                height={15}
                className="mr-1"
              />
              {deployment.duration}
            </div>
            {/* <div className="flex items-center gap-1 text-gray-300">
            <Image 
               src="worldwide.svg"
               alt="dasboard-logo"
               width={15}
               height={15}
               className="mr-1"
             />
              {deployment.location}
            </div>
            <div className="text-gray-500">{deployment.origin}</div> */}
            <div className="flex items-center gap-1 text-gray-300">
              {deployment.lid}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
            </div>
            <div className="text-gray-300">{deployment.pricing}</div>
            <div className="text-gray-300">{deployment.consumption}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const deployments = [
  {
    id: "1",
    asset: "RAM Storage",
    status: "error",
    duration: "2hr 37min",
    location: "WORLDWIDE",
    origin: "Provider",
    lid: "$558",
    pricing: "$00.32",
    consumption: "$00.32",
  },
  {
    id: "2",
    asset: "RAM Storage",
    status: "error",
    duration: "2hr 37min",
    location: "WORLDWIDE",
    origin: "Provider",
    lid: "$238",
    pricing: "$05.00",
    consumption: "$05.00",
  },
  {
    id: "3",
    asset: "RAM Storage",
    status: "error",
    duration: "1hr 21min",
    location: "WORLDWIDE",
    origin: "Provider",
    lid: "$238",
    pricing: "$00.88",
    consumption: "$00.88",
  },
  {
    id: "4",
    asset: "RAM Storage",
    status: "error",
    duration: "1hr 21min",
    location: "WORLDWIDE",
    origin: "Provider",
    lid: "$673",
    pricing: "$12.00",
    consumption: "$12.00",
  },
  {
    id: "5",
    asset: "RAM Storage",
    status: "active",
    duration: "2hrs ago",
    location: "WORLDWIDE",
    origin: "Provider",
    lid: "$999",
    pricing: "$01.42",
    consumption: "$01.42",
  },
  {
    id: "6",
    asset: "RAM Storage",
    status: "active",
    duration: "2hrs ago",
    location: "WORLDWIDE",
    origin: "Provider",
    lid: "$442",
    pricing: "$00.67",
    consumption: "$00.67",
  },
];
