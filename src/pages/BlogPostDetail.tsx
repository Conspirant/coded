import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { SEO } from "@/components/SEO";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/data/blogPosts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Copy,
  BookOpen,
  ChevronRight,
  List,
  Target,
  Brain,
  Info,
  ExternalLink
} from "lucide-react";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const post = useMemo(() => {
    return slug ? getBlogPostBySlug(slug) : undefined;
  }, [slug]);

  const relatedPosts = useMemo(() => {
    return post ? getRelatedBlogPosts(post.slug, post.category, 2) : [];
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tocItems = useMemo(() => {
    if (!post?.content) return [];
    const lines = post.content.split("\n");
    const items: { id: string; text: string; level: number }[] = [];
    
    lines.forEach((line) => {
      if (line.startsWith("### ")) {
        const text = line.replace("### ", "").trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 3 });
      } else if (line.startsWith("## ")) {
        const text = line.replace("## ", "").trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 2 });
      }
    });

    return items;
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!post) return;
    const text = encodeURIComponent(`Check out this KCET counseling guide: "${post.title}"\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
        <h1 className="text-xl font-bold text-foreground">Article Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested article may have been moved or renamed.
        </p>
        <Button asChild variant="outline" className="rounded-lg text-xs">
          <Link to="/blog">
            <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Return to All Guides
          </Link>
        </Button>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "KCET Coded",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kcetcoded.dev/pics/icon-512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kcetcoded.dev/blog/${post.slug}`
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 relative">
      {/* Subtle Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-0.5 bg-violet-500 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <SEO
        title={`${post.title} | KCET Coded Journal`}
        description={post.description}
        url={`https://kcetcoded.dev/blog/${post.slug}`}
        keywords={post.tags.join(", ")}
      />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Navigation Breadcrumb & Action Bar */}
      <div className="space-y-4 border-b border-border/50 pb-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto pb-1 scrollbar-none">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-foreground transition-colors">Journal</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate font-medium max-w-xs">{post.title}</span>
        </nav>

        <div className="flex items-center justify-between pt-1">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground p-0">
            <Link to="/blog">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Journal
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs rounded-lg border-border h-8"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareWhatsApp}
              className="gap-1.5 text-xs rounded-lg border-border h-8 text-foreground"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-400" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-violet-500/30 text-violet-400 text-xs font-semibold px-2.5 py-0.5">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readTime}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {post.publishedAt}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {post.description}
        </p>

        {/* Author Bar */}
        <div className="pt-3 flex items-center gap-3 border-t border-border/40">
          <div className="h-8 w-8 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-xs">
            KC
          </div>
          <div className="text-xs">
            <div className="font-semibold text-foreground">{post.author.name}</div>
            <div className="text-muted-foreground">{post.author.role}</div>
          </div>
        </div>
      </header>

      {/* Main Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pt-2">
        {/* Main Article Text */}
        <div className="lg:col-span-3 space-y-8">
          <article className="text-foreground leading-relaxed">
            <ReactMarkdown
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                  return (
                    <h2 id={id} className="text-xl sm:text-2xl font-bold text-foreground border-l-4 border-violet-500 pl-3.5 mt-10 mb-5 tracking-tight scroll-mt-24">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                  return (
                    <h3 id={id} className="text-lg font-bold text-foreground mt-8 mb-3 tracking-tight scroll-mt-24">
                      {children}
                    </h3>
                  );
                },
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold text-foreground mt-6 mb-2">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-sm sm:text-base leading-7 text-muted-foreground mb-5">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-violet-500 bg-secondary/30 p-4 sm:p-5 rounded-r-xl my-6 text-sm sm:text-base text-foreground italic space-y-1">
                    <div className="flex items-center gap-1.5 text-violet-400 font-semibold text-xs not-italic uppercase tracking-wider mb-1">
                      <Info className="h-3.5 w-3.5" /> Key Takeaway
                    </div>
                    <div>{children}</div>
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2.5 my-5 pl-5 list-disc text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-2.5 my-5 pl-5 list-decimal text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">
                    {children}
                  </li>
                ),
                table: ({ children }) => (
                  <div className="my-6 overflow-x-auto border border-border rounded-xl bg-card">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-secondary/60 text-foreground font-semibold border-b border-border">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="p-3.5 border-t border-border/40 text-muted-foreground text-xs sm:text-sm">
                    {children}
                  </td>
                ),
                code: ({ children }) => (
                  <code className="text-violet-300 bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="my-6 p-4 rounded-xl bg-secondary/80 border border-border overflow-x-auto text-xs font-mono text-foreground leading-relaxed">
                    {children}
                  </pre>
                ),
                hr: () => (
                  <hr className="border-border/60 my-8" />
                ),
                a: ({ href, children }) => (
                  <Link
                    to={href || "#"}
                    className="text-violet-400 font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    {children}
                    {href?.startsWith("http") && <ExternalLink className="h-3 w-3 inline ml-0.5" />}
                  </Link>
                )
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Action CTA Card */}
          <div className="border-l-4 border-l-violet-600 bg-card border border-border p-6 rounded-xl space-y-3">
            <h3 className="text-base font-bold text-foreground">
              Put this strategy into practice
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore previous 3-year KCET and COMEDK cutoffs filtered by your category, rank, and preferred branches using our interactive predictor tools.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold gap-1.5">
                <Link to="/college-predictor">
                  <Target className="h-3.5 w-3.5" /> Open College Predictor
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-border rounded-lg text-xs gap-1.5">
                <Link to="/cutoff-predictor">
                  <Brain className="h-3.5 w-3.5 text-violet-400" /> Cutoff Predictor
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {tocItems.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3 sticky top-24">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/50 pb-2">
                <List className="h-3.5 w-3.5 text-violet-400" />
                <span>Contents</span>
              </div>
              <nav className="space-y-2 text-xs">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-muted-foreground hover:text-foreground transition-colors line-clamp-1 ${
                      item.level === 3 ? "pl-3 text-[11px]" : "font-medium text-foreground/90"
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Related Reading
              </span>
              {relatedPosts.map((rel) => (
                <Link key={rel.id} to={`/blog/${rel.slug}`} className="block group">
                  <Card className="bg-card border border-border hover:border-violet-500/40 transition-colors p-3.5 rounded-lg">
                    <div className="space-y-1">
                      <span className="text-[10px] text-violet-400 font-semibold uppercase">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-violet-400 transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground block pt-1">
                        {rel.readTime}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
