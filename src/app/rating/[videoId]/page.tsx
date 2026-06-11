"use client";

import { FormEvent, use, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

type VideoData = {
  estimated_rating?: string;
  confidence_score?: number;
  title?: string;
};

type Annotation = {
  category: string;
  timestamp_seconds: number;
  video_id: string;
};

export default function RatingPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = use(params);

  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [category, setCategory] = useState("violence");
  const [timestampSeconds, setTimestampSeconds] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const videoRef = collection(db, "videos");
        const videoQuery = query(videoRef, where("__name__", "==", videoId));
        const videoSnap = await getDocs(videoQuery);

        if (!videoSnap.empty) {
          const data = videoSnap.docs[0].data() as VideoData;
          setVideoData(data);
        } else {
          setVideoData(null);
        }

       const annotationsRef = collection(db, "annotations");
       const annotationsSnap = await getDocs(annotationsRef);

       const items = annotationsSnap.docs
        .map((doc) => doc.data() as Annotation)
        .filter((annotation) => annotation.video_id === videoId);

      setAnnotations(items);
      } catch (error) {
        console.error("Failed to load page data:", error);
        setVideoData(null);
        setAnnotations([]);
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [videoId]);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setSubmitError(null);

  const parsedSeconds = Number(timestampSeconds);

  if (!Number.isFinite(parsedSeconds) || parsedSeconds < 0) {
    setSubmitError("Enter a valid timestamp.");
    return;
  }

  setSubmitting(true);

  try {
    await addDoc(collection(db, "annotations"), {
      video_id: videoId,
      category,
      timestamp_seconds: Math.floor(parsedSeconds),
      created_at: serverTimestamp(),
    });

    setCategory("violence");
    setTimestampSeconds("");

    const annotationsSnap = await getDocs(collection(db, "annotations"));
    const items = annotationsSnap.docs
      .map((doc) => doc.data() as Annotation)
      .filter((annotation) => annotation.video_id === videoId)
      .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);

    setAnnotations(items);
  } catch (error) {
    console.error("Failed to add annotation:", error);
    setSubmitError("Could not save annotation.");
  } finally {
    setSubmitting(false);
  }
}
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
  
function formatTimestamp(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
  
 
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

        <section className="rounded-3xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Community Annotations
          </h2>
 
          {annotations.length > 0 ? (
            <div className="mt-4 space-y-4">
              {annotations.map((annotation, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <p className="font-medium text-slate-900">
                    {annotation.category.charAt(0).toUpperCase() +
                    annotation.category.slice(1)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Timestamp: {formatTimestamp(annotation.timestamp_seconds)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-600">No annotations yet.</p>
          )}
        </section>
        <section className="rounded-3xl border border-slate-200 p-6">
  <h2 className="text-xl font-semibold text-slate-900">
    Add Annotation
  </h2>

  <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
    <div>
      <label className="block text-sm font-medium text-slate-700">
        Category
      </label>
      <select
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="violence">Violence</option>
        <option value="language">Language</option>
        <option value="scary">Scary</option>
        <option value="sexual">Sexual</option>
        <option value="drugs">Drugs</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700">
        Timestamp in seconds
      </label>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none"
        type="number"
        min="0"
        step="1"
        value={timestampSeconds}
        onChange={(event) => setTimestampSeconds(event.target.value)}
      />
    </div>

    {submitError ? (
      <p className="text-sm text-red-600">{submitError}</p>
    ) : null}

    <button
      className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={submitting}
    >
      {submitting ? "Saving..." : "Submit Annotation"}
    </button>
  </form>
</section>
      </div>
    </main>
  );
}