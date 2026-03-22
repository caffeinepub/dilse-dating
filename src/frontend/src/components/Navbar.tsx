import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-xl text-primary"
        >
          <Heart className="w-6 h-6 fill-primary text-primary" />
          <span>DilSe</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Home
          </Link>
          <Link
            to="/discover"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.discover.link"
          >
            Discover
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.pricing.link"
          >
            Pricing
          </Link>
          {isLoggedIn && (
            <Link
              to="/matches"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              data-ocid="nav.matches.link"
            >
              Matches
            </Link>
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-pill border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  data-ocid="nav.profile.button"
                >
                  My Profile
                </Button>
              </Link>
              <Button
                variant="default"
                size="sm"
                className="rounded-pill"
                onClick={() => clear()}
                data-ocid="nav.logout.button"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="rounded-pill border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => login()}
                disabled={isLoggingIn}
                data-ocid="nav.login.button"
              >
                {isLoggingIn ? "Connecting..." : "Log In"}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="rounded-pill"
                onClick={() => login()}
                disabled={isLoggingIn}
                data-ocid="nav.signup.button"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium py-2"
            data-ocid="mobile.nav.link"
          >
            Home
          </Link>
          <Link
            to="/discover"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium py-2"
            data-ocid="mobile.nav.discover.link"
          >
            Discover
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium py-2"
            data-ocid="mobile.nav.pricing.link"
          >
            Pricing
          </Link>
          {isLoggedIn && (
            <Link
              to="/matches"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-2"
              data-ocid="mobile.nav.matches.link"
            >
              Matches
            </Link>
          )}
          <div className="flex gap-3 pt-2">
            {isLoggedIn ? (
              <Button
                onClick={() => {
                  clear();
                  setMenuOpen(false);
                }}
                className="rounded-pill flex-1"
                data-ocid="mobile.nav.logout.button"
              >
                Log Out
              </Button>
            ) : (
              <Button
                onClick={() => {
                  login();
                  setMenuOpen(false);
                }}
                className="rounded-pill flex-1"
                data-ocid="mobile.nav.login.button"
              >
                Log In / Sign Up
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
