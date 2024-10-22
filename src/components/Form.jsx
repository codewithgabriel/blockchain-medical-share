import React, { useState } from 'react';
import axios from 'axios'; 
import contractAddress from "../abi";
import * as abi from "./abi.json";
import { useContract } from "@thirdweb-dev/react";

import Swal from 'sweetalert2';

const INFURA_PROJECT_ID = '2H7o4slTz3JdZLYCZds3gjE9cuh'; 
const INFURA_PROJECT_SECRET = '2b51a237206f71b8af26322607b96ff0';  

import { jsPDF } from 'jspdf';
import { create } from 'ipfs-http-client';

const auth = 'Basic ' + Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET).toString('base64');
const ipfs = create(
  {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    }
  }
);

const MedicalRecordForm = () => {

  const [jsonData, setJsonData] = useState('');  
  const [ipfsHash, setIpfsHash] = useState(''); 

  // const [fetchedData, setFetchedData] = useState(null);  
  // const [fetchError, setFetchError] = useState('');  

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    problemStartDate: '',
    problemDescription: '',
    causeOfProblem: '',
    surgeryRequired: '',
    surgeryDate: '',
    pastMedicalHistory: {
      breathingProblems: false,
      pregnant: false,
      heartProblems: false,
      woundProblems: false,
      pacemaker: false,
      tumorCancer: false,
      diabetes: false,
      stroke: false,
      boneJointProblems: false,
      kidneyProblems: false,
      gallbladderLiver: false,
      electricalImplants: false,
      anxietyAttacks: false,
      sleepApnea: false,
      depression: false,
      bowelBladder: false,
      alcoholHistory: false,
      drugUse: false,
      smoking: false,
      headaches: false,
    },
    surgeries: [],
    medications: [],
    allergies: {
      latex: null,
      iodine: null,
      bromine: null,
      other: ''
    },
    culturalViews: '',
    additionalComments: ''
  });




  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMedicalHistoryChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      pastMedicalHistory: {
        ...formData.pastMedicalHistory,
        [name]: checked
      }
    });
  };

  const handleAllergiesChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      allergies: {
        ...formData.allergies,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const pdfBlob = generatePDF();
    uploadToIPFS(pdfBlob);

  };

   

 

  const { contract, isLoading, error } = useContract(contractAddress, abi.abi);

  async function createPatientRecord(hash) {
    // ev.preventDefault();
   
    Swal.fire({
      title: "Registering...",
      html: "Please wait...",
      allowOutsideClick: false,
      background: "#172554",
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    contract
      .call("registerPatient", [hash])
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

  // Convert JSON to PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Medical History Report', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Date: ${formData.date}`, 20, 30);

    // Personal Information Section
    doc.setFontSize(16);
    doc.text('Personal Information', 20, 40);
    doc.setFontSize(12);
    doc.text(`Name: ${formData.name}`, 20, 50);
    doc.text(`Problem Start Date: ${formData.problemStartDate}`, 20, 60);
    doc.text(`Problem Description: ${formData.problemDescription}`, 20, 70);
    doc.text(`Cause of Problem: ${formData.causeOfProblem}`, 20, 80);
    doc.text(`Surgery Required: ${formData.surgeryRequired}`, 20, 90);
    if (formData.surgeryDate) doc.text(`Surgery Date: ${formData.surgeryDate}`, 20, 100);

    // Past Medical History Section
    doc.setFontSize(16);
    doc.text('Past Medical History', 20, 110);
    doc.setFontSize(12);

    let yOffset = 120;
    Object.keys(formData.pastMedicalHistory).forEach((condition) => {
      
      if (yOffset > 280) { // Check if page overflow
        doc.addPage();
        yOffset = 20; // Reset yOffset for the new page
      }
      doc.text(
        `${condition.replace(/([A-Z])/g, ' $1')}: ${
          formData.pastMedicalHistory[condition] ? 'Yes' : 'No'
        }`,
        20,
        yOffset
      );
      yOffset += 10;
    });

    // Surgeries Section
    doc.setFontSize(16);
    if (yOffset > 280) {
      doc.addPage();
      yOffset = 20;
    }
    doc.text('Surgeries', 20, yOffset);
    doc.setFontSize(12);
    yOffset += 10;
    if (formData.surgeries.length === 0) {
      doc.text('None', 20, yOffset);
    } else {
      formData.surgeries.forEach((surgery, index) => {
        doc.text(`${index + 1}. ${surgery}`, 20, yOffset);
        yOffset += 10;
      });
    }

    // Medications Section
    yOffset += 10;
    doc.setFontSize(16);
    doc.text('Medications', 20, yOffset);
    doc.setFontSize(12);
    yOffset += 10;
    doc.text(`${formData.medications}`, 20, yOffset);
    yOffset += 10;
      

    // Allergies Section
    yOffset += 10;
    doc.setFontSize(16);
    doc.text('Allergies', 20, yOffset);
    doc.setFontSize(12);
    yOffset += 10;
    doc.text(
      `Latex: ${formData.allergies.latex === null ? 'Unknown' : formData.allergies.latex ? 'Yes' : 'No'}`,
      20,
      yOffset
    );
    yOffset += 10;
    doc.text(`Iodine: ${formData.allergies.iodine ? 'Yes' : 'No'}`, 20, yOffset);
    yOffset += 10;
    doc.text(
      `Bromine: ${formData.allergies.bromine === null ? 'Unknown' : formData.allergies.bromine ? 'Yes' : 'No'}`,
      20,
      yOffset
    );
    yOffset += 10;
    doc.text(`Other: ${formData.allergies.other}`, 20, yOffset);

    // Cultural Views Section
    yOffset += 20;
    doc.setFontSize(16);
    doc.text('Cultural Views', 20, yOffset);
    doc.setFontSize(12);
    doc.text( formData.culturalViews ? "Yes" : "No" , 20, yOffset + 10);

    // Additional Comments Section
    yOffset += 20;
    doc.setFontSize(16);
    doc.text('Additional Comments', 20, yOffset);
    doc.setFontSize(12);
    doc.text(formData.additionalComments, 20, yOffset + 10);

    // Return PDF as a Blob for uploading
    return doc.output('blob');
  };

  // Upload PDF to IPFS
  const [ipfsUrl, setIpfsUrl] = useState('');
  const uploadToIPFS = async (pdfBlob) => {
    try {
      const result = await ipfs.add(pdfBlob);
      const url = `https://ipfs.io/ipfs/${result.path}`;
      console.log("Uploaded to IPFS:", url);
      setIpfsUrl(url);
      
      createPatientRecord(url)
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="w-10/12 mx-auto p-6 ">
      <h2 className="text-2xl font-bold mb-6 text-center">Medical Record</h2>

      {/* Name, Date, and Problem Description */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">When did your problem start?:</label>
          <input
            type="date"
            name="problemStartDate"
            value={formData.problemStartDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Describe Problem:</label>
          <textarea
            name="problemDescription"
            value={formData.problemDescription}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
      </div>

      {/* Cause of Current Problem */}
      <fieldset className="mb-6">
        <legend className="text-sm font-medium text-gray-700">Cause of Current Problem</legend>
        <div className="flex space-x-4 mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="causeOfProblem"
              value="Car Accident"
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Car Accident</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="causeOfProblem"
              value="Work Injury"
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Work Injury</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="causeOfProblem"
              value="Gradual Onset"
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Gradual Onset</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="causeOfProblem"
              value="Other"
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Other</span>
          </label>
        </div>
      </fieldset>

      {/* Past Medical History */}
      <fieldset className="mb-6">
        <legend className="text-sm font-medium text-gray-700">Past Medical History</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {Object.keys(formData.pastMedicalHistory).map((key) => (
            <label className="inline-flex items-center" key={key}>
              <input
                type="checkbox"
                name={key}
                checked={formData.pastMedicalHistory[key]}
                onChange={handleMedicalHistoryChange}
                className="form-checkbox"
              />
              <span className="ml-2">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Surgeries */}
      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="noSurgeries"
            checked={formData.surgeries.length === 0}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="ml-2">No Surgeries</span>
        </label>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">Surgery Date:</label>
          <input
            type="date"
            name="surgeryDate"
            value={formData.surgeryDate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Medications */}
      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="noMedication"
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="ml-2">No Medication</span>
        </label>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">Medications:</label>
          <textarea
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
      </div>

      {/* Allergies */}
      <fieldset className="mb-6">
        <legend className="text-sm font-medium text-gray-700">Allergies</legend>
        <div className="space-y-2 mt-2">
          <label className="block">
            Latex
            <div className="inline-flex ml-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="latex"
                  value="yes"
                  onChange={handleAllergiesChange}
                  className="form-radio"
                />
                <span className="ml-1">Yes</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="latex"
                  value="no"
                  onChange={handleAllergiesChange}
                  className="form-radio"
                />
                <span className="ml-1">No</span>
              </label>
            </div>
          </label>
          <label className="block">
            Iodine
            <div className="inline-flex ml-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="iodine"
                  value="yes"
                  onChange={handleAllergiesChange}
                  className="form-radio"
                />
                <span className="ml-1">Yes</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="iodine"
                  value="no"
                  onChange={handleAllergiesChange}
                  className="form-radio"
                />
                <span className="ml-1">No</span>
              </label>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Cultural Views */}
      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="culturalViews"
            checked={formData.culturalViews}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="ml-2">Cultural Views affecting treatment</span>
        </label>
      </div>

      {/* Additional Comments */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Additional Comments:</label>
        <textarea
          name="additionalComments"
          value={formData.additionalComments}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>

      {/* Signature and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Signature:</label>
          <input type="text" name="signature" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date:</label>
          <input type="date" name="signatureDate" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default MedicalRecordForm;
