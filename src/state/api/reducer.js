import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@env";
import TestAPI from "./routes/tests";
import { API, TAGS } from "@constants";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
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
  }),
});

export const {
  useGetTestsQuery,
  useGetTestByIdQuery,
  useAddTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
} = api;