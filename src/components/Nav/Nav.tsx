import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full">
      <div className="">
        <div className="flex items-center justify-between gap-4 h-20 bg-gray-600 px-10">
          <Link
            href="/"
            className="text-white font-bold text-base hover:text-black"
          >
            My Auth App
          </Link>
          <div className="flex gap-4">
            <Link
              href={"/public"}
              className="text-white font-bold text-base hover:text-black"
            >
              Public
            </Link>
            <Link
              href={"/client"}
              className="text-white font-bold text-base hover:text-black"
            >
              Client&apos;s Page
            </Link>
            <Link
              href={"/member"}
              className="text-white font-bold text-base hover:text-black"
            >
              Member&apos;s Page
            </Link>
            <Link
              href={"/createUser"}
              className="text-white font-bold text-base hover:text-black"
            >
              Create User
            </Link>

            {session ? (
              <Link
                href={"/api/auth/signout?callbackUrl=/"}
                className="text-white font-bold text-base hover:text-black"
              >
                Logout
              </Link>
            ) : (
              <Link
                href={"/api/auth/signin?callbackUrl=/"}
                className="text-white font-bold text-base hover:text-black"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
