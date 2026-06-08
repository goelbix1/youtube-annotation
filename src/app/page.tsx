"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const router = useRouter();
  
  const handleCheckRating = () => {
  if (!videoUrl.trim()) {
    return;
  }

  try {
    const extractedVideoId =
      new URL(videoUrl).searchParams.get("v") || "";

    if (!extractedVideoId) {
      alert("Could not find a YouTube video ID");
      return;
    }

    setVideoId(extractedVideoId);
    router.push(`/rating/${extractedVideoId}`);
  } catch {
    alert("Please enter a valid YouTube URL");
  }
  };
  
  
  
  

  return (
    <main className="min-h-screen bg-white px-6 flex items-center justify-center">
      <section className="w-full max-w-4xl text-center">
        <p className="text-sm text-gray-500 mb-4">
          Community-powered video content ratings
        </p>

        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight leading-tight mb-5">
          Know what’s in a video before watching
        </h1>

        <p className="max-w-2xl mx-auto text-base text-gray-600 mb-8">
          Paste a video link to view community annotations,
          content warnings, and estimated age guidance.
        </p>

        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste a video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="flex-1 rounded-2xl border border-gray-300 px-5 py-4 text-base outline-none focus:ring-2 focus:ring-gray-300"
          />

          <button
            onClick={handleCheckRating}
            className="rounded-2xl bg-gray-900 px-8 py-4 text-white font-medium hover:opacity-90 transition"
          >
            Check Rating
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-5">
          Currently supports YouTube videos
        </p>
        {videoId && (
          <p className="mt-6 text-gray-700">
          Video found: <strong>{videoId}</strong>
          </p>
        )}
      </section>
    </main>
  );
}