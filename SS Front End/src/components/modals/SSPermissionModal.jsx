import React, { useEffect, useState } from "react";
import SSModal from "../form/SSModal";
import { Form, Formik } from "formik";
import { RxCross2 } from "react-icons/rx";
import SSButton from "../form/SSButton";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePermission,
  getPermissionList,
  postPermission,
} from "@/redux/slices/permissionSlice";
import { BsPlusCircle } from "react-icons/bs";
import SSSelect from "../form/SSSelect";
import { getBuddyList } from "@/redux/slices/buddiesSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PERMISSION_FORM_TYPE_ENUMS } from "@/utils/helper";

const verificationPeriod = [
  {
    value: "Immediate Access",
    label: "Immediate Access",
  },
  {
    value: "Timed Release",
    label: "Timed Release",
  },
];

const SSPermissionModal = ({ permissionModal, setPermissionModal }) => {
  const dispatch = useDispatch();
  const [addPermissionModal, setAddPermissionModal] = useState(false);
  const [buddyListing, setBuddyListing] = useState([]);
  const { buddyList, permissionList, loading } = useSelector((state) => ({
    permissionList: state.permissionSlice.permissionList,
    loading: state.permissionSlice.loading,
    buddyList: state.buddiesSlice.buddyList,
  }));

  const data = {};
  if (permissionModal.permType) {
    data[permissionModal.permType] = permissionModal.id;
  } else if (permissionModal.form_type) {
    switch (permissionModal.form_type) {
      case "bankAccountId":
        data.form_type = PERMISSION_FORM_TYPE_ENUMS.BANK_ACCOUNT_FORM_TYPE_ENUM;
        break;
      case "creditCardId":
        data.form_type = PERMISSION_FORM_TYPE_ENUMS.CREDIT_CARD_FORM_TYPE_ENUM;
        break;
      case "loanAccountId":
        data.form_type = PERMISSION_FORM_TYPE_ENUMS.LOAN_ACCOUNT_FORM_TYPE_ENUM;
        break;
      case "merchantAccountId":
        data.form_type =
          PERMISSION_FORM_TYPE_ENUMS.MERCHANT_ACCOUNT_FORM_TYPE_ENUM;
        break;
      case "miscAccountId":
        data.form_type =
          PERMISSION_FORM_TYPE_ENUMS.MISC_PASSWORD_FORM_TYPE_ENUM;
        break;
      case "passwordStorageId":
        data.form_type =
          PERMISSION_FORM_TYPE_ENUMS.PASSWORD_STORAGE_FORM_TYPE_ENUM;
      default:
        break;
    }
    data[permissionModal.form_type] = permissionModal.id;
  }

  useEffect(() => {
    dispatch(getPermissionList(data));
    dispatch(getBuddyList())
      .unwrap()
      .then((res) => {
        const dataArray = [];
        const buddies = res?.buddies;
        if (buddies.length > 0) {
          for (const name in buddies) {
            const data = {};
            data.label = buddies[name].buddy.name;
            data.value = buddies[name].buddy.id;
            dataArray.push(data);
          }
        }
        setBuddyListing(dataArray);
      });
  }, []);

  return (
    <div>
      <SSModal isOpen={permissionModal.visible} onClose={() => {}}>
        <div className="w-full min-h-[400px] bg-white rounded-[20px] flex flex-col justify-start items-start">
          <div className="w-full flex justify-between items-center">
            <div>
              <h1 className="font-bold text-[28px]">Permissions</h1>
            </div>
            <div
              onClick={() => {
                setPermissionModal({ visible: false });
              }}
              className="w-[60px] h-[60px] flex justify-center items-center cursor-pointer rounded-full bg-[#F5F5F5]"
            >
              <RxCross2 size={30} />
            </div>
          </div>
          <div className="min-h-[350px] w-full flex flex-col mt-4 justify-start items-start gap-3">
            <div className="font-medium text-base">
              This file has been shared with
            </div>
            <div className="w-full min-h-[500px] h-full overflow-x-hidden overflow-y-auto">
              {Boolean(permissionList?.length > 0) ? (
                permissionList.map((perms, index) => (
                  <div
                    key={index}
                    className="w-full max-w-[500px] mx-auto border-b border-b-[#00000080] py-3 flex justify-between items-center"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-base">
                        {perms.buddy.name}
                      </p>
                      <p className="font-medium text-base text-[#00000080]">
                        {perms.buddy.email}
                      </p>
                      <p className="font-medium text-base text-[#00000080]">
                        {perms.instantReleaseDate
                          ? "Immediate Access"
                          : "Timed Release"}
                      </p>
                    </div>
                    <div>
                      <RiDeleteBin6Line
                        onClick={() =>
                          dispatch(
                            deletePermission({
                              id: perms.id,
                              buddyId: perms.buddy.id,
                            })
                          )
                            .unwrap()
                            .then(() => {
                              dispatch(getPermissionList(data));
                            })
                        }
                        className="text-[30px] text-[#00A652] cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <BsPlusCircle className="text-[100px] mx-auto mt-20 text-[#00A652]" />
              )}
            </div>

            <div className="w-full mt-auto">
              <SSButton
                type="submit"
                onClick={() => setAddPermissionModal(true)}
                className="w-[250px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer mx-auto"
              >
                Add new Permission
              </SSButton>
            </div>
          </div>
        </div>
      </SSModal>
      <SSModal
        isOpen={addPermissionModal}
        onClose={() => setAddPermissionModal(false)}
      >
        <Formik
          initialValues={{
            buddy_ids: "",
            verificationPeriod: "",
          }}
          enableReinitialize
          onSubmit={async (values) => {
            const permissionData = {};
            if (values.verificationPeriod === "Timed Release") {
              permissionData.timeReleaseDate = true;
            } else if (values.verificationPeriod === "Immediate Access") {
              permissionData.instantReleaseDate = true;
            }
            permissionData.buddy_ids = values.buddy_ids.map(
              (buddy) => buddy.value
            );
            if (permissionModal.permType) {
              permissionData[permissionModal.permType] = permissionModal.id;
            }
            if (permissionModal.form_type) {
              permissionData.form_type = data.form_type;
              permissionData[permissionModal.form_type] = permissionModal.id;
            }

            await dispatch(postPermission(permissionData))
              .unwrap()
              .then(() => {
                setAddPermissionModal(false);
                dispatch(getPermissionList(data));
              });
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="py-5">
              <div className="flex w-full justify-between items-center px-5">
                <h1 className="font-bold text-[28px] text-center">
                  Add Permissions
                </h1>
                <div
                  onClick={() => {
                    setAddPermissionModal(false);
                  }}
                  className="w-[60px] h-[60px] flex justify-center items-center cursor-pointer rounded-full bg-[#F5F5F5]"
                >
                  <RxCross2 size={30} />
                </div>
              </div>
              <div className="relative max-w-[512px] mx-auto w-full my-10">
                <label className="block font-medium text-xl leading-[30px] mb-1">
                  Whom do you want to share with
                </label>
                <SSSelect
                  label="Select buddies"
                  name="buddy_ids"
                  options={buddyListing}
                  fieldTitle="label"
                  fieldValue="value"
                  boxSize="w-full h-[50px]"
                  labelClassName="text-black"
                  multiple
                />
              </div>
              <div className="relative max-w-[512px] mx-auto w-full my-10">
                <label className="block font-medium text-xl leading-[30px] mb-1">
                  When do you want to share
                </label>
                <SSSelect
                  label="Select time period"
                  name="verificationPeriod"
                  options={verificationPeriod}
                  fieldTitle="label"
                  fieldValue="value"
                  boxSize="w-full h-[50px]"
                  labelClassName="text-black"
                />
              </div>
              <div className="mx-auto w-full mt-10">
                <SSButton
                  type="submit"
                  loading={loading}
                  className="w-[154px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer mx-auto"
                >
                  Submit
                </SSButton>
              </div>
            </Form>
          )}
        </Formik>
      </SSModal>
    </div>
  );
};

export default SSPermissionModal;
