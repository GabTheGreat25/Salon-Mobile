import * as yup from "yup";

export default yup.object({
  test: yup.string("Enter your Test").required("Test is required"),
});
