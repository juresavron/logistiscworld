import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BlogArticle } from "../components/blog";
import { PublicLayout } from "../components/layout";
import { getBlogPost } from "../data/blog";
import { pageHead } from "../domain/seo";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData: post }) => {
    if (!post) return {};
    const head = pageHead(post.title, post.description, `/blog/${post.slug}`);
    return { ...head, meta: [...head.meta.filter(meta => !("property" in meta && meta.property === "og:type")), { property: "og:type", content: "article" }, { property: "article:published_time", content: `${post.publishedAt}T00:00:00+01:00` }] };
  },
  component: Page,
  notFoundComponent: () => <PublicLayout><div className="wrap section blog-not-found"><span className="eyebrow">GUIDE NOT FOUND</span><h1>This guide isn’t here.</h1><p>Explore our latest articles for practical shipping advice.</p><Link className="button dark" to="/blog">Back to the blog</Link></div></PublicLayout>,
});

function Page() {
  const post = Route.useLoaderData();
  return <PublicLayout><BlogArticle post={post}/></PublicLayout>;
}
