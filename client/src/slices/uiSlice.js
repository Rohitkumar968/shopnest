import { createSlice } from '@reduxjs/toolkit';

const darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) document.documentElement.classList.add('dark');

const uiSlice = createSlice({
  name: 'ui',
  initialState: { darkMode },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
