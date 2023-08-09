import Cookies from "js-cookie";

export const getAccessToken = () => {
  return Cookies.get("token");
};

export const setUserToken = (token) => {
  localStorage.setItem("token", token);
  Cookies.set("token", token);
};

export const removeUserToken = () => {
  localStorage.removeItem("token");
  Cookies.remove("token");
  localStorage.removeItem("profile");
};

export const truncateString = (string, to = 15) => {
  let str = string;
  if (str.length > to) {
    let substr = str.split(".");
    str = str.slice(0, to - 5) + "..." + substr[substr.length - 1];
  }
  return str;
};

export const PERMISSION_FORM_TYPE_ENUMS = {
  BANK_ACCOUNT_FORM_TYPE_ENUM: "bank-account",
  CREDIT_CARD_FORM_TYPE_ENUM: "credit-card",
  LOAN_ACCOUNT_FORM_TYPE_ENUM: "loan-account",
  MERCHANT_ACCOUNT_FORM_TYPE_ENUM: "merchant-account",
  MISC_PASSWORD_FORM_TYPE_ENUM: "misc-password",
  PASSWORD_STORAGE_FORM_TYPE_ENUM: "password-storage",
  RECIPE_FORM_TYPE_ENUM: "recipe-storage",
};

export const PLANS_PRODUCTS = [
  {
    planName: "Basic Plan",
    title: "BASIC",
    timePeriod: "Monthly",
    id: "price_1NT9dvEgMk0fYPeIkVTXLLax",
    storage: "5",
    buddies: "4",
    amount: "6.99",
  },
  {
    planName: "Basic Plan",
    title: "BASIC",
    timePeriod: "Yearly",
    storage: "5",
    buddies: "4",
    id: "price_1NT9f2EgMk0fYPeIHVAwjgpj",
    amount: "71.88",
  },
  {
    planName: "Standard Plan",
    title: "STANDARD",
    timePeriod: "Monthly",
    storage: "10",
    buddies: "10",
    id: "price_1NT9foEgMk0fYPeIGzdr0b4N",
    amount: "9.99",
  },
  {
    planName: "Standard Plan",
    title: "STANDARD",
    timePeriod: "Yearly",
    storage: "10",
    buddies: "10",
    id: "price_1NT9gZEgMk0fYPeIJbkxvkNQ",
    amount: "95.00",
  },
  {
    planName: "Premium Plan",
    title: "PREMIUM",
    timePeriod: "Monthly",
    storage: "10",
    buddies: "15",
    id: "price_1NT9hNEgMk0fYPeIupxHwQJw",
    amount: "14.99",
  },
  {
    planName: "Premium Plan",
    title: "PREMIUM",
    timePeriod: "Yearly",
    storage: "10",
    buddies: "15",
    id: "price_1NT9htEgMk0fYPeImyaNExAv",
    amount: "125.00",
  },
];

export const convertPaymentCurrency = (price) => {
  const payment = `$ ${price / 100}`;

  return payment;
};
