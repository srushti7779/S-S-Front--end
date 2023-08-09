import Loading from "@/components/Loading";
import SSButton from "@/components/form/SSButton";
import SSInput from "@/components/form/SSInput";
import SSModal from "@/components/form/SSModal";
import SSSelect from "@/components/form/SSSelect";
import {
  deleteBuddy,
  getBuddyList,
  postBuddyRequest,
} from "@/redux/slices/buddiesSlice";
import { Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

const MyBuddies = () => {
  const dispatch = useDispatch();
  const [buddyModal, setBuddyModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const { buddyList, invitedBuddy, buddListLoading, loading, userProfile } =
    useSelector((state) => ({
      loading: state.buddiesSlice.loading,
      userProfile: state.userAuth.userProfile,
      buddyList: state.buddiesSlice.buddyList,
      buddListLoading: state.buddiesSlice.buddListLoading,
      invitedBuddy: state.buddiesSlice.invitedBuddy,
    }));
  const relationWithBuddyList = [
    { label: "Spouse", value: "Spouse" },
    { label: "Partner", value: "Partner" },
    { label: "Friend", value: "Friend" },
    { label: "Other", value: "Other" },
  ];

  useEffect(() => {
    dispatch(getBuddyList());
  }, []);

  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="px-5 xl:px-10 max-w-7xl flex flex-col justify-center items-start gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold text-xl">All Buddies</div>
          <div>
            <SSButton className="w-[150px]" onClick={() => setBuddyModal(true)}>
              + Add Buddy
            </SSButton>
          </div>
        </div>
        <div className="mt-5 w-full overflow-auto">
          {!buddListLoading ? (
            <table className="w-full bg-white rounded-[10px] border-collapse overflow-auto">
              <thead className="w-full">
                <tr className="text-left text-base font-normal text-[#00000080] border-b border-b-[#0000000d] p-[18px]">
                  <th className="p-[18px]">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-[#00A652] "
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                  </th>
                  <th className="p-[18px]">Contact Name</th>
                  <th className="p-[18px]">Relation</th>
                  <th className="p-[18px]">Status</th>
                  <th className="p-[18px]">Email</th>
                  <th className="p-[18px]">Buddy Type</th>
                  <th className="p-[18px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buddyList.length > 0 &&
                  buddyList?.map((item, index) => (
                    <tr
                      key={index}
                      className="text-left text-base font-normal text-[#000000] border-b border-b-[#0000000d] p-[18px]"
                    >
                      <td className="pl-5 py-[18px]">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-[#00A652] "
                          checked={checked}
                          onChange={() => setChecked(!checked)}
                        />
                      </td>
                      <td className="pl-5 py-[18px] capitalize">
                        {item?.profile_picture && (
                          <Image
                            priority
                            src={item?.profile_picture}
                            alt="Person"
                          />
                        )}
                        {item?.buddy?.email?.split("@")[0] ?? "N/A"}
                      </td>
                      <td className="pl-5 py-[18px] capitalize">
                        {item?.relationshipStatus ?? "N/A"}
                      </td>
                      <td className="pl-5 py-[18px] capitalize">
                        {item?.buddyStatus ?? "N/A"}
                      </td>
                      <td className="pl-5 py-[18px]">
                        {item?.buddy?.email ?? "N/A"}
                      </td>
                      <td className="pl-5 py-[18px] capitalize">
                        {item?.buddyType}
                      </td>
                      <td
                        className="pl-10 py-[18px] cursor-pointer"
                        onClick={() =>
                          dispatch(deleteBuddy({ type: "BD", id: item?.id }))
                            .unwrap()
                            .then(() => dispatch(getBuddyList()))
                            .catch(() => {})
                        }
                      >
                        <RiDeleteBin6Line size={25} color="#00000080" />
                      </td>
                    </tr>
                  ))}
                {invitedBuddy.length > 0 &&
                  invitedBuddy?.map((item, index) => (
                    <tr
                      key={index}
                      className="text-left text-base font-normal text-[#000000] border-b border-b-[#0000000d] p-[18px]"
                    >
                      <td className="pl-5 py-[18px]">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-[#00A652] "
                          checked={checked}
                          onChange={() => setChecked(!checked)}
                        />
                      </td>
                      <td className="pl-5 py-[18px]">
                        {item?.profile_picture && (
                          <Image
                            priority
                            src={item?.profile_picture}
                            alt="Person"
                          />
                        )}
                        {item?.buddy?.split("@")[0] ?? "N/A"}
                      </td>
                      <td className="pl-5 py-[18px]">
                        {item?.relationshipStatus ?? "N/A"}
                      </td>
                      <td className="pl-5 py-[18px]">
                        {item?.buddyStatus ?? "N/A"}
                      </td>
                      <td className="pl-5 py-[18px]">{item?.buddy ?? "N/A"}</td>
                      <td className="pl-5 py-[18px]">{item?.buddyType}</td>
                      <td
                        className="pl-10 py-[18px] cursor-pointer"
                        onClick={() =>
                          dispatch(deleteBuddy({ type: "IN", id: item?.id }))
                            .unwrap()
                            .then(() => dispatch(getBuddyList()))
                        }
                      >
                        <RiDeleteBin6Line size={25} color="#00000080" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center w-full opacity-[80] h-full">
              <Loading width="w-[100px]" height="h-[50px]" />
            </div>
          )}
        </div>
      </div>
      <SSModal isOpen={buddyModal} onClose={() => setBuddyModal(false)}>
        <Formik
          initialValues={{ email: "", relation: "" }}
          enableReinitialize
          onSubmit={(values) => {
            const allBuddies = [...buddyList, ...invitedBuddy];
            dispatch(postBuddyRequest(values))
              .unwrap()
              .then(() => {
                setBuddyModal(false);
                dispatch(getBuddyList());
              })
              .catch(() => {});
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="w-full bg-white rounded-[20px] flex flex-col justify-center items-start">
                <div className="w-full relative flex justify-end items-center">
                  <div>
                    <h1 className="absolute left-[26%] xl:left-[35%] top-5 xl:top-2 font-bold text-lg xl:text-[28px]">
                      Add new buddy
                    </h1>
                  </div>
                  <div
                    onClick={() => setBuddyModal(false)}
                    className="w-[60px] h-[60px] flex justify-center items-center cursor-pointer rounded-full bg-[#F5F5F5]"
                  >
                    <RxCross2 size={30} />
                  </div>
                </div>
                <div className="w-full p-6 mt-3 rounded-[20px] flex flex-col justify-start items-start gap-3">
                  <p className="font-semibold text-xl">Email of the buddy</p>
                  <div className="w-full">
                    <SSInput
                      type="text"
                      name="email"
                      placeholder="Enter your buddy's email here"
                    />
                  </div>
                  <div className="relative mx-auto w-full mt-4">
                    <label className="block font-semibold text-xl mb-1">
                      Select relationship
                    </label>
                    <SSSelect
                      label="Select the relationship"
                      name="relation"
                      options={relationWithBuddyList}
                      fieldTitle="label"
                      fieldValue="value"
                      boxSize="w-full h-[50px]"
                      labelClassName="text-black"
                    />
                  </div>
                  <div className="ml-auto w-full mt-5">
                    <SSButton
                      type="submit"
                      isLoading={loading}
                      className="w-[154px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer ml-auto"
                    >
                      Add Buddy
                    </SSButton>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </SSModal>
    </div>
  );
};

export default MyBuddies;
