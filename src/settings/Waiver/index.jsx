import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { BackIcon } from "@helpers";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { waiverSlice } from "../../state/waiver/waiverReducer";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export default function () {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { textColor, backgroundColor, colorScheme } = changeColor();

  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const [signatureImage, setSignatureImage] = useState(null);

  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSignatureImage(result.assets[0].uri);
    }
  };

  const pickImageFromStorage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSignatureImage(result.assets[0].uri);
    }
  };

  const saveImage = async () => {
    if (signatureImage) {
      let resizedImage = await ImageManipulator.manipulateAsync(
        signatureImage,
        [{ resize: { width: 250 } }],
        { compress: 0.5, format: "png", base64: true }
      );

      const base64Data = `data:image/png;base64,${resizedImage.base64}`;
      dispatch(waiverSlice.actions.waiverForm(base64Data));
      navigation.goBack();
    }
  };

  const removeImage = () => {
    setSignatureImage(null);
    dispatch(waiverSlice.actions.resetWaiver());
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          className={`mt-12`}
          style={{
            backgroundColor,
          }}
        >
          <View
            className={`justify-center rounded-lg m-6 px-4 pt-4 pb-10`}
            style={{
              backgroundColor: "#FDA7DF",
            }}
          >
            <Text
              className={`text-2xl text-center font-semibold py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Salon Waiver Agreement
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              I, acknowledge that I am voluntarily receiving services from
              Lhanlee Beauty Lounge, located at 22 Calleja Steet Central Signal
              Village 1630 Taguig, Philippines. Before proceeding with the
              services, I have read and understood the terms of this waiver
              agreement.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              {`Salon's Limited Liability:\nI understand and agree that Lhanlee Beauty Lounge and its staff are not liable for any injuries, damages, or losses that may occur during or as a result of the services provided. This includes but is not limited to allergic reactions, skin irritations, or injuries resulting from negligence. I release Lhanlee Beauty Lounge and its staff from any liability arising from the services rendered.`}
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              {`Assumption of Risk:\nI acknowledge that salon services may involve inherent risks, including but not limited to chemical exposure, burns, or other injuries. I voluntarily assume all risks associated with receiving salon services and waive any claims against Lhanlee Beauty Lounge and its staff for any injuries or damages incurred. Signature: By signing below, I acknowledge that I have read, understood, and agree to the terms of this waiver agreement. I consent to receive salon services knowing the risks involved.`}
            </Text>
            {!signatureImage && (
              <View
                className={`pt-3 flex-row item-center justify-center flex-wrap gap-x-6`}
              >
                <TouchableOpacity
                  style={{ backgroundColor }}
                  className={`py-2 px-6 rounded-lg`}
                  onPress={pickImageFromCamera}
                >
                  <Text style={{ color: textColor }} className={`text-base`}>
                    Take Picture
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor }}
                  className={`py-2 px-6 rounded-lg`}
                  onPress={pickImageFromStorage}
                >
                  <Text style={{ color: textColor }} className={`text-base`}>
                    Select Image
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {signatureImage && (
              <View className={`items-center justify-center`}>
                <Image
                  source={{ uri: signatureImage }}
                  style={{ width: 250, height: 100 }}
                  className={`rounded-lg pb-1`}
                />
              </View>
            )}
            {signatureImage && (
              <View
                className={`pt-3 flex-row item-center justify-center flex-wrap gap-x-6`}
              >
                <TouchableOpacity
                  style={{ backgroundColor }}
                  className={`py-2 px-6 rounded-lg`}
                  onPress={saveImage}
                  disabled={!signatureImage}
                >
                  <Text style={{ color: textColor }} className={`text-base`}>
                    Save Image
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor }}
                  className={`py-2 px-[15px] rounded-lg`}
                  onPress={removeImage}
                  disabled={!signatureImage}
                >
                  <Text style={{ color: textColor }} className={`text-base`}>
                    Remove Image
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
