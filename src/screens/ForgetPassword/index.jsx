import React from "react";
import { dimensionLayout } from "@utils";
import { Login } from "@components";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const initialState = {
    email: "",
  };

  return (
    <>
      <Login
        initialState={initialState}
        title={`Forget Password?`}
        description={`Please enter your email to reset you password.`}
        buttonTitle={`Continue`}
        navigateBack={() => navigation.goBack()}
        navigateTo={() => navigation.navigate("LoginUser")}
        showComponent={false}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
