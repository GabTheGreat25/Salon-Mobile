import * as yup from "yup";

export default yup.object({
  service_name: yup
    .string("Enter your Service Name")
    .required("Service Name is required")
    .min(2, "Your service Name should be of minimum 2 characters legth")
    .max(30, "Your service Name cannot exceed 30 characters"),
  description: yup
    .string("Enter your description")
    .min(2, "Your service Name should be of minimum 2 characters legth")
    .required("Description is required"),
  price: yup
    .number("Enter a price")
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .max(10000, "Price must be at most 10000"),
});
