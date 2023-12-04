import * as yup from "yup";

export default yup.object({
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  price: yup
    .number("Enter a price")
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .max(10000, "Price must be at most 10000"),
});
