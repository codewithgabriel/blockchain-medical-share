// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.0;  

contract BlockchainChainData {  
    // Struct to hold past medical history information  
    struct PastMedicalHistory {  
        bool breathingProblems;  
        bool pregnant;  
        bool heartProblems;  
        bool woundProblems;  
        bool pacemaker;  
        bool tumorCancer;  
        bool diabetes;  
        bool stroke;  
        bool boneJointProblems;  
        bool kidneyProblems;  
        bool gallbladderLiver;  
        bool electricalImplants;  
        bool anxietyAttacks;  
        bool sleepApnea;  
        bool depression;  
        bool bowelBladder;  
        bool alcoholHistory;  
        bool drugUse;  
        bool smoking;  
        bool headaches;  
    }  

    // Struct to hold allergies information  
    struct Allergies {  
        bool latex;  
        bool iodine;  
        bool bromine;  
        string other;  
    }  

    // Struct to hold surgery information  
    struct Surgery {  
        string surgeryName;  
        string year;  
        string complications;  
    }  

    // Struct to hold medication information  
    struct Medication {  
        string name;  
        string dose;  
        string reason;  
    }  

    // Struct to hold the entire medical record  
    struct MedicalRecordStruct {  
        string name;  
        string date;  
        string problemStartDate;  
        string problemDescription;  
        string causeOfProblem;  
        bool surgeryRequired;  
        string surgeryDate;  
        PastMedicalHistory pastMedicalHistory;  
        Surgery[] surgeries;  
        Medication[] medications;  
        Allergies allergies;  
        bool culturalViewsAffectTreatment;  
        string additionalComments;  
    }  

    struct authorizeProviderStruct {   
         address[] authorizedProviders;  
    }  

    struct PatientDataInput {  
        string name;  
        string date;  
        string problemStartDate;  
        string problemDescription;  
        string causeOfProblem;  
        bool surgeryRequired;  
        string surgeryDate;  
        bool[] pastMedicalHistoryFlags; // Flags for medical history  
        Surgery[] surgeries;  
        Medication[] medications;  
        bool latexAllergy;  
        bool iodineAllergy;  
        bool bromineAllergy;  
        string otherAllergies;  
        bool culturalViewsAffectTreatment;  
        string additionalComments;  
    }  

    // Mapping from patient address to their medical record  
    mapping(address => MedicalRecordStruct) private patients;  
    mapping(address => bool) private healthcareProviders;  
    mapping(address => authorizeProviderStruct) providers;  

    event PatientRegistered(address indexed patientAddress, string name);  
    event DataShared(address indexed patientAddress, address indexed providerAddress);  
    event ProviderAuthorized(address indexed patientAddress, address indexed providerAddress);  

    // Function to create or update medical records  
    function registerPatient(PatientDataInput memory input) public {  
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered");  

        // Initialize past medical history  
        PastMedicalHistory memory history = PastMedicalHistory(  
            input.pastMedicalHistoryFlags[0],  
            input.pastMedicalHistoryFlags[1],  
            input.pastMedicalHistoryFlags[2],  
            input.pastMedicalHistoryFlags[3],  
            input.pastMedicalHistoryFlags[4],  
            input.pastMedicalHistoryFlags[5],  
            input.pastMedicalHistoryFlags[6],  
            input.pastMedicalHistoryFlags[7],  
            input.pastMedicalHistoryFlags[8],  
            input.pastMedicalHistoryFlags[9],  
            input.pastMedicalHistoryFlags[10],  
            input.pastMedicalHistoryFlags[11],  
            input.pastMedicalHistoryFlags[12],  
            input.pastMedicalHistoryFlags[13],  
            input.pastMedicalHistoryFlags[14],  
            input.pastMedicalHistoryFlags[15],  
            input.pastMedicalHistoryFlags[16],  
            input.pastMedicalHistoryFlags[17],  
            input.pastMedicalHistoryFlags[18],  
            input.pastMedicalHistoryFlags[19]  
        );  

        // Initialize allergies  
        Allergies memory allergies = Allergies(input.latexAllergy, input.iodineAllergy, input.bromineAllergy, input.otherAllergies);  
        
        // Store the medical record  
        MedicalRecordStruct storage record = patients[msg.sender];  
        record.name = input.name;  
        record.date = input.date;  
        record.problemStartDate = input.problemStartDate;  
        record.problemDescription = input.problemDescription;  
        record.causeOfProblem = input.causeOfProblem;  
        record.surgeryRequired = input.surgeryRequired;  
        record.surgeryDate = input.surgeryDate;  
        record.pastMedicalHistory = history;  
        record.allergies = allergies;  
        record.culturalViewsAffectTreatment = input.culturalViewsAffectTreatment;  
        record.additionalComments = input.additionalComments;  

        // Copy surgeries from memory to storage  
        for (uint256 i = 0; i < input.surgeries.length; i++) {  
            record.surgeries.push(input.surgeries[i]);  
        }  

        // Copy medications from memory to storage  
        for (uint256 i = 0; i < input.medications.length; i++) {  
            record.medications.push(input.medications[i]);  
        }  

        emit PatientRegistered(msg.sender, input.name);  
    }  

    // Authorize a healthcare provider  
    function authorizeProvider(address _provider) public {  
        require(healthcareProviders[_provider], "Provider not registered");  
        require(!isAuthorized(msg.sender, _provider), "Provider already authorized");  
        providers[msg.sender].authorizedProviders.push(_provider);  

        emit ProviderAuthorized(msg.sender, _provider);  
    }  

    // Register a new healthcare provider  
    function registerProvider() public {  
        require(!healthcareProviders[msg.sender], "Provider already registered");  
        healthcareProviders[msg.sender] = true;  
    }  

    // Check if a provider is authorized to access a patient's data  
    function isAuthorized(address _patient, address _provider) public view returns (bool) {  
        address[] memory authorizedProviders = providers[_patient].authorizedProviders;  
        for (uint256 i = 0; i < authorizedProviders.length; i++) {  
            if (authorizedProviders[i] == _provider) {  
                return true;  
            }  
        }  
        return false;  
    }  

    // Function to retrieve a medical record  
    function getPatientData(address _owner) public view returns (MedicalRecordStruct memory) {  
        return patients[_owner];  
    }  
}