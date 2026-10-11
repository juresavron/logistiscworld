import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const questions = [
  { title: "Which type of provider do you need?", text: "A freight forwarder coordinates the journey. A carrier moves the goods. A customs broker handles declarations. Start by deciding which parts of the shipment you need someone to manage." },
  { title: "Do they handle your route and cargo?", text: "Ask about your exact collection and delivery locations, shipment size, and handling requirements. For cargo through Koper, confirm port collection, storage, and onward transport. Ask who carries out each leg." },
  { title: "What is actually included in the quote?", text: "Give each company the same shipment details. Compare transport, handling, customs, and storage charges alongside the schedule, insurance arrangements, and who you can contact when something changes." },
];
export function BuyerGuide() {
  return <section className="freight-guide" aria-labelledby="choose-partner"><div className="wrap guide-layout">
    <div className="guide-title"><span className="index-sidebar-label">THE BUYER’S NOTES / 01</span><h2 id="choose-partner">How to choose the best logistics company in Slovenia</h2><p>The right partner depends on the shipment. Here’s what to ask before you commit.</p><Link to="/methodology">Our comparison approach <ArrowUpRight size={16}/></Link></div>
    <div className="guide-questions">{questions.map((q,i)=><details key={q.title} open={i===0 ? true : undefined}><summary><span>0{i+1}</span><h3>{q.title}</h3><span className="guide-toggle" aria-hidden="true"/></summary><p>{q.text}</p></details>)}<p className="guide-caveat">Listings are not ranked by quality. The current directory contains fictional examples.</p></div>
  </div></section>;
}
