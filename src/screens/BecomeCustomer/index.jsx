import React from "react";
import { Welcome } from "@components";
import logo3 from "@assets/logo-3.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  return (
    <>
      <Welcome
        title="Become a Lanlee Customer?"
        description={`Lorem ipsum dolor sit amet \nconsectetur adipisicing elit.`}
        buttonTitle="Learn More"
        leftArrow={true}
        rightArrow={false}
        navigateLeft={() => navigation.navigate("BecomeEmployee")}
        navigateTo={() => navigation.navigate("ChooseRole")}
        logo={logo3}
      />
    </>
  );
}
