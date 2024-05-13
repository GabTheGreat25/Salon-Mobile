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
import { useGetFeedbackByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetFeedbackByIdQuery(id);

  const feedback = data?.details;

  const anonymizeName = (name) => {
    if (!name || name?.length < 2) return "";
    return name[0] + "*".repeat(name?.length - 2) + name[name?.length - 1];
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, borderColor } = changeColor();

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
              <ScrollView
                showsVerticalScrollIndicator={false}
                className={`m-2`}
              >
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center pb-6 text-3xl`}
                  >
                    View Feedback Details
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Customer Name
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={
                      feedback?.isAnonymous
                        ? anonymizeName(feedback?.name)
                        : feedback?.name
                    }
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Mobile Number
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 `}
                    autoCapitalize="none"
                    value={feedback?.contact_number}
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Email
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={feedback?.email}
                    editable={false}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Feedback Description
                  </Text>
                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                      borderColor,
                    }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2`}
                    placeholder="Add Ingredients Here..."
                    multiline={true}
                    value={feedback?.description}
                    editable={false}
                  />
                </ScrollView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
