import classNames from "classnames";
import { useField } from "formik";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SSInput = ({
  label,
  size,
  error,
  name,
  type,
  errorMessage,
  className,
  placeholder,
  disabled,
  labelClassName,
  StartIcon,
  EndIcon,
  inputRef,
  ...props
}) => {
  const [inputProps, { touched }, { setValue }] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className={classNames("relative ", size ? size : "w-full")}>
        <label
          className={classNames(
            "block font-medium text-xl leading-[30px]",
            labelClassName,
            !label && "hidden"
          )}
        >
          {label}
        </label>
        <div
          className={classNames(
            "mt-[7px] relative rounded-[10px]",
            size ? size : "w-full"
          )}
        >
          {type === "textarea" ? (
            <textarea
              {...inputProps}
              ref={inputRef}
              type={showPassword ? "text" : type}
              disabled={disabled}
              placeholder={placeholder}
              className={classNames(
                !className
                  ? `placeholder:text-xs md:placeholder:text-base focus:outline-none disabled:text-black disabled:cursor-not-allowed disabled:bg-gray-300 px-4 border border-[rgba(41, 45, 50, 0.2)] rounded-[10px] flex items-center`
                  : className,
                StartIcon && "pl-14 lg:pl-20",
                touched && error && "border-red-700"
              )}
              {...props}
            />
          ) : (
            <input
              {...inputProps}
              ref={inputRef}
              type={showPassword ? "text" : type}
              disabled={disabled}
              placeholder={placeholder}
              className={classNames(
                !className
                  ? `placeholder:text-xs md:placeholder:text-base focus:outline-none disabled:text-black disabled:cursor-not-allowed disabled:bg-gray-300 px-4 border border-[rgba(41, 45, 50, 0.2)] rounded-[10px] flex items-center`
                  : className,
                StartIcon && "pl-14 lg:pl-20",
                size ? size : "w-full h-[50px]",
                touched && error && "border-red-700"
              )}
              {...props}
            />
          )}
          {type === "password" &&
            (showPassword ? (
              <AiOutlineEyeInvisible
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 cursor-pointer top-[30%]"
                size={20}
              />
            ) : (
              <AiOutlineEye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 cursor-pointer top-[30%]"
                size={20}
              />
            ))}
          {StartIcon && (
            <div
              className={classNames(
                "absolute inset-y-0 left-[1px] flex items-center pointer-events-none",
                !StartIcon && "hidden"
              )}
            >
              {StartIcon}
            </div>
          )}
          {EndIcon && (
            <div
              className={classNames(
                "absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer",
                !EndIcon && "hidden"
              )}
            >
              {EndIcon}
            </div>
          )}
        </div>
        {error && touched && (
          <p className={classNames("text-xs  font-medium text-red-500")}>
            {errorMessage}
          </p>
        )}
      </div>
    </>
  );
};

export default SSInput;
