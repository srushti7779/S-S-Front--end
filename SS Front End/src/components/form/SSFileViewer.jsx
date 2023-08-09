import dynamic from "next/dynamic";

const MyFileViewer = dynamic(() => import("react-file-viewer"), { ssr: false });

const SSFileViewer = ({ url, ext, onError }) => {
  return typeof window !== "undefined" ? (
    <MyFileViewer fileType={ext} filePath={url} onError={onError} />
  ) : null;
};

export default SSFileViewer;
