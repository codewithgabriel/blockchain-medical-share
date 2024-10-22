let a = {
  name: "gabriel",
  date: "2021",
  problemStartDate: "what",
  causeOfProblem: "none",
  surgeryRequired: false,
  surgeryDate: "2021",
  additionalComments: "None",
};

(
    "gabriel",
    "2021",
    "what",
    "none",
    false,
    "2021",
    "None"

)
// Sample data to pass into the registerPatient function
const name = "John Doe";
const date = "2023-01-01";
const problemStartDate = "2022-12-01";
const problemDescription = "Chronic headache.";
const causeOfProblem = "Unknown";
const surgeryRequired = false;
const surgeryDate = ""; // No surgery performed
const pastMedicalHistoryFlags =
 [true, false, false, true, false, false, true, false, true, false, false, false, true, false, true, false, false, true, false, false];

// Surgeries data (array of struct Surgery)
const surgeries = [
  { surgeryName: "Appendectomy", year: "2019", complications: "None" }
];

// Medications data (array of struct Medication)
const medications = [
  { name: "Aspirin", dose: "100mg", reason: "Headache" },
  { name: "Ibuprofen", dose: "200mg", reason: "Pain" }
];

// AllergiesData struct
const allergiesData = {
  latexAllergy: true,
  iodineAllergy: false,
  bromineAllergy: false,
  otherAllergies: "Pollen"
};

// Cultural views affecting treatment
const culturalViewsAffectTreatment = false;

// Additional comments
const additionalComments = "Patient feels fatigued frequently.";
