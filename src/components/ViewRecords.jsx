import { useAddress, useContract } from "@thirdweb-dev/react";
import { Component, useEffect, useState } from "react";
import * as abi from "./abi.json";
import contractAddress from "../abi";

import Swal from "sweetalert2";
import Header from "./Header";
import FormView from "./FormView";
import { ethers } from "ethers";



export default function ViewRecords() {
  const { contract, isLoading, error } = useContract(contractAddress, abi.abi);
  const address = useAddress();
  const [payload, setPayload] = useState("");
  const [ result , setResult ]  = useState([])

//   const [component, setComponent] = useState(<FormView handleInput={handleInput} authorizeUser={authorizeUser} />);

  function authorizeUser(ev) {
    ev.preventDefault();
    // alert(payload.address);
    Swal.fire({
      title: "Loading...",
      html: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    contract
      .call("getPatientData", [payload.address])
      .then((r) => {
       
       setResult({ fullname: r[0] , age: r[1].toNumber()  , data: r[2]})
      

        Swal.fire({
          title: "Document",
          html: `Fullname: ${r[0]}\n Age: ${r[1]} \n Data: ${r[2]}`,
          icon: "success",
          position: "center",
        });
      })

      .catch((e) => {
        let err_msg = e.message.toString() 
        if (err_msg.includes("Patient not found")) { 
          Swal.fire({
            text: "You don\'t have access to this document, contact owner",
            title: "Authorization Declined",
            icon: "error",
            background: "#172554",
            color: '#fff',
            toast: true,
            position: "center",
          });

        }else  { 
          Swal.fire({
            text: e.message,
            title: "Error",
            icon: "error",
            toast: true,
            background: "#172554",
            color: '#fff',
            position: "center",
          });

        }
       
      });
  }

  function handleInput(ev) {
    let name = ev.target.name;
    let val = ev.target.value;
    setPayload({ [name]: val });
  }


  return (
    <div>
      <Header />
      <div className="w-full h-[500px] flex items-center justify-center">
      <div className="relative max-w-xs ">
        <h2> View Records</h2>
        <form action="#">
          <input
            type="text"
            placeholder="Enter Patient address"
            name="address"
            //   value={address}
            onChange={(e) => handleInput (e) }
            className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          <div className="mt-2 w-full">
            <button
              onClick={(e)=> authorizeUser (e) }
              className="w-full px-7 py-4 text-indigo-600 duration-150 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:bg-indigo-200"
            >
              View Record
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}



