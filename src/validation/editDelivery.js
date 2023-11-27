import * as yup from "yup";

export default yup.object({
  company_name: yup
    .string("Enter the Company Name")
    .required("Company Name is required")
    .min(2, "The Company Name should be of minimum 2 characters legth")
    .max(30, "The Company Name cannot exceed 30 characters"),
  date: yup.string().required("Date is required"),
  price: yup
    .number("Enter a price")
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .max(10000, "Price must be at most 10000"),
  quantity: yup
    .number("Enter a quantity")
    .required("Quantity is required")
    .min(0, "Quantity must be at least 0")
    .max(10000, "Quantity must be at most 10000"),
});
