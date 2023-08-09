import React, { useEffect } from "react";
import Logo from "../../../assests/images/Logo.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationList } from "@/redux/slices/notification";
import Loading from "@/components/Loading";
import { createBuddyRequest } from "@/redux/slices/buddiesSlice";
import NoFileImage from "../../../assests/images/nofile.svg";

const Notification = () => {
  const dispatch = useDispatch();
  const { notificationList, loading, buddListLoading } = useSelector(
    (state) => ({
      loading: state.notificationSlice.loading,
      notificationList: state.notificationSlice.notificationList,
      buddListLoading: state.buddiesSlice.buddListLoading,
    })
  );

  const createBuddy = (id) => {
    dispatch(createBuddyRequest({ id: id.inviterId }))
      .unwrap()
      .then(() => dispatch(getNotificationList()));
  };

  useEffect(() => {
    dispatch(getNotificationList());
  }, [dispatch]);

  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="px-10 max-w-[1100px] flex flex-col justify-center items-start gap-7 w-full bg-white rounded-[20px] mx-auto my-10 relative">
        {Boolean(!loading && !buddListLoading) ? (
          notificationList.length > 0 ? (
            notificationList?.map((item, index) => (
              <div
                key={index}
                className="w-full flex flex-col gap-3 justify-center md:grid md:grid-cols-[10%_30%_30%_23%_7%] items-center py-5 border-b border-b-[#0000000d]"
              >
                <div>
                  <Image
                    priority
                    src={Logo}
                    alt="logo"
                    width={40}
                    height={40}
                  />
                </div>
                <p className="font-normal text-lg">
                  {JSON.parse(item.data).inviterEmail}
                </p>
                <p className="font-normal text-lg">{item.message}</p>
                <p className="font-normal text-lg">
                  {item.type === "Buddy" || item.type === "buddy" ? (
                    <span
                      onClick={() => createBuddy(JSON.parse(item.data))}
                      style={{
                        cursor: "pointer",
                        marginLeft: 25,
                        textDecoration: "none",
                        color: "green",
                      }}
                      className=" animate-pulse"
                    >
                      Accept Invitation
                    </span>
                  ) : null}
                </p>
                <p className="font-normal text-xs text-[#00000080]">
                  {" "}
                  {item.createdAt.split("T")[0]}
                </p>
              </div>
            ))
          ) : (
            <div className="w-full h-[45vh] flex flex-col justify-center items-center">
              <Image
                priority
                src={NoFileImage}
                width={180}
                height={180}
                alt=""
              />
              <h1 className="font-medium text-[22px] whitespace-nowrap mt-[30px]">
                Notification will be displayed here
              </h1>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center w-full opacity-[80] h-[70vh]">
            <Loading
              width="w-[100px]"
              height="h-[100px]"
              className="text-[#00A652]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
