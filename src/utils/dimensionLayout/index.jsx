import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

export default function () {
  const [dimensionLayout, setDimensionLayout] = useState(
    Dimensions.get("window").height > Dimensions.get("window").width
  );

  useEffect(() => {
    const updateLayout = () => {
      setDimensionLayout(
        Dimensions.get("window").height > Dimensions.get("window").width
      );
    };

    const dimensionListener = Dimensions.addEventListener(
      "change",
      updateLayout
    );

    return () => {
      dimensionListener.remove();
    };
  }, []);

  return dimensionLayout;
}
