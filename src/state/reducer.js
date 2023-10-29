import { combineReducers } from "@reduxjs/toolkit";
import { api } from "./api/reducer";

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});
