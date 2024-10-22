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
  const [hash, setHash] = useState("");

  //   const [component, setComponent] = useState(<FormView handleInput={handleInput} authorizeUser={authorizeUser} />);

  async function authorizeUser(ev) {
    ev.preventDefault();
    let isAuthorized = await contract.call("isAuthorized", [
      payload.address,
      address,
    ]);
    console.log(`isAuthorized: ${isAuthorized}`);
    if (isAuthorized) {
      // alert(payload.address);
      Swal.fire({
        title: "Loading...",
        html: "Please wait...",
        background: "#172554",
        color: "#fff",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      contract
        .call("getPatientData", [payload.address])
        .then((hash) => {
          setHash(hash);
          Swal.fire({
            title: "Success",
            text: "view document",
            icon: "success",
            background: "#172554",
            color: "#fff",
            toast: true,
            position: "center",
          });
          
        })

        .catch((e) => {
          let err_msg = e.message.toString();
          if (err_msg.includes("Patient not found")) {
            Swal.fire({
              text: "You don't have access to this document, contact owner",
              title: "Authorization Declined",
              icon: "error",
              background: "#172554",
              color: "#fff",
              toast: true,
              position: "center",
            });
          } else {
            Swal.fire({
              text: e.message,
              title: "Error",
              icon: "error",
              toast: true,
              background: "#172554",
              color: "#fff",
              position: "center",
            });
          }
        });
    } else {
      Swal.fire({
        text: "You are not authorized to view this document, Please contact provider/patient for authorization",
        title: "Access Denied",
        icon: "error",
        toast: true,
        background: "#172554",
        color: "#fff",
        position: "center",
      });
    }
  }

  function handleInput(ev) {
    let name = ev.target.name;
    let val = ev.target.value;
    setPayload({ [name]: val });
  }

  return hash ? (
    <ViewDocument hash={hash} />
  ) : (
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
              onChange={(e) => handleInput(e)}
              className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
            <div className="mt-2 w-full">
              <button
                onClick={(e) => authorizeUser(e)}
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




import { Link } from "react-router-dom";
function ViewDocument ( {hash}) { 

  function downloadDocument() { 
    // window.location.href = hash
    window.open(hash)
  }

  useEffect( ()=> {
    (async function () {
          console.log(`https://ipfs.io/ipfs/${hash}`)
          const url = `https://ipfs.io/ipfs/${hash}`;
          const req = await fetch(url , 
                          {
                            meethod: "GET", 
                            mode: 'no-cors',
                            headers: {
                              "Content-Type": "application/json",
                            
                            }
                          }
                        );
          
          console.log(await req.json())
    })()

  })

  
  return( 
    <div className="flex h-screen justify-center items-center gap-6">
        <Link to="/dashboard" className=" bg-slate-900 text-white shadow-lg rounded-sm px-4 py-3 active:bg-blue-500 text-sm"> Back to Dashboard </Link>

        <button onClick={downloadDocument} className="bg-blue-600 text-white shadow-lg rounded-sm px-4 py-3 active:bg-blue-500 text-sm"> Download Document </button>
    </div>

  )
}