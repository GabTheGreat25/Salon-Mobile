import React from "react";
import { Opening } from "@components";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  return (
    <>
      <Opening
        title="Welcome to"
        showTitle={true}
        name="Lhanlee Beauty Lounge"
        showName={true}
        navigateBack={() => navigation.goBack()}
        firstButton="Login"
        navigateFirstButton={() => navigation.navigate("LoginUser")}
        secondButton="Signin"
        navigateSecondButton={() => navigation.navigate("ChooseRole")}
      />
    </>
  );
}
