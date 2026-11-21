import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowUpRight, ClipboardList, Container, Ship } from "lucide-react";
import { useState } from "react";
import harbourImage from "../assets/koper-harbour.jpg";
import { blogPosts, formatBlogDate, readingMinutes, type BlogCategory, type BlogPost } from "../data/blog";
import { emptySearch } from "../domain/search";
import { siteOrigin } from "../domain/seo";

function BlogArtwork({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  const Icon = post.artwork === "containers" ? Container : ClipboardList;
  return <div className={`blog-artwork blog-artwork--${post.artwork}`} aria-hidden="true">
    {post.artwork === "port" ? <img src={harbourImage} alt="" loading={eager ? "eager" : "lazy"} width="1200" height="800" /> : <><div className="blog-artwork-lines"/><Icon size={90} strokeWidth={1}/><span>{post.artwork === "containers" ? "FCL / LCL" : "THE SHIPMENT BRIEF"}</span></>}
    <span className="blog-artwork-label">LOGISTICSWORLD / FIELD NOTES</span>
  </div>;
}

function PostMeta({ post }: { post: BlogPost }) {
  return <div className="blog-meta"><span>{post.category}</span><span aria-hidden="true">/</span><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time><span aria-hidden="true">/</span><span>{readingMinutes(post)} min read</span></div>;
}

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
    <Link className="blog-card-image" to="/blog/$slug" params={{ slug: post.slug }} aria-label={`Read: ${post.title}`} tabIndex={-1}><BlogArtwork post={post} eager={featured}/></Link>
    <div className="blog-card-copy"><PostMeta post={post}/><h2><Link to="/blog/$slug" params={{ slug: post.slug }}>{post.title}</Link></h2><p>{post.description}</p><Link className="blog-read-link" to="/blog/$slug" params={{ slug: post.slug }}>Read the guide <ArrowUpRight size={18}/></Link></div>
  </article>;
}

export function BlogListing() {
  const [category, setCategory] = useState<"All" | BlogCategory>("All");
  const posts = blogPosts.filter(post => category === "All" || post.category === category);
  return <>
    <section className="blog-intro"><div className="wrap"><span className="eyebrow">THE LOGISTICSWORLD BLOG</span><div className="blog-intro-row"><h1>A clearer view<br/>of your next shipment<span>.</span></h1><p>Practical guides for moving goods, choosing a partner and understanding the journey. From Slovenia to wherever business takes you.</p></div><a className="blog-jump" href="#latest-guides">Explore the guides <ArrowDown size={17}/></a></div></section>
    <section className="wrap blog-library" id="latest-guides" aria-labelledby="latest-guides-title"><div className="blog-library-heading"><h2 id="latest-guides-title">Notes for the journey</h2><span aria-live="polite">{posts.length} {posts.length === 1 ? "guide" : "guides"}</span></div><div className="blog-filters" role="group" aria-label="Filter guides by topic">{(["All", "Slovenia", "Ocean freight", "Planning"] as const).map(topic => <button key={topic} type="button" aria-pressed={category === topic} onClick={() => setCategory(topic)}>{topic === "All" ? "All guides" : topic}</button>)}</div><div className="blog-grid">{posts.map((post, index) => <BlogCard key={post.slug} post={post} featured={index === 0 && category === "All"}/>)}</div></section>
    <DirectoryCallout/>
  </>;
}

export function LatestGuides() {
  return <section className="wrap blog-latest" aria-labelledby="home-guides-title"><div className="blog-section-heading"><div><span className="eyebrow">FROM THE BLOG</span><h2 id="home-guides-title">A little clarity before you ship.</h2></div><Link className="blog-read-link" to="/blog">All guides <ArrowUpRight size={18}/></Link></div><div className="blog-preview-grid">{blogPosts.slice(0, 3).map(post => <BlogCard key={post.slug} post={post}/>)}</div></section>;
}

function DirectoryCallout() {
  return <section className="wrap blog-directory-callout"><div><span className="eyebrow">PUT THE PLAN IN MOTION</span><h2>Your next step.<br/>The right logistics partner.</h2><p>Find companies in Slovenia by service and contact them directly.</p></div><Link className="button orange" to="/companies" search={{ ...emptySearch, office: "SI" }}>Find a company <ArrowUpRight size={18}/></Link></section>;
}

export function BlogArticle({ post }: { post: BlogPost }) {
  const related = blogPosts.filter(article => article.slug !== post.slug).slice(0, 2);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: `${post.publishedAt}T00:00:00+01:00`,
    author: { "@type": "Organization", name: "LogisticsWorld", url: siteOrigin },
    publisher: { "@type": "Organization", name: "LogisticsWorld", url: siteOrigin },
    mainEntityOfPage: `${siteOrigin}/blog/${post.slug}`,
    inLanguage: "en",
    articleSection: post.category,
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/>
    <article className="blog-article"><header className="wrap blog-article-header"><Link className="blog-back" to="/blog"><ArrowLeft size={16}/> All guides</Link><PostMeta post={post}/><h1>{post.title}</h1><p className="blog-standfirst">{post.description}</p><span className="blog-byline">By LogisticsWorld</span><BlogArtwork post={post} eager/></header>
      <div className="wrap blog-reading-layout"><aside className="blog-contents" aria-label="In this guide"><span className="eyebrow">IN THIS GUIDE</span><nav>{post.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>0{index + 1}</span>{section.title}</a>)}</nav><div className="blog-contents-note"><Ship size={22}/><p>Practical knowledge.<br/>Direct connections.</p></div></aside><div className="blog-prose"><div className="blog-takeaway"><span className="eyebrow">THE TAKEAWAY</span><p>{post.takeaway}</p></div>{post.sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}<section className="blog-sources" aria-labelledby="sources-heading"><h2 id="sources-heading">Sources & further reading</h2><ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul></section></div></div>
    </article>
    <section className="wrap blog-related" aria-labelledby="related-guides-title"><div className="blog-section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2 id="related-guides-title">More for the journey.</h2></div><Link className="blog-read-link" to="/blog">All guides <ArrowUpRight size={18}/></Link></div><div className="blog-grid">{related.map(article => <BlogCard key={article.slug} post={article}/>)}</div></section><DirectoryCallout/>
  </>;
}
