import { TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import contractAddress from "../abi";
import * as abi from "./abi.json";
import Swal from "sweetalert2";
import MedicalRecordForm from "./Form";

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
    <main className="w-full h-auto flex flex-col items-center justify-center px-4">
      <MedicalRecordForm/>
    </main>
  );
}
