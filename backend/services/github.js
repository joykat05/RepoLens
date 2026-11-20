import axios from "axios";

const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

export function parseGithubUrl(url) {
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

export async function getRepoInfo(owner, repo) {
  const { data } = await gh.get(`/repos/${owner}/${repo}`);
  return data;
}

export async function getTree(owner, repo, branch) {
  const { data } = await gh.get(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  return data;
}

export async function getFile(owner, repo, path) {
  const { data } = await gh.get(`/repos/${owner}/${repo}/contents/${path}`);
  return Buffer.from(data.content, "base64").toString("utf-8");
}