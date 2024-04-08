import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import { useSelector, useDispatch } from "react-redux";
import { transactionSlice } from "../../state/transaction/transactionReducer";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";

const windowWidth = Dimensions.get("window").width;

export default function () {
  const selectedPayment = useSelector(
    (state) => state?.transaction?.transactionData?.payment
  );
  const selectedCustomerType = useSelector(
    (state) => state?.transaction?.transactionData?.customerType
  );
  const image = useSelector(
    (state) => state?.transaction?.transactionData?.image
  );

  const dispatch = useDispatch();
  const { textColor, backgroundColor, borderColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const [isCashChecked, setCashChecked] = useState(
    selectedPayment === "Cash" || false
  );
  const [isGcashChecked, setGcashChecked] = useState(
    selectedPayment === "Maya" || false
  );

  const [isPwdChecked, setPwdChecked] = useState(
    selectedCustomerType === "Pwd" || false
  );
  const [isSeniorChecked, setSeniorChecked] = useState(
    selectedCustomerType === "Senior" || false
  );

  const [selectedImages, setSelectedImages] = useState(image || []);

  const handlePayment = (paymentType) => {
    if (paymentType === "Cash") {
      setCashChecked(!isCashChecked);
      setGcashChecked(false);
    } else if (paymentType === "Maya") {
      setGcashChecked(!isGcashChecked);
      setCashChecked(false);
    }
  };

  const handleType = (customerType) => {
    if (customerType === "Pwd") {
      if (isPwdChecked) {
        setPwdChecked(false);
        if (!isSeniorChecked) {
          dispatch(transactionSlice.actions.setType(""));
          dispatch(transactionSlice.actions.setImage([]));
          setSelectedImages([]);
        }
      } else {
        setPwdChecked(true);
        setSeniorChecked(false);
      }
    } else if (customerType === "Senior") {
      if (isSeniorChecked) {
        setSeniorChecked(false);
        if (!isPwdChecked) {
          dispatch(transactionSlice.actions.setType(""));
          dispatch(transactionSlice.actions.setImage([]));
          setSelectedImages([]);
        }
      } else {
        setSeniorChecked(true);
        setPwdChecked(false);
      }
    }
  };

  const handlePress = async () => {
    if ((isPwdChecked || isSeniorChecked) && selectedImages.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please upload an image when selecting PWD or Senior Citizen",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (selectedImages.some((img) => img === undefined || img === null)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2:
          "The images are corrupted. Please upload a new one and try again.",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (isCashChecked) {
      dispatch(transactionSlice.actions.setPayment("Cash"));
    } else if (isGcashChecked) {
      dispatch(transactionSlice.actions.setPayment("Maya"));
    }

    if (isPwdChecked) {
      dispatch(transactionSlice.actions.setType("Pwd"));
    } else if (isSeniorChecked) {
      dispatch(transactionSlice.actions.setType("Senior"));
    } else dispatch(transactionSlice.actions.setType("Customer"));

    const imageURIs = selectedImages.map((image) => image.uri);
    dispatch(transactionSlice.actions.setImage(imageURIs));

    navigation.navigate("Checkout");
  };

  const takePicture = async () => {
    if (image) {
      setSelectedImages([]);
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0];

      const manipulatorOptions = {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      };

      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          newImage.uri,
          [],
          manipulatorOptions
        );

        if (manipulatedImage) {
          setSelectedImages([manipulatedImage]);
        }
      } catch (error) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error Adding Image",
          text2: `${error}`,
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    }
  };

  const selectImages = async () => {
    if (image) {
      setSelectedImages([]);
    }

    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 2],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!results.canceled) {
      const selectedAssets = results.assets;

      const manipulatorOptions = {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      };

      const newImages = [];

      for (const selectedAsset of selectedAssets) {
        try {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            selectedAsset.uri,
            [],
            manipulatorOptions
          );

          if (manipulatedImage) {
            newImages.push(manipulatedImage);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Adding Image",
            text2: `${error}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      }

      setSelectedImages([...newImages]);
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <View
          style={{
            backgroundColor,
          }}
          className={`px-3 flex-1 flex-col pt-16`}
        >
          <View
            style={{
              height: 150,
              width: windowWidth * 0.925,
            }}
            className={`mx-1 px-4 pt-4 mb-2 bg-primary-default rounded-lg`}
          >
            <View className={`flex-row`}>
              <TouchableOpacity
                className={`flex-row px-4 py-2`}
                onPress={() => handlePayment("Cash")}
              >
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderColor,
                    backgroundColor: invertBackgroundColor,
                  }}
                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                >
                  {isCashChecked && (
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-2xl`}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <View className={`justify-start items-start`}>
                <View className={`pt-2`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-3xl font-semibold`}
                  >
                    Cash
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: invertTextColor,
                borderBottomWidth: 1,
                marginTop: 5,
              }}
            />
            <View className={`flex-row pt-2`}>
              <TouchableOpacity
                className={`flex-row px-4 py-2`}
                onPress={() => handlePayment("Maya")}
              >
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderColor,
                    backgroundColor: invertBackgroundColor,
                  }}
                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                >
                  {isGcashChecked && (
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-2xl`}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <View className={`justify-start items-start`}>
                <View className={`pt-2`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-3xl font-semibold`}
                  >
                    Maya
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              height: 150,
              width: windowWidth * 0.925,
            }}
            className={`mx-1 px-4 pt-4 my-2 bg-primary-default rounded-lg`}
          >
            <View className={`flex-row`}>
              <TouchableOpacity
                className={`flex-row px-4 py-2`}
                onPress={() => handleType("Pwd")}
              >
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderColor,
                    backgroundColor: invertBackgroundColor,
                  }}
                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                >
                  {isPwdChecked && (
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-2xl`}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <View className={`justify-start items-start`}>
                <View className={`pt-2`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-3xl font-semibold`}
                  >
                    Pwd
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: invertTextColor,
                borderBottomWidth: 1,
                marginTop: 5,
              }}
            />
            <View className={`flex-row pt-2`}>
              <TouchableOpacity
                className={`flex-row px-4 py-2`}
                onPress={() => handleType("Senior")}
              >
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderColor,
                    backgroundColor: invertBackgroundColor,
                  }}
                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                >
                  {isSeniorChecked && (
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-2xl`}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <View className={`justify-start items-start`}>
                <View className={`pt-2`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-3xl font-semibold`}
                  >
                    Senior
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {isPwdChecked || isSeniorChecked ? (
            <>
              <View
                style={{
                  height: 100,
                  width: windowWidth * 0.925,
                }}
                className={`mx-1 px-4 pt-4 my-2 bg-primary-default rounded-lg`}
              >
                <Text
                  style={{ color: textColor, borderColor }}
                  className={`font-semibold text-xl`}
                >
                  Upload Your Image
                </Text>
                <View className={`flex-row gap-x-2 mt-2 mb-6`}>
                  <TouchableOpacity onPress={takePicture}>
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      Take a Picture
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={selectImages}>
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      Select Images
                    </Text>
                  </TouchableOpacity>
                  {selectedImages?.length > 0 ? (
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      Add {selectedImages.length} image
                      {selectedImages.length > 1 ? "s" : ""}
                    </Text>
                  ) : (
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      No Image
                    </Text>
                  )}
                </View>
              </View>
            </>
          ) : null}
        </View>
        <View
          style={{
            shadowColor,
            backgroundColor,
            height: 90,
            width: windowWidth,
          }}
          className={`flex-col px-10 py-5 shadow-2xl`}
        >
          <TouchableOpacity onPress={handlePress}>
            <View
              style={{
                backgroundColor: invertBackgroundColor,
              }}
              className={`justify-center items-center rounded-md py-2`}
            >
              <Text
                style={{ color: invertTextColor }}
                className={`text-center text-lg font-bold`}
              >
                Confirm
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
