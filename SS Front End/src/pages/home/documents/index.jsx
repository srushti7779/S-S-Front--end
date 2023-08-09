import Loading from "@/components/Loading";
import SSButton from "@/components/form/SSButton";
import SSInput from "@/components/form/SSInput";
import SSModal from "@/components/form/SSModal";
import SSPermissionModal from "@/components/modals/SSPermissionModal";
import {
  deleteUserFoldersData,
  getUserFolders,
  getUserFoldersData,
  postUserFolders,
  putUserFolders,
} from "@/redux/slices/folderSlice";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillPlusCircle } from "react-icons/ai";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

const Documents = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    loading,
    folderList,
    userProfile: profile,
  } = useSelector((state) => ({
    loading: state.folderSlice.loading,
    folderList: state.folderSlice.folderList,
    userProfile: state.userAuth.userProfile,
  }));
  const [folderModal, setFolderModal] = useState(false);
  const [folderID, setFolderId] = useState();
  const [oldFolder, setOldFolder] = useState();
  const [permissionModal, setPermissionModal] = useState({
    visible: false,
  });

  useEffect(() => {
    dispatch(getUserFolders());
  }, []);

  useEffect(() => {
    if (folderID) {
      dispatch(getUserFoldersData({ id: folderID }))
        .unwrap()
        .then((res) => setOldFolder(res?.data.name.split("|")[0]));
    }
  }, [folderID]);

  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="px-10 max-w-7xl flex flex-col justify-center items-start gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold text-xl">Folders</div>
          <div>
            <SSButton
              className="hidden xl:block w-[150px]"
              onClick={() => setFolderModal(true)}
            >
              + Add Folder
            </SSButton>
            <AiFillPlusCircle
              onClick={() => setFolderModal(true)}
              className="block xl:hidden text-[#00A652] cursor-pointer"
              size={40}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 w-full">
          {folderList
            ?.filter((folder) => folder.name !== "root")
            .map((folders, index) => (
              <div
                key={index}
                onDoubleClick={() =>
                  router.push(`/home/documents/folder/${folders.id}`)
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
                                    `/home/documents/folder/${folders.id}`
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
                                  setPermissionModal({
                                    visible: true,
                                    permType: "folder_id",
                                    id: folders.id,
                                  })
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
                                  dispatch(
                                    deleteUserFoldersData({ id: folders.id })
                                  )
                                    .unwrap()
                                    .then(() => {
                                      dispatch(getUserFolders());
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
                                onClick={() => {
                                  setFolderModal(true);
                                  setFolderId(folders.id);
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
                <div className="capitalize font-semibold text-[20px] mt-5">
                  {folders.name.split("|")[0]}
                </div>
                <div className="capitalize font-normal text-[16px] text-[#00000080] mt-5">
                  {folders.files.length} Files
                </div>
              </div>
            ))}
        </div>
      </div>

      {permissionModal.visible && (
        <SSPermissionModal
          permissionModal={permissionModal}
          setPermissionModal={setPermissionModal}
        />
      )}
      <SSModal
        isOpen={folderModal}
        onClose={() => {
          setFolderModal(false);
          setOldFolder(null);
          setFolderId(null);
        }}
      >
        <Formik
          initialValues={{ folderName: oldFolder || "" }}
          enableReinitialize
          onSubmit={(values) => {
            if (folderID) {
              dispatch(
                putUserFolders({ name: values.folderName, id: folderID })
              )
                .unwrap()
                .then(() => {
                  dispatch(getUserFolders());
                  setFolderModal(false);
                  setOldFolder(null);
                  setFolderId(null);
                });
            } else {
              dispatch(postUserFolders({ name: values.folderName }))
                .unwrap()
                .then(() => {
                  dispatch(getUserFolders());
                  setFolderModal(false);
                });
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <h1 className="font-bold text-[22px]">Create New Folder</h1>
                  </div>
                  <div
                    onClick={() => {
                      setFolderModal(false);
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
        {loading && (
          <div className="absolute top-0 left-0 flex bg-[#00000020] justify-center items-center w-full opacity-[80] h-full border">
            <Loading width="w-[100px]" height="h-[100px]" />
          </div>
        )}
      </SSModal>
    </div>
  );
};

export default Documents;
