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
    password: "",
  };

  return (
    <>
      <Signup
        initialState={initialState}
        title={`Sign up as Customer`}
        description={`Create your account`}
        buttonTitle={`Sign up`}
        footerShow={true}
        footerTitle={`Already have an account?`}
        footerLinkTitle={`Sign in`}
        navigateBack={() => navigation.goBack()}
        navigateTo={() => navigation.navigate("LoginUser")}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
