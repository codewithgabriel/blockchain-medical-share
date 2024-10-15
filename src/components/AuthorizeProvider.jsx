import { useAddress, useContract } from "@thirdweb-dev/react";
import { useState } from "react";
import * as abi from "./abi.json";
import contractAddress from "../abi";

import Swal from "sweetalert2";
import Header from "./Header";

export default function AuthorizeProvider() {
  const { contract, isLoading, error } = useContract(contractAddress, abi.abi);
  const address = useAddress();
  const [payload, setPayload] = useState("");

  function authorizeUser(ev) {
    ev.preventDefault();
    console.log(payload.address);
    Swal.fire({
      title: "Loading...",
      html: "Please wait...",
      allowOutsideClick: false,
      background: "#172554",
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    contract
      .call("authorizeProvider", [payload.address])
      .then((r) => {
        Swal.fire({
          text: "Provider Authorized",
          title: "Success",
          icon: "success",
          background: "#172554",
      color: '#fff',
          toast: true,
          position: "top",
        });
      })
      .catch((e) => {
        let err_msg = e.message.toString();
        if(err_msg.includes( "Provider already authorized") ) {
          Swal.fire({
            text: "Provider already authorized",
            title: "Info",
            icon: "info",
            background: "#172554",
            color: '#fff',
            toast: true,
            position: "center",
          });

        }else { 
          Swal.fire({
            text: e.message,
            title: "Error",
            icon: "error",
            background: "#172554",
            color: '#fff',
            toast: true,
            position: "top",
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
            <h1 className="font-bold text-2xl py-3"> Authorize Provider </h1>
          <form action="#">
            <input
              type="text"
              placeholder="Enter address to authorize"
              name="address"
              //   value={address}
              onChange={handleInput}
              className="w-full pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
            <div className="mt-2 w-full">
              <button
                onClick={authorizeUser}
                className="w-full px-7 py-4 text-indigo-600 duration-150 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:bg-indigo-200"
              >
                Grant Access
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
