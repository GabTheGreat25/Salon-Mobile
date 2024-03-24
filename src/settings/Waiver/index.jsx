import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { BackIcon } from "@helpers";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { waiverSlice } from "../../state/waiver/waiverReducer";
import SignatureScreen from "react-native-signature-canvas";

export default function () {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { textColor, backgroundColor, colorScheme } = changeColor();

  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const ref = useRef();
  const [clearCalled, setClearCalled] = useState(false);
  const [show, setShow] = useState(false);
  const [signatureProvided, setSignatureProvided] = useState(false);
  const showSignature = () => setShow(true);

  const handleSignature = (signature) => {
    setShow(false);
    setSignatureProvided(true);
    dispatch(waiverSlice.actions.waiverForm(signature));
    navigation.navigate("SignUpCustomer");
  };

  const handleClear = () => {
    if (!clearCalled) {
      setClearCalled(true);
      ref.current?.clearSignature();
      dispatch(waiverSlice.actions.resetWaiver());
    }
  };

  useEffect(() => {
    let timeoutId;
    if (clearCalled) {
      timeoutId = setTimeout(() => {
        setClearCalled(false);
      }, 500);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [clearCalled]);

  const handleEnd = () => {
    if (!signatureProvided) {
      return;
    }
    ref.current.readSignature();
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
            {show && (
              <Modal animationType="slide">
                <View
                  className={`flex-1 relative top-[200px] rounded-lg px-4 `}
                >
                  <SignatureScreen
                    ref={ref}
                    onEnd={handleEnd}
                    onOK={handleSignature}
                    onClear={handleClear}
                    backgroundColor="#FDA7DF"
                  />
                </View>
              </Modal>
            )}
            <View
              className={` pt-3 flex-row justify-center items-center gap-x-6`}
            >
              <TouchableOpacity
                style={{ backgroundColor }}
                className={`py-2 px-6 rounded-lg`}
                onPress={showSignature}
              >
                <Text style={{ color: textColor }} className={`text-lg`}>
                  Add signature
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
