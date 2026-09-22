import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'What we do', href: '#what-we-do' },
  { label: 'Services', href: '#services' },
  { label: 'GPU Flex', href: '#gpu-flex' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Process', href: '#process' },
];

const services = [
  {
    number: '01',
    title: 'Enterprise AI Development',
    description: 'Custom AI systems built on LLMs, retrieval-augmented generation (RAG), computer vision, and speech models. We handle fine-tuning, evaluation, integration with ERP and CRM systems, and deployment on cloud, on-premise, or edge.',
    tags: 'LLMs · RAG · VISION · SPEECH',
  },
  {
    number: '02',
    title: 'AI Agents & Automation',
    description: 'Agentic workflows that act on your business systems. Voice agents for inbound calls and appointment booking, sales agents for lead qualification, and support agents grounded in your internal knowledge base. Multilingual, including Indian languages.',
    tags: 'VOICE · WORKFLOWS · INTEGRATIONS',
  },
  {
    number: '03',
    title: 'AI Product Engineering for Startups',
    description: 'For founders at idea stage, we scope, architect, and build the MVP. For startups with a live product, we develop specific AI modules delivered as APIs your team can own.',
    tags: 'MVP · MODULES · APIs',
  },
  {
    number: '04',
    title: 'GPU Flex: GPU Infrastructure & Utilisation',
    description: 'Our platform for NVIDIA GPU servers. Shared, dedicated, and MIG-partitioned allocation, browser-based access through JupyterHub and web terminal, and a live dashboard for utilisation and users.',
    tags: 'NVIDIA · MIG · ON-PREMISE',
  },
];

const capabilities = [
  { title: 'AI & ML', items: ['LLMs', 'RAG', 'Fine-tuning (LoRA / QLoRA)', 'Computer vision', 'Speech recognition and synthesis', 'Multi-agent systems', 'Vector databases'] },
  { title: 'Infrastructure', items: ['GPU Flex platform', 'NVIDIA DGX and HGX systems', 'Jetson edge devices', 'CUDA', 'MIG', 'Kubernetes', 'Slurm', 'Containerised environments'] },
  { title: 'Deployment', items: ['vLLM', 'TensorRT', 'Triton Inference Server', 'MLOps pipelines', 'Cloud', 'On-premise', 'Hybrid'] },
];

const engagementSteps = [
  { number: '01', title: 'Scoping', description: 'We define the problem, success metrics, data availability, and technical constraints.' },
  { number: '02', title: 'Architecture', description: 'We recommend models, infrastructure, and integration approach, with cost estimates.' },
  { number: '03', title: 'Development', description: 'We build in two-week sprints with working demos at each stage.' },
  { number: '04', title: 'Deployment', description: 'We release to production with monitoring and documentation.' },
  { number: '05', title: 'Support', description: 'We offer ongoing maintenance, model updates, and performance tuning.' },
];

const imageAssets = {
  server: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=85',
  engineer: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1800&q=85',
  enterprise: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85',
  startup: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=85',
  university: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85',
  contact: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85',
};

function GridLines() {
  return <div className="section-grid-lines" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>;
}

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .mask-reveal'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function PhotoSlot({ label, caption, meta, imageUrl, className = '' }: { label: string; caption: string; meta?: string; imageUrl?: string; className?: string }) {
  return (
    <div
      className={`photo-slot mask-reveal ${imageUrl ? 'has-image' : ''} ${className}`}
      role="img"
      aria-label={`${imageUrl ? 'Image of' : 'Placeholder for'} ${label}`}
      style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
    >
      <span className="slot-kicker">{imageUrl ? 'IMAGE /' : 'PHOTO SLOT /'} {label}</span>
      <span className="slot-crosshair" aria-hidden="true" />
      <div className="slot-caption">{caption}{meta && <span className="slot-meta block mt-2">{meta}</span>}</div>
    </div>
  );
}

