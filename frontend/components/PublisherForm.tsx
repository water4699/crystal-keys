"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, BookOpen, Sparkles, Lock } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  pricingTier: string;
  distributionWindow: string;
  isLocked: boolean;
}

interface PublisherFormProps {
  onSubmit: (book: Omit<Book, "id" | "isLocked">) => Promise<Book | undefined>;
  isSubmitting?: boolean;
}

export const PublisherForm = ({ onSubmit, isSubmitting = false }: PublisherFormProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [pricingTier, setPricingTier] = useState("");
  const [distributionWindow, setDistributionWindow] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBook = {
      title,
      author,
      publisher,
      genre,
      pricingTier,
      distributionWindow,
    };

    try {
      const registeredBook = await onSubmit(newBook);
      
      if (registeredBook) {
        setTitle("");
        setAuthor("");
        setPublisher("");
        setGenre("");
        setPricingTier("");
        setDistributionWindow("");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      {/* Top Gradient */}
      <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Register New Book Rights
              <Sparkles className="w-4 h-4 text-amber-400" />
            </CardTitle>
            <CardDescription>
              Encrypt and register licensing terms for your digital publication
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Info Section */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-transparent border border-purple-100">
            <h4 className="text-sm font-medium text-purple-700 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Book Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm">Book Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  className="rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  className="rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher" className="text-sm">Publisher</Label>
                <Input
                  id="publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Enter publisher name"
                  className="rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre" className="text-sm">Genre</Label>
                <Select value={genre} onValueChange={setGenre} required>
                  <SelectTrigger id="genre" className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Encrypted Terms Section */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-transparent border border-blue-100">
            <h4 className="text-sm font-medium text-blue-700 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Encrypted Licensing Terms
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricingTier" className="text-sm">Pricing Tier</Label>
                <Select value={pricingTier} onValueChange={setPricingTier} required>
                  <SelectTrigger id="pricingTier" className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select pricing tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium - $9.99">Premium - $9.99</SelectItem>
                    <SelectItem value="Standard - $4.99">Standard - $4.99</SelectItem>
                    <SelectItem value="Basic - $2.99">Basic - $2.99</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributionWindow" className="text-sm">Distribution Window</Label>
                <Select value={distributionWindow} onValueChange={setDistributionWindow} required>
                  <SelectTrigger id="distributionWindow" className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select distribution window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exclusive - 6 months">Exclusive - 6 months</SelectItem>
                    <SelectItem value="Limited - 3 months">Limited - 3 months</SelectItem>
                    <SelectItem value="Open - Unlimited">Open - Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-soft text-white rounded-xl h-12 text-base"
            disabled={isSubmitting}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            {isSubmitting ? "Encrypting & Signing..." : "Encrypt & Register Book Rights"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
