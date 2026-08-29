import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createClient } from "@supabase/supabase-js";

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

        const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
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

const devNvidiaChatPlugin = (nvidiaApiKey: string): Plugin => ({
  name: "dev-nvidia-chat-api",
  configureServer(server) {
    server.middlewares.use("/api/nvidia-chat", async (req, res) => {
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
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "messages array is required" }));
          return;
        }

        const response = await fetch(NVIDIA_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${nvidiaApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: NVIDIA_MODEL,
            messages,
            temperature: 0.6,
            max_tokens: 4096,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          res.statusCode = response.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: `NVIDIA API error: ${response.status}`, details: errorText }));
          return;
        }

        const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const content = data.choices?.[0]?.message?.content ?? "";

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ content, model: NVIDIA_MODEL }));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          error: "NVIDIA chat failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    });
  },
});

const devCheckResultPlugin = (supabaseUrl: string, supabaseAnonKey: string): Plugin => ({
  name: "dev-check-result-api",
  configureServer(server) {
    server.middlewares.use("/api/check-result", async (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      try {
        const body = await readRequestBody(req);
        const { applNo, dob } = body;

        if (!applNo || !dob) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Application number and Date of Birth are required" }));
          return;
        }

        const cleanApplNo = applNo.trim().toUpperCase();
        const cleanDob = dob.trim();

        // Mock error for testing invalid credentials flow
        if (cleanApplNo.startsWith('INVALID')) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            error: 'Invalid Credentials',
            message: 'Invalid Application Number or Date of Birth. Please check your credentials and try again.'
          }));
          return;
        }

        // Check if mock testing is requested
        if (cleanApplNo.startsWith('TEST') || cleanApplNo === '26UG999999' || cleanApplNo.startsWith('ME082')) {
          // Generate mock response
          let seed = 0;
          for (let i = 0; i < cleanApplNo.length; i++) {
            seed += cleanApplNo.charCodeAt(i);
          }
          const random = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
          };
          const mockData = {
            name: "Simulated Student " + cleanApplNo.slice(-4),
            regNo: cleanApplNo,
            ranks: {
              engineering: Math.floor(random() * 140000) + 120,
              agriculture: Math.floor(random() * 110000) + 200,
              veterinary: Math.floor(random() * 45000) + 50,
              ayush: Math.floor(random() * 75000) + 80,
              bpharma: Math.floor(random() * 95000) + 150,
              pharmd: Math.floor(random() * 38000) + 40
            },
            marks: {
              physics: Math.floor(random() * 30) + 20,
              chemistry: Math.floor(random() * 32) + 18,
              maths: Math.floor(random() * 35) + 15,
              biology: Math.floor(random() * 30) + 22
            },
            isMock: true
          };
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(mockData));
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Check Cache
        const { data: cachedRow, error: cacheError } = await supabase
          .from('ugcet_results_cache')
          .select('results_json')
          .eq('appl_no', cleanApplNo)
          .eq('dob', cleanDob)
          .single();

        if (cachedRow && cachedRow.results_json) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(cachedRow.results_json));
          return;
        }

        // Fetch KEA Results Portal
        const KEA_URL = 'https://keaonline.karnataka.gov.in/ugcet_2026_result/checkresult.php';
        const payload = new URLSearchParams();
        payload.append('reg_no', cleanApplNo);
        payload.append('dob', cleanDob);
        payload.append('Submit', 'Submit');

        let htmlContent = '';
        let fetchedSuccessfully = false;
        try {
          const response = await fetch(KEA_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Origin': 'https://keaonline.karnataka.gov.in',
              'Referer': 'https://keaonline.karnataka.gov.in/ugcet_2026_result/checkresult.php'
            },
            body: payload.toString()
          });

          if (response.ok) {
            htmlContent = await response.text();
            fetchedSuccessfully = true;
          }
        } catch (fetchErr) {
          console.warn("Local proxy to KEA failed:", fetchErr);
        }

        if (!fetchedSuccessfully) {
          // Fallback in dev: generate test data instead of throwing connection error
          const devMock = {
            name: "Simulated Student " + cleanApplNo.slice(-4),
            regNo: cleanApplNo,
            ranks: {
              engineering: 25410,
              agriculture: 18450,
              veterinary: 9840,
              ayush: 12050,
              bpharma: 16730,
              pharmd: 4920
            },
            marks: {
              physics: 32,
              chemistry: 28,
              maths: 41,
              biology: 35
            },
            isMock: true,
            _offlineFallback: true
          };
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(devMock));
          return;
        }

        if (htmlContent.includes('Invalid') || htmlContent.includes('not found') || htmlContent.includes('incorrect') || htmlContent.includes('Enter Correct')) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            error: 'Not Found',
            message: 'Invalid Application Number or Date of Birth entered. Please verify your details.'
          }));
          return;
        }

        // Parse HTML
        const extractVal = (idPattern: string): string => {
          const regex = new RegExp(`id=["']${idPattern}["'][^>]*>([^<]*)`, 'i');
          const match = htmlContent.match(regex);
          return match ? match[1].trim() : "";
        };

        let name = extractVal('lblname') || extractVal('lblvalueName') || extractVal('Name');
        let regNo = extractVal('lblregno') || extractVal('lblRegNo') || extractVal('reg_no');

        if (!name) {
          const nameMatch = htmlContent.match(/Candidate Name[^<]*:<\/td>[^<]*<td>([^<]*)/i);
          name = nameMatch ? nameMatch[1].trim() : "Candidate";
        }
        if (!regNo) {
          const regNoMatch = htmlContent.match(/Reg[^<]*No[^<]*:<\/td>[^<]*<td>([^<]*)/i);
          regNo = regNoMatch ? regNoMatch[1].trim() : "";
        }

        const getRank = (id: string, keyword: string): number | null => {
          const val = extractVal(id);
          if (val && !isNaN(parseInt(val))) return parseInt(val);
          const regex = new RegExp(`${keyword}[^<]*<\/td>[^<]*<td>([^<]*)`, 'i');
          const match = htmlContent.match(regex);
          if (match) {
            const parsed = parseInt(match[1].replace(/[^0-9]/g, ''));
            if (!isNaN(parsed)) return parsed;
          }
          return null;
        };

        const engineering = getRank('lbleng', 'Engineering');
        const agriculture = getRank('lblagri', 'Agriculture');
        const veterinary = getRank('lblvet', 'Veterinary');
        const ayush = getRank('lblayush', 'AYUSH');
        const bpharma = getRank('lblpharma', 'B-Pharma');
        const pharmd = getRank('lblpharmd', 'Pharm-D');

        const getMarks = (id: string, keyword: string): number => {
          const val = extractVal(id);
          if (val && !isNaN(parseFloat(val))) return parseFloat(val);
          const regex = new RegExp(`${keyword}[^<]*<\/td>[^<]*<td>([^<]*)`, 'i');
          const match = htmlContent.match(regex);
          if (match) {
            const parsed = parseFloat(match[1].replace(/[^0-9.]/g, ''));
            if (!isNaN(parsed)) return parsed;
          }
          return 0;
        };

        const physics = getMarks('lblphy', 'Physics');
        const chemistry = getMarks('lblchem', 'Chemistry');
        const maths = getMarks('lblmath', 'Mathematics');
        const biology = getMarks('lblbio', 'Biology');

        const parsedResult = {
          name,
          regNo,
          ranks: { engineering, agriculture, veterinary, ayush, bpharma, pharmd },
          marks: { physics, chemistry, maths, biology }
        };

        const hasAnyRank = Object.values(parsedResult.ranks).some(r => r !== null);
        if (!hasAnyRank) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            error: 'Invalid Credentials',
            message: 'Invalid Application Number or Date of Birth. Please check your credentials and try again.'
          }));
          return;
        }

        // Cache result
        await supabase
          .from('ugcet_results_cache')
          .upsert({
            appl_no: cleanApplNo,
            dob: cleanDob,
            name: parsedResult.name,
            results_json: parsedResult
          });

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(parsedResult));

      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          error: "Internal Server Error",
          message: error instanceof Error ? error.message : "An unexpected error occurred"
        }));
      }
    });
  }
});

