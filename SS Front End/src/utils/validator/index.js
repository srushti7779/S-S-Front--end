import * as Yup from "yup";

const phoneregex = /^\+\d+$/;

export const SignUpFormValidations = Yup.object({
  name: Yup.string().required("User Name is a required field.").trim(),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email Address is a required field.")
    .trim(),
  password: Yup.string()
    .min(8)
    .required("Password is a required field.")
    .trim(),
  phoneNumber: Yup.string()
    .matches(phoneregex, "Phone Number is invalid.")
    .required("Phone Number is a required field.")
    .min(10, "Please enter a valid number")
    .trim(),
});

export const LoginFormValdations = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email Address is a required field.")
    .trim(),
  password: Yup.string()
    .min(8)
    .required("Password is a required field.")
    .trim(),
});
