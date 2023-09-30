import React from "react";
import { Signup } from "@components";
import { useNavigation } from "@react-navigation/native";
import { dimensionLayout } from "@utils";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const initialState = {
    userName: "",
  };

  return (
    <>
      <Signup
        initialState={initialState}
        title={`Forgot Your Password?`}
        description={`We got you covered! Enter your email address \nand we will send you a link to reset your password.`}
        buttonTitle={`Continue`}
        footerShow={true}
        footerTitle={`Remember your pass?`}
        footerLinkTitle={`Sign in`}
        navigateBack={() => navigation.goBack()}
        navigateTo={() => navigation.navigate("Login")}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
