import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { getAllBlogPosts, searchBlogPosts } from "@/data/blogPosts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Filter,
  Newspaper
} from "lucide-react";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Guides", value: "all" },
  { label: "Strategy", value: "Strategy" },
  { label: "Counseling", value: "Counseling" },
  { label: "Comparisons", value: "Comparisons" },
];

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allPosts = useMemo(() => getAllBlogPosts(), []);
  const featuredPost = useMemo(() => allPosts.find((p) => p.featured) || allPosts[0], [allPosts]);

  const filteredPosts = useMemo(() => {
    return searchBlogPosts(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <SEO
        title="KCET & COMEDK Counseling Guides & Admissions Journal"
        description="Comprehensive guides for KCET 2026 and COMEDK counseling. Option Entry strategies, Choice 1/2/3/4 rules, VTU vs Autonomous comparisons, and college selection guides."
        url="https://kcetcoded.dev/blog"
        keywords="KCET blog, KEA counseling guide, KCET option entry strategy, Choice 1 choice 2 explained, VTU vs Autonomous, COMEDK guidance, Karnataka engineering admission"
      />

      {/* Header Section */}
      <div className="space-y-6 border-b border-border/60 pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-widest">
          <Newspaper className="h-4 w-4" />
          <span>Admissions Journal & Guidance</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Counseling Guides & Strategy
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Independent, data-backed breakdowns of KEA option entry rules, cutoff mechanics, and honest college comparisons for Karnataka engineering aspirants.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search guides (e.g., Option Entry, Choice 2, VTU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-card border-border rounded-lg focus:border-violet-500 transition-colors text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                    isActive
                      ? "bg-violet-600 text-white border-violet-600 font-semibold"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Article Card */}
      {!searchQuery && selectedCategory === "all" && featuredPost && (
        <div className="space-y-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Featured Editorial
          </span>
          <Link to={`/blog/${featuredPost.slug}`} className="block group">
            <Card className="bg-card border border-border hover:border-violet-500/50 transition-all duration-200 rounded-xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[11px] font-medium px-2.5 py-0.5">
                        {featuredPost.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-violet-400 transition-colors tracking-tight">
                      {featuredPost.title}
                    </h2>

                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-2">
                      {featuredPost.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-[10px]">
                          KC
                        </span>
                        {featuredPost.author.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {featuredPost.publishedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 lg:pt-0">
                    <Button variant="outline" className="border-border hover:border-violet-500/40 rounded-lg gap-2 text-xs font-semibold">
                      Read Article <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h2 className="text-lg font-bold text-foreground">
            {selectedCategory === "all" ? "All Admissions Articles" : `${selectedCategory} Guides`}
          </h2>
          <span className="text-xs text-muted-foreground">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <Card className="bg-card border border-border p-12 text-center space-y-4 rounded-xl">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No matching articles found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try searching for broader keywords like "Option Entry", "Choice 2", or "VTU".
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="rounded-lg text-xs"
            >
              Reset Search & Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col">
                <Card className="h-full bg-card border border-border hover:border-violet-500/50 transition-all duration-200 rounded-xl overflow-hidden flex flex-col justify-between">
                  <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-border text-muted-foreground text-[11px] font-medium px-2 py-0.5">
                          {post.category}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt}
                      </span>
                      <span className="text-xs font-semibold text-foreground group-hover:text-violet-400 transition-colors flex items-center gap-1">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
