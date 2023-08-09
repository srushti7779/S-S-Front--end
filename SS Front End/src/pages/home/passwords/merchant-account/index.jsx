import {
  deletePasswordForm,
  getPasswordFormDeatils,
  renameForm,
} from "@/redux/slices/passwordTypeFormSlice";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import FileImage from "../../../../assests/images/file1.png";
import classNames from "classnames";
import moment from "moment";
import { toast } from "react-hot-toast";
import NoFileImage from "../../../../assests/images/nofile.svg";
import { useRouter } from "next/router";
import SSPermissionModal from "@/components/modals/SSPermissionModal";
import SSButton from "@/components/form/SSButton";
import SSInput from "@/components/form/SSInput";
import { RxCross2 } from "react-icons/rx";
import { Form, Formik } from "formik";
import SSModal from "@/components/form/SSModal";

const MerchantAccountPasswordsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [permissionModal, setPermissionModal] = useState({
    visible: false,
  });
  const [renameModal, setRenameModal] = useState({
    visible: false,
  });
  const { formList, allowedList, loading } = useSelector((state) => ({
    allowedList: state.passwordFormSlice.allowedList,
    loading: state.passwordFormSlice.loading,
    formList: state.passwordFormSlice.formList,
  }));
  useEffect(() => {
    dispatch(getPasswordFormDeatils("merchant-account"));
  }, []);
  return (
    <>
      <div className="absolute top-8 xl:top-10 left-[20%] xl:left-[50%]">
        <h1 className="font-semibold text-base xl:text-[31px]">
          My Merchant Accounts
        </h1>
      </div>
      <div className="w-full flex justify-center items-start min-h-[85vh]">
        <div
          className={classNames(
            "px-10 max-w-7xl w-full bg-transparent rounded-[20px] mx-auto my-10 relative",
            Boolean(allowedList?.length || formList?.length)
              ? "grid grid-cols-1 xl:grid-cols-4 gap-5"
              : "flex"
          )}
        >
          {Boolean(allowedList?.length || formList?.length) ? (
            <>
              {formList?.map((item, index) => (
                <>
                  <div
                    key={index}
                    onDoubleClick={() =>
                      router.push(
                        `/home/passwords-forms/merchant-account/${item?.id}`
                      )
                    }
                    className="cursor-pointer hover:shadow-lg hover:ring-offset-0 hover:ring-opacity-25 transition-all duration-100 px-5 py-4 max-w-[290px] min-w-[150px] w-full h-[173px] bg-white rounded-[7px] "
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex justify-center items-center w-[40px] h-[40px] rounded-full bg-[#00A6521A]">
                        <Image
                          priority
                          src={FileImage}
                          width={18}
                          height={15}
                          alt=""
                        />
                      </div>
                      <div>
                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button className="flex relative max-w-xs items-center rounded-full bg-white text-sm focus:outline-none lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                              <IoEllipsisHorizontalOutline
                                color={"#00000066"}
                              />
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
                                        `/home/passwords-forms/merchant-account/${item?.id}`
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
                                      setRenameModal({ visible: true })
                                    }
                                  >
                                    Rename{" "}
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
                                      dispatch(
                                        deletePasswordForm({
                                          formType: "merchant-account",
                                          id: item.id,
                                        })
                                      )
                                        .unwrap()
                                        .then(() =>
                                          dispatch(
                                            getPasswordFormDeatils(
                                              "merchant-account"
                                            )
                                          )
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
                                      setPermissionModal({
                                        visible: true,
                                        form_type: "merchantAccountId",
                                        id: item.id,
                                      });
                                    }}
                                  >
                                    Permission{" "}
                                  </p>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                    <div className="font-semibold text-[20px] mt-5 capitalize">
                      {item?.name || item?.account_nick_name}{" "}
                    </div>
                    <p className="font-normal text-sm text-[#00000080]">
                      Created On{" "}
                      <strong className="ml-2">
                        {moment(item.createdAt).format("DD MM YYYY")}
                      </strong>
                    </p>
                    <p className="font-normal text-sm text-[#00000080]">
                      Edited On{" "}
                      <strong className="ml-2">
                        {moment(item?.updatedAt).format("DD MM YYYY")}
                      </strong>
                    </p>
                  </div>
                  <SSModal
                    isOpen={renameModal.visible}
                    onClose={() => setRenameModal({ visible: false })}
                  >
                    <Formik
                      initialValues={{ name: item?.name || "" }}
                      enableReinitialize
                      onSubmit={(values) => {
                        dispatch(
                          renameForm({
                            formType: "merchant-account",
                            id: item?.id,
                            name: values.name,
                          })
                        )
                          .unwrap()
                          .then(() => {
                            dispatch(
                              getPasswordFormDeatils("merchant-account")
                            );
                            setRenameModal({ visible: false });
                          });
                      }}
                    >
                      {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                          <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                            <div className="w-full flex justify-between items-center">
                              <div>
                                <h1 className="font-bold text-[22px]">
                                  Rename this file
                                </h1>
                              </div>
                              <div
                                onClick={() =>
                                  setRenameModal({ visible: false })
                                }
                                className="w-[60px] h-[60px] flex justify-center items-center cursor-pointer rounded-full bg-[#F5F5F5]"
                              >
                                <RxCross2 size={30} />
                              </div>
                            </div>
                            <div className="w-full p-6 mt-3 rounded-[20px] bg-[#f5f5f5] flex flex-col justify-start items-start gap-3">
                              <p className="font-semibold text-xl">Title</p>
                              <div className="w-full">
                                <SSInput
                                  type="text"
                                  name="name"
                                  placeholder="Type here..."
                                />
                              </div>
                              <div className="ml-auto w-full mt-5">
                                <SSButton
                                  type="submit"
                                  isLoading={loading}
                                  className="w-[154px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer ml-auto"
                                >
                                  Submit
                                </SSButton>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </SSModal>
                </>
              ))}
              {allowedList?.map((item, index) => (
                <div
                  key={index}
                  onDoubleClick={() =>
                    router.push(
                      `/home/passwords-forms/merchant-account/${item?.id}`
                    )
                  }
                  className="cursor-pointer hover:shadow-lg hover:ring-offset-0 hover:ring-opacity-25 transition-all duration-100 px-5 py-4 max-w-[290px] min-w-[150px] w-full h-[173px] bg-white rounded-[7px] "
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="flex justify-center items-center w-[40px] h-[40px] rounded-full bg-[#00A6521A]">
                      <Image
                        priority
                        src={FileImage}
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
                                      `/home/passwords-forms/merchant-account/${item?.id}`
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
                                      "You dont have the right permission"
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
                                  onClick={() =>
                                    toast.error(
                                      "You dont have the right permission"
                                    )
                                  }
                                >
                                  Permission{" "}
                                </p>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="font-semibold text-[20px] mt-5 capitalize">
                    {item?.account_nick_name}
                  </div>
                  <p className="font-normal text-sm text-[#00000080]">
                    Created On{" "}
                    <strong className="ml-2">
                      {moment(item.createdAt).format("DD MM YYYY")}
                    </strong>
                  </p>
                  <p className="font-normal text-sm text-[#00000080]">
                    Edited On{" "}
                    <strong className="ml-2">
                      {moment(item?.updatedAt).format("DD MM YYYY")}
                    </strong>
                  </p>
                </div>
              ))}
            </>
          ) : (
            <div className="w-full h-[80vh] flex flex-col justify-center items-center">
              <Image priority src={NoFileImage} width={180} height={180} />
              <h1 className="font-medium text-[22px] whitespace-nowrap mt-[30px]">
                Uploaded file will be displayed here
              </h1>
            </div>
          )}
        </div>
        {permissionModal.visible && (
          <SSPermissionModal
            permissionModal={permissionModal}
            setPermissionModal={setPermissionModal}
          />
        )}
      </div>
    </>
  );
};

export default MerchantAccountPasswordsList;
