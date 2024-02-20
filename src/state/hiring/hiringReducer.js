import { createSlice } from "@reduxjs/toolkit";

export const hiringSlice = createSlice({
  name: "hiring",
  initialState: {
    hiringData: {
      date: "",
      time: "",
      isHiring: false,
    },
  },
  reducers: {
    submitForm: (state, action) => {
      const { date, time, isHiring } = action.payload;

      state.hiringData.date = date;
      state.hiringData.time = time;
      state.hiringData.isHiring = isHiring;
    },
  },
});

export const { submitForm } = hiringSlice.actions;
export const selectDate = (state) => state.hiring.hiringData.date;
export const selectTime = (state) => state.hiring.hiringData.time;
export const selectIsHiring = (state) => state.hiring.hiringData.isHiring;

export default hiringSlice.reducer;
