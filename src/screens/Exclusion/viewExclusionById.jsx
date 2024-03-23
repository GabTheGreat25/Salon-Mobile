import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { useGetExclusionByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetExclusionByIdQuery(id);

  const exclusion = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  return (
    <>
      {isLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{ backgroundColor }}
              className={`relative flex-1 pt-12`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
              <KeyboardAvoidingView behavior="height">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center pb-6 text-3xl`}
                  >
                    View Exclusion Details
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Chemical Name
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={exclusion?.ingredient_name}
                    editable={false}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Chemical Category:
                  </Text>
                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                    value={exclusion?.type.join(", ")}
                    editable={false}
                  />
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
