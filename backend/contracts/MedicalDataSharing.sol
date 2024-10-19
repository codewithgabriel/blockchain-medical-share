// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainChainData {
    struct Patient {
        string name;
        uint256 age;
        string medicalHistory;
        address[] authorizedProviders;
    }

    mapping(address => Patient) private patients;
    mapping(address => bool) private healthcareProviders;

    event PatientRegistered(address indexed patientAddress, string name);
    event DataShared(address indexed patientAddress, address indexed providerAddress);
    event ProviderAuthorized(address indexed patientAddress, address indexed providerAddress);

    // Register a new patient
    function registerPatient(string memory _name, uint256 _age, string memory _medicalHistory) public {
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered");
        address[] memory addresses;
        patients[msg.sender] = Patient(_name, _age, _medicalHistory, addresses);
        emit PatientRegistered(msg.sender, _name);
    }

    // Authorize a healthcare provider
    function authorizeProvider(address _provider) public {
        require(healthcareProviders[_provider], "Provider not registered");
        require(!isAuthorized(msg.sender, _provider), "Provider already authorized");
        patients[msg.sender].authorizedProviders.push(_provider);

        emit ProviderAuthorized(msg.sender, _provider);
    }

    // Register a new healthcare provider
    function registerProvider() public {
        require(!healthcareProviders[msg.sender], "Provider already registered");
        healthcareProviders[msg.sender] = true;
    }

    // Check if a provider is authorized to access a patient's data
    function isAuthorized(address _patient, address _provider) public view returns (bool) {
        address[] memory authorizedProviders = patients[_patient].authorizedProviders;
        for (uint256 i = 0; i < authorizedProviders.length; i++) {
            if (authorizedProviders[i] == _provider) {
                return true;
            }
        }
        return false;
    }

    // Get a patient's data, only accessible by authorized providers
    function getPatientData(address _owner) public view returns (string memory, uint256, string memory) {
        // Check if the caller (msg.sender) is authorized to access the patient's data
        //require(isAuthorized(_owner, msg.sender), "Access Denied: You are not authorized to view this data.");
        
        // If authorized, return the patient's data
        Patient memory patient = patients[_owner];
        return (patient.name, patient.age, patient.medicalHistory);
    }
}
