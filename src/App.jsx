import { useState } from 'react';

const navItems = [
  { label: 'Weather Alert', href: '#weather-alert' },
  { label: 'Mandi Prices', href: '#mandi-section' },
  { label: 'Crop Profiles', href: '#crop-profiles' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Schemes & Directory', href: 'https://pmkisan.gov.in/' },
  { label: 'Book a Slot', href: '#booking-form' },
  { label: 'Govt. Agri Portal', href: 'https://agriwelfare.gov.in/', external: true },
];

const mandiRows = [
  {
    crop: 'Paddy',
    trichy: { min: 2100, max: 2350 },
    thanjavur: { min: 2150, max: 2400 },
    salem: { min: 2080, max: 2300 },
  },
  {
    crop: 'Sugarcane',
    trichy: { min: 3050, max: 3200 },
    thanjavur: { min: 3100, max: 3300 },
    salem: { min: 2990, max: 3150 },
  },
  {
    crop: 'Groundnut',
    trichy: { min: 5200, max: 5600 },
    thanjavur: { min: 5150, max: 5550 },
    salem: { min: 5300, max: 5700 },
  },
];

const cropData = [
  {
    title: 'Paddy (Oryza sativa)',
    season: 'Kharif & Rabi',
    depth: '2–3 cm (approx. ½ inch)',
    temp: '20°C – 37°C',
    soil: '5.5 – 6.5, referenced as pHoptimal',
  },
  {
    title: 'Sugarcane (Saccharum officinarum)',
    season: 'Year-round in tropical zones',
    depth: '4–5 cm',
    temp: '21°C – 27°C, yield measured in tonnes/hectare²',
    soil: 'Well-drained loamy soil with consistent moisture',
  },
];

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300',
    alt: 'Green paddy field under morning sun',
    href: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854',
  },
  {
    src: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300',
    alt: 'Farmer harvesting crops',
    href: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2',
  },
];

const initialForm = {
  produceType: '',
  quantity: '',
  unit: 'quintal',
  duration: '',
  startDate: '',
  district: '',
  farmerName: '',
  mobile: '',
};

function WeatherAlertBanner({ title, message, temp, humidity, wind, time }) {
  return (
    <section id="weather-alert" className="weather-banner">
      <div className="weather-copy">
        <span className="eyebrow">Field advisory / Tamil Nadu</span>
        <h2>{title}</h2>
        <p><strong>Heavy rainfall warning.</strong> {message} expected across Thanjavur, Trichy, and Cuddalore districts in the next 48 hours. Farmers are advised to delay pesticide spraying.</p>
        <p className="weather-status">Weather and mandi data refreshed at {time}.</p>
      </div>
      <div className="weather-readings" aria-label="Current weather">
        <span className="weather-symbol" aria-hidden="true">☂</span>
        <div className="temperature">{temp}<span>Field temperature</span></div>
        <div className="weather-detail"><span>Humidity <b>{humidity}%</b></span><span>Wind <b>{wind} km/h</b></span></div>
      </div>
    </section>
  );
}

