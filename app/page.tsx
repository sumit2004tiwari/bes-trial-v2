import Link from "next/link";
import Image from "next/image";
import AllRegistrationTypeServices from "./backend/lib/services/all-registration-type-service";
import { RegistrationServiceType } from "./backend/lib/db/models/all_registration_services.model";
import { getHomepageContent } from "./homepage/get-homepage-content";
import { getHomepageCarouselSlides } from "./homepage/get-homepage-carousel";
import { getHomepageVideoFallback } from "./homepage/homepage-video";
import { HOMEPAGE } from "./Utility/Constant";
import HeroVisual from "./UIComponent/design/HeroVisual";
import EventFilm from "./UIComponent/design/EventFilm";
import SocietyNews from "./UIComponent/design/SocietyNews";
import { Icon } from "./UIComponent/design/Icons";
import Partener from "./UIComponent/Carousel/HomePage/Partener";
import { resourceUrl } from "./UIComponent/design/resource-url";

const expo = "/event_conference/bes_expo";
console.log("just checking  ")
export default async function Home() {
  const [slides, content, services] = await Promise.all([
    getHomepageCarouselSlides(), getHomepageContent(),
    new AllRegistrationTypeServices().getAllRunningServices(),
  ]);
  const config = content.notificationConfig;
  const visitorOpen = services.some(service => service.service_name === RegistrationServiceType.VISITOR_REGISTRATIONS && service.isActive);
  const delegateOpen = services.some(service => service.service_name === RegistrationServiceType.DELEGATE_REGISTRATIONS && service.isActive);
  const spaceOpen = services.some(service => service.service_name === RegistrationServiceType.MY_SPACE && service.isActive);
  const brochure = content.brochureButton;
  const date = config?.subtitle || `${HOMEPAGE.expoStartDate.date}–${HOMEPAGE.expoEndDate.date} ${HOMEPAGE.expoEndDate.displayMonth} ${HOMEPAGE.expoEndDate.year}`;
  const venue = config?.venue || "Hall No. 12A, Bharat Mandapam, New Delhi";
  const registrationActions = [
    { label: "Register as a Visitor", href: config?.visitorButtonLink || "/registrationform/visitor", icon: "people", variant: "visitor" },
    { label: "Register as a Delegate", href: config?.delegateButtonLink || "/registrationform/delegateregistration", icon: "broadcast", variant: "delegate" },
    { label: "Book Exhibition Space", href: config?.primaryButtonLink || `${expo}/exibition/participation_fee`, icon: "building", variant: "exhibitor" },
  ];
  const paths = [
    { number: "01", tag: "VISIT THE EXHIBITION", title: "See the technology. Ask the people who build it.", text: "Explore equipment and services across the broadcast workflow, from cameras and audio production to transmission, storage, and streaming. Meet technology teams face to face, discuss your requirements, and compare approaches for your next project.", href: visitorOpen ? config?.visitorButtonLink || "/registrationform/visitor" : `${expo}/exibition/products_on_display`, action: visitorOpen ? config?.visitorButtonText || "Register as a visitor" : "Explore products on display", status: visitorOpen ? "Visitor registration open" : "Explore visitor information" },
    { number: "02", tag: "ATTEND THE CONFERENCE", title: "Make time for a deeper discussion.", text: "Join broadcast engineers, industry specialists, and researchers to examine the issues affecting radio, television, and digital media. Read the conference theme and programme to find the discussions most relevant to your work.", href: delegateOpen ? config?.delegateButtonLink || "/registrationform/delegateregistration" : `${expo}/conference/conference_theme`, action: delegateOpen ? config?.delegateButtonText || "Register as a delegate" : "Explore the conference", status: delegateOpen ? "Delegate registration open" : "Discover the conference theme" },
    { number: "03", tag: "EXHIBIT WITH BES", title: "Bring your work to the industry.", text: "Introduce your products and services to professionals working in broadcast and media. Review participation fees, the exhibition floor plan, and sponsorship options, then speak with the BES team about the right space for your organisation.", href: config?.primaryButtonLink || `${expo}/exibition/participation_fee`, action: config?.primaryButtonText || (spaceOpen ? "Book your exhibition space" : "View exhibitor information"), status: spaceOpen ? "Space booking open" : "Plan your participation" },
  ];

  return <div className="homepage">
    <section className="home-hero" aria-labelledby="home-title"><div className="hero-grid">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-rule" />BROADCAST ENGINEERING SOCIETY (INDIA) · EST. 1987 <span className="hero-edition-label">{HOMEPAGE.eventCount} edition</span></div>
        <h1 id="home-title">Shaping the Future of Broadcast<br />&  <em>Media Technology..</em></h1>
        {/* <p className="hero-event-title">{config?.title || `${HOMEPAGE.eventCount} International Conference & Exhibition on Broadcast & Media Technology`}</p> */}
        <p className="hero-description">Bringing together the people, technologies and ideas transforming the world of broadcasting. Through international exhibitions, conferences and industry initiatives, BES India drives knowledge exchange, innovation and collaboration across the global media ecosystem.</p>
        <div className="hero-actions"><Link href={resourceUrl(visitorOpen ? config?.visitorButtonLink || "/registrationform/visitor" : `${expo}/exibition/history`)} className="button button-primary">{visitorOpen ? "Register your visit" : "Explore BES EXPO"}<Icon name="arrow" /></Link><Link href={resourceUrl(config?.primaryButtonLink || `${expo}/exibition/participation_fee`)} className="button button-outline">Discover BES India<Icon name="diagonal" width={18} height={18} /></Link></div>
        <dl className="hero-event-meta"><div><dt><Icon name="calendar" />Event dates</dt><dd>{date}</dd></div><div><dt><Icon name="pin" />New Delhi, India</dt><dd>{venue}</dd></div></dl>
      </div><HeroVisual slides={slides} />
    </div></section>

    <EventFilm video={content.video || getHomepageVideoFallback()} />

    {content.announcementsEnabled && content.announcementItems.length > 0 && <SocietyNews items={content.announcementItems} />}

    <section className="registration-section" id="registration" aria-labelledby="registration-title">
      <div className="site-container">
        <div className="registration-heading">
          <div><div className="eyebrow">Your next step</div><h2 id="registration-title">Register for BES EXPO.</h2></div>
          <p>Visit the exhibition, join the conference, or book exhibition space.</p>
        </div>
        <div className="registration-buttons">
          {registrationActions.map(action => <Link key={action.variant} href={resourceUrl(action.href)} className={`registration-button registration-button-${action.variant}`}>
            <span className="registration-button-icon"><Icon name={action.icon} /></span>
            <span className="registration-button-label">{action.label}</span>
            <Icon name="arrow" width={20} height={20} />
          </Link>)}
        </div>
      </div>
    </section>

    <section className="home-section experience-section" id="participate" aria-labelledby="participate-title"><div className="site-container">
      <div className="section-heading"><div><div className="eyebrow">Exhibition & conference</div><h2 id="participate-title">Find your place at BES EXPO.</h2></div><p>Come with a project, a question, or an idea to share. Choose how you would like to take part and find the information you need before making plans.</p></div>
      <div className="experience-grid">{paths.map(path => <article className="experience-card" key={path.number}><span className="experience-number" aria-hidden="true">{path.number}</span><div className="experience-copy"><div className="eyebrow">{path.tag}</div><h3>{path.title}</h3><p>{path.text}</p></div><div className="experience-action"><span className="service-status">{path.status}</span><Link href={resourceUrl(path.href)} className="card-link">{path.action}<Icon name="arrow" /></Link></div></article>)}</div>
      {config?.theme && <div className="theme-callout"><span className="eyebrow">Conference theme · {HOMEPAGE.expoStartDate.year}</span><p>{config.theme.replace(/^Theme:\s*/i, "")}</p></div>}
    </div></section>

    <Partener />

    <section className="society-section" aria-labelledby="society-title"><div className="site-container society-grid"><div className="society-image"><Image src="/Images/homepage_exclusive_images/9J4A7583.jpg" alt="A speaker sharing broadcast expertise at a BES EXPO conference" fill sizes="(max-width: 900px) 90vw, 45vw" /></div><div className="society-copy"><div className="eyebrow">Broadcast Engineering Society (India) · Since 1987</div><h2 id="society-title">A professional society.<br />A shared purpose.</h2><p>BES India is a community for people who work in broadcast engineering. Established in New Delhi in 1987, the Society supports the exchange of technical knowledge through conferences, seminars, tutorials, and exhibitions.</p><p>Our work continues beyond the annual EXPO. Through local chapters, the BES Review technical journal, and opportunities for professional exchange, members stay connected to the practice and development of broadcasting.</p><div className="hero-actions"><Link href="/about_bes/at_glance" className="button button-gold">About the Society<Icon name="arrow" /></Link><Link href="/about_bes/membership" className="text-link-light">Explore membership<Icon name="diagonal" width={18} height={18} /></Link></div></div></div></section>

    <section className="home-section" aria-labelledby="gallery-title"><div className="site-container"><div className="section-heading"><div><div className="eyebrow">The BES archive</div><h2 id="gallery-title">An industry, in good company.</h2></div><p>A look at the talks, exhibition stands, and encounters that make BES EXPO a place to reconnect with the industry.</p></div><div className="home-gallery">{[
      { src: "/Images/homepage_exclusive_images/9J4A7080.jpg", title: "At the conference", text: "Technical knowledge shared across the room.", label: "SESSIONS & DISCUSSIONS" },
      { src: "/Images/ImageGallery/2026/WhatsApp Image 2026-01-31 at 16.38.35 (1).jpeg", title: "On the exhibition floor", text: "Equipment, demonstrations, and direct conversations.", label: "TECHNOLOGY & EXHIBITORS" },
      { src: "/Images/homepage_exclusive_images/9J4A7687.jpg", title: "Among the community", text: "Colleagues and peers brought together by broadcasting.", label: "PEOPLE & OCCASIONS" },
    ].map(photo => <Link href="/galleries/pictures" className="gallery-story" key={photo.src}><div><Image src={photo.src} alt={photo.title} fill sizes="(max-width: 700px) 90vw, 40vw" /></div><span className="eyebrow">{photo.label}</span><h3>{photo.title}<Icon name="diagonal" /></h3><p>{photo.text}</p></Link>)}</div><Link href="/galleries/pictures" className="text-link gallery-all">View photographs by year<Icon name="arrow" /></Link></div></section>

    <section className="home-section resources-section" aria-labelledby="plan-title"><div className="site-container resources-grid"><div><div className="eyebrow">Before you arrive</div><h2 id="plan-title">Make a plan<br />for your visit.</h2><p>Check the venue, review the exhibition layout, and look through the conference programme. Keep the event details close at hand so you can spend more time on the conversations that matter.</p>{brochure?.url && <Link className="text-link" href={resourceUrl(brochure.url)} target={brochure.target || "_blank"} rel="noopener noreferrer"><Icon name="download" />Download {brochure.label.toLowerCase()}</Link>}</div><div className="resource-links">{[
      { title: "Dates & venue", text: "Find the event location and plan your journey to Bharat Mandapam.", icon: "pin", href: `${expo}/exibition/venue` },
      { title: "Exhibition floor plan", text: "Get familiar with the hall layout before you visit or book a stand.", icon: "building", href: `${expo}/exibition/floor_plan` },
      { title: "Conference programme", text: "Review the published schedule and choose the sessions for your visit.", icon: "calendar", href: `${expo}/conference/conference_schedule` },
      ...(config?.resourceButtons || []).map(button => ({ title: button.label, text: "Open this event resource for further information.", icon: "download", href: button.url, target: button.target })),
    ].map(resource => <Link key={resource.title} href={resourceUrl(resource.href)} target={"target" in resource ? resource.target : undefined} rel={"target" in resource && resource.target === "_blank" ? "noopener noreferrer" : undefined}><Icon name={resource.icon} /><span><strong>{resource.title}</strong><small>{resource.text}</small></span><Icon name="diagonal" /></Link>)}</div></div></section>

    <section className="contact-section" aria-labelledby="contact-title"><div className="site-container contact-layout"><div className="contact-heading"><div className="eyebrow">Here to help</div><h2 id="contact-title">Speak with the BES team.</h2><p>For questions about exhibiting, attending the conference, or planning your participation, contact the relevant team below.</p></div><div><div className="contact-grid"><a href="mailto:conference@besindia.com"><span><small>Conference enquiries</small><strong>conference@besindia.com</strong></span><Icon name="diagonal" /></a><a href="mailto:exhibition@besindia.com"><span><small>Exhibition enquiries</small><strong>exhibition@besindia.com</strong></span><Icon name="diagonal" /></a></div><div className="contact-bottom"><a href="tel:+911123316709"><Icon name="phone" width={18} height={18} />+91 11 23316709</a><Link href="/about_bes/contact_us">Contact details<Icon name="arrow" width={18} height={18} /></Link></div></div></div></section>
  </div>;
}
