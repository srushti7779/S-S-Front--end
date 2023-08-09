import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3CenterLeftIcon,
  BellIcon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import Logo2 from "../../assests/images/store12.png";
import Link from "next/link";
import Home from "../../assests/icons/Home";
import Buddies from "@/assests/icons/Buddies";
import Documents from "@/assests/icons/Documents";
import AboutUS from "@/assests/icons/AboutUS";
import { useRouter } from "next/router";
import { authGetUserProfile } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { removeUserToken } from "@/utils/helper";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import Loading from "../Loading";
import { getPlansActivity } from "@/redux/slices/paymentSlice";
import { AiOutlineHome, AiOutlineInfoCircle } from "react-icons/ai";
import { MdPeopleOutline } from "react-icons/md";
import { BiSolidLockOpen, BiSolidLockOpenAlt } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { BsPersonCircle } from "react-icons/bs";
import { HiFolderPlus } from "react-icons/hi2";
import { IoShare, IoShareOutline } from "react-icons/io5";
import { getNotificationList } from "@/redux/slices/notification";

const statusStyles = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SSSideBar = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isCurrent = (path) => router.pathname.includes(path);
  const navigation = [
    {
      name: "Home",
      href: "/home",
      icon: <AiOutlineHome className="text-[25px] mr-3" />,
      current: router.pathname === "/home",
      style: "fill-[#00a654]",
    },
    {
      name: "My Buddies",
      href: "/home/buddies",
      icon: <MdPeopleOutline className="text-[25px] mr-3" />,
      current: isCurrent("/buddies"),
      style: "fill-[#00a654]",
    },
    {
      name: "Passwords",
      href: "/home/passwords",
      icon: <BiSolidLockOpenAlt className="text-[25px] mr-3" />,
      current: isCurrent("/passwords"),
      style: "fill-[#00a654]",
    },
    {
      name: "Documents",
      href: "/home/documents",
      icon: <CgFileDocument className="text-[25px] mr-3" />,
      current: isCurrent("/documents"),
      style: "fill-[#00a654]",
    },
    {
      name: "Shared With Me",
      href: "/home/shared-with-me",
      icon: <CgFileDocument className="text-[25px] mr-3" />,
      current: isCurrent("/shared-with-me"),
      style: "fill-[#00a654]",
    },
    {
      name: "About Us",
      href: "/home/about-us",
      icon: <AiOutlineInfoCircle className="text-[25px] mr-3" />,
      current: isCurrent("/about-us"),
    },
  ];
  const { userProfile, notificationList, profileLoading } = useSelector(
    (state) => ({
      userProfile: state.userAuth.userProfile,
      notificationList: state.notificationSlice.notificationList,
      profileLoading: state.userAuth.profileLoading,
    })
  );

  useEffect(() => {
    dispatch(authGetUserProfile());
    dispatch(getNotificationList());
  }, [dispatch]);

  return (
    <>
      <div className="min-h-full">
        <div className="fixed xl:hidden bottom-0 z-10">
          <div class="fixed z-10 w-full h-12 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 ">
            <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
              <button
                data-tooltip-target="tooltip-home"
                type="button"
                className={`inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-50 dark:hover:bg-[#00A652] ${
                  router.pathname === "home" && "dark:bg-[#00A652]"
                } group`}
                onClick={() => router.push("/home")}
              >
                <svg
                  className="w-5 h-5 mb-1 text-gray-500 dark:text-[#00A652] group-hover:text-blue-600 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                <span className="sr-only">Home</span>
              </button>
              <button
                data-tooltip-target="tooltip-wallet"
                type="button"
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-[#00A652] group"
                onClick={() => router.push("/home/passwords")}
              >
                <BiSolidLockOpen
                  size={25}
                  className="text-[#00A652] hover:text-white"
                />
                <span className="sr-only">Wallet</span>
              </button>
              <div
                className="flex items-center justify-center bg-transparent"
                onClick={() => router.push("/home/buddies")}
              >
                <button data-tooltip-target="tooltip-new" type="button">
                  <BsPersonCircle
                    className="shadow-2xl bg-white rounded-full text-[#00A652] relative -top-3"
                    size={50}
                  />
                  <span className="sr-only">New item</span>
                </button>
              </div>
              <button
                data-tooltip-target="tooltip-settings"
                type="button"
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-[#00A652] group"
                onClick={() => router.push("/home/documents")}
              >
                <HiFolderPlus
                  size={25}
                  className="text-[#00A652] hover:text-white"
                />
                <span className="sr-only">Settings</span>
              </button>
              <button
                data-tooltip-target="tooltip-profile"
                type="button"
                className="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-50 dark:hover:bg-[#00A652] group"
                onClick={() => router.push("/home/shared-with-me")}
              >
                <IoShare
                  size={25}
                  className="text-[#00A652] hover:text-white"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-64 xl:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto bg-white pb-4 pt-5">
            <div className="flex flex-shrink-0 gap-4 items-center px-4">
              <div className="relative w-12 h-12">
                <Image
                  className="h-8 w-8"
                  src={Logo2}
                  style={{ objectFit: "cover" }}
                  alt="Easywire logo"
                  fill
                />
              </div>
              <h1 className="font-bold text-2xl">S & S Vault</h1>
            </div>
            <nav
              className="mt-5 flex flex-1 flex-col justify-between overflow-y-auto"
              aria-label="Sidebar"
            >
              <div className="space-y-6 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-[#00A652] text-white"
                        : "text-black hover:bg-[#00A652] hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 w-52 text-sm font-medium leading-6"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
              <div
                className="flex w-full px-4 py-2 cursor-pointer"
                onClick={() => {
                  removeUserToken();
                  router.push("/auth/login");
                }}
              >
                <ArrowRightOnRectangleIcon
                  className="mr-4 h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                Logout
              </div>
            </nav>
          </div>
        </div>

        {router.pathname !== "/home/profile" ? (
          <div className="flex flex-1 flex-col xl:pl-64 pt-7">
            <div className="flex h-16 flex-shrink-0 bg-transparent">
              <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
                {router.pathname === "/home/buddies" && (
                  <h1 className="font-semibold text-4xl">My Buddies</h1>
                )}
                {(router.pathname.includes("/passwords") ||
                  router.pathname.includes("/passwords-forms") ||
                  router.pathname.includes("/documents") ||
                  router.pathname.includes("/notify") ||
                  router.pathname.includes("/about-us") ||
                  router.pathname.includes("/transactions") ||
                  router.pathname.includes("/shared-with-me")) && (
                  <div
                    onClick={() => router.back()}
                    className="flex justify-center cursor-pointer items-center w-[20px] h-[20px] xl:w-[64px] xl:h-[55px] rounded-[15px] bg-white shadow-lg ring-offset-0 ring-opacity-25"
                  >
                    <FaArrowLeft size={20} />
                  </div>
                )}
                {router.pathname === "/home/passwords" && (
                  <h1 className="font-semibold text-base xl:text-4xl">
                    Password Types
                  </h1>
                )}
                {router.pathname === "/home/settings/transactions" && (
                  <h1 className="font-semibold text-base xl:text-4xl">
                    My Transactions
                  </h1>
                )}
                {router.pathname === "/home/shared-with-me" && (
                  <h1 className="font-semibold text-base xl:text-4xl">
                    Shared With Me
                  </h1>
                )}
                {router.pathname === "/home/verify-user" && (
                  <h1 className="font-semibold text-base xl:text-4xl">
                    Verify Yourself
                  </h1>
                )}
                {router.pathname === "/home/about-us" && (
                  <h1 className="font-semibold text-base xl:text-4xl">
                    About Us
                  </h1>
                )}
                {router.pathname === "/home/notify" && (
                  <h1 className="font-semibold text-base xl:text-4xl">
                    Notification
                  </h1>
                )}
                {router.pathname === "/home/documents" && (
                  <h1 className="font-semibold text-base xl:text-4xl">
                    My Documents
                  </h1>
                )}
                {router.pathname === "/home" && (
                  <>
                    <div className="flex xl:hidden justify-center items-center gap-3 -top-3 relative">
                      <div className="relative w-8 h-8">
                        <Image
                          className="h-6 w-6"
                          src={Logo2}
                          style={{ objectFit: "cover" }}
                          alt="Easywire logo"
                          fill
                        />
                      </div>
                      <h1 className="font-bold text-xl">S & S Vault</h1>
                    </div>
                    <div className="hidden xl:flex flex-col flex-1">
                      <h3>Welcome, 👋</h3>
                      <h1 className="font-semibold text-base xl:text-4xl">
                        {userProfile?.userAuth?.name}
                      </h1>
                    </div>
                  </>
                )}
                <div className="ml-4 flex gap-4 -top-4 relative xl:top-0 items-center md:ml-6">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex relative max-w-xs items-center rounded-full bg-white text-sm  lg:hover:bg-gray-50">
                        <div className=" bg-white w-10 h-10 xl:w-16 xl:h-14 flex justify-center items-center rounded-md border-2 border-black/10 text-gray-400 hover:text-gray-500 focus:outline-none">
                          <span className="sr-only">View notifications</span>
                          <Cog8ToothIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </div>
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
                            <Link
                              href="/home/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/home/settings/transactions"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Transactions
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/home/settings/transactions"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Recent Plan Details
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                              onClick={() => {
                                removeUserToken();
                                router.push("/auth/login");
                              }}
                            >
                              Logout
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <button
                    type="button"
                    className=" bg-white relative w-10 h-10 xl:w-16 xl:h-14 flex justify-center rounded-md items-center border-2 border-black/10 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => router.push("/home/notify")}
                  >
                    {notificationList?.length > 0 && (
                      <span className="absolute top-[15px] w-2 h-2 rounded-full bg-red-600 right-[17px]"></span>
                    )}
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  {router.pathname === "/home" && (
                    <Menu>
                      <div onClick={() => router.push("/home/profile")}>
                        <Menu.Button className="flex relative max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                          <Image
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                            src={userProfile?.profilePicture}
                            style={{ objectFit: "cover" }}
                            alt="user"
                          />
                          <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                            <span className="sr-only">Open user menu for </span>
                            {userProfile?.firstName}
                          </span>
                          <ChevronRightIcon
                            className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                    </Menu>
                  )}
                </div>
              </div>
            </div>
            <div className="px-5 flex md:hidden justify-between flex-1">
              <h3>Welcome, 👋</h3>
              <h1 className="font-semibold text-base xl:text-4xl">
                {userProfile?.userAuth?.name}
              </h1>
            </div>
            {Boolean(profileLoading) && (
              <div className="absolute z-40 top-0 left-0 flex bg-[#00000080] backdrop-blur-sm justify-center items-center w-full h-full border">
                <Loading width="w-[100px]" height="h-[100px]" />
              </div>
            )}
            <main className="flex-1 w-full pb-8">{children}</main>
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col xl:pl-64 mt-5">
            <main className="flex-1 pb-8">{children}</main>
          </div>
        )}
      </div>
    </>
  );
};

export default SSSideBar;
