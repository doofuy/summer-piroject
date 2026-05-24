"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface UploadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  disabled?: boolean;
}

export default function UploadButton({
  loading,
  disabled,
  onClick,
  className = "",
  ...props
}: UploadButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden w-full max-w-lg mt-8 py-6 rounded-2xl font-semibold text-white tracking-wide
        transition-all duration-300 ease-out active:scale-[0.98] select-none
        ${
          disabled || loading
            ? "bg-muted text-muted-foreground cursor-not-allowed border opacity-80"
            : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-md shadow-violet-500/15 hover:shadow-xl hover:shadow-violet-500/25 hover:translate-y-[-1px]"
        }
        ${className}
      `}
      {...props}
    >
      {/* Glossy shine overlay on hover */}
      {!disabled && !loading && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none" />
      )}

      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
            <span className="animate-pulse">Uploading to AI...</span>
          </>
        ) : (
          <>
            <span>Upload Outfit</span>
            {!disabled && (
              <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 animate-pulse text-yellow-300 fill-yellow-300" />
            )}
          </>
        )}
      </div>
    </Button>
  );
}
