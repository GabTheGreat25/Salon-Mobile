import React from "react";
import { Welcome } from "../../components";
import { dimensionLayout } from "../../utils";
import logo2 from "../../../assets/logo-2.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();

  const handleButtonClick = () => {
    alert("Button clicked!");
  };

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
        navigateTo={handleButtonClick}
        logo={logo2}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
