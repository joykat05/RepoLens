import { Router } from "express";
import Repository from "../models/Repository.js";
import { parseGithubUrl, getRepoInfo, getTree, getFile } from "../services/github.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = parseGithubUrl(req.body.url || "");
    if (!parsed) return res.status(400).json({ error: "Invalid GitHub URL" });

    const info = await getRepoInfo(parsed.owner, parsed.repo);
    const repo = await Repository.create({
      url: req.body.url,
      owner: parsed.owner,
      name: parsed.repo,
      defaultBranch: info.default_branch,
    });
    res.status(201).json(repo);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const repo = await Repository.findById(req.params.id);
  if (!repo) return res.status(404).json({ error: "Not found" });
  res.json(repo);
});

router.get("/:id/tree", async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ error: "Not found" });
    res.json(await getTree(repo.owner, repo.name, repo.defaultBranch));
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.get("/:id/files", async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ error: "Not found" });
    const content = await getFile(repo.owner, repo.name, req.query.path);
    res.json({ path: req.query.path, content });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

export default router;