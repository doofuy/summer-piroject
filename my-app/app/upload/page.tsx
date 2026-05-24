"use client";
import { useState } from "react";
import UploadBox from "@/components/upload/UploadBox";
import UploadButton from "@/components/upload/UploadButton";
import ResultCard, { AnalysisResult } from "@/components/upload/ResultCard";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // image preview url:---
  const [previewUrl, setPreviewUrl] = useState("");

  // loading state
  const [loading, setLoading] = useState(false);

  // analysis result state
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile); // we are giving image as the key we would extract in the backend

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setResult({
          imageUrl: data.imageUrl,
          similar_items: data.similar_items || [],
          outfit_suggestion: data.outfit_suggestion || "",
          score: 88, // Simulated Style Score based on AI evaluation
          recommendations: data.recommendations
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-lg text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Upload Your Outfit
        </h1>
        <p className="text-muted-foreground mt-3 text-base md:text-lg">
          Let our AI analyze your outfit and suggest style improvements.
        </p>
      </div>

      {!result ? (
        <>
          <UploadBox
            onFileSelect={setSelectedFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />

          <UploadButton
            onClick={handleUpload}
            disabled={!selectedFile}
            loading={loading}
          />
        </>
      ) : (
        <ResultCard
          result={result}
          onReset={() => {
            setResult(null);
            setSelectedFile(null);
            setPreviewUrl("");
          }}
        />
      )}
    </div>
  );
}



