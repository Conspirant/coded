import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "nvidia/nemotron-3-super-120b-a12b";

const readRequestBody = async (req: import("http").IncomingMessage) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

const extractJson = (text: string) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return raw.slice(start, end + 1);
};

const devAiListerPlugin = (nvidiaApiKey: string): Plugin => ({
  name: "dev-ai-lister-api",
  configureServer(server) {
    server.middlewares.use("/api/ai-lister", async (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      if (!nvidiaApiKey) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "NVIDIA API key not configured" }));
        return;
      }

      try {
        const body = await readRequestBody(req);
        const candidates = Array.isArray(body.candidates) ? body.candidates : [];
        const safeLimit = Math.max(5, Math.min(Number(body.limit) || 30, candidates.length));
        const compactCandidates = candidates.slice(0, 260).map((candidate: any) => ({
          id: candidate.id,
          code: candidate.collegeCode,
          college: String(candidate.collegeName || "").slice(0, 120),
          branch: String(candidate.branchName || "").slice(0, 80),
          cutoff: candidate.cutoff,
          category: candidate.category,
          qualityScore: candidate.qualityScore,
        }));

        const response = await fetch(NVIDIA_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${nvidiaApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: NVIDIA_MODEL,
            messages: [
              {
                role: "system",
                content: [
                  "You are an expert KCET option-entry list ranker.",
                  "Rank engineering college-course candidates for Karnataka counselling.",
                  "Prefer stronger colleges by placements, infrastructure, faculty, brand, location, alumni network, autonomy/university strength, and student outcomes.",
                  "Also respect cutoff fit: do not put only impossible dream options first; maintain a practical list with realistic and safe backups.",
                  'Return ONLY valid JSON with this shape: {"orderedIds":["id1","id2"]}.',
                  "Do not include explanations, markdown, or extra keys.",
                ].join(" "),
              },
              {
                role: "user",
                content: JSON.stringify({
                  student: {
                    rank: body.rank,
                    category: body.category,
                    year: body.year,
                    round: body.round,
                    preferredStreams: body.branches,
                    requestedOptions: safeLimit,
                  },
                  candidates: compactCandidates,
                  instruction: `Return up to ${safeLimit} candidate ids in best option-entry order. If two options have similar cutoff fit, prefer the better college quality.`,
                }),
              },
            ],
            temperature: 0.25,
            top_p: 0.9,
            max_tokens: 4096,
            stream: false,
          }),
        });

        if (!response.ok) {
          const details = await response.text().catch(() => "Unknown error");
          res.statusCode = response.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: `NVIDIA API error: ${response.status}`, details }));
          return;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        const jsonText = extractJson(content);
        if (!jsonText) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "AI returned non-JSON content" }));
          return;
        }

        const parsed = JSON.parse(jsonText);
        const orderedIds = Array.isArray(parsed.orderedIds)
          ? parsed.orderedIds.filter((id: unknown) => typeof id === "string")
          : [];

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ orderedIds: orderedIds.slice(0, safeLimit), model: NVIDIA_MODEL }));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          error: "AI lister failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      devAiListerPlugin(env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY || ""),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
