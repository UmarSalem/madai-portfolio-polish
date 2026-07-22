import httpClient from './httpClient';



//Doctor Search
export const searchDoctors = (location, specialty) =>
  httpClient.get('/api/Doctors/search', { params: { location, specialty } });


//Symptom Checker
export const checkSymptoms = ({ patientName, symptomsText, dateSubmitted }) =>
  httpClient.post('/api/SymptomChecker', {
    patientName,
    symptomsText,
    dateSubmitted,
  });


//Medical Reports
export const uploadMedicalReport = ({ patientName, file }) => {
  const formData = new FormData();
  formData.append('PatientName', patientName);
  formData.append('File', file);

  return httpClient.post('/api/MedicalReport/upload-report', formData);
};

export const getMyMedicalReports = () =>
  httpClient.get('/api/MedicalReport/my-reports');

export const getMedicalHistory = () =>
  httpClient.get('/api/user/medical-history');
