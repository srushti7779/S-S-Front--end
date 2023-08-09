import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import SSFileViewer from "@/components/form/SSFileViewer";
import { viewUserfiles } from "@/redux/slices/fileSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

const ViewFiles = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [ext, setExt] = useState("");
  const [doc, setDoc] = useState("");
  const { fileLoading, fileData: document } = useSelector((state) => ({
    fileLoading: state.fileSlice.fileLoading,
    fileData: state.fileSlice.fileData,
  }));

  useEffect(() => {
    if (router.query && router.query.id) {
      dispatch(viewUserfiles({ id: router.query.id }));
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (document) {
      const docum = encodeURIComponent(document.url);
      setExt(document.ext);
      setUrl(document.url);
      setDoc(docum);
    }
  }, [document]);

  const onError = (e) => {
    console.log(e);
  };

  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="absolute top-7 xl:top-10 left-14 xl:left-[45%]">
        <h1 className="font-semibold text-base xl:text-[31px]">
          {document
            ? document?.fileName || document?.name?.split("|")[1]
            : "No files to show"}
        </h1>
      </div>
      <div className="px-10 max-w-7xl flex flex-col justify-center items-start gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
        {Boolean(url && ext)
          ? document && (
              <div className="w-full h-[75vh] flex items-center justify-center">
                {ext === "pdf" && (
                  <SSFileViewer
                    ext={ext.toLowerCase()}
                    url={url}
                    onError={onError}
                  />
                )}
                {(document.mime_type === "application/vnd.ms-excel" ||
                  document.mime_type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                  document.mime_type === "application/msword" ||
                  document.mime_type === "application/wps-office.docx" ||
                  document.mime_type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                  document.mime_type === "application/vnd.ms-powerpoint" ||
                  document.mime_type ===
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation") && (
                  <iframe
                    title="document"
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${doc}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                  >
                    This is an embedded
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="http://office.com"
                    >
                      Microsoft Office
                    </a>
                    document, powered by
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="http://office.com/webapps"
                    >
                      Office Online
                    </a>
                    .
                  </iframe>
                )}
                {(document.mime_type === "image/png" ||
                  document.mime_type === "image/jpg" ||
                  document.mime_type === "image/svg+xml" ||
                  document.mime_type === "image/jpeg") && (
                  <img
                    style={{
                      objectFit: "contain",
                      objectPosition: "50% 0%",
                      height: "inherit",
                    }}
                    src={document.url || document.hyperlink}
                  />
                )}
                {(document.mime_type === "video/mp4" ||
                  document.mime_type === "video/webm" ||
                  document.mime_type === "video/ogg" ||
                  document.mime_type === "video/quicktime" ||
                  document.mime_type === "video/x-msvideo" ||
                  document.mime_type === "video/x-flv" ||
                  document.mime_type === "video/x-matroska" ||
                  document.mime_type === "video/x-ms-wmv") && (
                  <video controls>
                    <source src={document.url} type={document.mime_type} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )
          : fileLoading && (
              <div className="absolute top-0 left-0 flex bg-[#00000020] justify-center items-center w-full opacity-[80] h-full border">
                <Loading width="w-[100px]" height="h-[100px]" />
              </div>
            )}
      </div>
    </div>
  );
};

export default ViewFiles;
