import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@env";
import TestAPI from "./routes/tests";
import AuthAPI from "./routes/auth";
import { RESOURCE, API, TAGS } from "@constants";

const prepareHeaders = (headers, { getState }) => {
  if (getState()?.auth?.authenticated)
  headers.set("authorization", `Bearer ${getState()?.auth?.token || ""}`);

  headers.set("accept", `application/json`);
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: RESOURCE.INCLUDE,
  prepareHeaders,
});

export const api = createApi({
  reducerPath: TAGS.API,
  baseQuery,
  tagTypes: API.TAGS,
  endpoints: (builder) => ({
    getTests: TestAPI.get(builder),
    getTestById: TestAPI.getById(builder),
    addTest: TestAPI.add(builder),
    updateTest: TestAPI.updateById(builder),
    deleteTest: TestAPI.deleteById(builder),
    login: AuthAPI.login(builder),
    logout: AuthAPI.logout(builder),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestByIdQuery,
  useAddTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useLoginMutation,
  useLogoutMutation,
} = api;