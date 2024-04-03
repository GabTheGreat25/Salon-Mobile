import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { changeColor } from "@utils";
import { reasonSlice } from "../../state/editSchedule/reasonReducer";

export default function ({ route }) {
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { id } = route.params;
  console.log(id);
  const reason = useSelector((state) => state.reason);
  console.log(reason);

  const goBack = () => {
    navigation.goBack();
    dispatch(reasonSlice.actions.resetReason());
  };

  return (
    <>
      <BackIcon navigateBack={goBack} textColor={textColor} />
    </>
  );
}
