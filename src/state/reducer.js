import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth/authReducer";
import appointment from "./appointment/appointmentReducer";
import hiring from "./hiring/hiringReducer";
import notification from "./notification/notificationReducer";
import { api } from "./api/reducer";

export const rootReducer = combineReducers({
  auth,
  appointment,
  hiring,
  notification,
  [api.reducerPath]: api.reducer,
});
