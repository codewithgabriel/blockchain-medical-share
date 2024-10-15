// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalDataSharing {
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

    modifier onlyPatient() {
        require(bytes(patients[msg.sender].name).length != 0, "Not a registered patient");
        _;
    }

    modifier onlyProvider() {
        require(healthcareProviders[msg.sender], "Not a registered provider");
        _;
    }

    function registerPatient(string memory _name, uint256 _age, string memory _medicalHistory) public {
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered");
        address[] memory addresses;
        patients[msg.sender] = Patient(_name , _age , _medicalHistory , addresses);
        emit PatientRegistered(msg.sender, _name);
    }

    function authorizeProvider(address _provider) public onlyPatient {
        require(healthcareProviders[_provider], "Provider not registered");
        require(!isAuthorized(msg.sender, _provider), "Provider already authorized");
        patients[msg.sender].authorizedProviders.push(_provider);
        emit ProviderAuthorized(msg.sender, _provider);
    }

    function shareData(address _patient) public onlyProvider {
        require(isAuthorized(_patient, msg.sender), "Provider not authorized");
        emit DataShared(_patient, msg.sender);
    }

    function isAuthorized(address _patient, address _provider) public view returns (bool) {
        address[] memory authorizedProviders = patients[_patient].authorizedProviders;
        for (uint256 i = 0; i < authorizedProviders.length; i++) {
            if (authorizedProviders[i] == _provider) {
                return true;
            }
        }
        return false;
    }

    function registerProvider() public {
        require(!healthcareProviders[msg.sender], "Provider already registered");
        healthcareProviders[msg.sender] = true;
    }

    function getPatientData() public view  returns (string memory, uint256, string memory) {
        return (patient.name, patient.age, patient.medicalHistory);
    }
}



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalDataSharing {

    struct Patient{
        string fullname;
        uint age;
        string data;

    } 
    struct Provider { 
        address owner;
        Patient[] patients;
        address[] accessList;
    }

    mapping (address => Provider) providers;


    function addPatient(string memory fullname, uint age, string memory data) public { 
            providers[msg.sender].patients.push(Patient(fullname , age, data) );
    }

    function authorizeProvider(address _providerAddress) public {
            providers[msg.sender].accessList.push(_providerAddress);
    }

    function getPatientData () public returns(string memory , uint, string memory) { 

    return 
    }



}
