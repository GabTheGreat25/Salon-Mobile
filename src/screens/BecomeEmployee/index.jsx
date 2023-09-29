import React from "react";
import { Welcome } from "@components";
import { dimensionLayout } from "@utils";
import logo2 from "@assets/logo-2.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();

  return (
    <>
      <Welcome
        title="Become a Lanlee Employee?"
        description={`Lorem ipsum dolor sit amet \nconsectetur adipisicing elit.`}
        buttonTitle="Learn More"
        leftArrow={true}
        rightArrow={true}
        navigateLeft={() => navigation.navigate("Home")}
        navigateRight={() => navigation.navigate("BecomeCustomer")}
        navigateTo={() => navigation.navigate("ChooseRole")}
        logo={logo2}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
