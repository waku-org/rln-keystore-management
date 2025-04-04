import Link from "next/link";
import { Github } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Footer() {
  return (
    <footer className="w-full border-t border-terminal-border bg-terminal-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Waku Section */}
          <div className="flex flex-col items-center space-y-4">
            <Link 
              href="https://waku.org" 
              target="_blank"
              className="flex items-center space-x-3 px-4 py-2 rounded-md transition-all duration-300 hover:bg-terminal-background/50"
            >
              <span className="text-primary font-mono text-xl font-bold glow-text">
                Waku
              </span>
            </Link>
            
            {/* Community Links */}
            <div className="flex items-center space-x-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="https://discord.waku.org"
                      target="_blank"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                      </svg>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">Join our Discord community for support & feedback</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link
                href="https://github.com/waku-org"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://docs.waku.org"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-mono text-sm"
              >
                Docs
              </Link>
              <Link
                href="https://github.com/waku-org/specs"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-mono text-sm"
              >
                Specs
              </Link>
            </div>
          </div>

          {/* Organizational Structure */}
          <div className="flex items-center justify-center space-x-8 text-muted-foreground">
            <Link 
              href="https://logos.co" 
              target="_blank"
              className="font-mono text-sm opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              Logos
            </Link>

            <span className="text-muted-foreground/40">•</span>

            <Link 
              href="https://free.technology" 
              target="_blank"
              className="font-mono text-sm opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              IFT
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 