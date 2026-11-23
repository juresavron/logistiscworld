import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const questions = [
  { title: "What does a logistics forwarder in Slovenia do?", text: "A freight forwarder coordinates transport and the handovers needed for your shipment. If you need several services, ask whether the proposal combines sea, air, road or rail freight with customs, storage and final delivery. Confirm which work the forwarder handles and which partners carry out individual stages." },
  { title: "Which type of provider do you need?", text: "A freight forwarder coordinates the journey. A carrier moves the goods. A customs broker handles declarations. Start by deciding which parts of the shipment you need someone to manage." },
  { title: "Do they handle your route and cargo?", text: "Ask about your exact collection and delivery locations, shipment size, and handling requirements. For cargo through Koper, confirm port collection, storage, and onward transport. Ask who carries out each leg." },
  { title: "What is actually included in the quote?", text: "Give each company the same shipment details. Compare transport, handling, customs, and storage charges alongside the schedule, insurance arrangements, and who you can contact when something changes." },
];
export function BuyerGuide() {
  return <section className="buyer-notes wrap" aria-labelledby="choose-partner">
    <h2 id="choose-partner">How to choose a freight forwarder in Slovenia</h2>
    <p className="buyer-introduction">Start with your origin, destination and cargo. For international freight forwarding, compare the full route and responsibilities alongside the price. <Link to="/services/$service" params={{ service: "forwarding" }}>Explore freight forwarding services in Slovenia</Link> or <Link to="/locations/$country" params={{ country: "koper" }}>find a freight forwarder for the Port of Koper</Link>.</p>
    <div className="guide-questions">{questions.map(q=><details key={q.title}><summary><h3>{q.title}</h3><span className="guide-toggle" aria-hidden="true"/></summary><p>{q.text}</p></details>)}</div>
    <Link className="buyer-methodology" to="/methodology">How we present company information <ArrowUpRight size={15}/></Link>
  </section>;
}
