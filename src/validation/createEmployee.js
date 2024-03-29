import * as yup from "yup";

export default yup.object({
  name: yup
    .string("Enter your Name")
    .required("Name is required")
    .min(2, "Your name should be of minimum 2 characters legth")
    .max(30, "Your name cannot exceed 30 characters"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .required("Password is required")
    .min(8, "Password should be of minimum 8 characters length"),
  contact_number: yup
    .string("Enter your contact number")
    .required("Contact number is required")
    .max(11, "Please enter a valid 11-digit phone number"),
  job: yup.string("Enter your job").required("Job is required"),
});
