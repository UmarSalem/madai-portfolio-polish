// Fictional, static examples only. No user data, files, storage or provider calls.
export const demoScenarios = [
  { id: 'headache', patient: 'Alex Example', text: 'Fictional headache and mild tiredness',
    guidance: { summary: 'Simulated example: a clinician would ask about duration and other symptoms. This fixed text is not a diagnosis or live AI guidance.', suggestedConditions: [], nextSteps: ['Explore the fictional doctor directory.'] } },
  { id: 'question', patient: 'Sam Sample', text: 'Fictional question: what happens during a routine check-up?',
    guidance: { summary: 'Simulated example: a routine visit can include a conversation about general wellbeing. This is prewritten sample text, not personalised advice.', suggestedConditions: [], nextSteps: ['Explore the sample report layout.'] } },
];

export const demoDoctors = [
  { id: 'sample-clinic-1', name: 'Example Family Clinic', address: '10 Sample Lane (fictional)', location: 'Demo City', specialty: 'General practice', isDemo: true },
  { id: 'sample-clinic-2', name: 'Sample Heart Clinic', address: '20 Example Road (fictional)', location: 'Demo City', specialty: 'Cardiology', isDemo: true },
];

export const demoReports = [
  { id: 'sample-report', patientName: 'Alex Example', fileName: 'fictional-sample-report.pdf', dateUploaded: '2026-01-01T12:00:00Z',
    summary: 'Prewritten sample explanation for a fictional report. No PDF was uploaded, read or analysed. This card illustrates the report layout only.',
    suggestedConditions: [], nextSteps: ['Report analysis and follow-up chat remain incomplete.'], downloadAvailable: false, isDemo: true },
];
