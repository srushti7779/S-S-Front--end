import PropTypes from "prop-types";
import { useRef } from "react";
import { Field, useField, useFormikContext } from "formik";
import { useState } from "react";
import SSInput from "./SSInput";
import OtpInput from "react-otp-input";

const SSCodes = ({ name, ...props }) => {
  const codesRef = useRef(null);
  const { setFieldValue } = useFormikContext();
  const [values, setValues] = useState("");

  return (
    <div className="flex justify-center" ref={codesRef}>
      <Field name={name}>
        {({ field }) => (
          <OtpInput
            value={values}
            onChange={setValues}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
          />
        )}
      </Field>
    </div>
  );
};

export default SSCodes;
