import React from "react";
import { store } from "./src/state/store";
import { Provider } from "react-redux";
import Main from "./Main";

export default function () {
  return (
    <>
    <Provider store={store}>
      <Main />
    </Provider>
    </>
  );
}