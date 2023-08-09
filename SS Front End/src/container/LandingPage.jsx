import SSButton from "@/components/form/SSButton";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import HomeImage from "../assests/images/homeScreen.png";
import PackagesImage from "../assests/images/Packages.png";
import CreateYourOwnImage from "../assests/images/create-your-own.png";

const LandingPage = () => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col justify-center items-center bg-[#fafafa] ">
      <div className="flex flex-col justify-center items-center gap-5 text-center p-6 sm:mx-[100px] sm:my-[50px] ">
        <div className="font-bold text-2xl md:text-4xl lg:text-6xl">
          Protecting Your Peace of Mind
        </div>
        <div className="text-[#02271480] font-medium text-sm md:text-base lg:text-xl">
          Store and Share Vault is an encrypted cloud based software created as
          a safe space for individuals to store all personal and sensitive
          information and have the ability to share them with a loved one in the
          event that something happens to them.
        </div>
        <div>
          <SSButton
            isLoading={false}
            onClick={() => router.push("/about-us")}
            className="p-3 w-full sm:w-[171px] sm:h-[56px] rounded-[10px] sm:text-lg font-semibold border border-[rgba(0, 0, 0, 0.05)]"
          >
            Explore Now
          </SSButton>
        </div>
      </div>
      <div className="max-w-[1440px] my-5 mx-auto border-[17px] border-white rounded-[15px] p-4 bg-[#F4F4F4] shadow-drop-shadow-md">
        <Image priority src={HomeImage} alt="home-image" />
      </div>

      {/* About Section */}
      <div className="flex flex-col xl:grid xl:grid-cols-[45%_55%] w-full max-w-screen-2xl mx-auto p-6 sm:p-20 overflow-hidden">
        <div className="flex flex-col gap-5">
          <h1 className="font-semibold ttext-2xl md:text-4xl lg:text-6xl text-black">
            About Us
          </h1>
          <p className="text-base font-normal text-black">
            Store and Share Vault is an Amazon Web Services S3 encrypted
            application created as a safe space for individuals to store online
            account logins, documents, files, photos and videos of any size and
            share them with family member and loved ones should anything happen
            to them.
            <br /> <br /> Store and Share Vault is designed for a Prime Account
            Holder who will be able to add any personal account requiring login
            and documents they choose and share them with up to (4) individuals
            who will be designated as Buddies. The Prime Account Holder will
            determine what information each individual Buddy will have access
            to. The Buddy Account Holders with granted access by the Prime
            Account Holder will have timed access or immediate access to this
            information.
            <br /> <br /> Store and Share Vault helps to protect your family and
            loved ones from additional challenges by providing them access to
            all your personal confidential accounts, information and documents
            you choose to upload utilizing the Store and Share Vault. The
            automated forms we provide within the App will assist you in
            documenting, saving, and managing login information for bank
            account, merchant accounts, loans, credit cards, and more. <br />{" "}
            <br />
            Store and Share Vault is a highly secured location created for
            personal use to provide a secure central location for storing and
            sharing confidential account login information and documents in case
            there is ever a need for access due to unavailability of the Prime
            Account holder.
            <br /> <br /> Store and Share Vault users will also have access to
            important personal and family services such as Financial Literacy,
            Entrepreneurship, Estate Planning, Mental Health Services, Substance
            Abuse and other services needed to foster personal and family
            growth. Users will have access to all of these services at no
            additional cost to them.
          </p>
        </div>
        <div className="relative w-full h-[300px] sm:h-[500px] xl:h-auto">
          <div className="absolute w-60 h-52 sm:w-80 sm:h-64 md:w-[500px] md:h-[350px] matrixHome top-20 sm:left-8 sm:top-[100px] md:left-[50px] md:top-[100px] xl:left-[80px] xl:top-[250px] border-4 border-[#292D32] rounded-2xl">
            <Image priority src={HomeImage} alt="home-img" fill />
          </div>
          <div className="absolute w-60 h-52 sm:w-80 sm:h-64 md:w-[500px] md:h-[350px] matrixPackages left-32  top-20 sm:left-[250px] sm:top-[100px] md:left-[400px] md:top-[100px] xl:left-[450px] xl:top-[250px] border-4 border-[#292D32] rounded-2xl">
            <Image priority src={PackagesImage} alt="package-img" fill />
          </div>
        </div>
      </div>

      {/* Support Service  */}
      <div className="w-full max-w-screen-2xl mx-auto flex justify-center items-center p-6">
        <div className="flex flex-col space-y-6 md:space-y-10 justify-center items-center text-center py-6 md:py-20">
          <h1 className="font-semibold text-2xl md:text-4xl lg:text-6xl">
            Support Services
          </h1>
          <p className="max-w-[1000px] w-full font-normal text-sm md:text-base">
            At S&S Vault serving and supporting our community is in our DNA. We
            were birthed from sorrow, pain and healing, none of which could be
            avoided. We want to help individuals and families in our community
            learn, grow, prosper and thrive.
          </p>
          <p className="max-w-[1000px] w-full font-normal text-base">
            We feel this can be achieved by providing them with access to any
            and all of the support services they may need. <br /> We have
            partnered with service providers in the below fields who will be
            able to provide you and your family with resources you may need to
            learn, grow, prosper and thrive.
          </p>
          <ul className="list-disc flex flex-wrap justify-center items-center gap-8 sm:gap-16 md:gap-28">
            <div className="font-semibold text-sm flex flex-col justify-start items-start">
              <li>Financial Literacy</li>
              <li>Estate Planning</li>
              <li>Physical Abuse</li>
              <li>Credit Worthiness</li>
              <li>Tutoring</li>
              <li>Home Buying</li>
              <li>Franchise Opportunities</li>
            </div>
            <div className="font-semibold text-sm flex flex-col justify-start items-start">
              <li>Physical Health</li>
              <li>Food</li>
              <li>Legal Services</li>
              <li>Home Repairs</li>
              <li>lifestyle Coaching</li>
              <li>Rehabilitation Services</li>
              <li>Transportation</li>
            </div>
            <div className="font-semibold text-sm flex flex-col justify-start items-start">
              <li>Affordable Housing</li>
              <li>Entrepreneurship</li>
              <li>Substance Abuse</li>
              <li>Trade Schools</li>
              <li>Access to Capital</li>
              <li>Caregiving</li>
              <li>Vehicle Repairs</li>
            </div>
          </ul>
        </div>
      </div>

      {/* Create Your Own */}
      <div className="w-full flex flex-col p-6 gap-10 md:mt-10 mb-20 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-6 items-center w-full max-w-3xl mx-auto md:mb-20">
          <h1 className="font-semibold text-2xl md:text-4xl lg:text-6xl text-black text-center leading-tight">
            Create your own space and manage files easily
          </h1>
          <div className="flex flex-col gap-6 items-center">
            <p className="font-normal text-sm md:text-base text-black text-center">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using Content here, content
              here`&apos;`s, making it look like readable English. Many desktop
              publishing packages and web page.
            </p>
            <SSButton
              isLoading={false}
              onClick={() => router.push("/auth/sign-up")}
              className="p-4 w-full sm:w-[271px] whitespace-nowrap sm:h-[56px] rounded-[10px] text-lg font-semibold border border-[rgba(0, 0, 0, 0.05)]"
            >
              Create Store and Share Vault
            </SSButton>
          </div>
        </div>
        <div className="relative w-full mx-auto">
          <Image
            src={CreateYourOwnImage}
            alt="create-your-own-img"
            width={1500}
            height={1500}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
