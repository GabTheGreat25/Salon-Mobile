import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth/authReducer";
import appointment from "./appointment/appointmentReducer";
import hiring from "./hiring/hiringReducer";
import notification from "./notification/notificationReducer";
import employee from "./auth/employeeReducer";
import location from "./auth/locationReducer";
import ingredient from "./ingredient/ingredientReducer";
import waiver from "./waiver/waiverReducer";
import fee from "./appointment/hasAppointmentReducer";
import { api } from "./api/reducer";

export const rootReducer = combineReducers({
  auth,
  appointment,
  hiring,
  notification,
  employee,
  location,
  ingredient,
  waiver,
  fee,
  [api.reducerPath]: api.reducer,
});
