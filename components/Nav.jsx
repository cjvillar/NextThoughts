"use client"; // Do to client side functionality useEffect, use State

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {signIn, signOut, useSession, getProviders} from "next-auth/react";


const Nav = () => {
  const {data: session} = useSession();
  const [providers, setProviders] = useState(null);

  const [toggleDropdown, settoggleDropdown] = useState(false)

  useEffect(() => {
    const setUpProviders = async () => {
        const response = await getProviders();
        setProviders(response);
    }
    setUpProviders();
  }, [])

  return (
   <nav className="flex-between w-full mb-16 pt-3">
    <Link href="/" className="flex gap-2 flex-center">
        <Image src="/assets/images/logo.svg" width={150} height={150} className="object-contain" alt="logo img"/>
        <span className="logo_text"></span>
    </Link>
   
    {/* Desktop Navigation */}

    <div className="sm:flex hidden">
    {session?.user ? (
        <div className="flex gap-3 md:gap-5"> 
        <Link href="/share-thought" className="black_btn">
            Share Thought
        </Link>
        <div className="flex relative">
            <Image src={session?.user.image} width={37} height={37} className="rounded-full"
            alt="profile" onClick={() => settoggleDropdown((prev) => !prev)}></Image>
             {toggleDropdown && (
                <div className="dropdown">
                    <Link 
                    href="/profile"
                    className="dropdown_link"
                    onClick={() => settoggleDropdown(false)}>
                        My Profile
                    </Link>
                    <Link 
                    href="/share-thought"
                    className="dropdown_link"
                    onClick={() => settoggleDropdown(false)}>
                       Create Thought
                    </Link>
                    <Link href="/" passHref>
                    <button type="button"
                    onClick={() => {settoggleDropdown(false); 
                    signOut();
                    }}
                    className="mt-5 w-full black_btn">
                        Sign Out
                    </button>
                    </Link>
                </div>
            )}
        </div>
    </div>
    ): ( 
    <>
    {providers && 
        Object.values(providers).map((provider) => (
        <button
        type="button"
        key={provider.name}
        onClick={() => signIn(provider.id)}
        className="black_btn"
        >
        Sign In
        </button>
    ))}
    </>
    )}
    </div>
    {/* Mobile Navigation */}
    <div className="sm:hidden flex relative">
        {session?.user ? (
            <div className="flex">
                 <Image src={session?.user.image} width={37} height={37} className="rounded-full"
            alt="profile" onClick={() => settoggleDropdown((prev) => !prev)}></Image>
            {toggleDropdown && (
                <div className="dropdown">
                    <Link 
                    href="/profile"
                    className="dropdown_link"
                    onClick={() => settoggleDropdown(false)}>
                        My Profile
                    </Link>
                    <Link 
                    href="/share-thought"
                    className="dropdown_link"
                    onClick={() => settoggleDropdown(false)}>
                       Create Thought
                    </Link>
                    <Link href="/" passHref>
                    <button type="button"
                    onClick={() => {settoggleDropdown(false); 
                    signOut();
                    }}
                    className="mt-5 w-full black_btn">
                        Sign Out
                    </button>
                    </Link>
                </div>
            )}
            </div>
        ): ( 
            <>
            {providers && 
                Object.values(providers).map((provider) => (
                <button
                type="button"
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="black_btn"
                >
                Sign In
                </button>
            ))}
            </>
            )}
    </div>
   </nav>
  )
}

export default Nav