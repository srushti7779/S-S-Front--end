import React from "react";

const HowItWorks = () => {
  return (
    <div className="w-full max-w-screen-xl py-36 mx-auto flex flex-col gap-20">
      <h1 className="text-black text-3xl text-center font-bold">
        How it Works
      </h1>
      <ul className="list-decimal flex flex-col gap-8 text-black text-base">
        <li>
          Store and Share Vault is designed to allow a Prime Account Holder to
          create a storage account and share the contents of the account with up
          to (4) Buddies.
        </li>
        <li>
          The Prime Account Holder will determine what information each
          individual Buddy will have access to. The Prime Account Holder has the
          ability to grant immediate access or time released access of this
          information to their Buddies.
        </li>
        <li>
          Store and Share Vault helps to protect your family and loved ones from
          additional challenges by providing them access to all of your personal
          confidential accounts, information and documents you choose to upload
          utilizing the Store and Share Vault. We provide automated forms in the
          App that will assist you in documenting, saving, and managing login
          information for bank accounts, merchant accounts, loans, credit cards,
          and more.
        </li>
      </ul>
    </div>
  );
};

export default HowItWorks;
