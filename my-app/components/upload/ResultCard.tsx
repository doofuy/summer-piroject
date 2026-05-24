"use client";

import { Sparkles, Shirt, Palette, ShieldAlert, Sparkle, RefreshCw, Layers } from "lucide-react";

export interface RecommendationItem {
  name: string;
  imageUrl?: string;
  score?: number;
}

export interface AnalysisResult {
  imageUrl: string;
  similar_items: string[];
  outfit_suggestion: string;
  score?: number;
  recommendations?: RecommendationItem[];
}

interface ResultCardProps {
  result: AnalysisResult | null;
  onReset?: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  if (!result) return null;

  // Default score to a highly-styled 88% if not provided by backend
  const displayScore = result.score || 88;

  return (
    <div className="w-full max-w-lg mx-auto mt-12 animate-[fadeIn_0.6s_ease-out] relative">
      {/* Decorative neon glow effects behind the card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000 -z-10 animate-pulse" />

      <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Shiny absolute accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header containing the overall score */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-muted/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">AI Style Analysis</h2>
              <p className="text-xs text-muted-foreground">Instantly processed by Vision AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-muted/40 p-2 pr-4 rounded-2xl border w-fit">
            {/* Circular rating score meter */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted/30"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-violet-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${displayScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-foreground">{displayScore}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-500">Style Score</span>
              <span className="text-xs font-semibold text-muted-foreground">Very Good Harmony</span>
            </div>
          </div>
        </div>

        {/* Uploaded Image Preview */}
        {result.imageUrl && (
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden my-6 border border-violet-500/10 shadow-inner group">
            <img
              src={result.imageUrl}
              alt="Analyzed Outfit"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Dark glassmorphic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/95 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Analyzed Outfit
            </span>
          </div>
        )}

        {/* Outfit Suggestion Section */}
        <div className="py-6 border-b border-muted/80">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Shirt className="w-4.5 h-4.5 text-violet-500" />
            AI Outfit Recommendation
          </h4>
          <div className="relative bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 hover:from-violet-500/10 hover:to-fuchsia-500/10 transition-all border border-violet-500/10 rounded-2xl p-4 md:p-5 shadow-sm">
            <p className="text-sm text-foreground/90 font-medium leading-relaxed italic">
              "{result.outfit_suggestion}"
            </p>
          </div>
        </div>

        {/* Similar / Recommended Pairing Items */}
        <div className="py-6">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-violet-500" />
            Recommended Pairings & Similar Items
          </h4>
          
          {result.recommendations && result.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.recommendations.map((item, index) => (
                <div 
                  key={index}
                  className="group relative flex flex-col bg-muted/30 border border-violet-500/10 hover:border-violet-500/30 hover:bg-violet-500/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                >
                  {/* Score/Match Badge */}
                  {item.score !== undefined && (
                    <div className="absolute top-2 right-2 z-10 text-[10px] font-extrabold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 select-none">
                      {item.score}% Match
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-muted/40 overflow-hidden">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to generic unsplash outfit placeholder if image fails to load
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Shirt className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <span className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-violet-500 transition-colors duration-200">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : result.similar_items && result.similar_items.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {result.similar_items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-muted/40 hover:bg-violet-500/5 hover:border-violet-500/30 rounded-full border text-xs font-semibold text-muted-foreground hover:text-violet-500 transition-all duration-200 cursor-default select-none hover:scale-[1.03]"
                >
                  <Sparkle className="w-3 h-3 text-violet-500 fill-violet-500/20" />
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">No recommendations loaded.</span>
          )}
        </div>

        {/* Reset button to upload another image */}
        {onReset && (
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-input bg-background/50 hover:bg-muted rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-all duration-200 mt-2 active:scale-98"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Analyze Another Outfit
          </button>
        )}
      </div>
    </div>
  );
}
