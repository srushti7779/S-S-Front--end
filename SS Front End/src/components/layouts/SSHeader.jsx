import React, { Fragment } from "react";
import Logo from "../../assests/logos/Logo.svg";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";
import SSButton from "../form/SSButton";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SSHeader = () => {
  const router = useRouter();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Products", href: "/products" },
    { name: "How it works", href: "/how-it-works" },
    { name: "Login", href: "/auth/login" },
    { name: "SignUp", href: "/auth/sign-up" },
  ];

  return (
    <Disclosure
      as="nav"
      className="w-full px-10 xl:px-[76px] relative z-[99] py-5 "
    >
      {({ open }) => (
        <>
          <div className="">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="w-full flex justify-between items-center ">
                <div className="flex justify-center items-center gap-2">
                  <div>
                    <Image priority src={Logo} alt="logo" />
                  </div>
                  <div className="text-[#022714] leading-7 text-2xl font-bold">
                    S & S Vault
                  </div>
                </div>
                <div className="md:block hidden">
                  <div className="flex justify-center items-center gap-5 lg:gap-9 w-max">
                    <div
                      className={classNames(
                        "text-base",
                        router.pathname === "/"
                          ? "text-[#022714]"
                          : "text-[#02271480]"
                      )}
                    >
                      <Link href="/">Home</Link>
                    </div>
                    <div
                      className={classNames(
                        "text-base",
                        router.pathname === "/about-us"
                          ? "text-[#022714]"
                          : "text-[#02271480]"
                      )}
                    >
                      <Link href="/about-us">About Us</Link>
                    </div>
                    <div
                      className={classNames(
                        "text-base",
                        router.pathname === "/products"
                          ? "text-[#022714]"
                          : "text-[#02271480]"
                      )}
                    >
                      <Link href="/products">Products</Link>
                    </div>
                    <div
                      className={classNames(
                        "text-base",
                        router.pathname === "/how-it-works"
                          ? "text-[#022714]"
                          : "text-[#02271480]"
                      )}
                    >
                      <Link href="how-it-works">How it Works</Link>
                    </div>
                    <div className="flex justify-center items-center gap-5">
                      <div>
                        <button
                          className={classNames(
                            "rounded-lg cursor-pointer",
                            router.pathname.includes("/login")
                              ? "bg-[#00A652] text-white w-[104px] h-[48px]"
                              : "text-[rgb(2, 39, 20)] w-[60px] h-[48px]"
                          )}
                          onClick={() => router.push("/auth/login")}
                        >
                          Login
                        </button>
                      </div>
                      <button
                        className={classNames(
                          "rounded-lg cursor-pointer",
                          router.pathname.includes("/login")
                            ? "text-[rgb(2, 39, 20)] w-[60px] h-[48px]"
                            : "bg-[#00A652] text-white w-[104px] h-[48px] font-semibold"
                        )}
                        onClick={() => router.push("/auth/sign-up")}
                      >
                        SignUp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-500"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-500"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Disclosure.Panel className="md:hidden fixed right-0 w-full ">
              <div
                className={classNames(
                  "space-y-1 z-[99] relative px-2 pb-3 pt-2 bg-white w-full flex flex-col items-center gap-5 shadow-lg rounded-md "
                )}
              >
                {navigation.map((item) => (
                  <Disclosure.Button key={item.name} as="a" href={item.href}>
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default SSHeader;
