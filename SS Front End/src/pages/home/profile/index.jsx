import React, { useEffect, useMemo, useRef, useState } from "react";
import SSInput from "@/components/form/SSInput";
import { Form, Formik } from "formik";
import Logo from "../../../assests/logos/Logo.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import SSButton from "@/components/form/SSButton";
import UseRImage from "../../../assests/images/userProfile.png";
import CameraImg from "../../../assests/images/camera.png";
import { useDispatch, useSelector } from "react-redux";
import {
  authGetUserProfile,
  authPostUserProfile,
} from "@/redux/slices/authSlice";
import SSSelect from "@/components/form/SSSelect";
import { countries } from "@/utils/countries";
import { toast } from "react-hot-toast";
import jwtDecode from "jwt-decode";

const UserProfile = () => {
  const router = useRouter();
  const imageRef = useRef();
  const [imagePreview, setImagePreview] = useState(null);
  const [email, setEmail] = useState();
  const [imageFile, setImageFile] = useState(null);
  const dispatch = useDispatch();
  const { loading, userProfile } = useSelector((state) => ({
    loading: state.userAuth.loading,
    userProfile: state.userAuth.userProfile,
  }));
  const [isProfileEdit, setIsProfileEdit] = useState(false);

  const verificationPeriodOptions = [
    { label: "One Week", value: "One Week" },
    { label: "Two Week", value: "Two Week" },
    { label: "One Month", value: "One Month" },
  ];

  useEffect(() => {
    if (
      !localStorage.getItem("profile") ||
      !JSON.parse(localStorage.getItem("profile"))?.id
    ) {
      dispatch(authGetUserProfile());
    }
    const token = process.browser && localStorage.getItem("token");
    const data = jwtDecode(token);
    if (data) {
      setEmail(data.email);
    }
  }, []);

  const renderVerification = (verifyDate) => {
    switch (verifyDate) {
      case "7":
        return verificationPeriodOptions[0].label;
      case "14":
        return verificationPeriodOptions[1].label;
      case "28":
        return verificationPeriodOptions[2].label;
    }
  };

  const countriesOptions = useMemo(() => {
    return countries.map((country) => ({
      value: country?.name,
      label: country?.name,
    }));
  }, []);
  return (
    <div className="w-full flex justify-center items-center h-full">
      <div className="max-w-[1200px] w-full bg-white rounded-[20px] px-5 mx-auto md:my-10 relative">
        <Formik
          initialValues={{
            profileImage: userProfile?.profilePicture || "",
            email: email || "",
            firstName: userProfile?.firstName || "",
            lastName: userProfile?.lastName || "",
            location: userProfile?.location || "",
            verificationPeriod:
              renderVerification(userProfile?.verficationPeriod) || "",
          }}
          enableReinitialize
          onSubmit={(values) => {
            if (!values.firstName)
              return toast.error("Please enter your first name");
            if (!values.lastName)
              return toast.error("Please enter your last name");
            if (!values.location)
              return toast.error("Please select your country");
            if (!values.verificationPeriod)
              return toast.error("Please select verification period");
            if (!values.profileImage)
              return toast.error("Please select your profile image");
            const userId = localStorage.getItem("user_id");
            const data = new FormData();
            data.append("file", values.profileImage);
            data.append("fname", values.firstName);
            data.append("lname", values.lastName);
            data.append("email", values.email);
            data.append("location", values.location);
            data.append("verificationPeriod", values.verificationPeriod);
            data.append("userID", userId);

            dispatch(authPostUserProfile(data))
              .unwrap()
              .then(() => {
                dispatch(authGetUserProfile())
                  .unwrap()
                  .then((res) => {
                    localStorage.setItem("profile", JSON.stringify(res.data));
                  })
                  .catch((e) => console.log(e));
              });
          }}
        >
          {({ errors, touched, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className="pb-[70px] md:pt-10">
              <div className="flex justify-center relative border bg-[#FAFAFA] items-center mx-auto mb-10 w-[184px] h-[184px] rounded-full">
                {imagePreview ? (
                  <div className="flex justify-center items-center w-[184px] h-[184px] rounded-full overflow-hidden">
                    <Image
                      priority
                      src={imagePreview}
                      width={200}
                      height={184}
                      alt=""
                    />
                  </div>
                ) : (
                  <Image
                    src={userProfile?.profilePicture || UseRImage}
                    width={60}
                    height={60}
                    alt=""
                  />
                )}
                <div
                  onClick={() => imageRef.current.click()}
                  className="absolute bottom-0 right-0 cursor-pointer w-[66px] h-[66px] rounded-full bg-[#00A652] flex justify-center items-center"
                >
                  <SSInput
                    inputRef={imageRef}
                    type="file"
                    size="hidden absolute"
                    name="profileImage"
                    value=""
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file.type.split("/")[0] !== "image")
                        return toast.error("This file type is not supported");
                      setImagePreview(URL.createObjectURL(file));
                      setImageFile(file);
                      setFieldValue("profileImage", file);
                    }}
                  />
                  <Image
                    priority
                    src={CameraImg}
                    width={30}
                    height={30}
                    alt=""
                  />
                </div>
              </div>
              <div className="max-w-[512px] mx-auto w-full">
                <SSInput
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="Enter your First name here"
                  error={!!errors?.firstName || false}
                  errorMessage={errors?.firstName}
                  disabled={userProfile || isProfileEdit}
                />
              </div>
              <div className="max-w-[512px] mx-auto w-full my-10">
                <SSInput
                  label="Last name"
                  type="text"
                  name="lastName"
                  placeholder="Enter your Last Name here"
                  error={!!errors?.lastName || false}
                  errorMessage={errors?.lastName}
                  disabled={userProfile || isProfileEdit}
                />
              </div>
              <div className="max-w-[512px] mx-auto w-full my-10">
                <SSInput
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email here"
                  error={!!errors?.email || false}
                  errorMessage={errors?.email}
                  disabled={true}
                />
              </div>
              <div className="relative max-w-[512px] mx-auto w-full my-10">
                <label className="block font-medium text-xl leading-[30px] mb-1">
                  Location
                </label>
                <SSSelect
                  label="Location"
                  name="location"
                  options={countriesOptions}
                  fieldTitle="label"
                  fieldValue="value"
                  boxSize="w-full h-[50px]"
                  labelClassName="text-black"
                  defaultValues={userProfile?.location}
                />
              </div>
              <div className="relative max-w-[512px] mx-auto w-full my-10">
                <label className="block font-medium text-xl leading-[30px] mb-1">
                  Verification Period
                </label>
                <SSSelect
                  label="Verfication Period"
                  name="verificationPeriod"
                  options={verificationPeriodOptions}
                  fieldTitle="label"
                  fieldValue="value"
                  boxSize="w-full h-[50px]"
                  labelClassName="text-black"
                  defaultValues={renderVerification(
                    userProfile?.verficationPeriod
                  )}
                />
              </div>
              <div className="mx-auto w-full mt-10">
                <SSButton
                  type="submit"
                  isLoading={loading}
                  className="w-[154px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer mx-auto"
                >
                  {userProfile ? "Update" : "Submit"}
                </SSButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserProfile;
