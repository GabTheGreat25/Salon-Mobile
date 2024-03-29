import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
} from "react-native";
import {
  useGetServiceByIdQuery,
  useGetCommentsQuery,
  useGetOptionsQuery,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { appointmentSlice } from "../../state/appointment/appointmentReducer";
import { useDispatch } from "react-redux";

const windowWidth = Dimensions.get("window").width;

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetServiceByIdQuery(id);

  const service = data?.details;

  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: commentsRefetch,
  } = useGetCommentsQuery();
  const comments = commentsData?.details || [];
  const [selectedStars, setSelectedStars] = useState(5);

  const {
    data: optionsData,
    isLoading: exclusionsLoading,
    refetch: exclusionsRefetch,
  } = useGetOptionsQuery();
  const options = optionsData?.details || [];

  const filteredOptions = options.filter((option) =>
    option.service.some((service) => service._id === id)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
      commentsRefetch();
      exclusionsRefetch();
    };
    fetchData();
  }, [isFocused]);

  const serviceComments = comments.filter((comment) =>
    comment.transaction?.appointment?.service.some((s) => s._id === id)
  );

  const ratings = serviceComments.flatMap((comment) => comment.ratings);
  const count = ratings?.length;
  const averageRating =
    count > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / count : 0;

  const {
    service_name,
    description,
    duration,
    type,
    occassion,
    warranty,
    price,
    image,
    product,
  } = service || {};

  const randomizedImages = image?.length
    ? image[Math.floor(Math.random() * image?.length)].url
    : null;

  const filteredServiceComments =
    selectedStars !== null
      ? serviceComments.filter((comment) => comment.ratings === selectedStars)
      : serviceComments;

  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (optionId) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else setSelectedOptions([...selectedOptions, optionId]);
  };

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const reverseBackgroundColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleViewModal = (option) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePress = (selectedProduct) => {
    const optionNames = selectedOptions.map(
      (optionId) =>
        options.find((option) => option._id === optionId)?.option_name || ""
    );
    const extraFee = selectedOptions.reduce(
      (sum, optionId) =>
        sum +
        (options.find((option) => option._id === optionId)?.extraFee || 0),
      0
    );

    const perPrices = selectedOptions.map((optionId) => {
      const option = options.find((option) => option._id === optionId);
      return option ? option.extraFee : 0;
    });

    dispatch(
      appointmentSlice.actions.setService({
        service_id: selectedProduct?._id || "",
        service_name: selectedProduct?.service_name || "",
        type: selectedProduct?.type || [],
        duration: selectedProduct?.duration || 0,
        description: selectedProduct?.description || "",
        product_name:
          selectedProduct?.product?.map((p) => p.product_name).join(", ") || "",
        price: selectedProduct?.price || 0,
        image: selectedProduct?.image || [],
        option_id: selectedOptions || [],
        option_name: optionNames.join(", "),
        per_price: perPrices || 0,
        extraFee: extraFee || 0,
      })
    );

    setSelectedOptions([]);
  };

  return (
    <>
      {isLoading || commentsLoading || exclusionsLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <SafeAreaView style={{ backgroundColor }} className={`flex-1 pt-6`}>
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              style={{
                backgroundColor,
              }}
              className={`px-3 flex-1 mt-6 mb-4`}
            >
              <View
                style={{
                  backgroundColor: "#FDA7DF",
                  width: windowWidth * 0.925,
                }}
                className={`rounded-2xl p-4 mt-4 mb-2`}
              >
                <View className={`flex-col`}>
                  <View className={`flex-col pt-4 self-center`}>
                    <Image
                      src={randomizedImages}
                      resizeMode="cover"
                      className={`h-[150px] w-[300px]`}
                    />
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-center text-lg font-semibold pt-4`}
                    >
                      Name: {service_name}
                    </Text>
                    <View className={`flex-row items-center justify-center`}>
                      {averageRating > 0 ? (
                        [...Array(Math.floor(averageRating))].map(
                          (_, starIndex) => (
                            <Feather
                              key={starIndex}
                              name="star"
                              color="#feca57"
                              size={30}
                            />
                          )
                        )
                      ) : (
                        <Text
                          style={{ color: invertTextColor }}
                          className="text-lg font-semibold"
                        >
                          No Ratings
                        </Text>
                      )}
                      {averageRating % 1 !== 0 && (
                        <Feather name="star" color="#feca57" size={30} />
                      )}
                      {averageRating > 0 && (
                        <Text
                          style={{ color: invertTextColor }}
                          className="pl-2 text-lg font-semibold"
                        >
                          {averageRating.toFixed(1)} out of 5
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className={`flex-col pt-2`}>
                    <View className={`pt-1`}>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-lg font-semibold`}
                      >
                        Warranty: {warranty}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-lg font-semibold`}
                      >
                        Price: ₱{price}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-lg flex-wrap text-start font-semibold`}
                      >
                        Description: {description}
                      </Text>
                      {occassion !== "None" && (
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg flex-wrap text-start font-semibold`}
                        >
                          Occasion: {occassion}
                        </Text>
                      )}
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-lg font-semibold`}
                      >
                        For: {type.join(", ")}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-lg flex-wrap text-start font-semibold`}
                      >
                        {duration}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-lg font-semibold`}
                      >
                        Products used:{" "}
                        {product?.map((product, index) => (
                          <React.Fragment key={index}>
                            {product?.product_name?.length > 25
                              ? `${product?.product_name.slice(0, 25)}...`
                              : product?.product_name}
                          </React.Fragment>
                        ))}
                      </Text>
                    </View>
                    <View className={`mt-6 items-center justify-center`}>
                      <TouchableOpacity
                        onPress={() => handlePress(service)}
                        className={`px-6 py-2 rounded-lg bg-primary-accent`}
                      >
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-semibold`}
                        >
                          Add Cart
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                style={{
                  width: windowWidth * 0.925,
                }}
                className={`flex-1 my-2`}
              >
                {filteredOptions.map((option) => (
                  <TouchableOpacity
                    key={option._id}
                    style={{
                      backgroundColor: selectedOptions.includes(option._id)
                        ? "#FDB9E5"
                        : "#FDA7DF",
                    }}
                    className={`rounded-lg mr-3 p-4`}
                    onPress={() => toggleOption(option._id)}
                  >
                    <View className={`items-center`}>
                      <Image
                        style={{ width: 100, height: 100 }}
                        className={`rounded-full`}
                        source={{
                          uri:
                            option?.image && option?.image?.length
                              ? option?.image[
                                  Math.floor(
                                    Math.random() * option?.image?.length
                                  )
                                ]?.url
                              : null,
                        }}
                      />
                    </View>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-lg font-semibold`}
                    >
                      {option?.option_name?.length > 10
                        ? `${option?.option_name.slice(0, 10)}...`
                        : option?.option_name}
                    </Text>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-base font-base`}
                    >
                      {option?.description?.length > 10
                        ? `${option.description.slice(0, 10)}...`
                        : option.description}
                    </Text>
                    <View className={`justify-between gap-x-4 flex-row mt-3`}>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-base font-semibold self-end`}
                      >
                        ₱{option.extraFee}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleViewModal(option)}
                        className={`bg-primary-accent rounded-lg`}
                      >
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-base font-semibold py-1 px-4`}
                        >
                          View
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View
                style={{
                  backgroundColor: "#FDA7DF",
                  width: windowWidth * 0.925,
                }}
                className={`rounded-2xl p-4 my-2`}
              >
                <View className={`px-2`}>
                  <View className={`flex-row items-center justify-between`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-xl font-semibold pb-4`}
                    >
                      Service Review
                    </Text>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-xl font-semibold pb-4`}
                    >
                      {averageRating.toFixed(1)} out of 5
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    scrollEventThrottle={1}
                    className={`flex gap-x-3 pb-4`}
                  >
                    <TouchableOpacity
                      key="all"
                      style={{
                        borderColor: borderColor,
                        backgroundColor:
                          selectedStars === null
                            ? reverseBackgroundColor
                            : "transparent",
                      }}
                      className={`border-[1px] py-2 px-6 rounded-lg`}
                      onPress={() => setSelectedStars(null)}
                    >
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold`}
                      >
                        All
                      </Text>
                    </TouchableOpacity>
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <TouchableOpacity
                        key={stars}
                        style={{
                          borderColor: borderColor,
                          backgroundColor:
                            selectedStars === stars
                              ? reverseBackgroundColor
                              : "transparent",
                        }}
                        className={`border-[1px] py-2 px-4 rounded-lg`}
                        onPress={() => setSelectedStars(stars)}
                      >
                        <Text
                          style={{ color: textColor }}
                          className={`text-lg font-semibold`}
                        >
                          {stars} Stars
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {filteredServiceComments?.map((comment) => (
                  <View
                    key={comment._id}
                    style={{
                      backgroundColor,
                    }}
                    className={`rounded-lg p-4`}
                  >
                    <View className={`flex-row gap-x-4`}>
                      <Image
                        source={{
                          uri:
                            comment?.image && comment?.image?.length
                              ? comment?.image[
                                  Math.floor(
                                    Math.random() * comment?.image?.length
                                  )
                                ]?.url
                              : "https://www.nuvali.ph/wp-content/themes/consultix/images/no-image-found-360x250.png",
                        }}
                        style={{ width: 128, height: 128 }}
                        className={`rounded-xl`}
                      />
                      <View>
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl font-semibold pb-2`}
                        >
                          {comment?.isAnonymous
                            ? comment?.transaction?.appointment?.customer?.name.substring(
                                0,
                                2
                              ) +
                              "*****" +
                              comment?.transaction?.appointment?.customer?.name.substring(
                                10
                              )
                            : comment?.transaction?.appointment?.customer?.name
                                .length > 20
                            ? comment?.transaction?.appointment?.customer?.name.substring(
                                0,
                                20
                              ) + "..."
                            : comment?.transaction?.appointment?.customer?.name}
                        </Text>
                        <View className={`flex-row flex-wrap`}>
                          {[...Array(comment.ratings)].map((_, starIndex) => (
                            <Feather
                              key={starIndex}
                              name="star"
                              color="#feca57"
                              size={30}
                            />
                          ))}
                        </View>
                        <Text
                          style={{ color: textColor }}
                          className={`text-base text-justify font-semibold pb-2 flex-wrap`}
                        >
                          {comment?.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View>
              {modalVisible && selectedOption && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={handleCloseModal}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                    className={`items-center justify-center flex-1`}
                  >
                    <View
                      style={{
                        backgroundColor,
                        width: "80%",
                      }}
                      className={`p-4 rounded-lg`}
                    >
                      <Text
                        style={{ color: textColor }}
                        className={`text-2xl font-semibold pb-4`}
                      >
                        Add Ons Details
                      </Text>
                      <View className={`self-center`}>
                        <Image
                          source={{
                            uri:
                              selectedOption?.image &&
                              selectedOption?.image?.length > 0
                                ? selectedOption?.image[
                                    Math.floor(
                                      Math.random() *
                                        selectedOption?.image?.length
                                    )
                                  ]?.url
                                : noPhoto,
                          }}
                          style={{ width: 150, height: 150 }}
                          className={`rounded-full`}
                        />
                      </View>
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold pb-1 pt-4 flex-wrap`}
                      >
                        Name: {selectedOption.option_name}
                      </Text>
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold pb-1 flex-wrap`}
                      >
                        Description: {selectedOption?.description}
                      </Text>
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold pb-1 flex-wrap`}
                      >
                        Price: ₱{selectedOption.extraFee}
                      </Text>
                      <View className={`items-center justify-center pt-4`}>
                        <TouchableOpacity
                          onPress={handleCloseModal}
                          className={`bg-primary-accent rounded-lg`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-xl font-semibold py-2 px-6`}
                          >
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
