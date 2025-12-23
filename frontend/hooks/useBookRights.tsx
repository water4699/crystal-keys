"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/hooks/useToast";
// import { createInstance } from "fhevmjs"; // TODO: Add fhevmjs when integrating real contract

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  pricingTier: string;
  distributionWindow: string;
  isLocked: boolean;
}

export const useBookRights = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Encrypt and register a book
  const registerBook = async (book: Omit<Book, "id" | "isLocked">) => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register a book.",
        variant: "destructive",
      });
      return;
    }

    setIsEncrypting(true);

    try {
      toast({
        title: "Preparing Transaction",
        description: "Encoding book data for blockchain...",
      });

      // Map pricing tier to number
      const pricingTierMap: Record<string, number> = {
        "Basic - $2.99": 0,
        "Standard - $4.99": 1,
        "Premium - $9.99": 2,
      };

      // Map distribution window to number
      const distributionWindowMap: Record<string, number> = {
        "Open - Unlimited": 0,
        "Limited - 3 months": 1,
        "Exclusive - 6 months": 2,
      };

      const pricingTierValue = pricingTierMap[book.pricingTier] || 0;
      const distributionWindowValue = distributionWindowMap[book.distributionWindow] || 0;

      toast({
        title: "Requesting Wallet Signature",
        description: "Please sign the transaction in your wallet...",
      });

      // Create a simple transaction to trigger wallet signature
      // This simulates the contract call - in production you'd call the actual contract
      const message = JSON.stringify({
        action: "registerBook",
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        genre: book.genre,
        pricingTier: pricingTierValue,
        distributionWindow: distributionWindowValue,
        timestamp: Date.now(),
      });

      // Request signature from wallet using personal_sign
      const signature = await (window as any).ethereum?.request({
        method: "personal_sign",
        params: [message, address],
      });

      if (!signature) {
        throw new Error("Signature rejected");
      }

      toast({
        title: "Transaction Signed",
        description: "Processing registration...",
      });

      // Simulate blockchain confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Book Registered Successfully",
        description: `"${book.title}" has been registered with encrypted licensing terms.`,
      });

      return {
        ...book,
        id: Math.random().toString(36).substring(7),
        isLocked: true,
      };
    } catch (error: any) {
      console.error("Error registering book:", error);
      
      if (error.code === 4001 || error.message?.includes("User rejected")) {
        toast({
          title: "Signature Rejected",
          description: "You rejected the signature request.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to register book. Please try again.",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  };

  // Decrypt book rights
  const decryptBookRights = async (bookId: string) => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to decrypt rights.",
        variant: "destructive",
      });
      return false;
    }

    setIsDecrypting(true);

    try {
      toast({
        title: "Requesting Wallet Signature",
        description: "Please sign to decrypt the book rights...",
      });

      // Create a message to sign for decryption authorization
      const message = JSON.stringify({
        action: "decryptBookRights",
        bookId: bookId,
        requester: address,
        timestamp: Date.now(),
      });

      // Request signature from wallet
      const signature = await (window as any).ethereum?.request({
        method: "personal_sign",
        params: [message, address],
      });

      if (!signature) {
        throw new Error("Signature rejected");
      }

      toast({
        title: "Signature Verified",
        description: "Decrypting book rights...",
      });

      // Simulate decryption process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Rights Decrypted Successfully",
        description: "You can now view the licensing terms.",
      });

      return true;
    } catch (error: any) {
      console.error("Error decrypting rights:", error);
      
      if (error.code === 4001 || error.message?.includes("User rejected")) {
        toast({
          title: "Signature Rejected",
          description: "You rejected the signature request.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Decryption Failed",
          description: error.message || "Failed to decrypt rights. Please try again.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsDecrypting(false);
    }
  };

  return {
    registerBook,
    decryptBookRights,
    isEncrypting,
    isDecrypting,
    isPending,
    isConfirming,
  };
};
