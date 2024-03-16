import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { changeColor, dimensionLayout } from "@utils";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();

  const navigation = useNavigation();

  const terms = () => {
    navigation.navigate("TermsCondition");
  };

  const policy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const feedback = () => {
    navigation.navigate("Feedback");
  };

  return (
    <>
      <ScrollView
        className={`flex-1`}
        style={{
          backgroundColor,
        }}
      >
        <SafeAreaView className={`m-2.5`}>
          <Text
            className={`text-lg font-bold`}
            style={{
              color: textColor,
            }}
          >
            How can we help?
          </Text>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              My Schedule
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Support Request
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              My Account
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Payment
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Get help with my pay
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Safety Concerns
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              How to become a Employee
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              How to become a Supporter
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
            onPress={terms}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Terms & Conditions
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
            onPress={policy}
            style={{
              color: textColor,
            }}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Privacy Policy
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Refund
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Security
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
            onPress={feedback}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Feedback
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              My Inquries
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-sm`}
              style={{
                color: textColor,
              }}
            >
              Privacy Problem
            </Text>
            <MaterialCommunityIcons
              name="greater-than"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
