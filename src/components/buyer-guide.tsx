import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const questions = [
  { title: "Which type of provider do you need?", text: "A freight forwarder coordinates the journey. A carrier moves the goods. A customs broker handles declarations. Start by deciding which parts of the shipment you need someone to manage." },
  { title: "Do they handle your route and cargo?", text: "Ask about your exact collection and delivery locations, shipment size, and handling requirements. For cargo through Koper, confirm port collection, storage, and onward transport. Ask who carries out each leg." },
  { title: "What is actually included in the quote?", text: "Give each company the same shipment details. Compare transport, handling, customs, and storage charges alongside the schedule, insurance arrangements, and who you can contact when something changes." },
];
export function BuyerGuide() {
  return <section className="buyer-notes wrap" aria-labelledby="choose-partner">
    <h2 id="choose-partner">How to choose the best logistics company in Slovenia</h2>
    <div className="guide-questions">{questions.map(q=><details key={q.title}><summary><h3>{q.title}</h3><span className="guide-toggle" aria-hidden="true"/></summary><p>{q.text}</p></details>)}</div>
    <Link className="buyer-methodology" to="/methodology">How we present company information <ArrowUpRight size={15}/></Link>
  </section>;
}
