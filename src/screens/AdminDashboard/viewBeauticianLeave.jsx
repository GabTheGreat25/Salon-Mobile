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
import { useGetScheduleByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetScheduleByIdQuery(id);

  const schedule = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, borderColor } = changeColor();

  const datePart = schedule?.date
    ? new Date(schedule?.date).toISOString().split("T")[0]
    : "";

  const leaveDate = `${datePart} `;

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
              className={`relative flex-1`}
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
                    className={`font-semibold text-center pt-12 pb-6 text-3xl`}
                  >
                    Employee's Leave Information
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Employee
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={schedule?.beautician?.name}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Leave's Date
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={leaveDate}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Beautician's Leave Note
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
                    multiline={true}
                    value={schedule?.leaveNote}
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
