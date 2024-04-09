import React, { useEffect } from "react";
import { Welcome } from "@components";
import logo2 from "@assets/lhanlee-hiring.png";
import { useNavigation } from "@react-navigation/native";
import { useGetHiringsQuery } from "../../state/api/reducer";
import { useIsFocused } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const { data, refetch } = useGetHiringsQuery();
  const hiring = data?.details[0];

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const defaultTitle = `Become a Lhanlee  Employee!`;
  const hiringTitle = `${"Were Hiring A\n" + hiring?.type + " Apply now!"}`;

  const hiringDate = hiring?.date ? new Date(hiring.date) : null;
  const hiringDateFormatted = hiringDate
    ? hiringDate.toISOString().split("T")[0]
    : "";

  const msg = `Are you passionate about beauty and wellness? Turn your passion into a rewarding career as a employee at Lhanlee Beauty Lounge..`;
  const hiringMsg = `${
    "Hiring Date: " +
    hiringDateFormatted +
    "\nHiring Time Slot: " +
    hiring?.time +
    "\nBring a Valid ID, Bring Your Own Resume with Updated: contact information, education, and relevant work experience."
  }`;

  const title = hiring?.isHiring === false ? defaultTitle : hiringTitle;
  const info = hiring?.isHiring === false ? msg : hiringMsg;

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
