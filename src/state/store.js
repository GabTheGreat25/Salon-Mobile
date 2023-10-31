import {
  configureStore
} from "@reduxjs/toolkit";
import {
  api
} from "./api/reducer";
import {
  setupListeners
} from "@reduxjs/toolkit/query";
import {
  rootReducer
} from "./reducer";
import {
  RESOURCE
} from "../constants";
import {
  API_URL
} from "../env";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: API_URL !== RESOURCE.PRODUCTION,
});
setupListeners(store.dispatch);