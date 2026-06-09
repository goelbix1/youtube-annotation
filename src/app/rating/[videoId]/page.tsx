export default async function RatingPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <h1>Video ID: {videoId}</h1>
    </main>
  );
}