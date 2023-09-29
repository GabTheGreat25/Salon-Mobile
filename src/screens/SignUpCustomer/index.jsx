import React from "react";
import { Signup } from "@components";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
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
        footerTitle={`Already have an account?`}
        footerLinkTitle={`Sign in`}
        navigateBack={() => navigation.goBack()}
      />
    </>
  );
}
