"use client";

import React, { useEffect, useState } from "react";

const DesktopOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1080);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // if (!isDesktop) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gray-100 text-center p-4">
  //       <div className="max-w-md">
  //         <h1 className="text-2xl font-bold text-gray-800">
  //           This website is only available in desktop mode.
  //         </h1>
  //         <p className="text-gray-600 mt-4">
  //           Please switch to a desktop device or resize your browser window to access the site.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default DesktopOnly;
