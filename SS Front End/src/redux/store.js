import { configureStore } from "@reduxjs/toolkit";
import userAuth from "./slices/authSlice";
import folderSlice from "./slices/folderSlice";
import fileSlice from "./slices/fileSlice";
import passwordFormSlice from "./slices/passwordTypeFormSlice";
import buddiesSlice from "./slices/buddiesSlice";
import permissionSlice from "./slices/permissionSlice";
import notificationSlice from "./slices/notification";
import verificationSlice from "./slices/verificationSlice";
import paymentSlice from "./slices/paymentSlice";

export const store = configureStore({
  reducer: {
    userAuth,
    folderSlice,
    fileSlice,
    passwordFormSlice,
    buddiesSlice,
    permissionSlice,
    notificationSlice,
    verificationSlice,
    paymentSlice,
  },
});
