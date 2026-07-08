import { createSlice } from '@reduxjs/toolkit';
export const LANGUAGES={
  ENGLISH:'en',DENMARK:'da', SWEDEN:'sv', GERMANY:'de',NORWAY:'no',
  defaultObject: {"en":"","da":"","sv":"","de":"","no":""}
}
export const ROLE={
  Admin:'admin',Manager:'manager', Receptionist:'receptionist',
}
export const TITLE = {
  COMPANY: "Company",
  COURSE: "Course",
  MODULE: "Module",
  TOPIC: "Topic",
  LEARNING_JOURNEY: "Learning Journey",
  TOPIC_EXERCISE: "Topic Exercise",
  ACTIVITY: "Activity",
  ADMIN: "Admins",
  USER: "User",
  TEAM: "Team",
  COURSE_TEAM: "Course Team",
  COURSE_TEAMS: "Course Teams",
  TEAM_USER: "Team User",
  COURSE_BUDDY_MATCH_QUESTION: "Course Buddy Match Question",
  COMPANY_USER: "Company Users",
  BUDDY_QUESTION: "BuddyQuestion",
  COURSE_USERS: "Course Users",
  ACTIVITIES:'Activities',
  VIEW_TEAM:'ViewTeam',
  TOPIC_SURVEYS:'Topic Surveys',
  TOPIC_SURVEYS:'Topic Surveys',
  
};
export const slice = createSlice({
  name: 'SettingsReducer',
  initialState: {
    selectedLanguage:'en',
  },
  reducers: {
    setSelectedLanguage : (state, action) => {
        state.selectedLanguage=action.payload;
    },
    resetSettingsReducer : (state) => {
        state.selectedLanguage=null;
    },
  },
});

export const {
    setSelectedLanguage,
 } = slice.actions;
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

export const selectedLanguageSelector = (state) => state.SettingsReducer.selectedLanguage;

export default slice.reducer;