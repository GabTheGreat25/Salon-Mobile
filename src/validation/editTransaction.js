import * as yup from "yup";

export default yup.object({
  date: yup.string().required("Date is required"),
  status: yup.string().required("Time is required"),
  payment: yup.string().required("Payment is required"),
});
