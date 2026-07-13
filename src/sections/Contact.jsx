import FeedbackForm from '../components/FeedbackForm'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/andrewjrlimpiada34-afk', path: 'M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.7 1.2 3.4.9.1-.8.4-1.2.7-1.5-2.7-.3-5.5-1.4-5.5-6A4.7 4.7 0 0 1 5.3 8c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1a4.7 4.7 0 0 1 1.3 3.3c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z' },
  { label: 'Facebook', href: 'https://www.facebook.com/andrewjrlimpiada', path: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.438H7.078v-3.489h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.974h-1.513c-1.49 0-1.956.931-1.956 1.887v2.261h3.328l-.532 3.489h-2.796V24C19.612 23.094 24 18.1 24 12.073Z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/limpiada-andrew-jr-b-3299513b7', path: 'M5.3 7.9A2.6 2.6 0 1 0 5.3 2.7a2.6 2.6 0 0 0 0 5.2ZM3.1 21h4.4V9.5H3.1V21Zm7.1-11.5V21h4.4v-5.7c0-1.5.3-3 2.2-3 1.9 0 1.9 1.7 1.9 3.1V21h4.4v-6.3c0-3.9-.8-6.9-5.4-6.9-2.2 0-3.6 1.2-4.2 2.3h-.1V9.5h-4.2Z' },
]

function Contact() {
  return (
    <>
      <section className="connect-section" id="contact">
        <Reveal className="connect-copy">
          <p className="eyebrow">Open to opportunities</p>
          <h2>Let&apos;s<br />Connect.</h2>
          <p>Have feedback, an idea, or a project in mind? Leave a message and I&apos;ll read it from my dashboard.</p>
          <div className="social-links" aria-label="Social profiles">
            {socialLinks.map(({ label, href, path }) => (
              <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} key={label}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path} /></svg>
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}><FeedbackForm /></Reveal>
      </section>
      <Footer />
    </>
  )
}

export default Contact
