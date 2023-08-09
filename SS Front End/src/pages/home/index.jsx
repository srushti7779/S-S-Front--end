import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  IoDocumentTextOutline,
  IoAddCircleOutline,
  IoEllipsisHorizontalOutline,
} from "react-icons/io5";
import FolderLogo from "../../assests/images/folder.png";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFoldersData,
  getUserFolders,
  getUserFoldersData,
  postUserFolders,
  putUserFolders,
} from "@/redux/slices/folderSlice";
import SSModal from "@/components/form/SSModal";
import { RxCross2 } from "react-icons/rx";
import { Form, Formik } from "formik";
import SSInput from "@/components/form/SSInput";
import SSButton from "@/components/form/SSButton";
import {
  deleteUserfiles,
  getFileData,
  getUserfiles,
  postUserfiles,
  renameUserfiles,
} from "@/redux/slices/fileSlice";
import { loadStripe } from "@stripe/stripe-js";
import { truncateString } from "@/utils/helper";
import moment from "moment";
import SSSelect from "@/components/form/SSSelect";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { PieChart } from "react-minimal-pie-chart";
import SSPermissionModal from "@/components/modals/SSPermissionModal";
import SSSubcriptionModal from "@/components/modals/SSSubcriptionModal";
import { getPlansActivity, getStripeKey } from "@/redux/slices/paymentSlice";
import { Elements } from "@stripe/react-stripe-js";
import { authGetUserProfile } from "@/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import { AiFillPlusCircle } from "react-icons/ai";

