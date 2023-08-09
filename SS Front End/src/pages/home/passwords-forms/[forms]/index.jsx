import { useRouter } from "next/router";
import React from "react";
import CreditCardForm from "@/components/passwordTypeFoms/CreditCard";
import LoanAccountForm from "@/components/passwordTypeFoms/LoanAccount";
import MerchantAccountForm from "@/components/passwordTypeFoms/MerchantAccount";
import MiscAccountForm from "@/components/passwordTypeFoms/MiscAccount";
import NonBankingPasswordForm from "@/components/passwordTypeFoms/NonBankingPasswordAccount";
import RecipeForm from "@/components/passwordTypeFoms/RecipeAccount";
import BankAccountForm from "@/components/passwordTypeFoms/BankAccount";

const PasswordTypeForms = () => {
  const { query } = useRouter();
  const formType = query.forms;
  const renderForm = () => {
    switch (formType) {
      case "loan-account":
        return <LoanAccountForm formType={formType} />;
      case "password-non-bank":
        return <NonBankingPasswordForm formType={formType} />;
      case "credit-card":
        return <CreditCardForm formType={formType} />;
      case "misc-password":
        return <MiscAccountForm formType={formType} />;
      case "bank-password":
        return <BankAccountForm formType={formType} />;
      case "merchant-account":
        return <MerchantAccountForm formType={formType} />;
      case "recipe-account":
        return <RecipeForm formType={formType} />;
      default:
        break;
    }
  };
  return <div>{renderForm()}</div>;
};

export default PasswordTypeForms;
