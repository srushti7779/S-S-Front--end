import Loading from "@/components/Loading";
import SSButton from "@/components/form/SSButton";
import SSInput from "@/components/form/SSInput";
import SSModal from "@/components/form/SSModal";
import SSSelect from "@/components/form/SSSelect";
import {
  deleteUserFoldersData,
  getUserFolders,
  getUserFoldersData,
  postUserFolders,
  putUserFolders,
} from "@/redux/slices/folderSlice";
import { getSharedWithMe } from "@/redux/slices/permissionSlice";
import NoFileImage from "../../../assests/images/nofile.svg";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { truncateString } from "@/utils/helper";
import { getBuddyList, postBuddyRequest } from "@/redux/slices/buddiesSlice";
import { toast } from "react-hot-toast";

const SharedWithMe = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, folderList, sharedData } = useSelector((state) => ({
    loading: state.permissionSlice.loading,
    sharedData: state.permissionSlice.sharedData,
  }));
  const [buddyModal, setBuddyModal] = useState(false);
  const relationWithBuddyList = [
    { label: "Spouse", value: "Spouse" },
    { label: "Partner", value: "Partner" },
    { label: "Friend", value: "Friend" },
    { label: "Other", value: "Other" },
  ];

  useEffect(() => {
    dispatch(getSharedWithMe());
    dispatch(getBuddyList());
  }, [dispatch]);

  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="px-10 max-w-7xl flex flex-col justify-center items-start gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold text-xl">Add Buddy</div>
          <div>
            <SSButton className="w-[150px]" onClick={() => setBuddyModal(true)}>
              + Add Buddy
            </SSButton>
          </div>
        </div>
        <div
          className={classNames(
            "px-10 max-w-7xl w-full bg-transparent rounded-[20px] mx-auto my-10 relative",
            Boolean(sharedData?.length)
              ? "grid grid-cols-1 xl:grid-cols-4 gap-5"
              : "flex"
          )}
        >
          {Boolean(sharedData?.length) ? (
            <>
              {sharedData.map((sharedDatum, index) => (
                <div
                  key={index}
                  onDoubleClick={() =>
                    router.push(
                      (sharedDatum?.folder &&
                        `/home/documents/folder/${sharedDatum.folder.id}`) ||
                        (sharedDatum?.file &&
                          `/home/documents/files/${sharedDatum.file.id}`) ||
                        (sharedDatum?.bankAccountId &&
                          `/home/password-forms/bank-account/${sharedDatum.bankAccountId.id}`) ||
                        (sharedDatum?.creditCardId &&
                          `/home/password-forms/credit-card/${sharedDatum.creditCardId.id}`) ||
                        (sharedDatum?.loanAccountId &&
                          `/home/password-forms/loan-account/${sharedDatum.loanAccountId.id}`) ||
                        (sharedDatum?.merchantAccountId &&
                          `/home/password-forms/merchant-account/${sharedDatum.merchantAccountId.id}`) ||
                        (sharedDatum?.miscAccountId &&
                          `/home/password-forms/misc-account/${sharedDatum.miscAccountId.id}`) ||
                        (sharedDatum?.passwordStorageId &&
                          `/home/password-forms/non-bank-account/${sharedDatum.passwordStorageId.id}`) ||
                        (sharedDatum?.recipeAccountId &&
                          `/home/password-forms/recipe/${sharedDatum.recipeAccountId.id}`)
                    )
                  }
                  className="cursor-pointer hover:shadow-lg hover:ring-offset-0 hover:ring-opacity-25 transition-all duration-100 px-5 py-4 max-w-[290px] min-w-[150px] w-full h-[173px] bg-white rounded-[7px] "
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="flex justify-center items-center w-[40px] h-[40px] rounded-full bg-[#FFBE9D1A]">
                      <Image
                        src="https://res.cloudinary.com/dlsxq98fr/image/upload/v1687022393/loadpasswordfolder_ii5i7s.png"
                        width={18}
                        height={15}
                        alt=""
                      />
                    </div>
                    <div>
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button className="flex relative max-w-xs items-center rounded-full bg-white text-sm focus:outline-none lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                            <IoEllipsisHorizontalOutline color={"#00000066"} />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <p
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  onClick={() =>
                                    router.push(
                                      (sharedDatum?.folder &&
                                        `/home/documents/folder/${sharedDatum.folder.id}`) ||
                                        (sharedDatum?.file &&
                                          `/home/documents/files/${sharedDatum.file.id}`) ||
                                        (sharedDatum?.bankAccountId &&
                                          `/home/passwords/bank-account/${sharedDatum.bankAccountId.id}`) ||
                                        (sharedDatum?.creditCardId &&
                                          `/home/passwords/credit-card/${sharedDatum.creditCardId.id}`) ||
                                        (sharedDatum?.loanAccountId &&
                                          `/home/passwords/loan-account/${sharedDatum.loanAccountId.id}`) ||
                                        (sharedDatum?.merchantAccountId &&
                                          `/home/passwords/merchant-account/${sharedDatum.merchantAccountId.id}`) ||
                                        (sharedDatum?.miscAccountId &&
                                          `/home/passwords/misc-account/${sharedDatum.miscAccountId.id}`) ||
                                        (sharedDatum?.passwordStorageId &&
                                          `/home/passwords/non-bank-account/${sharedDatum.passwordStorageId.id}`) ||
                                        (sharedDatum?.recipeAccountId &&
                                          `/home/passwords/recipe/${sharedDatum.recipeAccountId.id}`)
                                    )
                                  }
                                >
                                  Open{" "}
                                </p>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <p
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  onClick={() =>
                                    toast.error(
                                      "You don't have the correct permission"
                                    )
                                  }
                                >
                                  Permission{" "}
                                </p>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <p
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  onClick={() =>
                                    toast.error(
                                      "You don't have the correct permission"
                                    )
                                  }
                                >
                                  Delete{" "}
                                </p>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <p
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  onClick={() => {
                                    toast.error(
                                      "You don't have the correct permission"
                                    );
                                  }}
                                >
                                  Rename{" "}
                                </p>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="capitalize font-semibold text-[14px] mt-5">
                    Shared By :- {sharedDatum?.userAuth?.name}
                  </div>
                  {sharedDatum?.folder && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Folder :-</div>
                      {sharedDatum.folder?.name.split("|")[0]}
                    </div>
                  )}
                  {sharedDatum?.bankAccountId && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Bank Form :-</div>
                      {sharedDatum.bankAccountId.name ||
                        sharedDatum.bankAccountId.account_nick_name}
                    </div>
                  )}
                  {sharedDatum?.creditCardId && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Credit Card :-</div>
                      {sharedDatum.creditCardId.name ||
                        sharedDatum.creditCardId.account_nick_name}
                    </div>
                  )}
                  {sharedDatum?.loanAccountId && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Loan Account :-</div>
                      {sharedDatum.loanAccountId.name ||
                        sharedDatum.loanAccountId.account_nick_name}
                    </div>
                  )}
                  {sharedDatum?.merchantAccountId && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Merchant Account :-</div>
                      {sharedDatum.merchantAccountId.name ||
                        sharedDatum.merchantAccountId.account_nick_name}
                    </div>
                  )}
                  {sharedDatum?.miscAccountId && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Misc Account :-</div>
                      {sharedDatum.miscAccountId.name ||
                        sharedDatum.miscAccountId.account_nick_name}
                    </div>
                  )}
                  {sharedDatum?.passwordStorageId && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Password :-</div>
                      {sharedDatum.passwordStorageId.name ||
                        sharedDatum.passwordStorageId.account_nick_name}
                    </div>
                  )}
                  {sharedDatum?.recipeAccountId && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>Recipe :-</div>
                      {sharedDatum.recipeAccountId.name ||
                        sharedDatum.recipeAccountId?.recipe_name}
                    </div>
                  )}
                  {sharedDatum?.file && (
                    <div className="flex gap-3 capitalize font-normal text-[16px] text-[#00000080] mt-5">
                      <div>File :-</div>
                      {sharedDatum.file?.fileName ||
                        truncateString(
                          sharedDatum.file?.name.split("|")[1],
                          20
                        )}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="w-full h-[45vh] flex flex-col justify-center items-center">
              <Image
                priority
                src={NoFileImage}
                width={180}
                height={180}
                alt=""
              />
              <h1 className="font-medium text-[22px] whitespace-nowrap mt-[30px]">
                Shared file will be displayed here
              </h1>
            </div>
          )}
        </div>
      </div>
      <SSModal isOpen={buddyModal} onClose={() => setBuddyModal(false)}>
        <Formik
          initialValues={{ email: "", relation: "" }}
          enableReinitialize
          onSubmit={(values) => {
            dispatch(postBuddyRequest(values))
              .unwrap()
              .then(() => {
                setBuddyModal(false);
                dispatch(getBuddyList());
              });
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                <div className="w-full relative flex justify-end items-center">
                  <div>
                    <h1 className="absolute left-[26%] xl:left-[35%] top-5 xl:top-2 font-bold text-lg xl:text-[28px]">
                      Add new buddy
                    </h1>
                  </div>
                  <div
                    onClick={() => setBuddyModal(false)}
                    className="w-[60px] h-[60px] flex justify-center items-center cursor-pointer rounded-full bg-[#F5F5F5]"
                  >
                    <RxCross2 size={30} />
                  </div>
                </div>
                <div className="w-full p-6 mt-3 rounded-[20px] flex flex-col justify-start items-start gap-3">
                  <p className="font-semibold text-xl">Email of the buddy</p>
                  <div className="w-full">
                    <SSInput
                      type="text"
                      name="email"
                      placeholder="Enter your buddy's email here"
                    />
                  </div>
                  <div className="relative mx-auto w-full mt-4">
                    <label className="block font-semibold text-xl mb-1">
                      Select relationship
                    </label>
                    <SSSelect
                      label="Select the relationship"
                      name="relation"
                      options={relationWithBuddyList}
                      fieldTitle="label"
                      fieldValue="value"
                      boxSize="w-full h-[50px]"
                      labelClassName="text-black"
                    />
                  </div>
                  <div className="ml-auto w-full mt-5">
                    <SSButton
                      type="submit"
                      isLoading={loading}
                      className="w-[154px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer ml-auto"
                    >
                      Add Buddy
                    </SSButton>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </SSModal>
    </div>
  );
};

export default SharedWithMe;
