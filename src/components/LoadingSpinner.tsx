import React from 'react';
import {PulseLoader} from "react-spinners";



const LoadingSpinner = () => {

  return (
    <div>
      <br/>
      <br/>
      <div className={"d-flex justify-content-center"}>
        <PulseLoader color={"DarkSlateGray"}/>
      </div>
    </div>
  )

};

export default LoadingSpinner