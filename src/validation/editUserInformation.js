import * as yup from "yup";

export default yup.object({
    name: yup.string("Enter your Name").required("Name is required").min(2, "Your name should be of minimum 2 characters legth").max(30, "Your name cannot exceed 30 characters"),
    email: yup.string("Enter your email").email("Enter a valid email").required("Email is required"),
    contact_number: yup.string("Enter your contact number").required("Contact number is required").max(11, "Please enter a valid 11-digit phone number"),
});