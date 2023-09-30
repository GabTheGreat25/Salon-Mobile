import React from "react";
import { Signup } from "@components";
import { useNavigation } from "@react-navigation/native";
import { dimensionLayout } from "@utils";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const initialState = {
    userName: "",
    email: "",
    contactNumber: "",
    jobTitle: "",
    password: "",
  };

  return (
    <>
      <Signup
        initialState={initialState}
        title={`Sign up as Employee`}
        description={`Create your account`}
        buttonTitle={`Sign up`}
        footerTitle={`Already have an account?`}
        footerLinkTitle={`Sign in`}
        navigateBack={() => navigation.goBack()}
        navigateTo={() => navigation.navigate("Login")}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
