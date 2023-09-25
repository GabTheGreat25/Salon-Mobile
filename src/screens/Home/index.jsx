import React from "react";
import { Welcome } from "../../components";
import { dimensionLayout } from "../../utils";
import logo1 from "../../../assets/logo-1.png";
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
        title={`Looking for a \nsalon?`}
        description={`Lorem ipsum dolor sit amet \nconsectetur adipisicing elit.`}
        buttonTitle="Learn More"
        leftArrow={false}
        rightArrow={true}
        navigateRight={() => navigation.navigate("BecomeEmployee")}
        navigateTo={handleButtonClick}
        logo={logo1}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
