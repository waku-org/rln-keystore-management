import { useState } from "react";
import { useKeystore } from "@/contexts/keystore";
import { toast } from "sonner";
import { ArrowUpToLine } from "lucide-react";
import { Button } from "./ui/button";

export function KeystoreExporter() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { exportEntireKeystore, hasStoredCredentials } = useKeystore();

  const handleExport = async () => {
    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      setIsExporting(true);
      await exportEntireKeystore(password);
      toast.success("Keystore exported successfully");
      setPassword("");
      setShowPasswordInput(false);
      setIsExporting(false);
    } catch (error) {
      setIsExporting(false);
      toast.error("Failed to export keystore: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="space-y-3">
      {!showPasswordInput ? (
        <Button 
          onClick={() => setShowPasswordInput(true)} 
          variant="terminal"
          className="group relative overflow-hidden"
          disabled={!hasStoredCredentials}
        >
          <span className="relative z-10 flex items-center">
            <ArrowUpToLine className="w-4 h-4 mr-2" />
            Export Keystore
          </span>
          <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
        </Button>
      ) : (
        <div className="animate-in fade-in-50 duration-300 space-y-3">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter keystore password"
              className="flex-1 rounded-sm border border-terminal-border bg-background/80 px-3 py-2 font-mono text-xs text-terminal-text placeholder:text-terminal-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isExporting}
              autoFocus
            />
            
            <div className="flex space-x-2">
              <Button
                onClick={handleExport}
                variant="terminal"
                disabled={!password || isExporting}
                className="whitespace-nowrap"
              >
                {isExporting ? "Exporting..." : "Export"}
              </Button>
              
              <Button
                onClick={() => {
                  setShowPasswordInput(false);
                  setPassword("");
                }}
                variant="outline"
                className="text-muted-foreground hover:text-muted-foreground"
                disabled={isExporting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 