const Home = () => {
  const router = useRouter();
  const [pdfcount, setpdfcount] = useState(0);
  const [pngcount, setpngcount] = useState(0);
  const [jpegCount, setJpegCount] = useState(0);
  const [subscriptionModal, setSubscriptionModal] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const docRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const uploadRef = useRef();
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState({
    visible: false,
  });
  const [renameModal, setRenameModal] = useState({
    visible: false,
  });
  const [folderId, setFolderId] = useState();
  const [oldFolder, setOldFolder] = useState();
  const [oldFile, setOldFIle] = useState();
  const [allowedFiles, setAllowedFiles] = useState([]);
  const [allowedFolder, setAllowedFolder] = useState([]);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [openFileFolderModal, setOpenFileFolderModal] = useState(false);
  const [otherFilesCount, setOtherFilesCount] = useState(0);
  const [pieChartData, setPieChartData] = useState({
    upper: 100,
    lower: 0,
  });
  const dispatch = useDispatch();
  const {
    loading,
    folderList,
    fileList,
    fileLoading,
    planData,
    profileLoading,
    fileName,
    userProfile: profile,
  } = useSelector((state) => ({
    loading: state.folderSlice.loading,
    folderList: state.folderSlice.folderList,
    fileList: state.fileSlice.fileList,
    fileName: state.fileSlice.fileName,
    fileLoading: state.fileSlice.fileLoading,
    userProfile: state.userAuth.userProfile,
    profileLoading: state.userAuth.profileLoading,
    planData: state.paymentSlice.planData,
  }));
  const fileCountData = [
    { color: "#DFF9EC", count: pdfcount ? pdfcount : 0, type: "PDF Files" },
    { color: "#FDF1CD", count: pngcount ? pngcount : 0, type: "PNG Files" },
    { color: "#FEEBE1", count: jpegCount ? jpegCount : 0, type: "JPEG Files" },
    {
      color: "#E3EEFF",
      count: otherFilesCount ? otherFilesCount : 0,
      type: "Other Files",
    },
  ];
  const AllwordFoldersList = allowedFolder?.slice(0, 2);
  const FoldersList = folderList
    ?.slice(0, 4)
    ?.filter((folder) => folder.name !== "root");
  const FilesList = fileList?.slice(0, 4);
  const AllwoedFilesList = allowedFiles?.slice(0, 1);

  const PasswordTypeFormList = [
    {
      name: "Loan Account Passwords",
      label: "Loan Account Passwords",
      onClick: () => router.push("/home/passwords-forms/loan-account"),
    },
    {
      name: "Passwords (Non Bank Accounts)",
      label: "Passwords (Non Bank Accounts)",
      onClick: () => router.push("/home/passwords-forms/password-non-bank"),
    },
    {
      name: "Credit Card Account Passwords",
      label: "Credit Card Account Passwords",
      onClick: () => router.push("/home/passwords-forms/credit-card"),
    },
    {
      name: "Recipe Form",
      label: "Recipe Form",
      onClick: () => router.push("/home/passwords-forms/recipe-account"),
    },
    {
      name: "Misc Accounts Passwords",
      label: "Misc Accounts Passwords",
      onClick: () => router.push("/home/passwords-forms/misc-password"),
    },
    {
      name: "Bank Account Passwords",
      label: "Bank Account Passwords",
      onClick: () => router.push("/home/passwords-forms/bank-password"),
    },
    {
      name: "Merchant Account Passwords",
      label: "Merchant Account Passwords",
      onClick: () => router.push("/home/passwords-forms/merchant-account"),
    },
  ];

  const handleFileUpload = (e) => {
    const docFile = e.target.files[0];
    const file = new FormData();
    file.append("file", docFile);
    dispatch(postUserfiles(file))
      .unwrap()
      .then(() => {
        setOpenFileModal(false);
        dispatch(getUserfiles());
        dispatch(authGetUserProfile())
          .unwrap()
          .then((res) => {
            const defaultStorage = Number(res?.data?.storage || 0);
            const usedStorage = Number(res?.data?.storageLeft || 0);
            setPieChartData({
              upper:
                ((defaultStorage - usedStorage) / defaultStorage).toFixed(4) *
                100,
              lower: (usedStorage / defaultStorage).toFixed(4) * 100,
            });
          })
          .catch((e) => router.push("/home/profile"));
      });
  };

  useEffect(() => {
    dispatch(getStripeKey({ type: "live" }))
      .unwrap()
      .then((res) => setStripePromise(loadStripe(res.publishableKey)));
  }, [dispatch]);

  useEffect(() => {
    dispatch(authGetUserProfile())
      .unwrap()
      .then((res) => {
        const defaultStorage = Number(res?.data?.storage || 0);
        const usedStorage = Number(res?.data?.storageLeft || 0);
        setPieChartData({
          upper:
            ((defaultStorage - usedStorage) / defaultStorage).toFixed(4) * 100,
          lower: (usedStorage / defaultStorage).toFixed(4) * 100,
        });
      })
      .catch((e) => {});
  }, []);

  useEffect(() => {
    dispatch(getPlansActivity())
      .unwrap()
      .then((res) => {
        if (res.data && res.data.isPlanActive) {
          dispatch(getUserFolders())
            .unwrap()
            .then((res) => setAllowedFolder(res?.allowedFile || []))
            .catch((e) => console.log(e));
          dispatch(getUserfiles())
            .unwrap()
            .then((res) => setAllowedFiles(res?.allowedFile || []))
            .catch((e) => console.log(e));
          if (
            !profile &&
            !profile?.id &&
            !localStorage.getItem("profile") &&
            !JSON.parse(localStorage.getItem("profile"))?.id
          ) {
            router.push("/home/profile");
          }
        } else {
          setSubscriptionModal(true);
        }
      })
      .catch(() => {
        setSubscriptionModal(true);
      });
  }, [dispatch, profile, profileLoading, router]);

  useEffect(() => {
    const pdf = fileList?.filter(
      (file) => file.ext === "pdf" || file.ext === "PDF"
    );
    const png = fileList?.filter(
      (file) => file.ext === "png" || file.ext === "PNG"
    );
    const jpeg = fileList?.filter(
      (file) =>
        file.ext === "jpeg" ||
        file.ext === "jpg" ||
        file.ext === "JPEG" ||
        file.ext === "JPG"
    );
    const otherFiles = fileList?.filter(
      (file) =>
        file.ext !== "pdf" &&
        file.ext !== "png" &&
        file.ext !== "jpeg" &&
        file.ext !== "jpg" &&
        file.ext !== "PDF" &&
        file.ext !== "PNG" &&
        file.ext !== "JPEG" &&
        file.ext !== "JPG"
    );
    setpdfcount(pdf?.length);
    setpngcount(png?.length);
    setJpegCount(jpeg?.length);
    setOtherFilesCount(otherFiles?.length);
  }, [fileList]);

  useEffect(() => {
    if (folderId) {
      dispatch(getUserFoldersData({ id: folderId }))
        .unwrap()
        .then((res) => setOldFolder(res?.data.name.split("|")[0]));
    }
    if (renameModal?.id) {
      dispatch(getFileData({ id: renameModal.id }))
        .unwrap()
        .then((res) => {
          setOldFIle(res?.data?.fileName || res?.data?.name?.split("|")[1]);
        });
    }
  }, [dispatch, folderId, renameModal?.id]);

  return (
    <>
      <div className="w-full relative hidden md:flex justify-center items-start min-h-[85vh]">
        <div className="max-w-7xl flex justify-center items-start md:gap-0 xxl:gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
          <div className="max-w-[70%] gap-6 flex flex-col justify-center items-center">
            <div className="w-full flex justify-center items-center gap-3">
              {fileCountData?.map((file, index) => (
                <div
                  key={index}
                  style={{
                    background: file.color,
                  }}
                  className={`md:max-w-[180px] flex justify-center items-center xxl:max-w-[200px] md:h-[90px] xl:h-[118px] w-full whitespace-nowrap rounded-[10px] gap-4 md:p-4 xl:p-5`}
                >
                  <div className="flex flex-col justify-center items-start">
                    <h1 className="font-semibold md:text-[26px] xxl:text-[28px]">
                      {file.count || 0}
                    </h1>
                    <p className="font-normal md:text-[18px] xxl:text-[20px] leading-[26px]">
                      {file?.type}
                    </p>
                  </div>
                  <div className="flex relative w-[40px]">
                    <div className="w-[40px] absolute right-0 -top-8  h-[40px] rounded-full border flex justify-center items-center border-[#00000033]">
                      <IoDocumentTextOutline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full px-5 flex gap-5 justify-center items-start">
              <div className="bg-white rounded-t-[10px] w-[60%] min-h-[420px]">
                <div className="w-full bg-white rounded-t-[10px] flex flex-col justify-center items-center">
                  <div className="w-full flex flex-col rounded-t-[10px] justify-center items-center">
                    <div className=" w-full p-5 border-b  border-b-[#0000000d] flex justify-between items-center">
                      <h1 className="font-semibold text-[20px]">
                        Uploaded Folders
                      </h1>
                      <p
                        onClick={() => router.push("/home/documents")}
                        className="cursor-pointer font-normal text-base leading-[26px] "
                      >
                        View All {">"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-b-[10px] w-full p-3">
                    <div className=" grid grid-cols-2 items-start gap-4 w-full">
                      {FoldersList?.map((folder, index) => (
                        <div
                          onDoubleClick={() =>
                            router.push(`home/documents/folder/${folder.id}`)
                          }
                          key={index}
                          className="cursor-pointer w-full h-[95px] px-4 pt-2 rounded-[10px] border border-[#00a6521a] flex justify-between items-start"
                        >
                          <div className="flex flex-col justify-center items-start">
                            <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#FEEBE1]">
                              <Image
                                src={FolderLogo}
                                width={10}
                                height={10}
                                alt=""
                              />
                            </div>
                            <h3 className="font-semibold text-xs mt-2">
                              {" "}
                              {folder.name.split("|")[0]}
                            </h3>
                            <p className="font-normal text-[#00000080] text-xs leading-[26px]">
                              {folder.files?.length} file
                            </p>
                          </div>
                          <div>
                            <Menu as="div" className="relative mt-4">
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
                                            `home/documents/folder/${folder.id}`
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
                                        onClick={() => {
                                          setOpenFolderModal(true);
                                          setFolderId(folder.id);
                                        }}
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
                                            deleteUserFoldersData({
                                              id: folder.id,
                                            })
                                          )
                                            .unwrap()
                                            .then(() => {
                                              dispatch(getUserFolders());
                                              dispatch(getUserfiles());
                                            })
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
                                          setPermissionModal({
                                            visible: true,
                                            permType: "folder_id",
                                            id: folder.id,
                                          })
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
                      ))}
                      {AllwordFoldersList?.map((folder, index) => (
                        <div
                          onDoubleClick={() =>
                            router.push(
                              `home/documents/allowed-folder/${folder.id}`
                            )
                          }
                          key={index}
                          className="cursor-pointer w-full h-[95px] px-4 pt-2 rounded-[10px] border border-[#00a6521a] flex justify-between items-start"
                        >
                          <div className="flex flex-col justify-center items-start">
                            <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#FEEBE1]">
                              <Image
                                src={FolderLogo}
                                width={10}
                                height={10}
                                alt=""
                              />
                            </div>
                            <h3 className="font-semibold text-xs mt-2">
                              {" "}
                              {folder.name.split("|")[0]}
                            </h3>
                            <p className="font-normal text-[#00000080] text-xs leading-[26px]">
                              {folder.files?.length || 0} file
                            </p>
                          </div>
                          <div>
                            <Menu as="div" className="relative mt-4">
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
                                            `home/documents/folder/${folder.id}`
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
                                        onClick={() => {
                                          toast.error(
                                            "You dont have the right permission"
                                          );
                                        }}
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
                      ))}
                      <div
                        onClick={() => setOpenFolderModal(true)}
                        className="w-full cursor-pointer bg-[#F3FAF6] h-[95px] rounded-[10px] border border-[#00a6521a] flex flex-col justify-center items-center"
                      >
                        <div className="w-[40px] h-[40px] rounded-full bg-[#DDF1E5] flex justify-center items-center">
                          <IoAddCircleOutline color="#00A652" size={25} />
                        </div>
                        <h5 className="font-normal text-base leading-[26px]">
                          Create New Folder
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex flex-col w-[40%] rounded-t-[10px] justify-center items-center bg-white">
                <div className="w-full p-5 border-b  border-b-[#0000000d] flex justify-between items-center">
                  <h1 className="font-semibold text-[20px]">Uploaded Files</h1>
                  <p
                    onClick={() => router.push("/home/documents/files")}
                    className="cursor-pointer font-normal text-base leading-[26px] "
                  >
                    View All {">"}
                  </p>
                </div>
                <div className="min-h-[349px] p-3 flex flex-col justify-end w-full bg-white rounded-b-[10px]">
                  {FilesList?.map((file, index) => (
                    <div
                      key={index}
                      onDoubleClick={() =>
                        router.push(`/home/documents/files/${file.id}`)
                      }
                      className="flex py-4 border-b border-b-[#0000000d] justify-start items-center"
                    >
                      <div className="flex justify-center items-center w-[45px] h-[40px] rounded-[9px] bg-[#E8F6ED]">
                        <IoDocumentTextOutline style={{}} color="#00A652" />
                      </div>
                      <div className="flex flex-col ml-4 justify-start items-start">
                        <h6 className="font-medium text-sm">
                          {file.fileName ||
                            truncateString(file.name.split("|")[1], 20)}
                        </h6>
                        <p className="text-xs leading-[26px] font-normal text-[#00000080]">
                          Uploaded on : {moment(file.createdAt).format("L")}{" "}
                        </p>
                      </div>
                      <div className="ml-auto mr-4">
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
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                    onClick={() =>
                                      router.push(
                                        `/home/documents/files/${file.id}`
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
                                      setRenameModal({
                                        visible: true,
                                        id: file.id,
                                      })
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
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                    onClick={() => {
                                      dispatch(deleteUserfiles({ id: file.id }))
                                        .unwrap()
                                        .then(() => {
                                          dispatch(getUserfiles());
                                          dispatch(authGetUserProfile())
                                            .unwrap()
                                            .then((res) => {
                                              const defaultStorage = Number(
                                                res?.data?.storage || 0
                                              );
                                              const usedStorage = Number(
                                                res?.data?.storageLeft || 0
                                              );

                                              const upperData = Number();
                                              setPieChartData({
                                                upper:
                                                  (
                                                    (defaultStorage -
                                                      usedStorage) /
                                                    defaultStorage
                                                  ).toFixed(4) * 100,
                                                lower:
                                                  (
                                                    usedStorage / defaultStorage
                                                  ).toFixed(4) * 100,
                                              });
                                            });
                                        })
                                        .catch((e) => console.log(e));
                                    }}
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
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                    onClick={() =>
                                      setPermissionModal({
                                        visible: true,
                                        permType: "file_id",
                                        id: file.id,
                                      })
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
                  ))}
                  {AllwoedFilesList?.map((file, index) => (
                    <div
                      key={index}
                      onDoubleClick={() =>
                        router.push(`/home/documents/files/${file.id}`)
                      }
                      className="flex py-4 border-b border-b-[#0000000d] justify-start items-center"
                    >
                      <div className="flex justify-center items-center w-[45px] h-[40px] rounded-[9px] bg-[#E8F6ED]">
                        <IoDocumentTextOutline style={{}} color="#00A652" />
                      </div>
                      <div className="flex flex-col ml-4 justify-start items-start">
                        <h6 className="font-medium text-sm">
                          {file.fileName ||
                            truncateString(file.name.split("|")[1], 20)}
                        </h6>
                        <p className="text-xs leading-[26px] font-normal text-[#00000080]">
                          Uploaded on : {moment(file.createdAt).format("L")}{" "}
                        </p>
                      </div>
                      <div className="ml-auto mr-4">
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
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                    onClick={() =>
                                      router.push(
                                        `/home/documents/files/${file.id}`
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
                                    Rename{" "}
                                  </p>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <p
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                    onClick={() => {
                                      toast.error(
                                        "You dont have the right permission"
                                      );
                                    }}
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
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
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
                  ))}
                  <div className="w-full mt-auto">
                    <SSButton
                      onClick={() => setOpenFileModal(true)}
                      className="w-full h-[50px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer ml-auto"
                    >
                      + Upload new File
                    </SSButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[30%] rounded-[10px] flex flex-col justify-center items-start">
            <div className="w-full pl-5 pt-5 bg-white">
              <h1 className="font-semibold text-[20px]">Storage Capicity</h1>
              <div className="h-[200px]">
                <PieChart
                  width={100}
                  height={100}
                  animate={true}
                  viewBoxSize={[200, 150]}
                  center={[100, 77]}
                  totalValue={100}
                  data={[
                    {
                      title: "Used",
                      value: pieChartData.upper,
                      color: "#FBBC05",
                    },
                    {
                      title: "Free Space",
                      value: pieChartData.lower,
                      color: "#1877f2",
                    },
                  ]}
                  labelPosition={90}
                  label={({ x, y, dx, dy, dataEntry }) => {
                    return (
                      <g fill="#fff">
                        <circle
                          cx={x + dx}
                          cy={y + dy}
                          r={12}
                          fill="white"
                          style={{
                            stroke: "black",
                            strokeWidth: "1",
                            strokeOpacity: "0.1",
                          }}
                        ></circle>
                        <text
                          x={x}
                          y={y}
                          dx={dx}
                          dy={dy}
                          fill="#000"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{
                            fontWeight: 600,
                            fontSize: "10px",
                            textAlign: "center",
                            textAnchor: "center",
                            fontFamily: "TT Commons",
                          }}
                        >{`${Math.round(dataEntry.value)}%`}</text>
                      </g>
                    );
                  }}
                />
              </div>
              <div className="flex w-full justify-between items-center px-10 mb-5">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#FBBC05]" />
                  <p className="font-normal text-xs">Used</p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#1877F2]" />
                  <p className="font-normal text-xs">Free</p>
                </div>
              </div>
            </div>
            <div className="w-full min-h-[350px] mt-5 pt-2 rounded-[10px] flex flex-col justify-start items-start  bg-white">
              <div className="w-full p-5 border-b  border-b-[#0000000d] flex justify-between items-center">
                <h1 className="font-semibold text-[20px]">Recent Activity</h1>
                <p className="cursor-pointer font-normal text-base leading-[26px] ">
                  View All {">"}
                </p>
              </div>
              <div className="w-full mt-10 flex justify-center items-center">
                No activities
              </div>
            </div>
          </div>
        </div>
        {planData && !planData?.isPlanActive && (
          <Elements stripe={stripePromise}>
            <SSSubcriptionModal
              subscriptionModal={subscriptionModal}
              setSubscriptionModal={setSubscriptionModal}
            />
          </Elements>
        )}
        <SSModal
          isOpen={renameModal.visible}
          onClose={() => {
            setRenameModal({ visible: false, id: null });
            setOldFIle(null);
          }}
        >
          <Formik
            initialValues={{ fileName: oldFile || "" }}
            enableReinitialize
            onSubmit={(values) => {
              dispatch(
                renameUserfiles({
                  id: renameModal.id,
                  fileName: values.fileName,
                })
              )
                .unwrap()
                .then(() => {
                  dispatch(getUserfiles());
                  setRenameModal({ visible: false, id: null });
                  setOldFIle(null);
                });
            }}
          >
            {({ handleSubmit, resetForm }) => (
              <Form onSubmit={handleSubmit}>
                <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <h1 className="font-bold text-[22px]">
                        Rename this file
                      </h1>
                    </div>
                    <div
                      onClick={() => setRenameModal({ visible: false })}
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
                        name="fileName"
                        placeholder="Type here..."
                      />
                    </div>
                    <div className="ml-auto w-full mt-5">
                      <SSButton
                        type="submit"
                        isLoading={fileLoading}
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
        <SSModal
          isOpen={openFolderModal}
          onClose={() => {
            setOpenFolderModal(false);
            setOldFolder(null);
            setFolderId(null);
          }}
        >
          <Formik
            initialValues={{ folderName: oldFolder || "" }}
            enableReinitialize
            onSubmit={(values) => {
              if (folderId) {
                dispatch(
                  putUserFolders({ name: values.folderName, id: folderId })
                )
                  .unwrap()
                  .then(() => {
                    dispatch(getUserFolders());
                    setOpenFolderModal(false);
                    setOldFolder(null);
                    setFolderId(null);
                  });
              } else {
                dispatch(postUserFolders({ name: values.folderName }))
                  .unwrap()
                  .then(() => {
                    dispatch(getUserFolders());
                    setOpenFolderModal(false);
                  });
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <h1 className="font-bold text-[22px]">
                        Create New Folder
                      </h1>
                    </div>
                    <div
                      onClick={() => {
                        setOpenFolderModal(false);
                        setOldFolder(null);
                        setFolderId(null);
                      }}
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
                        name="folderName"
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
        {permissionModal.visible && (
          <SSPermissionModal
            permissionModal={permissionModal}
            setPermissionModal={setPermissionModal}
          />
        )}
        <SSModal isOpen={openFileModal} onClose={() => {}}>
          <Formik
            initialValues={{ folderName: "" }}
            enableReinitialize
            onSubmit={(values) => {
              dispatch(postUserFolders({ name: values.folderName }))
                .unwrap()
                .then(() => {
                  dispatch(getUserFolders());
                  setOpenFileModal(false);
                });
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <h1 className="font-bold text-[20px]">
                        Select Information type
                      </h1>
                    </div>
                    <div
                      onClick={() => setOpenFileModal(false)}
                      className="w-[60px] h-[60px] flex justify-center items-center cursor-pointer rounded-full bg-[#F5F5F5]"
                    >
                      <RxCross2 size={30} />
                    </div>
                  </div>
                  <div className="w-full my-5 md:px-8">
                    <div
                      onClick={() => docRef.current.click()}
                      className="w-full cursor-pointer hover:bg-[#F4F4F4] rounded-[10px]"
                    >
                      <SSInput
                        inputRef={docRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        size="hidden absolute"
                        name="profileImage"
                        value=""
                        onChange={handleFileUpload}
                      />
                      <div className="w-full border border-[#00000080] rounded-[10px] font-medium text-base flex justify-center items-center py-4">
                        Document
                      </div>
                    </div>
                    <div
                      onClick={() => imageRef.current.click()}
                      className="w-full mt-5 cursor-pointer hover:bg-[#F4F4F4] rounded-[10px]"
                    >
                      <SSInput
                        inputRef={imageRef}
                        type="file"
                        accept="image/*"
                        size="hidden absolute"
                        name="profileImage"
                        value=""
                        onChange={handleFileUpload}
                      />
                      <div className="w-full border border-[#00000080] rounded-[10px] font-medium text-base flex justify-center items-center py-4">
                        Photo
                      </div>
                    </div>
                    <div className="relative mx-auto w-full mt-5">
                      <SSSelect
                        label="Select Password Type"
                        name="select"
                        options={PasswordTypeFormList}
                        fieldTitle="label"
                        fieldValue="value"
                        fieldClickOption="onClick"
                        boxSize="w-full h-[50px]"
                        labelClassName="text-black text-center"
                        isLabelInMiddle
                      />
                    </div>
                    <div
                      onClick={() => videoRef.current.click()}
                      className="w-full mt-5 cursor-pointer hover:bg-[#F4F4F4] rounded-[10px]"
                    >
                      <SSInput
                        inputRef={videoRef}
                        type="file"
                        accept="video/*"
                        size="hidden absolute"
                        name="profileImage"
                        value=""
                        onChange={handleFileUpload}
                      />
                      <div className="w-full border border-[#00000080] rounded-[10px] font-medium text-base flex justify-center items-center py-4">
                        Video
                      </div>
                    </div>
                    <div
                      onClick={() => uploadRef.current.click()}
                      className="w-full mt-5 cursor-pointer hover:bg-[#F4F4F4] rounded-[10px]"
                    >
                      <SSInput
                        inputRef={uploadRef}
                        type="file"
                        size="hidden absolute"
                        name="profileImage"
                        value=""
                        onChange={handleFileUpload}
                      />
                      <div className="w-full border border-[#00000080] rounded-[10px] font-medium text-base flex justify-center items-center py-4">
                        Upload from device
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          {fileLoading && (
            <div className="absolute top-0 left-0 flex bg-[#00000020] justify-center items-center w-full opacity-[80] h-full border">
              <Loading width="w-[100px]" height="h-[100px]" />
            </div>
          )}
        </SSModal>
      </div>
      <div className="block md:hidden pb-10">
        <div className="w-full relative flex md:hidden justify-center items-start mt-5">
          <div className="w-full grid grid-cols-2 gap-2 justify-center px-3">
            {fileCountData?.map((file, index) => (
              <div
                key={index}
                style={{
                  background: file.color,
                }}
                className={`max-w-[180px] h-[80px] w-full whitespace-nowrap rounded-[10px] gap-4 md:p-4 xl:p-5 flex justify-center items-center`}
              >
                <div className="flex flex-col justify-center items-start">
                  <h1 className="font-semibold md:text-[26px] xl:text-[32px]">
                    {file.count || 0}
                  </h1>
                  <p className="font-normal md:text-[18px] xl:text-[22px] leading-[26px]">
                    {file?.type}
                  </p>
                </div>
                <div className="w-[46px] h-[46px] rounded-full border flex justify-center items-center border-[#00000033">
                  <IoDocumentTextOutline />
                </div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-20 right-5 z-[99]">
            <AiFillPlusCircle
              className="block md:hidden text-[#00A652] relative z-[99] cursor-pointer"
              size={70}
              onClick={() => setOpenFileFolderModal(true)}
            />
            <SSModal
              isOpen={openFileFolderModal}
              onClose={() => setOpenFileFolderModal(false)}
            >
              <div className="text-lg font-bold mb-5">What you want to do?</div>
              <div className="flex flex-col gap-5">
                <div
                  onClick={() => setOpenFileModal(true)}
                  className="w-full border border-[#00000080] rounded-[10px] font-medium text-base flex justify-center items-center py-4"
                >
                  Upload a file
                </div>
                <div
                  onClick={() => setOpenFolderModal(true)}
                  className="w-full border border-[#00000080] rounded-[10px] font-medium text-base flex justify-center items-center py-4"
                >
                  Create New Folder
                </div>
              </div>
            </SSModal>
          </div>
        </div>
        <div className="my-5 px-3">
          <div className=" h-5 rounded-sm bg-gray-200">
            <div
              className="h-5 rounded-sm bg-[#FBBC05]"
              style={{
                width: `${(
                  100 -
                  (profile.storageLeft / profile.storage) * 100
                ).toFixed(3)}%`,
              }}
            ></div>
          </div>
          <div className="flex w-full justify-center gap-10 mt-5 items-center px-10 mb-5">
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FBBC05]" />
              <p className="font-normal text-xs">Used</p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <p className="font-normal text-xs">Free</p>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-2 px-3 mt-5">
          {FoldersList?.map((folder, index) => (
            <div
              onDoubleClick={() =>
                router.push(`home/documents/folder/${folder.id}`)
              }
              key={index}
              className="cursor-pointer w-[160px] h-[95px] px-4 pt-2 rounded-[10px] border border-[#00a6521a] flex justify-between items-start"
            >
              <div className="flex flex-col justify-center items-start">
                <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#FEEBE1]">
                  <Image src={FolderLogo} width={10} height={10} alt="" />
                </div>
                <h3 className="font-semibold truncate text-xs mt-2">
                  {" "}
                  {folder.name.split("|")[0]}
                </h3>
                <p className="font-normal text-[#00000080] text-xs leading-[26px]">
                  {folder.files?.length} file
                </p>
              </div>
              <div>
                <Menu as="div" className="relative mt-2">
                  <div>
                    <Menu.Button className="flex relative max-w-xs items-center rounded-full bg-white text-sm focus:outline-none lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      <IoEllipsisHorizontalOutline
                        color={"#00000066"}
                        className="rotate-90"
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <p
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            onClick={() =>
                              router.push(`home/documents/folder/${folder.id}`)
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
                            onClick={() => {
                              setOpenFolderModal(true);
                              setFolderId(folder.id);
                            }}
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
                                deleteUserFoldersData({
                                  id: folder.id,
                                })
                              )
                                .unwrap()
                                .then(() => {
                                  dispatch(getUserFolders());
                                  dispatch(getUserfiles());
                                })
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
                              setPermissionModal({
                                visible: true,
                                permType: "folder_id",
                                id: folder.id,
                              })
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
          ))}
        </div>
        <div className="w-full grid grid-cols-2 gap-2 px-3 mt-5">
          {FilesList?.map((file, index) => (
            <div
              key={index}
              onDoubleClick={() =>
                router.push(`/home/documents/files/${file.id}`)
              }
              className="cursor-pointer w-[160px] h-[95px] rounded-[10px] border border-[#00a6521a] flex flex-col py-4 justify-center items-center"
            >
              <div className="w-full relative flex justify-center mb-3">
                <div className="flex justify-center items-center w-[45px] h-[40px] rounded-[9px] bg-[#E8F6ED]">
                  <IoDocumentTextOutline style={{}} color="#00A652" />
                </div>
                <div className="absolute right-5 top-2">
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex relative max-w-xs items-center rounded-full bg-white text-sm focus:outline-none lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                        <IoEllipsisHorizontalOutline
                          color={"#00000066"}
                          className="rotate-90"
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <p
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                              onClick={() =>
                                router.push(`/home/documents/files/${file.id}`)
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
                                setRenameModal({
                                  visible: true,
                                  id: file.id,
                                })
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
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                              onClick={() => {
                                dispatch(deleteUserfiles({ id: file.id }))
                                  .unwrap()
                                  .then(() => dispatch(getUserfiles()));
                              }}
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
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                              onClick={() =>
                                setPermissionModal({
                                  visible: true,
                                  permType: "file_id",
                                  id: file.id,
                                })
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
              <div className="flex flex-col justify-start items-start">
                <h6 className="font-medium truncate text-sm">
                  {file.fileName || truncateString(file.name.split("|")[1], 20)}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
