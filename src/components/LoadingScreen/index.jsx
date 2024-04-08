import React from "react";
import { View, Image, Animated } from "react-native";
import LogoImage from "@assets/salon-logo.png";

class PulseAnimation extends React.Component {
  constructor() {
    super();
    this.state = {
      opacityValue: new Animated.Value(1),
    };
  }

  componentDidMount() {
    this.startPulseAnimation();
  }

  startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.opacityValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.opacityValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  render() {
    const { opacityValue } = this.state;

    return (
      <>
        <Animated.View style={{ opacity: opacityValue }}>
          {this.props.children}
        </Animated.View>
      </>
    );
  }
}

export default function () {
  return (
    <>
      <View className={`flex-1 justify-center items-center bg-primary-default`}>
        <PulseAnimation>
          <Image source={LogoImage} />
        </PulseAnimation>
      </View>
    </>
  );
}
