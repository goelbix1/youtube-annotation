export default async function RatingPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <section className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-4">
          Rating page
        </p>

        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Video ID: {videoId}
        </h1>

        <p className="text-gray-600">
          Rating page coming soon.
        </p>
      </section>
    </main>
  );
}