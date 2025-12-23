"use client";

import { Lock, Unlock, Eye, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface BookCardProps {
  title: string;
  author: string;
  publisher: string;
  isLocked: boolean;
  pricingTier?: string;
  distributionWindow?: string;
  genre?: string;
  onDecrypt?: () => Promise<void>;
}

export const BookCard = ({ 
  title, 
  author, 
  publisher, 
  isLocked, 
  pricingTier, 
  distributionWindow,
  genre,
  onDecrypt 
}: BookCardProps) => {
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = async () => {
    if (!onDecrypt) return;
    
    setIsDecrypting(true);
    try {
      await onDecrypt();
    } catch (error) {
      console.error("Decrypt error:", error);
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <Card className={`glass-card book-card relative overflow-hidden ${
      isLocked ? "card-locked" : ""
    }`}>
      {/* Top Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isLocked 
          ? "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" 
          : "bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
      }`} />

      {/* Status Badge */}
      {isLocked ? (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="badge-locked text-xs font-medium">
            <Lock className="w-3 h-3 mr-1" />
            Encrypted
          </Badge>
        </div>
      ) : (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="badge-unlocked text-xs font-medium">
            <Unlock className="w-3 h-3 mr-1" />
            Unlocked
          </Badge>
        </div>
      )}

      <CardHeader className="pt-8">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLocked 
              ? "bg-gray-100" 
              : "bg-gradient-to-br from-purple-100 to-pink-100"
          }`}>
            <BookOpen className={`w-5 h-5 ${isLocked ? "text-gray-400" : "text-purple-500"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 leading-tight">{title}</CardTitle>
            <CardDescription className="mt-1">
              <p className="font-medium text-foreground/80">by {author}</p>
            </CardDescription>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{publisher}</p>
          {genre && (
            <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
              {genre}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLocked ? (
          <div className="space-y-3 p-4 rounded-xl bg-gray-50/80">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gray-400" />
              <div className="flex-1 h-3 rounded-full bg-gray-200 loading-shimmer" />
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gray-400" />
              <div className="flex-1 h-3 rounded-full bg-gray-200 loading-shimmer" style={{ animationDelay: '0.3s' }} />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Connect wallet to decrypt licensing terms
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pricing Tier</span>
              <span className="font-semibold text-purple-600 text-sm">{pricingTier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Distribution</span>
              <span className="font-semibold text-blue-600 text-sm">{distributionWindow}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {isLocked ? (
          <Button 
            onClick={handleDecrypt}
            disabled={isDecrypting}
            className="w-full btn-soft text-white rounded-xl h-11"
          >
            {isDecrypting ? (
              <>
                <Lock className="w-4 h-4 mr-2 animate-pulse" />
                Decrypting...
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Decrypt Rights
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" className="w-full rounded-xl h-11 border-purple-200 text-purple-600 hover:bg-purple-50">
            <Eye className="w-4 h-4 mr-2" />
            View Full Terms
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
