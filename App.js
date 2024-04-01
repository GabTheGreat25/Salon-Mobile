import React from "react";
import { store, persistor } from "./src/state/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import Main from "./Main";

export default function () {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Main />
          <Toast />
        </PersistGate>
      </Provider>
    </>
  );
}
