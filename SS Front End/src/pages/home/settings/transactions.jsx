import Loading from "@/components/Loading";
import SSButton from "@/components/form/SSButton";
import {
  getPaymentInvoice,
  getTransactionList,
} from "@/redux/slices/paymentSlice";
import { convertPaymentCurrency } from "@/utils/helper";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import moment from "moment";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Transcations = () => {
  const dispatch = useDispatch();
  const { loading, transacitonList } = useSelector((state) => ({
    loading: state.paymentSlice.loading,
    transacitonList: state.paymentSlice.transacitonList,
  }));

  useEffect(() => {
    dispatch(getTransactionList());
  }, [dispatch]);

  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="px-10 max-w-7xl flex flex-col justify-center items-start gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold text-xl">Payment History</div>
        </div>
        <div className="mt-5 w-full">
          {!loading ? (
            <table className="w-full bg-white rounded-[10px] border-collapse overflow-visible">
              <thead className="w-full">
                <tr className="text-left text-base font-normal text-[#00000080] border-b border-b-[#0000000d] p-[18px]">
                  <th className="p-[18px]">Date</th>
                  <th className="p-[18px]">Type</th>
                  <th className="p-[18px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transacitonList?.length > 0
                  ? transacitonList?.map((item, index) => (
                      <tr
                        key={index}
                        className="text-left text-base font-normal text-[#000000] border-b border-b-[#0000000d] p-[18px]"
                      >
                        <td className="pl-5 py-[18px] capitalize">
                          {moment(item?.created * 1000).format("MM/DD/YYYY")}
                        </td>
                        <td className="pl-5 py-[18px] capitalize">
                          {item?.description}
                        </td>
                        <td className="pl-5 py-[18px]">
                          {convertPaymentCurrency(item.amount)}
                        </td>
                        <td className="pl-10 py-[18px] cursor-pointer">
                          <Menu as="span" className="relative">
                            <span>
                              <Menu.Button className="flex relative max-w-xs items-center rounded-full bg-white text-sm focus:outline-none lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                                <IoEllipsisHorizontalOutline
                                  className="rotate-90"
                                  color={"#00000066"}
                                />
                              </Menu.Button>
                            </span>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-32 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                  {({ active }) => (
                                    <p
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                      onClick={() =>
                                        dispatch(
                                          getPaymentInvoice({
                                            id: item?.invoice,
                                          })
                                        )
                                      }
                                    >
                                      Get email invoice{" "}
                                    </p>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href={item?.receipt_url}
                                      target="_blank"
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Get receipt{" "}
                                    </Link>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </td>
                      </tr>
                    ))
                  : "No data yet"}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center w-full opacity-[80] h-full">
              <Loading width="w-[100px]" height="h-[50px]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcations;
