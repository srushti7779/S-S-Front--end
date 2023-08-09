import { PasswordsFolderList } from "@/utils/passwordsFolders";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { toast } from "react-hot-toast";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";

const Passwords = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="px-10 max-w-7xl grid grid-cols-1 xl:grid-cols-4 gap-5 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
        {PasswordsFolderList.map((folders, index) => (
          <div
            key={index}
            onDoubleClick={() =>
              router.push(`/home/passwords/${folders?.navigate}`)
            }
            className="cursor-pointer hover:shadow-lg hover:ring-offset-0 hover:ring-opacity-25 transition-all duration-100 px-5 py-4 max-w-[290px] min-w-[150px] w-full h-[173px] bg-white rounded-[7px] "
          >
            <div className="w-full flex justify-between items-center">
              <div
                className="flex justify-center items-center w-[40px] h-[40px] rounded-full"
                style={{ background: folders?.bg }}
              >
                <Image
                  priority
                  src={folders?.icon}
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
                                `/home/passwords/${folders?.navigate}`
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
                              toast.error("You can't delete root folders")
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
            <div className="font-semibold text-[20px] mt-5">
              {folders?.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Passwords;
