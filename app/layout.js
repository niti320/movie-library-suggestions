"use client";

import { useEffect, useState } from "react";
import { Databases, Query } from "appwrite";
import { client, account } from "@/lib/appwrite";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/src/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

const databases = new Databases(client);

const fetchAndStoreUserData = async () => {
  try {
    const user = await account.get();
    if (!user) return;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const favoritesCollection = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_FAVORITES;
    // const watchlistCollection = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WATCHLIST;


    // Fetch favorites & watchlist from Appwrite
    const [favResponse] = await Promise.all([
      databases.listDocuments(databaseId, favoritesCollection, [Query.equal("user_id", user.$id)]),
      // databases.listDocuments(databaseId, watchlistCollection, [Query.equal("user_id", user.$id)]),
    ]);

    // Store in localStorage
    localStorage.setItem("Favorite", JSON.stringify(favResponse.documents));
    // localStorage.setItem("Watchlist", JSON.stringify(watchlistResponse.documents));
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export default function RootLayout({ children }) {
  useEffect(() => {
    fetchAndStoreUserData();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site created using create-react-app" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
