"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Per Aspera
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              href="/bike"
              className="text-sm font-medium hover:text-primary"
            >
              Bike
            </Link>
            <Link
              href="/gears"
              className="text-sm font-medium hover:text-primary"
            >
              Gears
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/bike"
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md"
              onClick={toggleMenu}
            >
              Bike
            </Link>
            <Link
              href="/gears"
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md"
              onClick={toggleMenu}
            >
              Gears
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
