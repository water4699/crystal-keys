"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { PublisherForm } from "@/components/PublisherForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Library, ShieldCheck, Sparkles, Users, TrendingUp } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useBookRights, type Book } from "@/hooks/useBookRights";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const { registerBook, decryptBookRights, isEncrypting } = useBookRights();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "Digital Publishing in the Blockchain Era",
      author: "Sarah Chen",
      publisher: "TechPress Publishing",
      genre: "Technology",
      pricingTier: "Premium - $9.99",
      distributionWindow: "Exclusive - 6 months",
      isLocked: true,
    },
    {
      id: "2",
      title: "Cryptographic Rights Management",
      author: "Michael Rodriguez",
      publisher: "Crypto Books Ltd",
      genre: "Technology",
      pricingTier: "Standard - $4.99",
      distributionWindow: "Limited - 3 months",
      isLocked: true,
    },
    {
      id: "3",
      title: "The Future of Digital Content",
      author: "Emily Watson",
      publisher: "Future Media Corp",
      genre: "Business",
      pricingTier: "Basic - $2.99",
      distributionWindow: "Open - Unlimited",
      isLocked: true,
    },
  ]);

  const handleAddBook = async (newBook: Omit<Book, "id" | "isLocked">) => {
    const registeredBook = await registerBook(newBook);
    if (registeredBook) {
      setBooks([registeredBook, ...books]);
      return registeredBook;
    }
  };

  const handleDecrypt = async (bookId: string) => {
    const success = await decryptBookRights(bookId);
    if (success) {
      setBooks(
        books.map((book) =>
          book.id === bookId ? { ...book, isLocked: false } : book
        )
      );
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 hero-gradient overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-300/30 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-pink-300/30 blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-blue-300/20 blur-xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-purple-700">Powered by Homomorphic Encryption</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Publish Safely, <span className="gradient-text">License Transparently</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Register encrypted licensing terms for digital books. Verified
            distributors can decrypt pricing tiers and distribution windows
            without exposing sensitive deal structures.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="stats-card px-6 py-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="text-xs text-muted-foreground">Books Registered</p>
                </div>
              </div>
            </div>
            <div className="stats-card px-6 py-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">567</p>
                  <p className="text-xs text-muted-foreground">Publishers</p>
                </div>
              </div>
            </div>
            <div className="stats-card px-6 py-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-pink-500" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">89%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </div>
          </div>

          {!isConnected && (
            <div className="glass max-w-md mx-auto rounded-2xl p-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-purple-500" />
              </div>
              <p className="text-foreground mb-2 font-medium">
                Connect Your Wallet
              </p>
              <p className="text-sm text-muted-foreground">
                Connect your Rainbow Wallet to unlock rights details and
                complete licensing transactions
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
              <Library className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Connect Your Wallet to Get Started
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please connect your Rainbow Wallet using the button in the header
              to access the platform and view encrypted book rights.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 p-1 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
              <TabsTrigger
                value="marketplace"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Library className="w-4 h-4" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger 
                value="publisher" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <BookOpen className="w-4 h-4" />
                Publisher
              </TabsTrigger>
            </TabsList>

            <TabsContent value="marketplace" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">
                  Encrypted Book Rights <span className="gradient-text">Marketplace</span>
                </h3>
                <p className="text-muted-foreground">
                  Browse available books and decrypt licensing terms with your
                  verified wallet
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    {...book}
                    onDecrypt={async () => await handleDecrypt(book.id)}
                  />
                ))}
              </div>

              {books.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-purple-400" />
                  </div>
                  <p className="text-muted-foreground">
                    No books registered yet. Be the first to publish!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="publisher" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">
                  <span className="gradient-text">Publisher</span> Portal
                </h3>
                <p className="text-muted-foreground">
                  Register new books with encrypted licensing terms
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <PublisherForm onSubmit={handleAddBook} isSubmitting={isEncrypting} />
              </div>

              {books.length > 0 && (
                <div className="mt-12">
                  <h4 className="text-2xl font-bold mb-6 text-center">
                    Your Published Books
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                      <BookCard
                        key={book.id}
                        {...book}
                        onDecrypt={async () => await handleDecrypt(book.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
