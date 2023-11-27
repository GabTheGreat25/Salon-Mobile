import { ROUTE, TAGS, API } from "../../../constants";

export const get = (builder) => {
  return builder.query({
    query: () => `${ROUTE.DELIVERY_ROUTE}`,
    method: API.GET,
    providesTags: [TAGS.DELIVERY],
  });
};

export const getById = (builder) => {
  return builder.query({
    query: (id) => `${ROUTE.DELIVERY_ID_ROUTE.replace(":id", id)}`,
    method: API.GET,
    providesTags: [TAGS.DELIVERY],
  });
};

export const add = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: `${ROUTE.DELIVERY_ROUTE}`,
      method: API.POST,
      body: payload,
    }),
    invalidaproductags: [TAGS.DELIVERY],
  });
};

export const updateById = (builder) => {
  return builder.mutation({
    query: ({ id, payload }) => {
      return {
        url: `${ROUTE.EDIT_DELIVERY_ID_ROUTE.replace(":id", id)}`,
        method: API.PATCH,
        body: payload,
      };
    },
    invalidaproductags: [TAGS.DELIVERY],
  });
};

export const deleteById = (builder) => {
  return builder.mutation({
    query: (id) => ({
      url: `${ROUTE.DELIVERY_ID_ROUTE.replace(":id", id)}`,
      method: API.DELETE,
    }),
    invalidaproductags: [TAGS.DELIVERY],
  });
};

export default { get, getById, add, updateById, deleteById };
