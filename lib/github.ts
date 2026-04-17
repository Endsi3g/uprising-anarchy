export interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

export async function getLatestCommits(count = 10): Promise<GithubCommit[]> {
  const token = process.env.GITHUB_PAT;
  const owner = "Endsi3g"; // Based on context
  const repo = "uprising-anarchy";

  if (!token) {
    console.warn("GITHUB_PAT not found in environment variables");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${count}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}
