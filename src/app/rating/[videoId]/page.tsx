"use client";

import { use, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type VideoData = {
  estimated_rating?: string;
  confidence_score?: number;
  title?: string;
};

export default function RatingPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = use(params);

  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const videoRef = doc(db, "videos", videoId);
        const videoSnap = await getDoc(videoRef);

        if (videoSnap.exists()) {
          setVideoData(videoSnap.data() as VideoData);
        } else {
          setVideoData(null);
        }
      } catch (error) {
        console.error("Failed to load video:", error);
        setVideoData(null);
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [videoId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-slate-500">Loading rating...</p>
        </div>
      </main>
    );
  }

  const rating = videoData?.estimated_rating ?? "Unrated";
  const confidence = videoData?.confidence_score;

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm text-slate-500">Community-powered content guidance</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {videoData ? "Community Video Rating" : "No Rating Yet"}
          </h1>
        </header>
      <div className="aspect-video overflow-hidden rounded-3xl border border-slate-200">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allowFullScreen
        />
      </div>
        {videoData ? (
          <section className="grid gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <p className="text-sm text-slate-500">Estimated rating</p>
              <div className="mt-2 inline-flex rounded-full bg-slate-900 px-4 py-2 text-lg font-semibold text-white">
                {rating}
              </div>
            </div>

            <div className="md:col-span-1">
              <p className="text-sm text-slate-500">Confidence</p>
              <p className="mt-2 text-lg font-medium text-slate-900">
                {typeof confidence === "number"
                  ? `${Math.round(confidence * 100)}%`
                  : "Unknown"}
              </p>
            </div>

            <div className="md:col-span-1">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-2 text-lg font-medium text-slate-900">
                Rating found
              </p>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              No Rating Yet
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              This video has not been rated by the community yet. Be the first
              to add an annotation.
            </p>

            <button className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white">
              Add First Annotation
            </button>
          </section>
        )}

        {videoData && (
          <section className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              What this means
            </h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              This rating is generated from community annotations and votes.
              Higher confidence means the community has added more consistent
              evidence.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}