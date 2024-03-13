import React from "react";
import { Welcome } from "@components";
import logo2 from "@assets/lhanlee-hiring.png";
import { useNavigation } from "@react-navigation/native";
import {
  selectDate,
  selectTime,
  selectIsHiring,
} from "../../state/hiring/hiringReducer";
import { useSelector } from "react-redux";

export default function () {
  const navigation = useNavigation();

  const date = useSelector(selectDate);
  const time = useSelector(selectTime);
  const hiring = useSelector(selectIsHiring);

  const defaultTitle = `Become a Lhanlee  Beautician!`;
  const hiringTitle = `Were Hiring! Apply now!`;

  const msg = `Are you passionate about beauty and wellness?   Turn your passion into a rewarding career as a beautician at Lhanlee Beauty Lounge..`;
  const hiringMsg = `Hiring Date: ${date}  Hiring Time Slot ${time}  Bring a Valid ID  Bring Your Own Resume with Updated:   contact
  information, education, and relevant work experience.`;

  const title = hiring ? hiringTitle : defaultTitle;
  const info = hiring ? hiringMsg : msg;

  return (
    <>
      <Welcome
        title={title}
        description={info}
        buttonTitle="Learn More"
        leftArrow={true}
        rightArrow={true}
        navigateLeft={() => navigation.navigate("Home")}
        navigateRight={() => navigation.navigate("BecomeCustomer")}
        navigateTo={() => navigation.navigate("ChooseRole")}
        logo={logo2}
      />
    </>
  );
}
