"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#002f5f] to-[#004080] text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="PaisaTrackr Logo"
            width={180}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <SignedOut>
            <a href="#features" className="hover:text-yellow-400 font-medium">
              Features
            </a>
            <a href="#testimonials" className="hover:text-yellow-400 font-medium">
              Testimonials
            </a>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button className="bg-transparent text-white border border-white hover:bg-white hover:text-blue-800 flex items-center">
                <LayoutDashboard size={18} />
                <span className="ml-2">Dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-300 flex items-center">
                <PenBox size={18} />
                <span className="ml-2">Add Transaction</span>
              </Button>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "w-10 h-10" } }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="w-full text-blue-800 border-white hover:bg-white hover:text-blue-800"
              >
                Login
              </Button>
            </SignInButton>

          </SignedOut>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#003366] text-white px-4 py-6 space-y-4">
          <SignedOut>
            <a href="#features" className="block hover:text-yellow-400 font-medium">
              Features
            </a>
            <a href="#testimonials" className="block hover:text-yellow-400 font-medium">
              Testimonials
            </a>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="w-full text-blue-800 border-white hover:bg-white hover:text-blue-800"
              >
                Login
              </Button>
            </SignInButton>

          </SignedOut>

          <SignedIn>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-transparent text-white border border-white hover:bg-white hover:text-blue-800 flex items-center justify-center">
                  <LayoutDashboard size={18} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/transaction/create">
                <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300 flex items-center justify-center">
                  <PenBox size={18} className="mr-2" />
                  Add Transaction
                </Button>
              </Link>
            </div>
            <div className="flex justify-end mt-4">
              <UserButton
                appearance={{ elements: { avatarBox: "w-10 h-10" } }}
              />
            </div>
          </SignedIn>
        </div>
      )}
    </header>
  );
};

export default Header;
