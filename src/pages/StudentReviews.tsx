import { SEO } from "@/components/SEO"
import { ExternalLink, ArrowUpRight } from "lucide-react"

interface RedditPost {
  title: string
  url: string
  timeAgo: string
  content: string
}

interface RedditComment {
  author: string
  badge?: string
  timeAgo: string
  upvotes: number
  body: string
}

const REDDIT_POSTS: RedditPost[] = [
  {
    title: "Appreciate the developer",
    url: "https://www.reddit.com/r/KCETCoded/comments/1xjjvak/appreciate_the_developer/",
    timeAgo: "3 months ago",
    content:
      "Honestly, thank you for this app. I've never seen something related to KCET made so well... Dude, I respect you so much. Gonna recommend it to all of my friends. Thank you."
  },
  {
    title: "Just a post thanking the makers of kcetcoded",
    url: "https://www.reddit.com/r/KCETCoded/comments/1vi7mg1/just_a_post_thanking_the_makers_of_kcetcoded/",
    timeAgo: "5 months ago",
    content:
      "Thank you for this nice, user friendly website you have made. You've helped us out a lot, made our lives 10 times easier. Love the site."
  },
  {
    title: "Respect for makers",
    url: "https://www.reddit.com/r/KCETCoded/comments/1u1g30a/respect_for_makers/",
    timeAgo: "6 months ago",
    content:
      "Major respect to the makers for creating an open, fast, and comprehensive toolkit that solves what KEA portals never did. Helped so many of us navigate counselling with clarity."
  }
]

const REDDIT_COMMENTS: RedditComment[] = [
  {
    author: "Few-Luck-3895",
    badge: "Top 1% Poster",
    timeAgo: "3mo ago",
    upvotes: 1,
    body: "day by day this website gets crazy 😜 😜 anw kudos to u man for amazing work"
  },
  {
    author: "SituationDue4843",
    badge: "kcetard 2026",
    timeAgo: "5mo ago",
    upvotes: 1,
    body: "I was just checking it out. Great job man! You've helped us out a lot, made our lives 10 times easier. Love the site."
  },
  {
    author: "Feisty_Box5779",
    timeAgo: "6mo ago",
    upvotes: 5,
    body: "hello dawg, thanks for making such an amazing website, helped me understand how much I needed to score along with my cbse marks and you made it possible! Thank you"
  },
  {
    author: "Few-Luck-3895",
    badge: "Top 1% Poster",
    timeAgo: "6mo ago",
    upvotes: 3,
    body: "we equally thank you for such a wonderfull website>>"
  },
  {
    author: "Alarmed_Role5593",
    timeAgo: "6mo ago",
    upvotes: 1,
    body: "Man this is crazy great job bro,thanks a lot"
  }
]

export default function StudentReviews() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Student Reviews — KCET Coded"
        description="Community reviews and appreciation from students on r/KCETCoded."
        url="https://kcetcoded.dev/student-reviews"
        keywords="KCET Coded reviews, r/KCETCoded appreciation, student feedback"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Community Reviews
            </h1>
            <a
              href="https://www.reddit.com/r/KCETCoded/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              <span>r/KCETCoded</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Unfiltered appreciation and feedback shared by students on Reddit.
          </p>
        </div>

        {/* Featured Reddit Posts with full content */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Reddit Posts
          </h2>
          <div className="space-y-3">
            {REDDIT_POSTS.map((post) => (
              <div
                key={post.url}
                className="rounded-lg border border-border/60 bg-card/40 p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 font-semibold text-base text-foreground hover:text-primary transition-colors leading-snug"
                    >
                      <span>"{post.title}"</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      r/KCETCoded • {post.timeAgo}
                    </div>
                  </div>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground font-mono shrink-0 underline decoration-muted-foreground/40 underline-offset-4"
                  >
                    View Thread
                  </a>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed font-sans border-l-2 border-border/80 pl-3 italic">
                  "{post.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Comments */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Student Comments
          </h2>

          <div className="space-y-3">
            {REDDIT_COMMENTS.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/60 bg-card/40 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">
                      Anonymous
                    </span>
                    {c.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/40">
                        {c.badge}
                      </span>
                    )}
                    <span className="text-muted-foreground">• {c.timeAgo}</span>
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                    <span>▲</span>
                    <span>{c.upvotes}</span>
                  </div>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  "{c.body}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Note */}
        <div className="rounded-lg border border-border/70 bg-card/50 p-5 sm:p-6 space-y-2.5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Developer Note
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            A Thank You from the Creator
          </h3>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              When KCET counselling starts, KEA typically releases multi-hundred-page scanned PDFs filled with dense cutoff tables. Students and parents spend hours panicking, squinting through phone screens, or paying private counselling consultants.
            </p>
            <p>
              KCETCoded was created with one goal: decode that raw data into instant, transparent, and completely free tools. Seeing positive remarks from students on Reddit confirms that this work genuinely helps real candidates during one of the most stressful phases of their academic journey.
            </p>
            <p className="text-foreground font-medium pt-1">
              Thank you to every student who recommended the platform to their friends, verified cutoff numbers, or dropped a kind word. You are the reason this site stays alive. ❤️
            </p>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="pt-6 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between gap-4 flex-wrap">
          <span>Built for Karnataka students.</span>
          <a
            href="https://www.reddit.com/r/KCETCoded/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors inline-flex items-center gap-1 font-medium"
          >
            Join r/KCETCoded <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
