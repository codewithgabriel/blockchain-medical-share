import { TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import contractAddress from "../abi";
import * as abi from "./abi.json";
import Swal from "sweetalert2";

export default function CreatePatient() {
  const [payload, setPayload] = useState({});

  const { contract, isLoading, error } = useContract(contractAddress, abi.abi);

  async function createPatientRecord(ev) {
    ev.preventDefault();
   
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
      .call("registerPatient", [payload.name, payload.age, payload.historyData])
      .then((r) => {

        Swal.fire({
          text: "Patient Record Created",
          title: "Sucess",
          icon: "success",
          background: "#172554",
          color: '#fff',
          toast: true,
          position: 'center'
        });
      } )
      .catch((e) => {
        let err_msg = e.message.toString() 
        if (err_msg.includes("Patient already registered")) { 
          Swal.fire({
            text: "Try accessing your document",
            title: "Patient already registered",
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

  function handleOnChange(ev) {
    let val = ev.target.value;
    let name = ev.target.name;
    setPayload((payload) => ({ ...payload, [name]: val }));
  }
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600">
        <div className="text-center">
          <h3>Create New Patient Record</h3>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-5">
          <div>
            <label className="font-medium"> Full Name </label>
            <input
              type="text"
              name="name"
              required
              onChange={handleOnChange}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium"> Age </label>
            <input
              type="number"
              min={1}
              max={100}
              name="age"
              required
              onChange={handleOnChange}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>

          <div>
            <TextArea
              name="historyData"
              placeholder="Enter patient's data here"
              radius="full"
              required
              onChange={handleOnChange}
            ></TextArea>
          </div>
          <div>
            <button
              className="w-full px-7 py-4 text-indigo-600 duration-150 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:bg-indigo-200"
              onClick={createPatientRecord}
            >
              {" "}
              Create Record{" "}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
