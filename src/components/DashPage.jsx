import { useEffect, useState } from "react";
import axios from "axios";

const DashPage = ({ children }) => {

  return (
    <div className="w-full max-h-full bg-white h-screen text-black ">
      {children}
    </div>
  );
};

export default DashPage;

