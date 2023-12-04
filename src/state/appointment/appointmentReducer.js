import { createSlice } from "@reduxjs/toolkit";
import { api } from "../api/reducer";
import { initialState } from "./state";

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setService(state, action) {
      state.appointmentData.service = action.payload.service;
      state.appointmentData.price = action.payload.price;
      state.appointmentData.extraFee = action.payload.extraFee;
      state.appointmentData.service_name = action.payload.service_name;
      state.appointmentData.product_name = action.payload.product_name;
      state.appointmentData.image = action.payload.image;
      state.count += 1;
    },
    setDateTime(state, action) {
      state.appointmentData.date = action.payload.date;
      state.appointmentData.time = action.payload.time;
    },
    setEmployee(state, action) {
      state.appointmentData.employee = action.payload;
    },
    setNote(state, action) {
      state.appointmentData.note = action.payload;
    },
    setCustomer(state, action) {
      state.appointmentData.customer = action.payload;
    },
    clearAppointmentData(state) {
      state.appointmentData = {
        employee: "",
        customer: "",
        service: "",
        service_name: "",
        product_name: "",
        image: [],
        date: "",
        time: "",
        price: 0,
        extraFee: 0,
        note: "",
        status: "pending",
        payment: "",
      };
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.addAppointment.matchFulfilled,
      (state, { payload }) => {
        if (payload?.success === true) {
          const { appointment } = payload.details;
          console.log("Appointment added:", appointment);
          state.appointmentData = {
            ...state.appointmentData,
            ...appointment,
          };

          console.log("State after adding appointment:", state);
        }
      }
    );
  },
});

export const {
  setService,
  setDateTime,
  setEmployee,
  setNote,
  setCustomer,
  clearAppointmentData,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
