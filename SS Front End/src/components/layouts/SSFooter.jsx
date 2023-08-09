import Image from "next/image";
import React from "react";
import Logo from "../../assests/logos/Logo.svg";
import AppleStoreImg from "../../assests/images/AppStore.png";
import PlayStoreImg from "../../assests/images/GooglePlay.png";
import Link from "next/link";

const SSFooter = () => {
  return (
    <div className="flex flex-col justify-center items-center sm:gap-10">
      <div className="w-full flex justify-around items-center sm:items-start bg-[#FAFAFA] py-7 flex-wrap space-y-11 md:space-y-0 sm:flex-nowrap">
        <div className="flex flex-col gap-7 justify-center sm:items-start items-center ">
          <div className="flex justify-center items-start gap-3">
            <div>
              <Image priority src={Logo} alt="logo" />
            </div>{" "}
            <p className="text-[#022714] leading-7 text-2xl font-bold">
              S & S Vault
            </p>
          </div>

          <p className="font-semibold leading-6 text-black text-xl">
            Our App is Coming Soon....
          </p>

          <div className="flex gap-3 flex-wrap ">
            <div>
              <Image priority src={AppleStoreImg} alt="Appleimage" />
            </div>
            <div>
              <Image priority src={PlayStoreImg} alt="playstoreimage" />
            </div>
          </div>
        </div>

        <div className="flex lg:gap-20 gap-10 justify-center items-start flex-wrap sm:flex-nowrap">
          <div className="flex flex-col items-center sm:items-start justify-center gap-5 w-full">
            <div className="font-semibold text-[22px]">Want to know more?</div>
            <div className="flex flex-col items-start pl-2 justify-center gap-5 text-lg text-[#494E4C]">
              <div>
                <Link href="/faq">FAQs</Link>
              </div>
              <div>
                <Link href="/contact-us">Contact Us</Link>
              </div>
              <div>
                <Link href="/about-us">About Us</Link>
              </div>
              <div>
                <Link href="/careers">Careers</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-start items-center justify-center gap-5 w-full">
            <div className="font-semibold text-[22px]">More About us</div>
            <div className="flex flex-col items-center sm:items-start pl-2 justify-center gap-5 text-lg text-[#494E4C]">
              <div>
                <Link href="/">Terms of Sale</Link>
              </div>
              <div>
                <Link href="/">Terms of Service</Link>
              </div>
              <div>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </div>
              <div>
                <Link href="/tnc">Terms and Conditions</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-start items-center justify-center gap-5 w-full">
            <div className="font-semibold text-[22px]">Social Links</div>
            <div className="flex flex-col items-start pl-2 justify-center gap-5 text-lg text-[#494E4C]">
              <div>Blog</div>
              <div>
                <Link
                  target="_blank"
                  href="https://www.facebook.com/Store-and-Share-Vault-S-and-S-Vault-107816765260015"
                >
                  Facebook
                </Link>
              </div>
              <div>
                <Link
                  target="_blank"
                  href="https://www.instagram.com/storeandsharevault/"
                >
                  Instagram
                </Link>
              </div>
              <div>LinkedIn</div>
              <div>Twitter</div>
              <div>
                <Link
                  target="_blank"
                  href="https://www.youtube.com/@storeandsharevault"
                >
                  Youtube
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#292D32] flex justify-center items-center text-white text-sm h-[46px] w-full">
        ©{new Date().getFullYear()} All Rights Reserved by S & S Vault
      </div>
    </div>
  );
};

export default SSFooter;
