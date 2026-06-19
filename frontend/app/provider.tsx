"use client";

import { Provider } from "react-redux";
import { store } from "./store/index"; // Adjust this path to your actual store file
import React from "react";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;