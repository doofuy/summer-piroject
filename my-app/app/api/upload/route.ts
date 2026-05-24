import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Upload kaam kar raha siiii!",
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const image = formData.get("image") as File | null; //this as file is for typescript which is to indicate that it is a file and null means if it is not there then it is null

    if (!image) {
      return NextResponse.json(
        { success: false, message: "No image provided" },
        { status: 400 },
      );
    }

    if (image instanceof File) {
      console.log({
        name: image.name,
        size: image.size,
        type: image.type,
      });
    }
    console.log(image);

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(buffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "dressupai" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(buffer);
    });
    console.log(result);

    const imageUrl = (result as any).secure_url;

    const getMockImageUrl = (name: string): string => {
      const normalized = name.toLowerCase();
      if (normalized.includes("jean")) {
        return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60";
      }
      if (normalized.includes("sneaker") || normalized.includes("shoe") || normalized.includes("footwear")) {
        return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60";
      }
      if (normalized.includes("jacket") || normalized.includes("coat") || normalized.includes("outerwear")) {
        return "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60";
      }
      if (normalized.includes("hoodie") || normalized.includes("sweatshirt") || normalized.includes("sweater")) {
        return "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60";
      }
      if (normalized.includes("shirt") || normalized.includes("t-shirt") || normalized.includes("tee")) {
        return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60";
      }
      // Generic clothing image fallback
      return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60";
    };

    // Call the ML recommendation server with the Cloudinary image URL
    let similar_items = ["Black Jeans", "White Sneakers", "Oversized Jacket"];
    let outfit_suggestion = "Try pairing this with black jeans and white sneakers for a classic, effortless look.";
    let recommendations = [
      { name: "Black Jeans", imageUrl: getMockImageUrl("Black Jeans"), score: 92 },
      { name: "White Sneakers", imageUrl: getMockImageUrl("White Sneakers"), score: 88 },
      { name: "Oversized Jacket", imageUrl: getMockImageUrl("Oversized Jacket"), score: 85 }
    ];

    try {
      const mlServerUrl = process.env.ML_SERVER_URL || "http://localhost:8000";
      const mlResponse = await fetch(`${mlServerUrl}/recommend?img_url=${encodeURIComponent(imageUrl)}`, {
        method: "POST",
      });
      
      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        if (mlData.success) {
          similar_items = mlData.similar_items;
          outfit_suggestion = mlData.outfit_suggestion;
          
          if (mlData.raw_matches && mlData.raw_matches.length > 0) {
            recommendations = mlData.raw_matches.map((match: any, index: number) => {
              const cleanFile = match.file.replace(/\\/g, '/');
              const name = similar_items[index] || cleanFile.split('/').pop().split('.')[0].replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
              return {
                name: name,
                imageUrl: `${mlServerUrl}/${cleanFile}`,
                score: Math.round(match.score * 100)
              };
            });
          } else {
            recommendations = similar_items.map((item: string) => ({
              name: item,
              imageUrl: getMockImageUrl(item),
              score: 85
            }));
          }
          console.log("Fetched recommendations from ML Server:", mlData);
        }
      } else {
        console.error("ML Server returned an error:", await mlResponse.text());
      }
    } catch (error) {
      console.warn("Failed to connect to ML Server. Using default mock recommendations:", error);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      similar_items,
      outfit_suggestion,
      recommendations,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong si paaji!!!",
      },
      {
        status: 500,
      },
    );
  }
}
