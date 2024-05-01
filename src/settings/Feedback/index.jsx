import {React, useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Image,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { TextInputMask } from "react-native-masked-text";
import { LoadingScreen } from "@components";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { useAddFeedbackMutation } from "../../state/api/reducer";
import { useIsFocused } from "@react-navigation/native";
import LogoImage from "@assets/salon-logo.png";

export default function () {
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth?.user);
  const isFocused = useIsFocused();

  const { textColor, backgroundColor, borderColor, colorScheme } =
    changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePhoneNumberChange = (event) => {
    let phoneNumber = event.nativeEvent.text.replace(/[-\s]/g, "");
    phoneNumber = phoneNumber.substring(0, 11);
    // formik.setFieldValue("contact_number", phoneNumber);
  };

  const[addFeedback, { isLoading }, refetch] = useAddFeedbackMutation();

  const formik = useFormik({
    initialValues:{
      name: user?.name,
      email: user?.email,
      contact_number: user?.contact_number,
      description:"",
      isAnonymous: false,
    },
    onSubmit: (values) => {
      addFeedback(values)
        .unwrap()
        .then((response) => {
          navigation.navigate("Feedback");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Your Feedback was Successfully Submitted",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Submitting Feedback",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  })

  const [isHidden, setHidden] = useState(false);
  const handleCheckBoxToggle = () => {
    const newValue = !isHidden;
    setHidden(newValue);
    formik.setFieldValue("isAnonymous", newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);


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
              <View className={`relative flex-1 pt-12`}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6`}
                >
                   <Image source={LogoImage} />
                  <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-lg pt-12`}
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
                      className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2`}
                      placeholder="Add Message Here..."
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      multiline={true}
                      onChangeText={formik.handleChange("description")}
                      onBlur={formik.handleBlur("description")}
                      value={formik.values.description}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <Text style={{ color: "red" }}>
                          {formik.errors.description}
                        </Text>
                      )}  

                  <View className={`flex flex-row`}>
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle()}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor,
                          backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded mr-3`}
                      >
                        {isHidden && (
                          <Text
                            style={{ color: textColor }}
                            className={`text-2xl`}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <View className={`flex-row justify-center items-center `}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-2xl font-semibold`}
                      >
                       Make myself Anonymous?
                      </Text>
                    </View>
                  </View>
                  {formik.touched.isAnonymous && formik.errors.isAnonymous && (
                    <Text style={{ color: "red" }}>{formik.errors.isAnonymous}</Text>
                  )}


                  <View className={`my-4 items-center justify-center flex-col`}>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`mb-2 flex justify-center items-center`}>
                        <View
                          className={`py-2 rounded-lg bg-primary-accent w-[175px] ${
                            !formik.isValid ? "opacity-50" : "opacity-100"
                          }`}
                        >
                          <Text
                            className={`font-semibold text-center text-lg`}
                            style={{ color: textColor }}
                          >
                            Submit
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}