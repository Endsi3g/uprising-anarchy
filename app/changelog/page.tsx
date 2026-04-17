import { getLatestCommits } from "@/lib/github";
import { Nav } from "@/components/landing/Nav";
import { ChangelogList } from "@/components/landing/ChangelogList";

export const dynamic = "force-dynamic";

export default async function ChangelogPage() {
  const commits = await getLatestCommits(20);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20">
      <Nav />
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="font-serif text-5xl font-medium mb-4">Changelog</h1>
          <p className="text-white/50 text-lg">
            Every commit, every push. Real-time evolution of the Uprising Agency OS.
          </p>
        </div>

        <ChangelogList commits={commits} />
      </div>
    </main>
  );
}
