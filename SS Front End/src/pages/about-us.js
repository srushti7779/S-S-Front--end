import Image from "next/image";
import React from "react";
import AccountingImage from "../assests/images/Accounting.png";
import PhonesImage from "../assests/images/Phones.png";
import ShareImage from "../assests/images/Share.png";
import SigningImage from "../assests/images/Signing.png";

const AboutUs = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-6 py-20 px-10 xl:px-0">
      <h1 className="font-bold text-4xl text-black text-center">About us</h1>
      <div className="text-base text-black font-normal flex flex-col gap-8">
        <p>
          Store and Share Vault is an Amazon Web Services S3 encrypted
          application created as a safe space for individuals to store online
          account logins, documents, files, photos and videos of any size and
          share them with family member and loved ones should anything happen to
          them.
        </p>
        <p>
          Store and Share Vault helps to protect your family and loved ones from
          additional challenges by providing them access to your accounts,
          information and documents you choose to upload utilizing the S&S
          Vault. The automated forms we provide within the App will assist you
          in documenting, saving, and managing login information for bank
          account, merchant accounts, loans, credit cards, and more.
        </p>
        <p>
          S&S Vault users will also have access to important personal and family
          services such as Financial Literacy, Entrepreneurship, Estate
          Planning, Mental Health Services, Substance Abuse and other services
          needed to foster personal and family growth.
        </p>
        <div className="w-full h-full min-h-[800px] md:min-h-[400px] grid md:grid-cols-[48%_48%] mx-auto gap-6">
          <div className="grid grid-rows-[48%_48%] gap-6">
            <div className="relative">
              <Image
                src={PhonesImage}
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                alt="phone-image"
                fill
              />
            </div>
            <div className="grid grid-cols-[35%_62%] gap-6">
              <div className="relative">
                <Image
                  src={SigningImage}
                  className="rounded-lg"
                  style={{ objectFit: "cover" }}
                  alt="signing-image"
                  fill
                />
              </div>
              <div className="relative h-2/3">
                <Image
                  src={AccountingImage}
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                  alt="accounting-image"
                  fill
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src={ShareImage}
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              alt="share-image"
              fill
            />
          </div>
        </div>
        <p>
          Store and Share Vault is a highly secured location created for
          personal use to provide a secure central location for storing and
          sharing confidential account login information and documents in case
          there is ever a need for access due to unavailability of the Prime
          Account holder.
        </p>
        <p>
          Store and Share Vault users will also have access to important
          personal and family services such as Financial Literacy,
          Entrepreneurship, Estate Planning, Mental Health Services, Substance
          Abuse and other services needed to foster personal and family growth.
          Users will have access to all of these services at no additional cost
          to them.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
