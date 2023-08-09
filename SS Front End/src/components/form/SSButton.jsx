import classNames from "classnames";
import React from "react";
import Loading from "../Loading";

const SSButton = ({
  className,
  type,
  onClick,
  isLoading,
  icon,
  disabled,
  children,
  color,
  props,
}) => {
  return (
    <button
      className={classNames(
        "flex justify-center items-center gap-2 cursor-pointer disabled:bg-[#00A63080]",
        isLoading && "bg-[#00A10080]",
        "w-[104px] h-[48px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer",
        className,
        color
      )}
      onClick={onClick}
      type={type}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Loading /> : ""}
      {icon && <div>{icon}</div>}
      {children}
    </button>
  );
};

export default SSButton;
