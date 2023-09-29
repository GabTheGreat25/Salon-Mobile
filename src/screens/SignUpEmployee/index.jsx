import React from "react";
import { Signup } from "@components";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
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
      />
    </>
  );
}