function Logo() {
  return (
    <a href="#top" aria-label="Nueclue home" data-testid="link-logo" className="font-display text-[1.25rem] font-bold tracking-[-.06em] text-[#EDEBE6]">
      nueclue<span className="text-[#FF5A1F]">.</span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 64);
      setHidden(current > previous && current > 180);
      previous = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav-shell fixed left-0 right-0 top-0 z-40 ${scrolled ? 'nav-scrolled' : ''} ${hidden && !menuOpen ? 'nav-hidden' : ''}`}>
      <div className="content-width flex h-[4.75rem] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="signal-line text-[.78rem] text-[#8C8A85] transition-colors hover:text-[#EDEBE6]">{item.label}</a>
          ))}
        </nav>
        <a href="#contact" data-testid="link-header-contact" className="orange-button hidden min-h-0 py-3 sm:inline-flex">Discuss a project <ArrowUpRight size={15} aria-hidden="true" /></a>
        <button type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)} data-testid="button-mobile-menu" className="grid h-10 w-10 place-items-center border border-white/25 text-[#EDEBE6] lg:hidden">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="menu-panel border-t border-white/10 px-5 py-7 lg:hidden" aria-label="Mobile navigation">
          <div className="content-width flex flex-col">
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="flex items-center justify-between border-b border-white/10 py-5 font-display text-3xl font-semibold tracking-[-.04em] text-[#EDEBE6]">
                <span><span className="mr-4 font-mono-ui text-xs text-[#FF5A1F]">0{index + 1}</span>{item.label}</span><ArrowDownRight size={18} />
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="link-mobile-contact" className="orange-button mt-7">Discuss a project <ArrowUpRight size={15} /></a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[100dvh] overflow-hidden bg-[#0B0B0C] text-[#EDEBE6]">
      <Header />
      <GridLines />
      <div className="content-width section-inner flex min-h-[100dvh] flex-col justify-end pb-10 pt-28 md:pb-12">
        <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <div className="section-label reveal mb-8">AI ENGINEERING · GPU INFRASTRUCTURE · BENGALURU</div>
            <h1 className="display-heading reveal delay-1 max-w-5xl text-[clamp(3.25rem,8.7vw,8.5rem)]">Applied AI engineering for enterprises, startups, and research institutions.</h1>
            <p className="body-copy reveal delay-2 mt-9 max-w-2xl text-[1.03rem] text-[#8C8A85]">We build LLM applications, agentic systems, and computer vision products, and run GPU Flex, our platform for managed, fully utilised GPU infrastructure.</p>
            <div className="reveal delay-3 mt-9 flex flex-wrap gap-3">
              <a href="#contact" data-testid="link-hero-discuss-project" className="orange-button">Discuss a project <ArrowUpRight size={16} /></a>
              <a href="#services" data-testid="link-hero-view-services" className="outline-button">View services <ArrowDownRight size={16} /></a>
            </div>
          </div>
          <PhotoSlot label="GPU SERVER FRONT" caption="GPU server front with rack lights" meta="NVIDIA DGX · 8× GPU · ON-PREMISE" imageUrl={imageAssets.server} className="reveal delay-2 min-h-[20rem] lg:mb-2" />
        </div>
        <div className="hero-rail reveal delay-3 mt-16 grid grid-cols-2 sm:grid-cols-4">
          {['RESEARCH TO REALITY', 'SYSTEMS, NOT DEMOS', 'BUILT AROUND YOUR DATA', 'BENGALURU, WORLDWIDE'].map((label, index) => (
            <div key={label} className="border-r border-white/10 py-4 pr-4 first:pl-0 last:border-0 sm:px-5">
              <span className="font-mono-ui text-[.65rem] text-[#FF5A1F]">0{index + 1}</span>
              <span className="mt-2 block text-[.64rem] text-[#8C8A85]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeDo() {
  return (
    <section id="what-we-do" className="light-section relative overflow-hidden py-24 md:py-36">
      <GridLines />
      <div className="content-width section-inner">
        <div className="grid gap-14 lg:grid-cols-[.45fr_1.1fr_.7fr] lg:gap-12">
          <div className="reveal"><div className="section-label light-label">01 / WHAT WE DO</div></div>
          <div className="reveal delay-1">
            <h2 className="display-heading max-w-3xl text-[clamp(2.5rem,5.4vw,5.8rem)]">We take AI from requirement to deployment.</h2>
            <p className="mt-8 max-w-2xl text-[1.04rem] leading-8 text-black/65">Nueclue is an AI engineering firm based in Bengaluru. We take AI from requirement to deployment: model selection, data pipelines, application development, inference optimisation, and production operations. Our clients range from global enterprises to early-stage startups and universities building AI research capacity.</p>
          </div>
          <PhotoSlot label="ENGINEER AT TERMINAL" caption="Engineer at work / real operations" meta="WORKING SYSTEMS · REAL OPERATIONS" imageUrl={imageAssets.engineer} className="reveal delay-2" />
        </div>
        <div className="mt-24 grid border-y border-black/15 md:grid-cols-3">
          {[
            ['01', 'Make it legible', 'Turn a large, ambiguous opportunity into a clear technical path.'],
            ['02', 'Make it work', 'Build the product and systems around the model.'],
            ['03', 'Make it last', 'Leave a foundation that can be operated, evaluated, and improved.'],
          ].map(([number, title, body], index) => (
            <article key={number} className={`reveal delay-${index + 1} border-b border-black/15 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 first:pl-0 last:border-r-0 last:pr-0`}>
              <span className="font-mono-ui text-xs text-black/45">{number}</span>
              <h3 className="mt-12 font-display text-2xl font-semibold tracking-[-.04em]">{title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-black/60">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#0B0B0C] py-24 text-[#EDEBE6] md:py-36">
      <GridLines />
      <div className="content-width section-inner">
        <div className="grid gap-8 md:grid-cols-[.45fr_1.2fr]">
          <div className="section-label reveal">02 / SERVICES</div>
          <div className="reveal delay-1"><h2 className="display-heading max-w-4xl text-[clamp(2.7rem,5.6vw,6rem)]">Four practice areas, one engineering team.</h2><p className="body-copy mt-7 max-w-2xl">Each engagement is scoped to your requirements, data, and infrastructure, whether that&apos;s a single AI module or a full production system.</p></div>
        </div>
        <div className="mt-20 border-t border-white/15">
          {services.map((service, index) => (
            <article key={service.number} className="reveal group grid gap-7 border-b border-white/15 py-8 md:grid-cols-[.14fr_1.05fr_1.2fr_.3fr] md:items-center md:gap-8 md:py-10">
              <span className="font-mono-ui text-sm text-[#FF5A1F]">{service.number}</span>
              <h3 className="font-display text-[clamp(1.65rem,2.6vw,2.8rem)] font-semibold leading-[1.02] tracking-[-.045em]">{service.title}</h3>
              <div><p className="max-w-xl text-sm leading-7 text-[#8C8A85]">{service.description}</p><span className="mt-4 block font-mono-ui text-[.62rem] tracking-[.1em] text-[#8C8A85]">{service.tags}</span></div>
              <a href={index === 3 ? '#gpu-flex' : '#contact'} data-testid={`link-service-${service.number}`} className="arrow-link justify-self-start text-[#EDEBE6] md:justify-self-end"><span className="hidden md:inline">Learn more</span><ArrowUpRight size={19} /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GpuFlexSpotlight() {
  return (
    <section id="gpu-flex" className="relative overflow-hidden bg-[#16161A] py-24 text-[#EDEBE6] md:py-36">
      <GridLines />
      <div className="content-width section-inner">
        <div className="grid gap-14 lg:grid-cols-[1.08fr_.92fr] lg:items-start lg:gap-20">
          <div className="reveal lg:sticky lg:top-28">
            <div className="section-label mb-8">03 / PRODUCT SPOTLIGHT</div>
            <PhotoSlot label="GPU FLEX / HARDWARE CONTEXT" caption="Temporary product context / replace with approved dashboard capture" meta="UTILISATION · USERS · CONTAINERS" imageUrl={imageAssets.server} className="min-h-[25rem] lg:min-h-[37rem]" />
            <div className="mt-4 flex justify-between font-mono-ui text-[.62rem] uppercase tracking-[.1em] text-[#8C8A85]"><span>Dashboard state / live visibility</span><span>01—04</span></div>
          </div>
          <div>
            <div className="reveal"><h2 className="display-heading max-w-2xl text-[clamp(2.8rem,5.5vw,6rem)]">Turn your GPU servers into a shared, managed compute platform.</h2><p className="body-copy mt-7 max-w-xl">GPU Flex is our platform for NVIDIA GPU servers, deployed and supported on your hardware.</p></div>
            <div className="mt-14 border-t border-white/15">
              {[
                'Shared, dedicated, and MIG-partitioned GPU allocation',
                'Browser access via JupyterHub, web terminal, and SSH',
                'Live dashboard for GPU utilisation, users, and containers',
                'Runs on-premise, so your data stays in your network',
              ].map((item, index) => (
                <div key={item} className={`reveal delay-${(index % 3) + 1} flex gap-5 border-b border-white/15 py-6`}>
                  <span className="font-mono-ui text-xs text-[#FF5A1F]">0{index + 1}</span>
                  <p className="max-w-md text-base leading-7 text-[#EDEBE6]">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#contact" data-testid="link-gpu-request-demo" className="orange-button">Request a demo <ArrowUpRight size={16} /></a>
              <a href="#contact" data-testid="link-gpu-learn-more" className="outline-button">Learn more <ArrowDownRight size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoWeWorkWith() {
  const groups = [
    ['Enterprises & MNCs', 'AI product development, process automation, and higher GPU utilisation with GPU Flex for teams running large-scale training and inference.', 'ENTERPRISE OFFICE', imageAssets.enterprise],
    ['Startups', 'Engineering capacity for founders who need to ship an AI product or feature without hiring a full ML team.', 'STARTUP TEAM', imageAssets.startup],
    ['Universities & Colleges', 'Managed GPU labs powered by GPU Flex, with browser-based access, per-user quotas, and preconfigured environments for coursework and research.', 'UNIVERSITY GPU LAB', imageAssets.university],
  ];
  return (
    <section id="who-we-work-with" className="relative overflow-hidden bg-[#0B0B0C] py-24 text-[#EDEBE6] md:py-36">
      <GridLines />
      <div className="content-width section-inner">
        <div className="grid gap-8 md:grid-cols-[.45fr_1.2fr]"><div className="section-label reveal">04 / WHO WE WORK WITH</div><div className="reveal delay-1"><h2 className="display-heading max-w-4xl text-[clamp(2.7rem,5.4vw,5.8rem)]">For teams building what comes next.</h2><p className="body-copy mt-7 max-w-2xl">The common thread is not company size. It is the conviction that AI should solve a real problem, and the ambition to build it properly.</p></div></div>
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {groups.map(([title, body, slot, imageUrl], index) => (
            <article key={title} className={`reveal delay-${index + 1} border border-white/15 bg-[#16161A] p-4`}>
              <PhotoSlot label={slot} caption={`${slot.toLowerCase()} / field context`} imageUrl={imageUrl} className="min-h-[14rem]" />
              <div className="p-3 pb-5"><div className="mt-4 font-mono-ui text-[.67rem] uppercase tracking-[.12em] text-[#FF5A1F]">{title}</div><p className="mt-5 text-sm leading-7 text-[#8C8A85]">{body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" className="light-section relative overflow-hidden py-24 md:py-36">
      <GridLines />
      <div className="content-width section-inner">
        <div className="grid gap-8 md:grid-cols-[.45fr_1.2fr]"><div className="section-label light-label reveal">05 / TECHNICAL CAPABILITIES</div><div className="reveal delay-1"><h2 className="display-heading max-w-4xl text-[clamp(2.7rem,5.4vw,5.8rem)]">A full-stack view of applied intelligence.</h2><p className="mt-7 max-w-2xl text-base leading-8 text-black/60">Strong models are only one layer. We bring equal care to the data, software, infrastructure, and feedback loops that make them useful.</p></div></div>
        <div className="mt-20 grid border-y border-black/15 md:grid-cols-3">
          {capabilities.map((capability, index) => (
            <article key={capability.title} className={`reveal delay-${index + 1} border-b border-black/15 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 first:pl-0 last:border-r-0 last:pr-0`}>
              <div className="flex items-baseline justify-between"><h3 className="font-display text-2xl font-semibold tracking-[-.04em]">{capability.title}</h3><span className="font-mono-ui text-xs text-black/45">0{index + 1}</span></div>
              <ul className="mt-9 space-y-3">{capability.items.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-black/65"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#FF5A1F]" />{item}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="tech-marquee mt-20" aria-label="Technology stack">
          <div className="tech-marquee-track">{['CUDA', 'MIG', 'KUBERNETES', 'SLURM', 'vLLM', 'TENSORRT', 'TRITON', 'PYTORCH', 'HUGGING FACE', 'CUDA', 'MIG', 'KUBERNETES', 'SLURM', 'vLLM', 'TENSORRT', 'TRITON', 'PYTORCH', 'HUGGING FACE'].map((tech, index) => <span key={`${tech}-${index}`}>{tech}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-[#0B0B0C] py-24 text-[#EDEBE6] md:py-36">
      <GridLines />
      <div className="content-width section-inner">
        <div className="grid gap-8 md:grid-cols-[.45fr_1.2fr]"><div className="section-label reveal">06 / HOW AN ENGAGEMENT WORKS</div><div className="reveal delay-1"><h2 className="display-heading max-w-4xl text-[clamp(2.7rem,5.4vw,5.8rem)]">Clear steps. No theatre.</h2><p className="body-copy mt-7 max-w-2xl">We keep the work close to the outcome and the decision-making visible at every stage.</p></div></div>
        <div className="mt-24 md:mt-32"><div className="timeline-line" /><div className="grid md:grid-cols-5">
          {engagementSteps.map((step, index) => (
            <article key={step.number} className={`timeline-step reveal delay-${(index % 3) + 1} border-b border-white/15 py-7 md:border-b-0 md:border-r md:px-5 md:py-0 md:pt-8 md:first:pl-0 md:last:border-r-0`}>
              <span className="font-mono-ui text-xs text-[#FF5A1F]">{step.number}</span><h3 className="mt-9 font-display text-2xl font-semibold tracking-[-.04em]">{step.title}</h3><p className="mt-4 max-w-[14rem] text-sm leading-7 text-[#8C8A85]">{step.description}</p>
              {index < engagementSteps.length - 1 && <ChevronRight className="mt-8 hidden text-[#8C8A85] md:block" size={16} aria-hidden="true" />}
            </article>
          ))}
        </div></div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return (
    <section id="contact" className="relative overflow-hidden bg-[#F2EFE9] py-24 text-[#0B0B0C] md:py-36">
      <GridLines />
      <div className="content-width section-inner">
        <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <div className="reveal"><div className="section-label light-label">07 / CONTACT</div><h2 className="display-heading mt-8 max-w-2xl text-[clamp(3.2rem,7vw,7.8rem)]">Tell us what you&apos;re building.</h2><p className="mt-8 max-w-md text-base leading-8 text-black/60">We&apos;ll respond within one business day with an initial assessment.</p><PhotoSlot label="ENGINEERS AT WORK" caption="Engineers at work / Bengaluru" meta="NUECLUE · BENGALURU" imageUrl={imageAssets.contact} className="mt-14 min-h-[16rem] bg-[#16161A]" /></div>
          <div className="reveal delay-2">
            {submitted ? (
              <div className="flex min-h-[27rem] flex-col justify-center border border-black/15 bg-[#16161A] p-8 text-[#EDEBE6] md:p-12" data-testid="status-contact-success"><div className="grid h-12 w-12 place-items-center bg-[#FF5A1F] text-[#0B0B0C]"><Check size={22} /></div><h3 className="mt-8 font-display text-3xl font-semibold tracking-[-.04em]">Message received.</h3><p className="mt-4 max-w-sm text-sm leading-7 text-[#8C8A85]">Thank you for reaching out. We&apos;ll be in touch within one business day.</p><button type="button" onClick={() => setSubmitted(false)} data-testid="button-send-another" className="arrow-link mt-9 w-fit text-[#EDEBE6]">Send another message <ArrowUpRight size={16} /></button></div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-black/15 bg-[#16161A] p-7 text-[#EDEBE6] md:p-12">
                <div className="mb-10 font-mono-ui text-[.68rem] uppercase tracking-[.12em] text-[#8C8A85]">Start with the useful details.</div>
                <div className="grid gap-8">
                  <label className="grid gap-2 text-sm text-[#8C8A85]">Your name<input required name="name" data-testid="input-contact-name" className="form-field text-[#EDEBE6] placeholder:text-white/25" placeholder="How should we address you?" /></label>
                  <label className="grid gap-2 text-sm text-[#8C8A85]">Work email<input required type="email" name="email" data-testid="input-contact-email" className="form-field text-[#EDEBE6] placeholder:text-white/25" placeholder="you@company.com" /></label>
                  <label className="grid gap-2 text-sm text-[#8C8A85]">What are you building?<textarea required name="message" rows={4} data-testid="input-contact-message" className="form-field resize-none text-[#EDEBE6] placeholder:text-white/25" placeholder="A little context goes a long way." /></label>
                  <button type="submit" data-testid="button-submit-contact" className="orange-button mt-2 w-full">Book a consultation <ArrowUpRight size={17} /></button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    { heading: 'Services', links: [['Enterprise AI', '#services'], ['AI Agents', '#services'], ['Startup Product Engineering', '#services'], ['GPU Flex', '#gpu-flex'], ['GPU Labs', '#who-we-work-with']] },
    { heading: 'Company', links: [['About', '#what-we-do'], ['Our Work', '#what-we-do'], ['Insights', '#capabilities'], ['Careers', '#contact'], ['FAQ', '#contact'], ['Contact', '#contact']] },
    { heading: 'Legal', links: [['Privacy Policy', '#contact'], ['Terms of Use', '#contact']] },
  ];
  return (
    <footer className="bg-[#0B0B0C] py-16 text-[#EDEBE6] md:py-24">
      <div className="content-width">
        <div className="border-b border-white/15 pb-16"><div className="section-label">NUECLUE / AI ENGINEERING AND GPU INFRASTRUCTURE</div><h2 className="display-heading mt-8 text-[clamp(4rem,12vw,12rem)]">Let&apos;s build<span className="text-[#FF5A1F]">.</span></h2></div>
        <div className="grid gap-12 border-b border-white/15 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => <div key={column.heading}><div className="font-mono-ui text-[.68rem] uppercase tracking-[.14em] text-[#FF5A1F]">{column.heading}</div><div className="mt-5 grid gap-3">{column.links.map(([label, href]) => <a key={label} href={href} data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`} className="w-fit text-sm text-[#8C8A85] transition-colors hover:text-[#EDEBE6]">{label}</a>)}</div></div>)}
          <div><div className="font-mono-ui text-[.68rem] uppercase tracking-[.14em] text-[#FF5A1F]">Contact</div><div className="mt-5 grid gap-3 text-sm text-[#8C8A85]"><a href="mailto:contact@nueclue.com" data-testid="link-footer-email" className="flex items-center gap-2 hover:text-[#EDEBE6]"><Mail size={14} />contact@nueclue.com</a><span className="flex items-center gap-2"><MapPin size={14} />Bengaluru, India</span><span className="flex items-center gap-2"><Phone size={14} />+91 00000 00000</span></div></div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-6 font-mono-ui text-[.62rem] uppercase tracking-[.1em] text-[#8C8A85] sm:flex-row"><span>© 2026 Nueclue. All rights reserved.</span><a href="#top" data-testid="link-back-to-top" className="arrow-link text-[#8C8A85]">Back to top <ArrowUpRight size={14} /></a></div>
      </div>
    </footer>
  );
}

function Home() {
  useRevealOnScroll();
  return <div className="noise min-h-[100dvh]"><Hero /><WhatWeDo /><Services /><GpuFlexSpotlight /><WhoWeWorkWith /><Capabilities /><Process /><Contact /><Footer /></div>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;