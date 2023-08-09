import React from "react";

const Products = () => {
  return (
    <div className="py-20 flex flex-col gap-20">
      <h1 className="text-4xl text-center font-bold text-black">
        Products (Plans and Support Services)
      </h1>
      <div className="flex justify-between gap-5 w-full max-w-screen-xl mx-auto">
        <div className="bg-white w-full h-full py-20 px-10 shadow-md flex flex-col gap-4 rounded-md">
          <h1 className="text-3xl font-normal text-green-700 px-5">Plan A</h1>
          <ul className="list-disc list-inside">
            <li>5Gb Space</li>
            <li>4 Buddies</li>
            <li>$6.99/month</li>
            <li className="list-none pl-5">OR</li>
            <li>$71.00/annually (15% discount for annual subscription)</li>
          </ul>
        </div>
        <div className="bg-white w-full h-full py-20 px-10 shadow-md flex flex-col gap-4 rounded-md">
          <h1 className="text-3xl font-normal text-green-700 px-5">Plan B</h1>
          <ul className="list-disc list-inside">
            <li>5Gb Space</li>
            <li>4 Buddies</li>
            <li>$6.99/month</li>
            OR
            <li>$71.00/annually (15% discount for annual subscription)</li>
          </ul>
        </div>
        <div className="flex justify-between w-full max-w-screen-xl">
          <div className="bg-white w-full h-full py-20 px-10 shadow-md flex flex-col gap-4 rounded-md">
            <h1 className="text-3xl font-normal text-green-700 px-5">Plan C</h1>
            <ul className="list-disc list-inside">
              <li>5Gb Space</li>
              <li>4 Buddies</li>
              <li>$6.99/month</li>
              OR
              <li>$71.00/annually (15% discount for annual subscription)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