const devRazorpayPlugin = (keyId: string, keySecret: string): Plugin => ({
  name: "dev-razorpay-api",
  configureServer(server) {
    server.middlewares.use("/api/create-order", async (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      if (!keyId || !keySecret) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Razorpay credentials not configured in dev" }));
        return;
      }

      try {
        const body = await readRequestBody(req);
        const { amount, currency = "INR", receipt } = body;

        if (amount === undefined || amount === null) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Amount is required" }));
          return;
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || !Number.isInteger(numericAmount) || numericAmount < 100) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Minimum amount must be 100 paise (₹1)" }));
          return;
        }

        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
          amount: numericAmount,
          currency,
          receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
        }));
      } catch (error: unknown) {
        console.error("Dev Razorpay create order error:", error);
        const err = error as { statusCode?: number; message?: string };
        const statusCode = err.statusCode || 500;
        res.statusCode = statusCode;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ 
          error: statusCode === 401 ? "Authentication failure with Razorpay API" : "Failed to create order", 
          message: err.message || String(error),
          details: error
        }));
      }
    });

    server.middlewares.use("/api/verify-payment", async (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      if (!keySecret) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Razorpay credentials not configured in dev" }));
        return;
      }

      try {
        const body = await readRequestBody(req);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Missing required verification fields" }));
          return;
        }

        const crypto = await import("crypto");
        const generatedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");

        if (generatedSignature === razorpay_signature) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, message: "Payment verified successfully" }));
        } else {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: false, error: "Signature mismatch" }));
        }
      } catch (error: unknown) {
        console.error("Dev Razorpay verify payment error:", error);
        const err = error as { message?: string; stack?: string };
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ 
          error: "Failed to verify signature",
          message: err.message || String(error),
          stack: err.stack,
          details: error
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
      devNvidiaChatPlugin(env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY || ""),
      devCheckResultPlugin(
        env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
        env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ""
      ),
      devRazorpayPlugin(
        env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "",
        env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || ""
      ),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
