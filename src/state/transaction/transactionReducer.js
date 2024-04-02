import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setDateTime(state, action) {
      const { date, time } = action.payload;

      return {
        ...state,
        transactionData: {
          ...state.transactionData,
          time: time || [],
          date: date || "",
        },
      };
    },
    setBeautician(state, action) {
      const beautician = action.payload;

      return {
        ...state,
        transactionData: {
          ...state.transactionData,
          beautician: beautician || [],
        },
      };
    },
    setPayment(state, action) {
      state.transactionData.payment = action.payload || "";
    },
    setType(state, action) {
      state.transactionData.customerType = action.payload || "";
    },
    setImage(state, action) {
      const images = action.payload;

      return {
        ...state,
        transactionData: {
          ...state.transactionData,
          image: images || [],
        },
      };
    },
    setCustomer(state, action) {
      state.transactionData.customer = action.payload || "";
    },
    clearTransactionData(state) {
      state.transactionData = {
        beautician: [],
        customer: "",
        date: "",
        time: [],
        payment: "",
        customerType: "",
        image: [],
      };
    },
  },
});

export const {
  clearTransactionData,
  setDateTime,
  setBeautician,
  setPayment,
  setType,
  setImage,
  setCustomer,
} = transactionSlice.actions;

export default transactionSlice.reducer;
