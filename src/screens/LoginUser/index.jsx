import React from "react";
import { Login } from "@components";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  return (
    <>
      <Login
        title={`Welcome back!`}
        description={`Log in to your account`}
        buttonTitle={`Login`}
        navigateBack={() => navigation.goBack()}
        showComponent={true}
        linkNavigateTo={() => navigation.navigate("ForgetPassword")}
        linkTitle={`Forgot password?`}
        footerTitle={`Don't have an account?`}
        footerLink={() => navigation.navigate("ChooseRole")}
        footerLinkTitle={`Sign up here`}
      />
    </>
  );
}
