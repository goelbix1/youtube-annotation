"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Status = "idle" | "loading" | "success" | "error";

export default function FirestoreTestPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Testing Firestore connection...");
  const [docExists, setDocExists] = useState<boolean | null>(null);

  useEffect(() => {
    async function testFirestore() {
      try {
        // Use a fixed test document ID for now.
        const testRef = doc(db, "videos", "connectivity-test");
        const snap = await getDoc(testRef);

        if (snap.exists()) {
          setDocExists(true);
          setMessage("Document found.");
        } else {
          setDocExists(false);
          setMessage("No document found.");
        }

        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Firestore read failed.");
      }
    }

    testFirestore();
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Firestore Test
        </h1>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">Status</p>
          <p className="mt-1 text-base font-medium text-slate-900">{status}</p>

          <p className="mt-4 text-sm text-slate-600">Result</p>
          <p className="mt-1 text-base text-slate-900">{message}</p>

          <p className="mt-4 text-sm text-slate-600">Document exists</p>
          <p className="mt-1 text-base text-slate-900">
            {docExists === null ? "Checking..." : docExists ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </main>
  );
}
