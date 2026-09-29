'use client';
import { useState } from 'react';

const ROWS = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,'w'],
  ['w',1,1,1,1,1,1,1,1,1,1,1,1,1],
  ['w',1,1,1,1,1,1,1,1,1,1,1,1],
  ['w',1,1,1,1,1,1,1,1,1,1,1,1],
  [1,'w',1,'s',1,1,1,1],
];
const ACCENTS = new Set(['0-0','0-13','1-0','2-0','3-0','4-1','4-4','4-7','1-13']);
const COLORS = [
  { name: 'Violet', hex: '#6D3BFF' },
  { name: 'Lilac', hex: '#B9A2FF' },
  { name: 'Midnight', hex: '#2A1A55' },
];
const PRICE = 149;

function Keyboard() {
  return (
    <div className="kb" aria-hidden="true">
      {ROWS.map((row, i) => (
        <div className="row" key={i}>
          {row.map((k, j) => (
            <i key={j} className={`key ${k === 'w' ? 'w' : k === 's' ? 's' : ''} ${ACCENTS.has(`${i}-${j}`) || (k === 'w' && j === 0) ? 'a' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Checkout({ color }) {
  const [f, setF] = useState({ email: '', card: '', exp: '', cvc: '' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const card = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const exp = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  function pay() {
    const digits = f.card.replace(/\D/g, '');
    const e = f.exp.replace(/\D/g, '');
    let m = '';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) m = 'Enter a valid email address.';
    else if (digits.length !== 16) m = 'Card number must have 16 digits.';
    else if (e.length !== 4 || +e.slice(0, 2) < 1 || +e.slice(0, 2) > 12) m = 'Enter expiry as MM / YY.';
    else if (f.cvc.length < 3) m = 'CVC must have 3 or 4 digits.';
    setErr(m);
    if (!m) setDone(true);
  }

  if (done) {
    return (
      <section className="view" style={{ gridTemplateColumns: '1fr' }}>
        <div className="sum ok">
          <div className="tick">✓</div>
          <h2>Order placed</h2>
          <p className="lead" style={{ margin: 0 }}>A receipt is on its way to {f.email}.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="view tall">
      <div className="copy">
        <h2>Checkout</h2>
        <p className="lead" style={{ margin: '6px 0 clamp(10px,2vh,18px)' }}>Enter your details to complete the order.</p>
        <div className="form">
          <label>Email<input type="email" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label>Card number<input inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" maxLength={19} value={f.card} onChange={(e) => set('card', card(e.target.value))} /></label>
          <div className="two">
            <label>Expiry<input inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" maxLength={7} value={f.exp} onChange={(e) => set('exp', exp(e.target.value))} /></label>
            <label>CVC<input inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={f.cvc} onChange={(e) => set('cvc', e.target.value.replace(/\D/g, ''))} /></label>
          </div>
          <div className="err" role="alert">{err}</div>
          <button className="btn" onClick={pay}>Pay ${PRICE}</button>
        </div>
      </div>
      <div className="sum">
        <div className="line" style={{ color: 'var(--ink)', fontWeight: 600 }}><span>Orbit 65 · {color.name}</span><span>${PRICE}.00</span></div>
        <div className="line"><span>Shipping</span><span>Free</span></div>
        <div className="line"><span>Tax</span><span>$0.00</span></div>
        <div className="line tot"><span>Total</span><span>${PRICE}.00</span></div>
        <p className="note">Demo store: no real payment is taken and card details are not sent anywhere.</p>
      </div>
    </section>
  );
}

export default function Page() {
  const [view, setView] = useState('home');
  const [color, setColor] = useState(COLORS[0]);

  return (
    <div style={{ display: 'contents', '--k': color.hex }}>
      <header>
        <button className="logo" onClick={() => setView('home')}><span className="dot" />Orbit</button>
        <nav aria-label="Steps">
          {['home', 'product', 'checkout'].map((v) => (
            <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{v[0].toUpperCase() + v.slice(1)}</button>
          ))}
        </nav>
      </header>
      <main>
        {view === 'home' && (
          <section className="view">
            <div className="copy">
              <h1>Type at the speed of thought.</h1>
              <p className="lead">Orbit 65 is a compact wireless keyboard with a quiet, precise feel. Built for people who write, code and create all day.</p>
              <button className="btn" onClick={() => setView('product')}>Shop Orbit 65</button>
              <button className="btn ghost hide-m" onClick={() => setView('product')}>See details</button>
            </div>
            <Keyboard />
          </section>
        )}
        {view === 'product' && (
          <section className="view">
            <Keyboard />
            <div className="copy">
              <h2>Orbit 65</h2>
              <div className="price">${PRICE}</div>
              <p className="lead" style={{ marginTop: 4 }}>A 65% layout with silent linear switches, aluminum frame and Bluetooth for three devices.</p>
              <div className="facts">
                <div><b>65%</b><span>Compact layout</span></div>
                <div><b>90 hrs</b><span>Battery life</span></div>
                <div><b>3</b><span>Paired devices</span></div>
              </div>
              <div className="sws" role="group" aria-label="Color">
                {COLORS.map((c) => (
                  <button key={c.name} className={`sw ${c.name === color.name ? 'on' : ''}`} style={{ background: c.hex }} aria-label={c.name} onClick={() => setColor(c)} />
                ))}
                <span>{color.name}</span>
              </div>
              <button className="btn" onClick={() => setView('checkout')}>Buy now</button>
            </div>
          </section>
        )}
        {view === 'checkout' && <Checkout color={color} />}
      </main>
    </div>
  );
}
