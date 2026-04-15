// landing page -> for quick glimpse of what actually is the website about ?, 
// what problem does it solve, features, testimonals etc 

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Zap, CheckCircle, Users, Activity,
  Calendar, Clock, Layout, Bell, ChevronRight,
  HeartPulse, History, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Landing.css';


const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];


const WORDS = ['Intelligent.', 'Real-time.', 'Efficient.'];

const Typewriter = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-block relative overflow-hidden text-gradient" style={{ height: '1.2em', paddingBottom: '0.1em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO as any }}
          className="block"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } }
  };

  return (
    <div className="landing-container">
      {/* ═══ NAVBAR ═══ */}
      <nav className="landing-nav">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="brand">
            <Activity size={28} />
            <span>MediQueue</span>
          </Link>
          <div className="links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="landing-btn landing-btn-ghost">Log In</Link>
            <Link to="/register" className="landing-btn landing-btn-primary">Book Appointment</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow-2" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl relative z-10 w-full">
          <div className="grid-2">
            {/* Left Content */}
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <motion.div variants={itemVariants as any}>
                <div className="status-badge" style={{ marginBottom: '2rem' }}>
                  <span className="status-dot animate-pulse" />
                  <span>Live Queue Tracking Available</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants as any}>
                <h1 className="heading-1" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  Hospital Queues.
                </h1>
                <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                  <Typewriter />
                </div>
              </motion.div>

              <motion.p variants={itemVariants as any} className="leading-relaxed text-muted" style={{ fontSize: '1.125rem', maxWidth: '500px', marginBottom: '2.5rem' }}>
                Book appointments, track your live queue position, and eliminate waiting room chaos. A smart solution for modern healthcare facilities.
              </motion.p>

              <motion.div variants={itemVariants as any} className="nav-actions" style={{ flexWrap: 'wrap' }}>
                <Link to="/register">
                  <button className="landing-btn landing-btn-primary group">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Find a Doctor
                      <ArrowRight size={18} style={{ transition: 'transform 0.2s', transform: 'translateX(0)' }} className="group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="landing-btn landing-btn-secondary">
                    Patient Portal
                  </button>
                </Link>
              </motion.div>

              {/* Stats or trust signals */}
              <motion.div variants={itemVariants as any} style={{ display: 'flex', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>2.5k+</div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>Active Patients</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>50+</div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>Specialist Doctors</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>&lt; 5 min</div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>Wait Time Accuracy</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO as any }}
            >
              <div className="hero-image-wrapper">
                {/* Fallback pattern if image is missing, but it should load our generated dashboard */}
                <div style={{ position: 'absolute', inset: 0, background: 'var(--primary-light)', opacity: 0.5, zIndex: -1 }}></div>
                <img src="/dashboard-preview.png" alt="MediQueue Dashboard Preview" className="hero-image" />

                {/* Floating elements for visual flair */}
                <div style={{ position: 'absolute', top: '10%', right: '-5%', background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border)', transform: 'rotate(5deg)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Dr. Emily Vance</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Consultation Complete</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="section section-surface">
        <div className="max-w-7xl">
          <div className="section-header">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-label">Core Features</span>
              <h2 className="section-title">Everything you need for seamless care</h2>
              <p className="section-description">
                Built with a scalable foundation to handle every aspect of digital appointment booking, live queue updates, and hospital administration.
              </p>
            </motion.div>
          </div>

          <div className="grid-3">
            {[
              { icon: Activity, title: 'Real-Time Queue Tracking', desc: 'Live queue position, estimated waiting time, and dynamic updates via Observer Pattern.' },
              { icon: Calendar, title: 'Smart Appointments', desc: 'Book walk-ins, scheduled, or emergency slots efficiently using factory pattern scalable logic.' },
              { icon: AlertCircle, title: 'Emergency Handling', desc: 'Instantly add emergency patients with priority override and dynamic queue reordering.' },
              { icon: Bell, title: 'Instant Notifications', desc: 'Automated turn alerts, delays, and appointment confirmations so patients never miss a turn.' },
              { icon: Layout, title: 'Doctor Dashboards', desc: 'Doctors have full visibility of the load, missed patients, and smart controls to update status.' },
              { icon: Shield, title: 'SOLID Architecture', desc: 'Secure, reliable backend built with SOLID principles ensuring no downtime and fast responses.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="feature-card"
              >
                <div className="feature-icon-box">
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="section">
        <div className="max-w-5xl">
          <div className="section-header">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-label">Patient Flow</span>
              <h2 className="section-title">From booking to billing in 3 steps</h2>
              <p className="section-description">
                We've digitized the entire patient journey. No manual tokens, no long waiting lines.
              </p>
            </motion.div>
          </div>

          <div className="step-container">
            <div className="step-line" />
            <div className="grid-3" style={{ position: 'relative' }}>
              {[
                { num: "1", title: "Book Appointment", desc: "Select your preferred doctor and time slot, or register as an emergency direct walk-in." },
                { num: "2", title: "Track Digitally", desc: "Receive a digital token. Track your live position and accurate wait time on your phone." },
                { num: "3", title: "Consult & Go", desc: "Get notified when it's your turn. Consult with the doctor and have your history saved securely." }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="step-card"
                >
                  <div className="step-number">{step.num}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS / DOCTOR SECTION ═══ */}
      <section className="section section-surface">
        <div className="max-w-7xl">
          <div className="grid-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-label">For Medical Professionals</span>
              <h2 className="section-title">Gain complete control over your workload</h2>
              <p className="section-description" style={{ marginBottom: '2rem' }}>
                The Doctor dashboard utilizes Strategy Pattern for flexible queue handling (FIFO, Priority, Round Robin). Mark availability, monitor average consultation times, and efficiently manage skipped patients.
              </p>

              <div className="benefit-list">
                {[
                  { icon: Clock, text: 'Track number of patients and average consultation time' },
                  { icon: Users, text: 'View patient details and complete history prior to consult' },
                  { icon: Zap, text: 'Reorder queues dynamically when emergencies arrive' },
                ].map((item, i) => (
                  <div key={i} className="benefit-item">
                    <div className="benefit-icon">
                      <item.icon size={20} />
                    </div>
                    <p style={{ paddingTop: '0.5rem', color: 'var(--text-secondary)' }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="hero-image-wrapper" style={{ padding: '2rem', background: 'white' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Live Doctor Updates</h3>
                {[
                  { icon: HeartPulse, title: 'Emergency Protocol', desc: 'Patient P045 flagged as priority' },
                  { icon: History, title: 'Patient History', desc: 'Automatically fetched previous records' },
                  { icon: Layout, title: 'Availability Control', desc: 'Toggle status (Available, Busy, Offline)' }
                ].map((card, i) => (
                  <div key={i} className="mini-card">
                    <div className="mini-icon">
                      <card.icon size={24} />
                    </div>
                    <div className="mini-card-content" style={{ flexGrow: 1 }}>
                      <h4>{card.title}</h4>
                      <p>{card.desc}</p>
                    </div>
                    <ChevronRight size={20} style={{ color: 'var(--border)' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="section">
        <div className="section-header">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-label">Testimonials</span>
            <h2 className="section-title">Trusted by healthcare heroes</h2>
          </motion.div>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[...Array(2)].map((_, listIdx) => (
              <React.Fragment key={listIdx}>
                {[
                  { quote: "The real-time updates have completely eliminated the chaotic crowds in our waiting rooms. Patients are so much happier.", author: "Dr. Sarah Chen", role: "Head of General Medicine" },
                  { quote: "Being able to see exactly where I am in the queue on my phone meant I could wait comfortably at a nearby cafe instead of the clinic.", author: "Michael Brown", role: "Patient" },
                  { quote: "The emergency override feature is brilliant. When a priority case comes in, the queue dynamically adjusts without confusing the other patients.", author: "James Wilson", role: "Hospital Administrator" },
                  { quote: "Clean, fast, and incredibly intuitive. Booking appointments has never been easier.", author: "Sophia Lee", role: "Patient" },
                  { quote: "The solid architecture behind this system handles our peak hours flawlessly. No crashes, no delays.", author: "David Kim", role: "IT Director" }
                ].map((testimonial, i) => (
                  <div key={`${listIdx}-${i}`} className="testimonial">
                    <p className="testimonial-text">"{testimonial.quote}"</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div className="testimonial-info">
                        <h4>{testimonial.author}</h4>
                        <p>{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="max-w-7xl">
          <div className="footer-grid">
            <div>
              <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 800, textDecoration: 'none', marginBottom: '1.5rem' }}>
                <Activity size={24} />
                <span>MediQueue</span>
              </Link>
              <p className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                Transforming hospital wait times with intelligent queue management and scalable digital appointments.
              </p>
            </div>

            <div>
              <h4 className="footer-col-title">Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">System Status</a></li>
                <li><a href="#">Developer API</a></li>
                <li><a href="#">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* <div className="footer-bottom">
            {/* <span>© {new Date().getFullYear()} MediQueue Systems. All rights reserved.</span> */}

        </div>
      </footer>
    </div>
  );
};

export default Landing;