function MandiTable({ rows }) {
  return (
    <table className="mandi-table">
      <thead>
        <tr>
          <th rowSpan="2">Crop</th>
          <th colSpan="2">Trichy</th>
          <th colSpan="2">Thanjavur</th>
          <th colSpan="2">Salem</th>
        </tr>
        <tr>
          <th>Min</th>
          <th>Max</th>
          <th>Min</th>
          <th>Max</th>
          <th>Min</th>
          <th>Max</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.crop}>
            <td>{row.crop}</td>
            <td>{row.trichy.min}</td>
            <td>{row.trichy.max}</td>
            <td>{row.thanjavur.min}</td>
            <td>{row.thanjavur.max}</td>
            <td>{row.salem.min}</td>
            <td>{row.salem.max}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CropProfileCard({ crop }) {
  return (
    <div className="crop-card" key={crop.title}>
      <div className="crop-heading"><span className="crop-number" aria-hidden="true">{crop.title.startsWith('Paddy') ? '01' : '02'}</span><h3>{crop.title.split(' (')[0]}<em>{crop.title.split(' (')[1].replace(')', '')}</em></h3></div>
      <dl>
        <dt>Season</dt>
        <dd>{crop.season}</dd>

        <dt>Sowing Depth</dt>
        <dd>{crop.depth}</dd>

        <dt>Ideal Temperature Zone</dt>
        <dd>{crop.temp}</dd>

        <dt>Soil</dt>
        <dd>{crop.soil}</dd>
      </dl>
    </div>
  );
}

function App() {
  const currentDate = new Date();
  const weatherTime = currentDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formattedDate = currentDate.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Today's date in YYYY-MM-DD format (local time) for the Start Date
  // input's min attribute, so past dates cannot be selected in the picker.
  // Backend validation still runs as a second protection layer.
  const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdId, setCreatedId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitted(false);
    setCreatedId(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produceType: form.produceType,
          quantity: Number(form.quantity),
          unit: form.unit,
          durationDays: Number(form.duration),
          startDate: form.startDate,
          district: form.district,
          farmerName: form.farmerName,
          mobile: form.mobile,
        }),
      });

      if (!response.ok) {
        const hint =
          response.status >= 500
            ? ' The Spring Boot backend may not be running on port 8080.'
            : '';
        throw new Error(`The server could not save your request (HTTP ${response.status}).${hint}`);
      }

      const savedBooking = await response.json();
      setCreatedId(savedBooking.id);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error.message === 'Failed to fetch'
          ? 'Could not reach the server. Make sure the Spring Boot backend is running on port 8080.'
          : error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="utility-bar"><span>Rooted in the field. Connected to the market.</span><span>Tamil Nadu · Agriculture &amp; market access</span></div>
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="Kisan Setu home">
          <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 32V17M20 24C8 25 6 17 6 10c10 0 14 5 14 14ZM20 18C20 8 27 5 34 5c0 8-4 14-14 13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M8 34h24" stroke="currentColor" strokeWidth="2"/></svg>
          <span>Kisan Setu<small>From soil to opportunity</small></span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main-content" className="container">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow">Your farming companion</span>
            <h1 id="hero-title">Better decisions.<br />Stronger <em>harvests.</em></h1>
            <p>From the first sowing to the right market — find the information and support your farm needs, all in one place.</p>
            <div className="hero-actions"><a className="primary-link" href="#mandi-section">Explore mandi prices <span aria-hidden="true">↗</span></a><a className="text-link" href="#booking-form">Book cold storage <span aria-hidden="true">→</span></a></div>
            <div className="hero-note"><span aria-hidden="true">↳</span> Local knowledge. Growing possibilities.</div>
          </div>
          <div className="hero-photo"><img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=85" alt="Sunlight falling across cultivated green fields" /><span className="photo-label">THE LAND WE GROW WITH <span>01 / Field notes</span></span></div>
        </section>
        <WeatherAlertBanner
          title="Live Weather Alert"
          message="Moderate to heavy showers"
          temp="31°C"
          humidity="78"
          wind="12"
          time={weatherTime}
        />

        <article className="about-section">
          <div><span className="eyebrow">A bridge for every farmer</span><h2>About Kisan Setu</h2></div>
          <p>
            Kisan Setu is a direct market-access portal connecting farmers to real time mandi prices,
            government schemes, soil testing infrastructure, and agricultural best practices.
          </p>
          <p>
            Our mission — bridging the gap between the field and the market.<br />
            One portal. Every district. One click.
          </p>
        </article>

        <section id="mandi-section">
          <div className="section-heading"><div><span className="eyebrow">01 / Market watch</span><h2>Mandi price comparison</h2><p>Tamil Nadu districts · Prices in ₹ (INR) per quintal, updated daily.</p></div><span className="section-tag">3 crops · 3 districts</span></div>
          <div className="table-scroll" role="region" aria-label="Mandi price comparison" tabIndex="0"><MandiTable rows={mandiRows} /></div>
        </section>

        <section id="crop-profiles">
          <div className="section-heading"><div><span className="eyebrow">02 / Know your crop</span><h2>Good harvests start here.</h2></div><p>Crop profiles for your next growing season.</p></div>

          <div className="crop-grid">
            {cropData.map((crop) => (
              <CropProfileCard key={crop.title} crop={crop} />
            ))}
          </div>
        </section>

        <section id="gallery">
          <div className="section-heading"><div><span className="eyebrow">03 / Life on the land</span><h2>Field gallery</h2></div><p>A closer look at the roots of our work.</p></div>
          <div className="gallery-row">
            {galleryImages.map((image, index) => (
              <a key={image.alt} href={image.href} target="_blank" rel="noreferrer">
                <img className="gallery-img" src={image.src.replace("w=300", "auto=format&fit=crop&w=1000&q=80")} alt={image.alt} width="600" height="360" loading="lazy" /><span className="gallery-caption"><span><small>FIELD NOTE / 0{index + 1}</small>{image.alt}</span><span aria-hidden="true">↗</span></span>
              </a>
            ))}
          </div>
        </section>

        <section id="booking-form" className="content-card booking-block">
          <div className="booking-intro"><span className="eyebrow">04 / Protect your produce</span><h2>A little planning.<br />A fresher harvest.</h2><h3>Book Cold Storage Space</h3>
          <p>
            Reserve cold-storage capacity for your produce ahead of harvest. Fill in the quantity,
            duration, and district — our team confirms availability at the nearest facility within 24 hours.
          </p>

          <div className="booking-note"><span aria-hidden="true">↗</span><p>Plan ahead of harvest.<br /><strong>Confirmation within 24 hours.</strong></p></div></div>
          <form className="cold-storage-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Cold Storage Requirement</legend>

              <div className="form-row">
                <label htmlFor="produceType">Produce Type</label>
                <select id="produceType" name="produceType" value={form.produceType} onChange={handleChange} required>
                  <option value="">Select produce</option>
                  <option value="paddy">Paddy</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="groundnut">Groundnut</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  step="0.1"
                  placeholder="e.g. 50"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="unit">Unit</label>
                <select id="unit" name="unit" value={form.unit} onChange={handleChange} required>
                  <option value="quintal">Quintal</option>
                  <option value="tonne">Tonne</option>
                  <option value="kg">Kilogram</option>
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="duration">Duration Needed (days)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  placeholder="e.g. 15"
                  value={form.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="startDate">Storage Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  min={today}
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="district">District</label>
                <select id="district" name="district" value={form.district} onChange={handleChange} required>
                  <option value="">Select district</option>
                  <option value="trichy">Trichy</option>
                  <option value="thanjavur">Thanjavur</option>
                  <option value="salem">Salem</option>
                  <option value="cuddalore">Cuddalore</option>
                  <option value="madurai">Madurai</option>
                </select>
              </div>
            </fieldset>

            <fieldset>
              <legend>Contact Details</legend>

              <div className="form-row">
                <label htmlFor="farmerName">Full Name</label>
                <input
                  type="text"
                  id="farmerName"
                  name="farmerName"
                  placeholder="Your name"
                  value={form.farmerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </fieldset>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Submitting\u2026' : 'Request Cold Storage Slot'}
            </button>
            {submitted && (
              <p className="success-message" role="status">
                Your cold storage request has been recorded successfully.
                {createdId ? ` (Booking ID: ${createdId})` : ''}
              </p>
            )}
            {submitError && <p className="error-message" role="alert">{submitError}</p>}
          </form>
        </section>

        <section id="downloads" className="content-card">
          <div><span className="eyebrow">Keep informed</span><h2>Resources for the road ahead.</h2></div>
          <ul>
            <li>
              <a href="https://www.commodityonline.com/mandiprices/state/tamil-nadu" target="_blank" rel="noreferrer">
                Mandi Price Report <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </section>
      </main>

      <a href="#weather-alert" className="back-to-top">↑ Top</a>

      <footer className="site-footer"><div className="footer-brand">Kisan Setu<span>Direct Agriculture Intelligence &amp; Market Access Portal</span></div>
        <p>Last updated: {formattedDate} at {formattedTime}</p>
        <p>
          © 2026 Kisan Setu™. All rights reserved. | Registered mark ® Kisan Setu Agricultural Services |
          Prices displayed are indicative × subject to daily revision.
        </p>
      </footer>
    </>
  );
}

export default App;
