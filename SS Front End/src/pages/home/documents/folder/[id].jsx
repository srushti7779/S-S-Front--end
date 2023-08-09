import Loading from "@/components/Loading";
import SSButton from "@/components/form/SSButton";
import SSInput from "@/components/form/SSInput";
import SSModal from "@/components/form/SSModal";
import { deleteUserfiles, postUserfiles } from "@/redux/slices/fileSlice";
import { getUserFoldersData } from "@/redux/slices/folderSlice";
import { Menu, Transition } from "@headlessui/react";
import FileImage from "../../../../assests/images/file1.png";
import NoFileImage from "../../../../assests/images/nofile.svg";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  IoDocumentOutline,
  IoDocumentTextOutline,
  IoEllipsisHorizontalOutline,
  IoImageOutline,
  IoMusicalNoteOutline,
} from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import SSPermissionModal from "@/components/modals/SSPermissionModal";
import { AiFillPlusCircle } from "react-icons/ai";

const FolderWithTheFile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const docRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const uploadRef = useRef();
  const [openFileModal, setOpenFileModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState({
    visible: false,
  });
  const { fileLoading, deleteFileLoading, folderData } = useSelector(
    (state) => ({
      fileLoading: state.fileSlice.fileLoading,
      deleteFileLoading: state.fileSlice.deleteFileLoading,
      folderData: state.folderSlice.folderData,
    })
  );

  const handleFileUpload = (e) => {
    const docFile = e.target.files[0];
    const file = new FormData();
    file.append("file", docFile);
    file.append("folderId", router.query.id);
    dispatch(postUserfiles(file))
      .unwrap()
      .then(() => {
        dispatch(getUserFoldersData({ id: router.query.id }));
        setOpenFileModal(false);
      });
  };

  useEffect(() => {
    if (router.query && router.query.id) {
      dispatch(getUserFoldersData({ id: router.query.id }));
    }
  }, [router]);

  return (
    <>
      <div className="absolute top-7 xl:top-10 left-14 xl:left-[50%]">
        <h1 className="font-semibold text-base xl:text-[31px]">
          Folder {">"} {folderData?.name.split("|")[0]}
        </h1>
      </div>
      <div className="w-full flex justify-center items-start min-h-[85vh]">
        <div className="px-10 max-w-7xl flex flex-col justify-center items-start gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
          <div className="w-full flex justify-between items-center">
            <div className="font-semibold text-xl">Add File</div>
            <div>
              <SSButton
                className="hidden xl:block w-[350px]"
                onClick={() => setOpenFileModal(true)}
              >
                + Upload documents
              </SSButton>
              <AiFillPlusCircle
                onClick={() => setOpenFileModal(true)}
                className="block xl:hidden text-[#00A652] cursor-pointer"
                size={40}
              />
            </div>
          </div>
          <div
            className={classNames(
              "xl:px-10 max-w-7xl w-full bg-transparent rounded-[20px] mx-auto my-10 relative",
              Boolean(folderData?.files.length)
                ? "grid grid-cols-1 xl:grid-cols-4 gap-5"
                : "flex"
            )}
          >
            {Boolean(folderData?.files.length) ? (
              <>
                {!deleteFileLoading ? (
                  folderData?.files.map((item, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer hover:shadow-lg hover:ring-offset-0 hover:ring-opacity-25 transition-all duration-100  px-5 py-4 max-w-[290px] min-w-[150px] w-full h-[120px] xl:h-[173px] bg-white rounded-[7px] "
                    >
                      <div className="w-full flex justify-between items-center">
                        <div className="flex justify-center items-center w-[40px] h-[40px] rounded-full bg-[#00A6521A]">
                          {item.ext.toLowerCase().includes("pdf") ? (
                            <IoDocumentTextOutline
                              color="#00A652"
                              size="24px"
                            />
                          ) : item.ext
                              .toLowerCase()
                              .includes("jpeg" || "jpg" || "png" || "webp") ? (
                            <IoImageOutline color="#FF5F5F" size="24px" />
                          ) : item.ext
                              .toLowerCase()
                              .includes("mp3" || "wav") ? (
                            <IoMusicalNoteOutline color="#1877F2" size="24px" />
                          ) : (
                            <IoDocumentOutline color="#00A652" size="24px" />
                          )}
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
                                          `/home/documents/files/${item?.id}`
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
                                        dispatch(
                                          deleteUserfiles({ id: item.id })
                                        )
                                          .unwrap()
                                          .then(() =>
                                            dispatch(
                                              getUserFoldersData({
                                                id: router.query.id,
                                              })
                                            )
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
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                      onClick={() =>
                                        setPermissionModal({
                                          visible: true,
                                          permType: "file_id",
                                          id: item.id,
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
                      <div className="font-medium truncate line-clamp-2 text-base mt-5 capitalize">
                        {item?.name.split("|")[1]}
                      </div>
                      {permissionModal.visible && (
                        <SSPermissionModal
                          permissionModal={permissionModal}
                          setPermissionModal={setPermissionModal}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="absolute w-full rounded-[10px] h-[173px] top-0 left-0 flex justify-center items-center opacity-[80] ">
                    <Loading
                      className="text-[#00A652]"
                      width="w-[50px]"
                      height="h-[50px]"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-[45vh] flex flex-col justify-center items-center">
                <Image priority src={NoFileImage} width={180} height={180} />
                <h1 className="font-medium text-[22px] whitespace-nowrap mt-[30px]">
                  Uploaded file will be displayed here
                </h1>
              </div>
            )}
          </div>
        </div>
        <SSModal isOpen={openFileModal} onClose={() => setOpenFileModal(false)}>
          <Formik initialValues={{ folderName: "" }} enableReinitialize>
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <h1 className="font-bold text-[20px]">
                        Select File type
                      </h1>
                    </div>
                    <div
                      onClick={() => setOpenFileModal(false)}
                      className="w-[60px] h-[60px] flex justify-center items-center cursor-pointer rounded-full bg-[#F5F5F5]"
                    >
                      <RxCross2 size={30} />
                    </div>
                  </div>
                  <div className="w-full my-5 px-8">
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
    </>
  );
};

export default FolderWithTheFile;
