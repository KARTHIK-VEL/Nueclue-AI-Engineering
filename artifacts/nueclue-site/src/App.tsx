import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Brackets, Boxes, Check, ChevronRight, Cpu, Database, Gauge, Layers3, Mail, MapPin, Menu, Network, Phone, ShieldCheck, Workflow, X } from 'lucide-react';
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
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Process', href: '#process' },
];

const services = [
  {
    number: '01',
    title: 'Enterprise AI Development',
    description: 'Production-grade LLM applications and intelligent systems that respect your data, your people, and the way your business actually works.',
    tags: ['LLM applications', 'Private data', 'Production systems'],
    icon: Boxes,
  },
  {
    number: '02',
    title: 'AI Agents & Automation',
    description: 'Agentic systems that reason across tools, workflows, and knowledge bases — with the guardrails to make autonomy useful, not theatrical.',
    tags: ['Agentic systems', 'Tool use', 'Evaluation'],
    icon: Workflow,
  },
  {
    number: '03',
    title: 'AI Product Engineering for Startups',
    description: 'A focused technical partner for ambitious teams moving from a strong insight to an AI product customers can depend on.',
    tags: ['0 → 1 builds', 'Rapid validation', 'Scale-ready'],
    icon: Brackets,
  },
  {
    number: '04',
    title: 'GPU Infrastructure & Utilisation',
    description: 'The systems layer underneath the model: efficient inference, predictable workloads, and infrastructure that turns expensive compute into an advantage.',
    tags: ['Inference', 'GPU scheduling', 'Observability'],
    icon: Gauge,
  },
];

const capabilities = [
  { label: 'Model selection & evaluation', detail: 'Choose the right model for the job, then prove it with task-specific benchmarks.', icon: Activity },
  { label: 'Data pipelines & retrieval', detail: 'Reliable ingestion, transformation, indexing, and retrieval over proprietary knowledge.', icon: Database },
  { label: 'Application development', detail: 'Thoughtful interfaces and robust services that make intelligence usable in the real world.', icon: Brackets },
  { label: 'Inference optimisation', detail: 'Latency, throughput, quantisation, caching, and cost tuned for your production shape.', icon: Cpu },
  { label: 'Deployment & operations', detail: 'Observability, evaluation loops, safety controls, and a clean path from staging to scale.', icon: ShieldCheck },
  { label: 'Systems architecture', detail: 'A clear technical backbone connecting models, products, data, and the teams around them.', icon: Network },
];

const engagementSteps = [
  { number: '01', title: 'Scoping', description: 'We understand the ambition, constraints, users, and the measurable outcome worth building toward.' },
  { number: '02', title: 'Architecture', description: 'We make the important choices explicit: models, data, interfaces, infrastructure, and trade-offs.' },
  { number: '03', title: 'Development', description: 'Small feedback loops, working software, and engineering decisions that stay legible as the system grows.' },
  { number: '04', title: 'Deployment', description: 'We put the system in the hands of real users with the instrumentation and controls to operate it well.' },
  { number: '05', title: 'Support', description: 'We stay close through iteration, optimisation, and the next question your system makes possible.' },
];

