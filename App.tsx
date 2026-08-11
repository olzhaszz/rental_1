import React from "react";
import { useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { pitches } from "./data";
import { supabase } from "./lib/supabase";

const money = (n:number) => new Intl.NumberFormat("kk-KZ").format(n) + " ₸";

function Header() {
  return <header className="header">
    <Link className="logo" to="/">PLAY<span>QZ</span></Link>
    <nav>
      <Link to="/pitches">Find a pitch</Link>
      <Link to="/faq">FAQ</Link>
      <Link to="/owners">For venues</Link>
    </nav>
    <div className="header-actions">
      <Link className="lang" to="/?lang=kk">KZ</Link>
      <Link className="login" to="/login">Log in</Link>
    </div>
  </header>;
}

function Layout({children}:{children:React.ReactNode}) {
  return <><Header/><main>{children}</main><footer>
    <div><div className="logo">PLAY<span>QZ</span></div><p>Football pitch booking, simplified.</p></div>
    <div className="footer-links"><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link><Link to="/legal">Terms & privacy</Link></div>
  </footer></>;
}

function Home() {
  const [city,setCity]=useState("Almaty");
  return <section className="hero-wrap">
    <div className="hero">
      <div className="eyebrow">⚽ FOOTBALL IN KAZAKHSTAN</div>
      <h1>Book a football pitch<br/><span>in a few clicks.</span></h1>
      <p className="hero-copy">See real availability, compare prices and reserve your game without calling ten venues.</p>
      <div className="search-card">
        <label>City<select value={city} onChange={e=>setCity(e.target.value)}><option>Almaty</option><option>Astana</option><option>Shymkent</option></select></label>
        <label>Date<input type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label>
        <Link className="primary" to={`/pitches?city=${encodeURIComponent(city)}`}>Search pitches →</Link>
      </div>
    </div>
    <div className="trust-row"><span>✓ Real-time availability</span><span>✓ Online booking</span><span>✓ Local prices in ₸</span></div>
    <section className="section">
      <div className="section-head"><div><div className="eyebrow">DISCOVER</div><h2>Popular pitches</h2></div><Link to="/pitches">See all →</Link></div>
      <div className="cards">{pitches.map(p=><PitchCard key={p.id} p={p}/>)}</div>
    </section>
  </section>
}

function PitchCard({p}:{p:typeof pitches[number]}) {
  return <Link className="pitch-card" to={`/pitches/${p.id}`}>
    <img src={p.image}/><div className="pitch-body"><div className="row"><strong>{p.venue}</strong><span>★ {p.rating}</span></div><p>{p.city} · {p.players} · {p.surface}</p><div className="row"><b>{money(p.price)} <small>/ hour</small></b><span className="available">● {p.slots.length} slots</span></div></div>
  </Link>
}

function Pitches() {
  const [params]=useSearchParams();
  const [city,setCity]=useState(params.get("city") || "All");
  const [max,setMax]=useState(20000);
  const filtered=useMemo(()=>pitches.filter(p=>(city==="All"||p.city===city)&&p.price<=max),[city,max]);
  return <section className="section page">
    <div className="eyebrow">SEARCH</div><h1>Find your pitch</h1>
    <div className="filters">
      <label>City<select value={city} onChange={e=>setCity(e.target.value)}><option>All</option><option>Almaty</option><option>Astana</option><option>Shymkent</option></select></label>
      <label>Max price: {money(max)}<input type="range" min="5000" max="20000" step="1000" value={max} onChange={e=>setMax(+e.target.value)}/></label>
      <button className="secondary" onClick={()=>{setCity("All");setMax(20000)}}>Reset</button>
    </div>
    <p className="muted">{filtered.length} pitches found</p>
    <div className="cards">{filtered.map(p=><PitchCard key={p.id} p={p}/>)}</div>
  </section>
}

function PitchDetail() {
  const {id}=useParams(); const p=pitches.find(x=>x.id===id); const navigate=useNavigate();
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  if(!p) return <section className="section page"><h1>Pitch not found</h1></section>;
  return <section className="section page detail">
    <Link to="/pitches" className="back">← Back to pitches</Link>
    <div className="detail-grid">
      <div><img className="detail-image" src={p.image}/><div className="detail-copy"><div className="row"><div><h1>{p.venue}</h1><p>{p.address}</p></div><strong>★ {p.rating}</strong></div><p>{p.players} · {p.surface} · {p.indoor?"Indoor":"Outdoor"}</p><h3>Facilities</h3><div className="chips">{p.amenities.map(a=><span key={a}>{a}</span>)}</div></div></div>
      <div className="booking-box"><h2>Book a slot</h2><label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><p className="muted">Choose an available time:</p><div className="slots">{p.slots.map(s=><button key={s} onClick={()=>navigate(`/book/${p.id}?date=${date}&time=${s}`)}>{s}<small>{money(p.price)}</small></button>)}</div><p className="tiny">This MVP uses a mock availability list. Supabase will become the source of truth after setup.</p></div>
    </div>
  </section>
}

function Book() {
  const {id}=useParams(); const [params]=useSearchParams(); const p=pitches.find(x=>x.id===id)!;
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [email,setEmail]=useState(""); const [done,setDone]=useState(false);
  const time=params.get("time") || p.slots[0]; const date=params.get("date") || new Date().toISOString().slice(0,10);
  async function submit(e:React.FormEvent){e.preventDefault();
    if(supabase){ await supabase.from("bookings").insert({pitch_id:p.id, booking_date:date, start_time:time, customer_name:name, customer_phone:phone, customer_email:email, status:"pending"}); }
    setDone(true);
  }
  if(done) return <section className="section page success"><div className="success-icon">✓</div><h1>Booking request received</h1><p>{p.venue} · {date} · {time}</p><p className="muted">The venue can confirm the slot from its dashboard. In the production version, you will also receive a notification and payment option.</p><Link className="primary" to="/pitches">Find another pitch</Link></section>;
  return <section className="section page narrow"><Link to={`/pitches/${p.id}`} className="back">← Change slot</Link><h1>Confirm your booking</h1><div className="summary"><b>{p.venue}</b><span>{date} · {time}</span><strong>{money(p.price)}</strong></div><form onSubmit={submit} className="form"><label>Full name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Phone<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+7 ..."/></label><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><button className="primary">Request booking →</button><p className="tiny">Production note: connect a Kazakhstan payment provider after the booking state is confirmed.</p></form></section>
}

function Login(){return <section className="section page narrow"><div className="eyebrow">ACCOUNT</div><h1>Log in</h1><p className="muted">For the MVP, use Supabase Auth with Google and phone/email authentication.</p><button className="primary" onClick={()=>alert("Connect Supabase Auth in the next step.")}>Continue with Google</button></section>}

function Owners(){return <section className="section page"><div className="eyebrow">FOR VENUES</div><h1>Turn your pitch into an online booking business.</h1><p className="lead">Manage availability, prices and bookings from one dashboard while players discover your venue.</p><div className="feature-grid"><div><h3>Calendar</h3><p>Open and block time slots in real time.</p></div><div><h3>Pricing</h3><p>Set weekday, weekend and peak-hour prices.</p></div><div><h3>Bookings</h3><p>Approve, reject and track customer bookings.</p></div><div><h3>Analytics</h3><p>See utilization and revenue trends.</p></div></div><Link className="primary" to="/owner-dashboard">Open demo dashboard →</Link></section>}

function OwnerDashboard(){return <section className="section page"><div className="row"><div><div className="eyebrow">VENUE ADMIN</div><h1>Today's bookings</h1></div><span className="badge">Demo</span></div><div className="dashboard"><div className="stat"><span>Bookings</span><b>18</b></div><div className="stat"><span>Revenue</span><b>214 000 ₸</b></div><div className="stat"><span>Utilization</span><b>82%</b></div></div><table><thead><tr><th>Time</th><th>Customer</th><th>Pitch</th><th>Status</th></tr></thead><tbody>{["18:00","19:00","20:00","21:00"].map((t,i)=><tr key={t}><td>{t}</td><td>Customer {i+1}</td><td>Main pitch</td><td><span className="status">Confirmed</span></td></tr>)}</tbody></table></section>}

function FAQ(){return <section className="section page narrow"><div className="eyebrow">HELP</div><h1>Frequently asked questions</h1>{[
["How does booking work?","Choose a pitch, select a date and available slot, enter your details and submit the booking."],
["Can I cancel?","Set the cancellation policy per venue. The MVP should store a policy and calculate whether a cancellation is free."],
["How do venues get paid?","For the first launch, let the venue receive payment directly or use a supported local payment processor. Add automated settlement after product-market fit."],
["Can this support other sports?","Yes. The data model is intentionally sport-agnostic, so basketball, volleyball, tennis and padel can be added later."]
].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>}

function Contact(){return <section className="section page narrow"><div className="eyebrow">CONTACT</div><h1>Contact us</h1><p className="lead">For venue onboarding, support or partnership requests.</p><a className="primary inline" href="mailto:hello@playqz.kz">hello@playqz.kz</a></section>}
function Legal(){return <section className="section page narrow"><div className="eyebrow">LEGAL</div><h1>Terms & privacy</h1><p>This starter contains placeholders. Before accepting real customers, have Kazakhstan-specific Terms of Service, Privacy Policy, cancellation/refund rules and payment terms reviewed for your business.</p></section>}

export default function App(){
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/><Route path="/pitches" element={<Pitches/>}/><Route path="/pitches/:id" element={<PitchDetail/>}/>
    <Route path="/book/:id" element={<Book/>}/><Route path="/login" element={<Login/>}/><Route path="/owners" element={<Owners/>}/><Route path="/owner-dashboard" element={<OwnerDashboard/>}/>
    <Route path="/faq" element={<FAQ/>}/><Route path="/contact" element={<Contact/>}/><Route path="/legal" element={<Legal/>}/>
  </Routes></Layout>
}