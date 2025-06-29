import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="container mx-auto pt-40 pb-20 px-5 bg-[#0a0a23] text-white min-h-screen rounded-lg shadow-lg">
      {children}
    </div>
  );
};

export default MainLayout;
