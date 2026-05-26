import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { blogPosts } from "@/data/blog";

const categories = ["All", "Tenants", "Landlords", "Investors", "Market Insights", "PropTech"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter((p) => p.audience === activeCategory);

  return (
    <Layout>
      <section className="bg-navy text-navy-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Blog & <span className="text-accent">Insights</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert advice, market analysis, and guides for tenants, landlords, and investors.
          </p>
        </div>
      </section>

      <section className="py-6 border-b sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4 lg:px-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              variant={activeCategory === c ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {post.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
