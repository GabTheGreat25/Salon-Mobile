import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { BackIcon } from "@helpers";
import { changeColor } from "@utils";
import { useGetExclusionsQuery } from "../../state/api/reducer";
import { ingredientSlice } from "../../state/ingredient/ingredientReducer";
import { LoadingScreen } from "@components";
import { useDispatch, useSelector } from "react-redux";
import { locationSlice } from "../../state/auth/locationReducer";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

export default function () {
  const isFocused = useIsFocused();
  const { backgroundColor, textColor } = changeColor();

  const checkedAllergies = useSelector(
    (state) => state.ingredient.ingredientData.allergy || []
  );

  const { data, isLoading, refetch } = useGetExclusionsQuery();
  const allergies = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const filteredAllergies =
    allergies?.filter((allergy) => allergy.type.includes("Hair")) || [];

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Array.isArray(checkedAllergies)) {
      dispatch(ingredientSlice.actions.ingredientForm([]));
    } else dispatch(ingredientSlice.actions.ingredientForm(checkedAllergies));
  }, [checkedAllergies, dispatch]);

  const handleCheckboxChange = (allergy) => {
    const isChecked = checkedAllergies.some((item) => item._id === allergy._id);

    let updatedAllergies;
    if (isChecked) {
      updatedAllergies = checkedAllergies.filter(
        (val) => val._id !== allergy._id
      );
    } else {
      updatedAllergies = [...checkedAllergies, allergy];
    }

    dispatch(ingredientSlice.actions.ingredientForm(updatedAllergies));
  };

  const handleLabelClick = (allergy, event) => {
    event.preventDefault();
  };

  const goBack = () => {
    navigation.goBack();
    dispatch(
      locationSlice.actions.updateFormData({ allergy: checkedAllergies })
    );
  };

  return (
    <>
      {isLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <SafeAreaView
          style={{ backgroundColor }}
          className={`relative flex-1 pt-12 px-6`}
        >
          <BackIcon navigateBack={goBack} textColor={textColor} />
          <Text
            style={{ color: textColor }}
            className="pb-4 text-xl text-center"
          >
            {`Choose any of the following Chemical Solutions that can cause you allergy`}
          </Text>
          <View className={`flex flex-row flex-wrap gap-x-4`}>
            {filteredAllergies?.map((allergy) => (
              <TouchableOpacity
                key={allergy?._id}
                onPress={() => handleCheckboxChange(allergy)}
                className={`flex-row items-center py-4`}
              >
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderColor: textColor,
                    backgroundColor: checkedAllergies.some(
                      (item) => item._id === allergy._id
                    )
                      ? backgroundColor
                      : "transparent",
                  }}
                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                >
                  {checkedAllergies.some(
                    (item) => item._id === allergy._id
                  ) && (
                    <Text style={{ color: textColor }} className={`text-lg`}>
                      ✓
                    </Text>
                  )}
                </View>
                <View>
                  <Text
                    style={{
                      color: textColor,
                    }}
                    className={`text-lg font-semibold`}
                    onPress={(e) => handleLabelClick(allergy, e)}
                  >
                    {allergy?.ingredient_name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
