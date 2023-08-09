import { useEffect, useState } from "react";
import classNames from "classnames";
import { Listbox } from "@headlessui/react";
import { useField } from "formik";
import { AiOutlineCaretDown } from "react-icons/ai";

const SSSelect = ({
  boxClassName,
  icon,
  fieldValue,
  fieldTitle,
  optionClassName,
  optionsClassName,
  labelClassName,
  boxSize,
  options,
  label,
  name,
  defaultValues,
  isLabelInMiddle,
  fieldClickOption,
  disabled,
  multiple,
}) => {
  const [selectedPerson, setSelectedPerson] = useState(defaultValues);
  const [isOpen, setIsOpen] = useState(false);
  const [field, meta] = useField(name);

  useEffect(() => {
    setSelectedPerson(defaultValues);
  }, [defaultValues]);

  const handleChange = (value) => {
    setSelectedPerson(value);
    field.onChange({ target: { value, name } });
  };

  return (
    <>
      <Listbox
        disabled={disabled}
        value={multiple ? selectedPerson : selectedPerson?.value}
        onChange={(value) => handleChange(value)}
        multiple={multiple}
      >
        <Listbox.Button
          onClick={() => setIsOpen(!isOpen)}
          open={isOpen}
          className={classNames(
            isLabelInMiddle ? "justify-center" : "justify-start",
            "disabled:bg-gray-300 ",
            boxClassName
              ? boxClassName
              : "whitespace-nowrap py-[10px] relative border border-[#00000080] rounded-[10px] flex items-center px-3",
            boxSize ? boxSize : "w-[210px] max-h-[43px] h-full",
            meta.error && meta.touched && "border border-red-500"
          )}
        >
          <div className="block truncate">
            <p
              className={classNames(
                labelClassName
                  ? labelClassName
                  : "font-medium text-lg leading-[22px] tracking-wide text-black",
                !selectedPerson && !defaultValues && "text-[#6B7280]"
              )}
            >
              {!selectedPerson
                ? label
                : multiple
                ? selectedPerson.map((data) => `${data.label},`)
                : selectedPerson}
            </p>
          </div>

          <div
            className={classNames(
              "pointer-events-none absolute right-5",
              isOpen && "rotate-180"
            )}
          >
            <AiOutlineCaretDown />
          </div>
        </Listbox.Button>
        <Listbox.Options
          className={classNames(
            optionsClassName
              ? optionsClassName
              : "border border-blue-dark rounded-[10px] overflow-auto overflow-x-hidden",
            "absolute z-30 max-h-[200px] w-full "
          )}
        >
          {options?.length > 0 ? (
            options.map((option, index) => (
              <Listbox.Option
                key={index}
                value={multiple ? option : option[fieldValue]}
                className={classNames(
                  "cursor-pointer",
                  optionClassName
                    ? optionClassName
                    : "bg-white whitespace-nowrap px-8 py-[10px] hover:bg-blue-100 flex items-center justify-center w-full"
                )}
                onClick={option[fieldClickOption]}
              >
                {option[fieldTitle]}
              </Listbox.Option>
            ))
          ) : (
            <div
              className={classNames(
                optionClassName
                  ? optionClassName
                  : "bg-white whitespace-nowrap px-8 py-[80px] flex items-center justify-center w-full"
              )}
            >
              No Data to show
            </div>
          )}
        </Listbox.Options>
      </Listbox>
      {meta.error && meta.touched ? (
        <div className="text-red-500 absolute top-10">{meta.error}</div>
      ) : (
        ""
      )}
    </>
  );
};

export default SSSelect;
