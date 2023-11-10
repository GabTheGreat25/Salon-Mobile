import React from "react";
import { dimensionLayout } from "@utils";
import { Login } from "@components";
import Facebook from "@assets/facebook.png";
import Google from "@assets/google.png";
import Instagram from "@assets/instagram.png";
import Linkedin from "@assets/linkedin.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();

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
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
