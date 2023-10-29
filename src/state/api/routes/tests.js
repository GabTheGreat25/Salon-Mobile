import { ROUTE, TAGS, API } from "../../../constants";

export const get = (builder) => {
  return builder.query({
    query: () => `${ROUTE.TESTS_ROUTE}`,
    method: API.GET,
    providesTags: [TAGS.TESTS],
  });
};

export const getById = (builder) => {
  return builder.query({
    query: (id) => `${ROUTE.TEST_ID_ROUTE.replace(":id", id)}`,
    method: API.GET,
    providesTags: [TAGS.TESTS],
  });
};

export const add = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: `${ROUTE.TESTS_ROUTE}`,
      method: API.POST,
      body: payload,
    }),
    invalidatesTags: [TAGS.TESTS],
  });
};

export const updateById = (builder) => {
  return builder.mutation({
    query: ({ id, payload }) => {
      return {
        url: `${ROUTE.EDIT_TEST_ID_ROUTE.replace(":id", id)}`,
        method: API.PATCH,
        body: payload,
      };
    },
    invalidatesTags: [TAGS.TESTS],
  });
};

export const deleteById = (builder) => {
  return builder.mutation({
    query: (id) => ({
      url: `${ROUTE.TEST_ID_ROUTE.replace(":id", id)}`,
      method: API.DELETE,
    }),
    invalidatesTags: [TAGS.TESTS],
  });
};

export default { get, getById, add, updateById, deleteById };
