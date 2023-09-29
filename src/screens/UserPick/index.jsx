import React from "react";
import { Opening } from "@components";
import { dimensionLayout } from "@utils";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  return (
    <>
      <Opening
        title="Welcome to"
        showTitle={true}
        name="Lhanlee Beauty Lounge"
        showName={true}
        navigateBack={() => navigation.goBack()}
        firstButton="Login"
        navigateFirstButton={() => navigation.navigate("Login")}
        secondButton="Signin"
        navigateSecondButton={() => navigation.navigate("Signin")}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
