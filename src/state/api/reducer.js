import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@env";
import TestAPI from "./routes/tests";
import AuthAPI from "./routes/auth";
import UserAPI from "./routes/user";
import ProductAPI from "./routes/product";
import DeliveryAPI from "./routes/delivery";
import ServiceAPI from "./routes/service";
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
    getUsers: UserAPI.get(builder),
    getUserById: UserAPI.getById(builder),
    addUser: UserAPI.add(builder),
    updateUser: UserAPI.updateById(builder),
    deleteUser: UserAPI.deleteById(builder),
    confirmUser: UserAPI.confirmUser(builder),
    updateUserPassword: UserAPI.updatePasswordById(builder),
    getProducts: ProductAPI.get(builder),
    getProductById: ProductAPI.getById(builder),
    addProduct: ProductAPI.add(builder),
    updateProduct: ProductAPI.updateById(builder),
    deleteProduct: ProductAPI.deleteById(builder),
    getDeliveries: DeliveryAPI.get(builder),
    getDeliveryById: DeliveryAPI.getById(builder),
    addDelivery: DeliveryAPI.add(builder),
    updateDelivery: DeliveryAPI.updateById(builder),
    deleteDelivery: DeliveryAPI.deleteById(builder),
    getServices: ServiceAPI.get(builder),
    getServiceById: ServiceAPI.getById(builder),
    addService: ServiceAPI.add(builder),
    updateService: ServiceAPI.updateById(builder),
    deleteService: ServiceAPI.deleteById(builder),
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
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useConfirmUserMutation,
  useUpdateUserPasswordMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetDeliveriesQuery,
  useGetDeliveryByIdQuery,
  useAddDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = api;