function useRevealOnScroll() {
  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" aria-label="Nueclue home" data-testid="link-logo" className="group inline-flex items-center gap-3">
      <span className={`grid h-9 w-9 place-items-center rounded-full border ${light ? 'border-[#d7f997]/40 bg-[#d7f997] text-[#173b34]' : 'border-[#173b34]/20 bg-[#173b34] text-[#d7f997]'}`}>
        <span className="text-[1.05rem] font-bold leading-none">n</span>
      </span>
      <span className={`text-[1.05rem] font-semibold tracking-[-.04em] ${light ? 'text-[#f7f2e8]' : 'text-[#173b34]'}`}>nueclue</span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="absolute left-0 right-0 top-0 z-30">
      <div className="content-width flex h-20 items-center justify-between">
        <Logo light />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="signal-line font-mono-ui text-[.68rem] uppercase tracking-[.12em] text-[#d6dbcf]/80 transition-colors hover:text-[#d7f997]">
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contact" data-testid="link-header-contact" className="hidden items-center gap-2 border border-[#d7f997]/40 px-4 py-2.5 font-mono-ui text-[.68rem] uppercase tracking-[.12em] text-[#d7f997] transition-colors hover:bg-[#d7f997] hover:text-[#173b34] sm:inline-flex">
          Start a conversation <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <button type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} data-testid="button-mobile-menu" className="grid h-10 w-10 place-items-center border border-[#d7f997]/40 text-[#d7f997] md:hidden">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="content-width border-t border-[#d7f997]/15 bg-[#173b34] py-5 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="px-3 py-3 font-mono-ui text-xs uppercase tracking-[.12em] text-[#d6dbcf] hover:bg-[#d7f997] hover:text-[#173b34]">
                {item.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="link-mobile-contact" className="mt-2 inline-flex items-center gap-2 px-3 py-3 font-mono-ui text-xs uppercase tracking-[.12em] text-[#d7f997]">
              Start a conversation <ArrowUpRight size={14} />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="dark-grid relative isolate min-h-[46rem] overflow-hidden bg-[#173b34] text-[#f7f2e8]">
      <Header />
      <div className="pointer-events-none absolute -right-40 top-28 h-[32rem] w-[32rem] rounded-full border border-[#d7f997]/10 md:right-[-4rem]">
        <div className="hero-orbit absolute inset-10" />
        <div className="hero-orbit hero-orbit-reverse absolute inset-24" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d7f997]/10 blur-2xl" />
      </div>
      <div className="content-width relative flex min-h-[46rem] flex-col justify-end pb-20 pt-36 md:pb-24">
        <div className="mb-8 flex items-center gap-3 font-mono-ui text-[.68rem] uppercase tracking-[.16em] text-[#d7f997] reveal">
          <span className="h-2 w-2 rounded-full bg-[#d7f997]" />
          Bengaluru / AI engineering studio
        </div>
        <h1 className="max-w-5xl text-balance text-[clamp(2.8rem,7.3vw,7.5rem)] font-semibold leading-[.98] tracking-[-.08em] text-[#f7f2e8] reveal delay-1">
          Applied AI engineering for <span className="text-[#d7f997]">enterprises, startups,</span> and research institutions.
        </h1>
        <div className="mt-10 grid max-w-4xl gap-8 md:grid-cols-[1fr_auto] md:items-end reveal delay-2">
          <p className="max-w-xl text-[1rem] leading-7 text-[#d6dbcf]/75 md:text-[1.1rem]">
            We build LLM applications, agentic systems, computer vision products, and GPU infrastructure — taking ambitious AI from requirement to dependable deployment.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contact" data-testid="link-hero-discuss-project" className="group inline-flex items-center gap-3 bg-[#d7f997] px-5 py-3.5 text-sm font-semibold text-[#173b34] transition-transform hover:-translate-y-1">
              Discuss a Project <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#services" data-testid="link-hero-view-services" className="inline-flex items-center gap-3 border border-[#d6dbcf]/30 px-5 py-3.5 text-sm font-semibold text-[#f7f2e8] transition-colors hover:border-[#d7f997] hover:text-[#d7f997]">
              View Services <ArrowDownRight size={17} />
            </a>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 border-t border-[#d6dbcf]/20 pt-5 sm:grid-cols-4 reveal delay-3">
          {[
            ['01', 'Research to reality'],
            ['02', 'Systems, not demos'],
            ['03', 'Built around your data'],
            ['04', 'Bengaluru, worldwide'],
          ].map(([number, label]) => (
            <div key={number} className="border-r border-[#d6dbcf]/20 py-2 pr-4 last:border-0 sm:px-4 first:pl-0">
              <div className="font-mono-ui text-[.65rem] text-[#d7f997]">{number}</div>
              <div className="mt-2 text-xs text-[#d6dbcf]/65">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, body, light = false }: { eyebrow: string; title: string; body?: string; light?: boolean }) {
  return (
    <div className={`reveal grid gap-6 md:grid-cols-[.7fr_1.3fr] md:gap-14 ${light ? 'text-[#f7f2e8]' : 'text-[#173b34]'}`}>
      <div className={`font-mono-ui text-[.68rem] uppercase tracking-[.16em] ${light ? 'text-[#d7f997]' : 'text-[#27896c]'}`}>/ {eyebrow}</div>
      <div>
        <h2 className="max-w-3xl text-balance text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.03] tracking-[-.07em]">{title}</h2>
        {body && <p className={`mt-6 max-w-2xl text-base leading-7 ${light ? 'text-[#d6dbcf]/70' : 'text-[#173b34]/65'}`}>{body}</p>}
      </div>
    </div>
  );
}

function WhatWeDo() {
  return (
    <section id="what-we-do" className="site-grid bg-[#f7f2e8] py-24 md:py-36">
      <div className="content-width">
        <SectionIntro eyebrow="What we do" title="The difficult middle is where we do our best work." body="Most AI initiatives do not fail because the model is unavailable. They fail in the gap between a promising capability and a system people can trust. Nueclue closes that gap — with the technical depth to make the right choices and the pragmatism to ship." />
        <div className="mt-20 grid gap-0 border-y border-[#173b34]/20 md:grid-cols-3">
          {[
            { number: '01', title: 'Make it legible', body: 'We turn a large, ambiguous opportunity into a clear technical path with measurable outcomes.' },
            { number: '02', title: 'Make it work', body: 'We build the product and systems around the model — the part that creates lasting value.' },
            { number: '03', title: 'Make it last', body: 'We leave you with a production foundation that can be operated, evaluated, and improved.' },
          ].map((item, index) => (
            <article key={item.number} className={`reveal delay-${index + 1} border-b border-[#173b34]/20 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 first:pl-0 last:border-r-0 last:pr-0`}>
              <span className="font-mono-ui text-xs text-[#27896c]">{item.number}</span>
              <h3 className="mt-10 text-xl font-semibold tracking-[-.04em]">{item.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#173b34]/60">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-[#e4e6c6] py-24 md:py-36">
      <div className="content-width">
        <SectionIntro eyebrow="Services" title="From first architecture decision to the first reliable inference." body="Engage us for a focused technical challenge or a complete build. The shape changes; the standard does not." />
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article key={service.number} data-testid={`card-service-${service.number}`} className={`reveal delay-${(index % 3) + 1} group relative overflow-hidden border border-[#173b34]/20 bg-[#f7f2e8] p-7 transition-colors hover:bg-[#173b34] hover:text-[#f7f2e8] md:p-9 ${index === 0 ? 'md:min-h-[24rem]' : index === 1 ? 'md:translate-y-10 md:min-h-[24rem]' : index === 2 ? 'md:min-h-[21rem]' : 'md:translate-y-10 md:min-h-[21rem]'}`}>
                <div className="flex items-start justify-between">
                  <span className="font-mono-ui text-xs text-[#27896c] group-hover:text-[#d7f997]">{service.number}</span>
                  <Icon size={26} strokeWidth={1.5} className="text-[#27896c] transition-transform duration-300 group-hover:rotate-12 group-hover:text-[#d7f997]" aria-hidden="true" />
                </div>
                <h3 className="mt-16 max-w-sm text-[1.65rem] font-semibold leading-[1.05] tracking-[-.06em]">{service.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-6 text-[#173b34]/60 group-hover:text-[#d6dbcf]/70">{service.description}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {service.tags.map((tag) => <span key={tag} className="border border-[#173b34]/15 px-2.5 py-1 font-mono-ui text-[.61rem] uppercase tracking-[.08em] text-[#173b34]/55 group-hover:border-[#d6dbcf]/20 group-hover:text-[#d6dbcf]/65">{tag}</span>)}
                </div>
                <ArrowUpRight size={17} className="absolute bottom-8 right-8 text-[#173b34]/30 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#d7f997]" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhoWeWorkWith() {
  return (
    <section className="bg-[#173b34] py-24 text-[#f7f2e8] md:py-36">
      <div className="content-width">
        <SectionIntro light eyebrow="Who we work with" title="For teams building what comes next." body="The common thread is not company size. It is the conviction that AI should solve a real problem, and the ambition to build it properly." />
        <div className="mt-20 grid gap-px overflow-hidden bg-[#d6dbcf]/15 md:grid-cols-3">
          {[
            { label: 'Enterprises', title: 'Turn operational knowledge into leverage.', body: 'We help established organisations move from pilots to systems that people across the business can use with confidence.' },
            { label: 'Startups', title: 'Build the technical edge into the product.', body: 'We join founders and product teams when the idea is clear, the constraints are real, and speed matters.' },
            { label: 'Research institutions', title: 'Take promising work into the world.', body: 'We translate novel research into usable products, robust infrastructure, and systems that can operate beyond the lab.' },
          ].map((item, index) => (
            <article key={item.label} className={`reveal delay-${index + 1} bg-[#173b34] p-8 md:min-h-[20rem] md:p-10`}>
              <div className="font-mono-ui text-[.67rem] uppercase tracking-[.12em] text-[#d7f997]">{item.label}</div>
              <h3 className="mt-16 max-w-xs text-[1.45rem] font-semibold leading-[1.1] tracking-[-.05em]">{item.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#d6dbcf]/65">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" className="site-grid bg-[#f7f2e8] py-24 md:py-36">
      <div className="content-width">
        <SectionIntro eyebrow="Technical capabilities" title="A full-stack view of applied intelligence." body="Strong models are only one layer. We bring equal care to the data, software, infrastructure, and feedback loops that make them useful." />
        <div className="mt-16 grid border-t border-[#173b34]/20 md:grid-cols-2">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <article key={capability.label} data-testid={`capability-${index + 1}`} className={`reveal delay-${(index % 3) + 1} group flex gap-5 border-b border-[#173b34]/20 py-7 md:min-h-[10rem] md:px-5 first:pl-0 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:pl-0 md:[&:nth-child(even)]:pr-0`}>
                <div className="grid h-10 w-10 shrink-0 place-items-center border border-[#173b34]/20 text-[#27896c] transition-colors group-hover:border-[#173b34] group-hover:bg-[#d7f997] group-hover:text-[#173b34]"><Icon size={18} strokeWidth={1.6} aria-hidden="true" /></div>
                <div>
                  <h3 className="text-base font-semibold tracking-[-.03em]">{capability.label}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#173b34]/60">{capability.detail}</p>
                </div>
                <span className="ml-auto font-mono-ui text-[.65rem] text-[#173b34]/30">0{index + 1}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="bg-[#d7f997] py-24 text-[#173b34] md:py-32">
      <div className="content-width">
        <SectionIntro eyebrow="How an engagement works" title="Clear steps. No theatre." body="We keep the work close to the outcome and the decision-making visible at every stage." />
        <div className="mt-16 grid border-t border-[#173b34]/30 md:grid-cols-5">
          {engagementSteps.map((step, index) => (
            <article key={step.number} className={`reveal delay-${(index % 3) + 1} border-b border-[#173b34]/30 py-7 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0 md:last:pr-0`}>
              <div className="flex items-center justify-between font-mono-ui text-xs">
                <span>{step.number}</span>
                {index < engagementSteps.length - 1 && <ChevronRight size={14} className="hidden md:block" aria-hidden="true" />}
              </div>
              <h3 className="mt-12 text-lg font-semibold tracking-[-.04em]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#173b34]/65">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return (
    <section id="contact" className="bg-[#f7f2e8] py-24 md:py-36">
      <div className="content-width">
        <div className="grid gap-14 md:grid-cols-[1fr_.8fr] md:gap-24">
          <div className="reveal">
            <div className="font-mono-ui text-[.68rem] uppercase tracking-[.16em] text-[#27896c]">/ Contact</div>
            <h2 className="mt-7 max-w-xl text-balance text-[clamp(2.6rem,6vw,6rem)] font-semibold leading-[.96] tracking-[-.08em]">Tell us what you're building.</h2>
            <p className="mt-7 max-w-md text-base leading-7 text-[#173b34]/65">We'll respond within one business day with an initial assessment.</p>
            <div className="mt-12 space-y-4 border-t border-[#173b34]/20 pt-6 text-sm">
              <a href="mailto:contact@nueclue.com" data-testid="link-contact-email" className="flex items-center gap-3 text-[#173b34] hover:text-[#27896c]"><Mail size={16} aria-hidden="true" /> contact@nueclue.com</a>
              <div className="flex items-center gap-3 text-[#173b34]/60"><MapPin size={16} aria-hidden="true" /> Bengaluru, India</div>
            </div>
          </div>
          <div className="reveal delay-2">
            {submitted ? (
              <div className="flex min-h-[24rem] flex-col justify-center border border-[#173b34]/20 bg-[#e4e6c6] p-8 md:p-10" data-testid="status-contact-success">
                <div className="grid h-12 w-12 place-items-center bg-[#d7f997] text-[#173b34]"><Check size={22} /></div>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-.05em]">Message received.</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#173b34]/65">Thank you for reaching out. We'll be in touch within one business day.</p>
                <button type="button" onClick={() => setSubmitted(false)} data-testid="button-send-another" className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[#173b34] pb-1 text-sm font-semibold">Send another message <ArrowUpRight size={15} /></button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-[#173b34]/20 bg-[#e4e6c6] p-6 md:p-10">
                <div className="grid gap-6">
                  <label className="grid gap-2 text-sm font-medium">Your name<input required name="name" data-testid="input-contact-name" className="border-b border-[#173b34]/30 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-[#173b34]/35 focus:border-[#27896c]" placeholder="How should we address you?" /></label>
                  <label className="grid gap-2 text-sm font-medium">Work email<input required type="email" name="email" data-testid="input-contact-email" className="border-b border-[#173b34]/30 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-[#173b34]/35 focus:border-[#27896c]" placeholder="you@company.com" /></label>
                  <label className="grid gap-2 text-sm font-medium">What are you building?<textarea required name="message" rows={4} data-testid="input-contact-message" className="resize-none border-b border-[#173b34]/30 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-[#173b34]/35 focus:border-[#27896c]" placeholder="A little context goes a long way." /></label>
                  <button type="submit" data-testid="button-submit-contact" className="mt-3 inline-flex w-full items-center justify-between bg-[#173b34] px-5 py-4 text-left text-sm font-semibold text-[#f7f2e8] transition-colors hover:bg-[#27896c]">Send enquiry <ArrowUpRight size={18} /></button>
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
  return (
    <footer className="bg-[#173b34] py-12 text-[#f7f2e8]">
      <div className="content-width">
        <div className="grid gap-12 border-b border-[#d6dbcf]/20 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#d6dbcf]/60">Applied AI engineering for organisations building what comes next.</p>
          </div>
          <div>
            <div className="font-mono-ui text-[.66rem] uppercase tracking-[.15em] text-[#d7f997]">Find us</div>
            <div className="mt-5 flex items-center gap-3 text-sm text-[#d6dbcf]/70"><MapPin size={15} /> Bengaluru, India</div>
            <div className="mt-3 flex items-center gap-3 text-sm text-[#d6dbcf]/70"><Phone size={15} /> +91 00000 00000</div>
          </div>
          <div>
            <div className="font-mono-ui text-[.66rem] uppercase tracking-[.15em] text-[#d7f997]">Talk to us</div>
            <a href="mailto:contact@nueclue.com" data-testid="link-footer-email" className="mt-5 flex items-center gap-3 text-sm text-[#d6dbcf]/70 hover:text-[#d7f997]"><Mail size={15} /> contact@nueclue.com</a>
            <a href="#services" data-testid="link-footer-services" className="mt-3 flex items-center gap-3 text-sm text-[#d6dbcf]/70 hover:text-[#d7f997]"><Layers3 size={15} /> Services</a>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 font-mono-ui text-[.62rem] uppercase tracking-[.11em] text-[#d6dbcf]/45 sm:flex-row">
          <span>© 2024 Nueclue. All rights reserved.</span>
          <a href="#top" data-testid="link-back-to-top" className="inline-flex items-center gap-2 hover:text-[#d7f997]">Back to top <ArrowUpRight size={13} /></a>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  useRevealOnScroll();
  return (
    <div className="noise min-h-[100dvh]">
      <Hero />
      <WhatWeDo />
      <Services />
      <WhoWeWorkWith />
      <Capabilities />
      <Process />
      <Contact />
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;