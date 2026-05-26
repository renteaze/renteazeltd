import { useParams, Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Clock, User, Tag, Twitter, MessageCircle, Link2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { blogPosts } from "@/data/blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const share = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${url}`)}`,
    copy: () => {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    },
  };

  return (
    <Layout>
      <article>
        <section className="py-6 border-b">
          <div className="container mx-auto px-4 lg:px-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Back to insights
            </Link>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary inline-flex items-center gap-1">
              <Tag className="h-3 w-3" /> {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mt-4 leading-tight">{post.title}</h1>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(post.date).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
            </div>
          </div>
        </section>

        <section>
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <img src={post.image} alt={post.title} className="w-full h-[260px] md:h-[420px] object-cover rounded-xl" />
          </div>
        </section>

        <section className="py-10">
          <div
            className="container mx-auto px-4 lg:px-8 max-w-3xl prose prose-slate prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-p:text-muted-foreground prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        <section className="py-6 border-y">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Share:</span>
            <a href={share.twitter} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-2"><Twitter className="h-4 w-4" /> X</Button>
            </a>
            <a href={share.whatsapp} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
            </a>
            <Button size="sm" variant="outline" className="gap-2" onClick={share.copy}>
              <Link2 className="h-4 w-4" /> Copy link
            </Button>
          </div>
        </section>

        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Continue reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <img src={p.image} alt={p.title} className="w-full h-44 object-cover" />
                    <CardContent className="p-5">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{p.category}</span>
                      <h3 className="font-semibold mt-2 line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to take the next step?</h2>
            <p className="mt-3 opacity-90">Talk to a Renteaze advisor about the right product for your situation.</p>
            <Link to="/contact" className="inline-block mt-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90 gap-2">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default BlogPost;
