'use client';

import Link from "next/link";
import { useCallback, useState } from "react";
import SocialIcons from "./SocialIcons";


export default function Navigation() {

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div className="mx-auto mt-6 flex-grow">
      <nav className="border-gray-200 px-2 mb-6">
        <div className="mx-6 flex flex-wrap justify-between min-w-80">
          <Link href="/" className="flex">
            <span className="self-center text-xl font-semibold whitespace-nowrap">Matthew M. Osborn</span>
          </Link>
          <div className="flex md:order-3">
            <div className="hidden md:flex items-center space-x-4">
              <SocialIcons />
            </div>
            <button data-collapse-toggle="mobile-menu-3" type="button" onClick={toggleMenu} className="md:hidden inline-flex items-center justify-center" aria-controls="mobile-menu-3" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
          <div className="hidden md:flex justify-between w-full md:w-auto md:order-1">
            <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-lg md:font-medium">
              <li>
                <Link href="/" className="" aria-current="page">Home</Link>
              </li>
              <li>
                <Link href="/blog" className="">Blog</Link>
              </li>
              <li>
                <Link href="/bookshelf" className="">Bookshelf</Link>
              </li>
              <li>
                <Link href="/talks" className="">Talks</Link>
              </li>
            </ul>
          </div>
          <div className={`${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-400 ease-in-out justify-between w-full`}>
            <ul className="flex-col flex gap-1 text-lg text-right pt-2 pr-1">
              <li>
                <Link href="/" className="" aria-current="page">Home</Link>
              </li>
              <li>
                <Link href="/blog" className="">Blog</Link>
              </li>
              <li>
                <Link href="/bookshelf" className="">Bookshelf</Link>
              </li>
              <li>
                <Link href="/talks" className="">Talks</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}