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
                    View Leave Details
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Beautician Name
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={schedule?.beautician?.name}
                    editable={false}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Leave Date
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={
                      schedule?.date
                        ? new Date(schedule.date).toISOString().split("T")[0]
                        : ""
                    }
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Leave Status
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={schedule?.status}
                    editable={false}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Leave Note
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={
                      schedule?.leaveNote || "The Status Is Currently Absent"
                    }
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
