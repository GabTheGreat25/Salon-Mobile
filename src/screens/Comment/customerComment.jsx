import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useGetCommentsQuery } from "../../state/api/reducer";
import { useFormik } from "formik";
import { LoadingScreen } from "@components";
import { useSelector, useDispatch } from "react-redux";
import noPhoto from "@assets/no-photo.jpg";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const isFocused = useIsFocused();

  const auth = useSelector((state) => state.auth.user);

  const { data, isLoading, refetch } = useGetCommentsQuery();
  const comments = data?.details || [];

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const filteredComments = comments.filter((comment) => {
    const appointmentCustomerID =
      comment?.transaction?.appointment?.customer?._id;
    const authID = auth?._id;
    return appointmentCustomerID === authID;
  });

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
          <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              style={{
                backgroundColor,
              }}
              className={`px-3 flex-1 mt-4`}
            >
              <ScrollView
                decelerationRate="fast"
                scrollEventThrottle={1}
                showsVerticalScrollIndicator={false}
              >
                {filteredComments.map((comment) => (
                  <View
                    key={comment?._id}
                    style={{
                      backgroundColor: invertBackgroundColor,
                      height: windowHeight * 0.6,
                      width: windowWidth * 0.925,
                    }}
                    className={`flex-col items-start justify-start rounded-2xl mx-1 px-4 mb-2`}
                  >
                    <View className={`flex-col pt-4 self-center`}>
                      {comment?.transaction.appointment.service.map(
                        (comment, index) => (
                          <Image
                            key={index}
                            source={{
                              uri:
                                comment?.image && comment?.image.length
                                  ? comment?.image[
                                      Math.floor(
                                        Math.random() * comment?.image?.length
                                      )
                                    ]?.url
                                  : noPhoto,
                            }}
                            resizeMode="cover"
                            className={`h-[150px] w-[300px]`}
                          />
                        )
                      )}
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-center text-lg font-semibold pt-4`}
                      >
                        {`Date: ${
                          comment?.transaction?.appointment?.date
                            ? new Date(comment?.transaction.appointment.date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        } at ${
                          comment?.transaction?.appointment?.time?.length > 0
                            ? comment?.transaction.appointment.time.length === 1
                              ? `${comment?.transaction?.appointment?.time[0]}`
                              : `${
                                  comment?.transaction?.appointment?.time[0]
                                } to ${
                                  comment?.transaction?.appointment?.time[
                                    comment?.transaction?.appointment?.time
                                      .length - 1
                                  ]
                                }`
                            : ""
                        }`}
                      </Text>
                    </View>
                    <View className={`flex-col pt-2`}>
                      <View className="flex flex-row">
                        <Text
                          style={{ color: invertTextColor }}
                          className="text-lg font-semibold"
                        >
                          Ratings:{" "}
                        </Text>
                        {Array.from(
                          { length: comment?.ratings },
                          (_, index) => (
                            <Feather
                              key={index}
                              name="star"
                              color="#feca57"
                              size={30}
                            />
                          )
                        )}
                        {Array.from(
                          { length: 5 - comment?.ratings },
                          (_, index) => (
                            <Feather
                              key={`empty-${index}`}
                              name="star"
                              color={
                                colorScheme === "dark" ? "#212B36" : "#e5e5e5"
                              }
                              size={30}
                            />
                          )
                        )}
                      </View>
                      <View className={`pt-1`}>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-semibold`}
                        >
                          Description:{" "}
                          {comment?.description.length > 25
                            ? comment?.description.substring(0, 25) + "..."
                            : comment?.description}
                        </Text>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-semibold`}
                        >
                          Description:{" "}
                          {comment?.suggestion.length > 25
                            ? comment?.suggestion.substring(0, 25) + "..."
                            : comment?.suggestion}
                        </Text>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-semibold`}
                        >
                          Beautician:{" "}
                          {comment?.transaction?.appointment?.beautician
                            ?.map((beautician) => beautician?.name)
                            .join(", ")
                            .slice(0, 25) +
                            (comment?.transaction?.appointment?.beautician
                              ?.length > 0 &&
                            comment?.transaction?.appointment?.beautician
                              ?.length > 25
                              ? "..."
                              : "")}
                        </Text>
                      </View>
                      <View className={`mt-6 gap-x-2 flex-row mx-1`}>
                        <TouchableOpacity
                          className={`px-4 py-2 rounded-lg bg-primary-accent`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-lg font-semibold`}
                          >
                            Edit Comment
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className={`px-4 py-2 rounded-lg bg-secondary-accent`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-lg font-semibold`}
                          >
                            Delete Comment
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
