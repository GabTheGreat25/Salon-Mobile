import * as yup from "yup";

export default yup.object({
    product_name: yup.string("Enter your Product Name").required("Product Name is required").min(2, "Your product Name should be of minimum 2 characters legth").max(30, "Your product Name cannot exceed 30 characters"),
    brand: yup.string("Enter your brand").required("Brand is required"),
    type: yup.string("Enter your type").required("Type is required"),
});