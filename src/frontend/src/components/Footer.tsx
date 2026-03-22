import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl text-primary mb-3">
              <Heart className="w-5 h-5 fill-primary" />
              DilSe
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find meaningful connections with people who share your values,
              dreams, and life goals.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/discover"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Discover Profiles
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/matches"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Your Matches
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Contact Us
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with{" "}
            <Heart className="w-3 h-3 fill-primary text-primary inline" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Made with love for meaningful connections 💕
          </p>
        </div>
      </div>
    </footer>
  );
}
