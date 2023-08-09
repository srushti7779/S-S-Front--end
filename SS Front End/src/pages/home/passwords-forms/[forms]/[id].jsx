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
  const { id } = query;
  const renderForm = () => {
    switch (formType) {
      case "loan-account":
        return (
          <LoanAccountForm isEdit={id && true} id={id} formType={formType} />
        );
      case "password-non-bank":
        return (
          <NonBankingPasswordForm
            isEdit={id && true}
            id={id}
            formType={formType}
          />
        );
      case "credit-card":
        return (
          <CreditCardForm isEdit={id && true} id={id} formType={formType} />
        );
      case "misc-password":
        return (
          <MiscAccountForm isEdit={id && true} id={id} formType={formType} />
        );
      case "bank-password":
        return (
          <BankAccountForm isEdit={id && true} id={id} formType={formType} />
        );
      case "merchant-account":
        return (
          <MerchantAccountForm
            isEdit={id && true}
            id={id}
            formType={formType}
          />
        );
      case "recipe-account":
        return <RecipeForm isEdit={id && true} id={id} formType={formType} />;
      default:
        break;
    }
  };
  return <div>{renderForm()}</div>;
};

export default PasswordTypeForms;
