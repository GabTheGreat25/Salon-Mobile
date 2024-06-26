import React, { useEffect } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { useGetCommentByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetCommentByIdQuery(id);

  const comment = data?.details;

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
              <KeyboardAvoidingView behavior="height">
              <ScrollView
                showsVerticalScrollIndicator={false}
                className={`m-2`}
              >
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center pb-6 text-3xl`}
                  >
                    View Comment Details
                  </Text>
                  <View className="items-center justify-center pb-6">
                    <Image
                      key={
                        data?.details?.image[
                          Math.floor(
                            Math.random() * data?.details?.image?.length
                          )
                        ]?.public_id
                      }
                      source={{
                        uri: data?.details?.image[
                          Math.floor(
                            Math.random() * data?.details?.image?.length
                          )
                        ]?.url,
                      }}
                      className={`rounded-full w-60 h-60`}
                      resizeMode="cover"
                    />
                  </View>
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
                      comment?.isAnonymous
                        ? anonymizeName(
                            comment?.transaction?.appointment?.customer?.name
                          )
                        : comment?.transaction?.appointment?.customer?.name
                    }
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Comment Description
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
                    value={comment?.description}
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Comment Suggestion
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
                    value={comment?.suggestion}
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Ratings
                  </Text>
                  <Text style={{ color: textColor }}>
                    {Array.from(
                      {
                        length: Math.min(
                          5,
                          Math.max(0, Math.floor(comment?.ratings))
                        ),
                      },
                      (_, index) => (
                        <Feather
                          key={index}
                          name={
                            index < Math.floor(comment?.ratings)
                              ? "star"
                              : "star-outline"
                          }
                          size={40}
                          color="#feca57"
                        />
                      )
                    )}
                  </Text>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
