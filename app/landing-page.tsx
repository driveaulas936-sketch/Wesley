'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, AtSign, BarChart3, Check, CircleDollarSign, Layers3, MousePointerClick, Pause, Play, Sparkles, Target, TrendingUp, Volume2, VolumeX, X } from 'lucide-react';
import { siteContent } from './content';

const c = siteContent;

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

function SectionHeader({ index, eyebrow, title, text, align = 'left' }: { index: string; eyebrow: string; title: string; text?: string; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-4xl text-center' : 'max-w-4xl'}>
      <div className={`mb-5 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="text-stone-600">{index}</span><span className="h-px w-7 bg-amber-400/60" />{eyebrow}
      </div>
      <h2 className="text-[clamp(2.25rem,5vw,5.2rem)] font-extrabold leading-[0.97] tracking-[-0.05em] text-stone-50">{title}</h2>
      {text && <p className={`mt-6 max-w-2xl text-base leading-7 text-stone-400 sm:text-lg sm:leading-8 ${align === 'center' ? 'mx-auto' : ''}`}>{text}</p>}
    </div>
  );
}

function CTAButton({ label = 'Quero me inscrever', light = false, unlocked }: { label?: string; light?: boolean; unlocked: boolean }) {
  const colors = light ? 'bg-stone-950 text-stone-50 hover:bg-stone-800' : 'bg-amber-400 text-stone-950 hover:bg-amber-300';

  if (!unlocked) return null;

  return (
    <a href={c.links.salesPage} className={`group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full px-7 text-center text-xs font-extrabold uppercase tracking-[0.07em] shadow-[0_18px_55px_rgba(245,158,11,0.15)] transition duration-300 hover:-translate-y-1 active:translate-y-0 sm:w-auto sm:text-sm ${colors}`}>
      {label}<ArrowUpRight className="size-4 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
    </a>
  );
}

function SalesVideo({ unlocked, onUnlock }: { unlocked: boolean; onUnlock: () => void }) {
  const unlockAtSeconds = 150;
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastPlayedTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  };

  const cyclePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const playbackRateLabel = playbackRate === 1 ? '1x' : playbackRate === 1.25 ? '1,25x' : '1,5x';

  return (
    <div className="relative mx-auto w-full max-w-[390px] sm:max-w-[440px] lg:ml-auto">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
        <video
          ref={videoRef}
          className="size-full cursor-pointer object-contain"
          autoPlay
          muted
          controls={false}
          disablePictureInPicture
          playsInline
          preload="auto"
          onClick={togglePlayback}
          onContextMenu={(event) => event.preventDefault()}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
          onSeeking={(event) => {
            const video = event.currentTarget;
            if (Math.abs(video.currentTime - lastPlayedTimeRef.current) > 1) video.currentTime = lastPlayedTimeRef.current;
          }}
          onTimeUpdate={(event) => {
            lastPlayedTimeRef.current = event.currentTarget.currentTime;
            if (event.currentTarget.currentTime >= unlockAtSeconds) onUnlock();
          }}
          onEnded={() => { setIsPlaying(false); onUnlock(); }}
          aria-label="Vídeo de apresentação do Low Ticket na Prática"
        >
          <source src="/videos/wesley-vsl.mp4" type="video/mp4" />
          Seu navegador não conseguiu reproduzir este vídeo.
        </video>
        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-3 rounded-full border border-white/10 bg-black/55 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-stone-300 backdrop-blur-md sm:text-[9px]">
          <span>Vídeo de apresentação</span>
          <span className={unlocked ? 'text-emerald-300' : 'text-amber-300'}>{unlocked ? 'Acesso liberado' : 'Libera aos 02:30'}</span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2" aria-label="Controles do vídeo">
          <button type="button" onClick={togglePlayback} className="grid size-12 place-items-center rounded-full border border-white/10 bg-black/75 text-white shadow-lg backdrop-blur transition hover:bg-black/90" aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}>
            {isPlaying ? <Pause className="size-5" aria-hidden="true" /> : <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />}
          </button>
          <button type="button" onClick={cyclePlaybackRate} className="grid min-h-12 min-w-12 place-items-center rounded-full border border-white/10 bg-black/75 px-3 text-xs font-extrabold text-white shadow-lg backdrop-blur transition hover:bg-black/90" aria-label={`Velocidade do vídeo: ${playbackRateLabel}. Máximo de 1,5x.`} title="Alterar velocidade até 1,5x">
            {playbackRateLabel}
          </button>
          <button type="button" onClick={toggleMuted} className="grid size-12 place-items-center rounded-full border border-white/10 bg-black/75 text-white shadow-lg backdrop-blur transition hover:bg-black/90" aria-label={isMuted ? 'Ativar som do vídeo' : 'Silenciar vídeo'} title={isMuted ? 'Ativar som' : 'Silenciar'}>
            {isMuted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-amber-400/25 bg-[#0b0b0a]/95 px-5 py-4 shadow-2xl backdrop-blur"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-500">Marco da minha trajetória</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-stone-50">+ R$ 1 milhão</p><p className="text-xs text-amber-300">faturado no digital</p></div>
    </div>
  );
}

function StoryPhotoGallery() {
  const photos = [
    { src: '/images/wesley-before-01.jpeg', alt: 'Registro antigo de Wesley em sua rotina de trabalho', width: 1186, height: 1600, position: 'object-center' },
    { src: '/images/wesley-before-02.jpeg', alt: 'Registro antigo de Wesley antes de trabalhar com o mercado digital', width: 1284, height: 1477, position: 'object-center' },
    { src: '/images/wesley-before-03.jpeg', alt: 'Registro antigo de Wesley trabalhando como entregador', width: 1214, height: 1600, position: 'object-center' },
  ];

  return (
    <div className="grid min-h-[470px] grid-cols-2 grid-rows-2 gap-2.5 sm:min-h-[620px] sm:gap-3 lg:min-h-[680px]">
      {photos.map((photo, index) => (
        <figure
          key={photo.src}
          className={`group relative overflow-hidden border border-white/10 bg-[#11110f] ${index === 0 ? 'row-span-2 rounded-[1.6rem] sm:rounded-[2rem]' : 'rounded-[1.25rem] sm:rounded-[1.6rem]'}`}
        >
          <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" className={`size-full object-cover transition duration-700 group-hover:scale-[1.025] ${photo.position}`} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
          <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-stone-200 sm:inset-x-5 sm:bottom-5 sm:text-[9px]">
            <span>Antes do digital</span><span className="text-amber-300">0{index + 1}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function AnimatedRevenue() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * 1_000_000));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <p ref={ref} aria-label="Mais de um milhão de reais faturado no digital" className="whitespace-nowrap text-[clamp(2.65rem,10vw,9.5rem)] font-extrabold leading-none tracking-[-0.075em] text-amber-400">+ R$ {value.toLocaleString('pt-BR')}</p>;
}

const benefitIcons = [Target, CircleDollarSign, Layers3, TrendingUp, MousePointerClick, BarChart3];
const socialProofs = [
  { src: '/images/proof-01.jpeg', alt: 'Relato de aluno celebrando sua primeira venda', width: 1198, height: 1600 },
  { src: '/images/proof-02.jpeg', alt: 'Relato de aluno sobre suas primeiras vendas', width: 1148, height: 1600 },
  { src: '/images/proof-03.jpeg', alt: 'Registros de vendas compartilhados por aluna', width: 1100, height: 1600 },
  { src: '/images/proof-04.jpeg', alt: 'Resultado de aluna com 35 vendas realizadas no período', width: 1206, height: 1600 },
] as const;

function FloatingNotification({ icon, eyebrow, title, detail, className, elementRef }: { icon: ReactNode; eyebrow: string; title: string; detail: string; className: string; elementRef: (node: HTMLDivElement | null) => void }) {
  return (
    <div ref={elementRef} className={`intro-notification absolute flex w-[min(62vw,250px)] items-center gap-3 rounded-2xl border border-violet-300/20 bg-[#0b0910]/78 p-3.5 opacity-0 shadow-[0_18px_60px_rgba(88,28,135,0.28)] backdrop-blur-xl sm:w-[310px] sm:gap-4 sm:p-4 ${className}`}>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">{icon}</span>
      <span className="min-w-0"><span className="block font-mono text-[7px] font-semibold uppercase tracking-[0.15em] text-violet-300/80">{eyebrow}</span><strong className="mt-1 block truncate text-xs font-bold text-stone-100 sm:text-sm">{title}</strong><span className="mt-0.5 block truncate text-[10px] text-stone-400 sm:text-[11px]">{detail}</span></span>
      <span className="ml-auto size-1.5 shrink-0 rounded-full bg-violet-300 shadow-[0_0_12px_#c4b5fd]" />
    </div>
  );
}

function IntroExperience({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const notificationRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const backgroundVideo = backgroundVideoRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const ranges = [[0.08, 0.68], [0.38, 0.96]];
    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const update = () => {
      frame = 0;
      const total = Math.max(container.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-container.getBoundingClientRect().top / total);
      notificationRefs.current.forEach((element, index) => {
        if (!element) return;
        if (reducedMotion) {
          element.style.opacity = '0';
          element.style.transform = 'none';
          element.style.filter = 'none';
          return;
        }
        const [start, end] = ranges[index];
        const appear = clamp((progress - start) / 0.11);
        const disappear = clamp((end - progress) / 0.12);
        const visibility = appear * disappear;
        const translate = (1 - appear) * 34 - progress * (10 + index * 5);
        element.style.opacity = String(visibility * 0.92);
        element.style.transform = `translate3d(0, ${translate}px, 0) scale(${0.975 + appear * 0.025})`;
        element.style.filter = `blur(${(1 - appear) * 3}px)`;
      });
    };
    const queueUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    const videoObserver = backgroundVideo && !reducedMotion ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void backgroundVideo.play().catch(() => undefined);
      else backgroundVideo.pause();
    }) : null;
    if (backgroundVideo && reducedMotion) backgroundVideo.pause();
    if (videoObserver) videoObserver.observe(container);
    update();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    return () => {
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      videoObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const particles = [
    { left: '8%', top: '18%', delay: '-1s' }, { left: '18%', top: '72%', delay: '-4s' },
    { left: '44%', top: '12%', delay: '-2s' }, { left: '70%', top: '28%', delay: '-6s' },
    { left: '84%', top: '67%', delay: '-3s' }, { left: '57%', top: '82%', delay: '-5s' },
  ];

  return (
    <div ref={containerRef} className="intro-experience relative isolate">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-clip" aria-hidden="true">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#070609]">
          <video ref={backgroundVideoRef} className="intro-background-video absolute inset-0 size-full object-cover" autoPlay muted loop playsInline preload="metadata" tabIndex={-1}>
            <source src="/videos/wesley-intro-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,2,5,0.84)_0%,rgba(5,3,8,0.6)_48%,rgba(4,3,7,0.48)_100%)] sm:bg-[linear-gradient(90deg,rgba(3,2,5,0.87)_0%,rgba(5,3,8,0.56)_42%,rgba(4,3,7,0.35)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(139,92,246,0.28),transparent_30%),radial-gradient(circle_at_18%_78%,rgba(88,28,135,0.22),transparent_28%),linear-gradient(180deg,transparent_68%,rgba(5,3,8,0.82))]" />
          <div className="intro-light-beam absolute -right-[16%] top-[8%] h-[68%] w-[34%] rotate-[18deg] bg-gradient-to-b from-violet-300/0 via-violet-300/10 to-transparent blur-3xl" />
          <div className="intro-particles absolute inset-0 hidden sm:block">{particles.map((particle, index) => <i key={index} className="intro-particle absolute size-1 rounded-full bg-violet-200/70 shadow-[0_0_18px_#a78bfa]" style={{ left: particle.left, top: particle.top, animationDelay: particle.delay }} />)}</div>
        </div>
      </div>
      <div className="intro-floating-layer pointer-events-none absolute inset-0 z-[5] overflow-clip" aria-hidden="true">
        <div className="sticky top-0 mx-auto h-screen max-w-[1600px]">
          <FloatingNotification elementRef={(node) => { notificationRefs.current[0] = node; }} className="right-[2vw] top-[3vh] hidden lg:flex" icon={<Layers3 className="size-4" aria-hidden="true" />} eyebrow="Estrutura visual" title="Operação em movimento" detail="Oferta • página • aquisição" />
          <FloatingNotification elementRef={(node) => { notificationRefs.current[1] = node; }} className="bottom-[3vh] right-[2vw] hidden lg:flex" icon={<TrendingUp className="size-4" aria-hidden="true" />} eyebrow="Processo contínuo" title="Otimização em andamento" detail="Leitura de dados e melhoria" />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function LandingPage() {
  const [ctaUnlocked, setCtaUnlocked] = useState(false);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.brand.name,
    url: c.brand.instagramUrl,
    sameAs: [c.brand.instagramUrl],
    description: 'Profissional do mercado digital com atuação em produtos digitais low ticket.',
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IntroExperience>
      <section id="inicio" className="hero-grid relative isolate min-h-screen">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_28%,rgba(245,158,11,0.13),transparent_28%),linear-gradient(180deg,transparent_60%,rgba(245,158,11,0.04))]" />
        <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-14">
          <a href="#inicio" className="group inline-flex items-center gap-3" aria-label={`${c.brand.name} — início`}>
            <span className="grid size-10 place-items-center rounded-full border border-amber-400/45 bg-amber-400/10 font-mono text-xs font-bold text-amber-300 transition group-hover:bg-amber-400 group-hover:text-stone-950">{c.brand.initials}</span>
            <span className="text-sm font-semibold tracking-[-0.01em] text-stone-200">{c.brand.name}</span>
          </a>
          <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:flex"><i className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_14px_#fbbf24]" />Estratégia em operação</span>
        </header>

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 px-5 pb-20 pt-8 sm:px-8 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[1.08fr_0.92fr] lg:px-14 lg:pb-24 lg:pt-2">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-6 max-w-xl border-l border-amber-400 pl-3 font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.14em] text-amber-300 sm:text-xs">{c.hero.eyebrow}</p>
            <h1 className="max-w-[920px] text-[clamp(2.75rem,7vw,7.2rem)] font-extrabold leading-[0.89] tracking-[-0.065em] text-stone-50">
              {c.hero.headlineStart} <span className="text-amber-400">{c.hero.headlineHighlight}</span> {c.hero.headlineEnd}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-stone-400 sm:text-lg sm:leading-8">{c.hero.subheadline}</p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <CTAButton label={c.hero.cta} unlocked={ctaUnlocked} />
              <p className="max-w-xs text-xs leading-5 text-stone-500">Resultados dependem de aplicação, experiência, mercado, investimento e outros fatores.</p>
            </div>
          </div>

          <SalesVideo unlocked={ctaUnlocked} onUnlock={() => setCtaUnlocked(true)} />
        </div>
        <a href="#trajetoria" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600 lg:flex">Conheça minha história<ArrowDown className="size-4 animate-bounce" aria-hidden="true" /></a>
      </section>

      <section id="trajetoria" className="relative border-y border-violet-200/10 bg-[#0d0c10]/58 px-5 py-24 backdrop-blur-[1px] sm:px-8 lg:px-14 lg:py-40">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal><StoryPhotoGallery /></Reveal>
          <Reveal>
            <SectionHeader index="01" eyebrow="Minha história" title="Antes do digital, a minha realidade era completamente diferente." />
            <div className="mt-8 space-y-5 text-base leading-8 text-stone-400">
              <p>Antes de viver do digital, eu trabalhava como porteiro. Quando entrei nesse mercado, comecei a entender como funcionavam os produtos digitais, os anúncios e toda a estrutura por trás de uma operação de vendas online.</p>
              <p>Foi no Low Ticket que encontrei o modelo que mais fez sentido para mim. A barreira de entrada é muito baixa quando comparada a outros modelos de negócio, e você não precisa começar com uma grande estrutura ou investimento alto.</p>
              <p>Com o conhecimento certo, uma oferta bem montada e uma estrutura organizada, é possível criar uma operação que vende de forma automática, sem precisar estar presente em cada venda.</p>
              <p>Foi esse modelo que me mostrou que é possível construir uma operação simples, escalável e previsível no digital.</p>
              <p>Foi no Low Ticket que encontrei o meu principal modelo. Com essa estrutura, ultrapassei <strong className="font-semibold text-stone-100">R$ 1 milhão faturado na internet</strong>.</p>
              <p><strong className="font-semibold text-amber-300">Foi isso que mudou a minha trajetória no digital.</strong></p>
            </div>
            <div className="mt-9"><CTAButton unlocked={ctaUnlocked} /></div>
          </Reveal>
        </div>
        <Reveal className="mx-auto mt-16 max-w-[1320px] lg:mt-24">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
            {[['Antes', 'Porteiro', 'Eu ainda não tinha fama, grande estrutura ou conhecimento avançado.'], ['Processo', 'Mercado digital', 'Eu aprendi, apliquei e comecei a construir uma operação.'], ['Trajetória', '+ R$ 1 milhão', '1 milhão faturado']].map(([label, title, text], index) => (
              <div key={label} className="contents">
                <article className={`rounded-3xl border p-7 sm:p-9 ${index === 2 ? 'border-amber-400/35 bg-amber-400/[0.07]' : 'border-white/10 bg-white/[0.025]'}`}><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-500">{label}</p><h3 className={`mt-7 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl ${index === 2 ? 'text-amber-300' : 'text-stone-100'}`}>{title}</h3><p className="mt-4 text-sm leading-6 text-stone-400">{text}</p></article>
                {index < 2 && <div className="grid place-items-center py-2 text-stone-600 lg:px-2"><ArrowRight className="hidden size-5 lg:block" aria-hidden="true" /><ArrowDown className="size-5 lg:hidden" aria-hidden="true" /></div>}
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      </IntroExperience>

      <section id="provas" className="px-5 py-24 sm:px-8 lg:px-14 lg:py-40">
        <Reveal className="mx-auto max-w-[1320px]">
          <SectionHeader index="02" eyebrow="Resultados dos alunos" title="O conhecimento não ficou só comigo." text="Essa foi a minha transformação. Mas o mais importante é que esse conhecimento também está sendo colocado em prática por alunos." />
          <div className="proof-scroll -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {socialProofs.map((proof, index) => (
              <figure key={proof.src} className="group min-w-[82vw] snap-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2.5 sm:min-w-0 sm:rounded-[2rem] sm:p-3">
                <div className="overflow-hidden rounded-[1.25rem] bg-black sm:rounded-[1.5rem]">
                  <img src={proof.src} alt={proof.alt} width={proof.width} height={proof.height} loading="lazy" decoding="async" className="h-auto w-full transition duration-500 group-hover:scale-[1.01]" />
                </div>
                <figcaption className="flex items-center justify-between gap-3 px-3 pb-2 pt-4 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-stone-500 sm:text-[9px]"><span>Prova real 0{index + 1}</span><span className="text-amber-300">Aluno</span></figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-5 text-stone-600">Os registros foram compartilhados por alunos e não representam promessa ou garantia de resultados individuais.</p>
        </Reveal>
      </section>

      <section className="method-lines px-5 py-24 sm:px-8 lg:px-14 lg:py-40">
        <Reveal className="mx-auto max-w-[1320px]">
          <SectionHeader index="03" eyebrow="O método" title="O método vai muito além de colocar um produto barato na internet." text="Eu organizo uma operação de low ticket em etapas. Cada uma prepara a próxima — e os dados ajudam a orientar o caminho." />
          <div className="mt-16 border-y border-white/10">
            {c.method.map((step, index) => (
              <article key={step.title} className="group grid gap-4 border-b border-white/10 py-7 last:border-b-0 sm:grid-cols-[90px_1fr_1.15fr_auto] sm:items-center sm:gap-7 sm:py-8">
                <span className="font-mono text-xs text-amber-400/70">0{index + 1}</span><h3 className="text-2xl font-extrabold tracking-tight text-stone-100 sm:text-3xl">{step.title}</h3><p className="text-sm leading-6 text-stone-500">{step.text}</p><span className="grid size-10 place-items-center rounded-full border border-white/10 text-stone-600 transition group-hover:border-amber-400/40 group-hover:text-amber-300"><ArrowRight className="size-4" aria-hidden="true" /></span>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-[#e8e1d4] px-5 py-24 text-stone-950 sm:px-8 lg:px-14 lg:py-36">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="max-w-4xl"><p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">04 / Os benefícios</p><h2 className="text-[clamp(2.5rem,6vw,6.2rem)] font-extrabold leading-[0.94] tracking-[-0.06em]">Por que produtos <span className="text-amber-700">Low Ticket?</span></h2><p className="mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">Produtos digitais de entrada possuem valores mais acessíveis e podem reduzir a barreira inicial de compra. Não é dinheiro fácil: é uma forma de estruturar uma oferta simples e aprender com o mercado.</p></div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.lowTicketBenefits.map((item, index) => { const Icon = benefitIcons[index]; return <article key={item.title} className="group min-h-64 rounded-3xl border border-stone-950/10 bg-white/35 p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/60 sm:p-8"><span className="grid size-12 place-items-center rounded-2xl bg-stone-950 text-amber-300"><Icon className="size-5" aria-hidden="true" /></span><p className="mt-9 font-mono text-[9px] uppercase tracking-[0.18em] text-stone-500">0{index + 1}</p><h3 className="mt-2 text-2xl font-extrabold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-stone-600">{item.text}</p></article>; })}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-white/8 bg-[#0d0d0c] px-5 py-24 sm:px-8 lg:px-14 lg:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
          <Reveal>
            <SectionHeader index="05" eyebrow="Para quem é" title="Esse modelo pode fazer sentido para você se…" />
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {c.audience.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-5"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-amber-400/12 text-amber-300"><Check className="size-3.5" aria-hidden="true" /></span><p className="text-sm leading-6 text-stone-300">{item}</p></div>)}
            </div>
            <div className="mt-9"><CTAButton label="Quero me inscrever" unlocked={ctaUnlocked} /></div>
          </Reveal>
          <Reveal className="lg:pt-24">
            <div className="rounded-[2rem] border border-red-300/10 bg-red-400/[0.035] p-7 sm:p-9"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-300/70">Transparência</p><h3 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-100">Talvez não seja para você se…</h3><div className="mt-7 space-y-4">{c.notFor.map((item) => <div key={item} className="flex gap-3"><X className="mt-0.5 size-4 shrink-0 text-red-300/60" aria-hidden="true" /><p className="text-sm leading-6 text-stone-500">{item}</p></div>)}</div></div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-amber-400 px-5 py-24 text-stone-950 sm:px-8 lg:px-14 lg:py-36">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <Reveal className="relative mx-auto max-w-[1320px]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-800/60">06 / Autoridade construída</p><h2 className="mt-4 max-w-4xl text-[clamp(2.3rem,5vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.055em]">Do meu ponto de partida aos primeiros sete dígitos.</h2>
          <div className="mt-12"><AnimatedRevenue /></div><p className="mt-6 max-w-2xl text-base font-medium leading-7 text-stone-800/75">Construídos ao longo da minha trajetória no mercado digital.</p><p className="mt-10 max-w-3xl border-l border-stone-950/30 pl-4 text-xs leading-5 text-stone-800/70">Esse resultado se refere à minha trajetória e não representa garantia de ganhos ou resultados individuais.</p>
        </Reveal>
      </section>

      <section className="border-y border-white/8 bg-[#0d0d0c] px-5 py-24 sm:px-8 lg:px-14 lg:py-36">
        <Reveal className="mx-auto max-w-[1320px]">
          <SectionHeader index="07" eyebrow="Conteúdo provisório" title="O caminho, organizado passo a passo." text="Os nomes abaixo são provisórios e ficam centralizados no arquivo de conteúdo para substituição pelos módulos reais." />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {c.modules.map((module, index) => <article key={module.number} className={`relative overflow-hidden rounded-3xl border p-7 sm:p-8 ${index === 6 ? 'border-amber-400/30 bg-amber-400/[0.07] lg:col-span-3' : 'border-white/10 bg-white/[0.025]'}`}><span className="font-mono text-xs text-amber-300">Módulo {module.number}</span><h3 className="mt-12 max-w-sm text-2xl font-extrabold leading-tight tracking-[-0.035em] text-stone-100">{module.title}</h3><Layers3 className="absolute -bottom-5 -right-4 size-28 text-white/[0.035]" aria-hidden="true" /></article>)}
          </div>
        </Reveal>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-40">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
          <Reveal><SectionHeader index="08" eyebrow="O diferencial" title="Aprenda comigo: eu continuo no jogo." text="O conteúdo nasce da experiência prática que construí operando no mercado digital e utilizando o modelo low ticket no meu próprio negócio." /><div className="mt-9 flex gap-4 border-l border-amber-400/50 pl-5"><Sparkles className="mt-1 size-5 shrink-0 text-amber-300" aria-hidden="true" /><p className="max-w-lg text-sm leading-7 text-stone-400">O que compartilho vem do conhecimento que adquiri na prática ao longo da minha trajetória, organizado para ser compreendido e aplicado.</p></div></Reveal>
          <Reveal>
            <figure className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#11110f] shadow-[0_32px_90px_rgba(0,0,0,0.35)]">
              <img src="/images/wesley-authority.jpg" alt="Wesley Rodrigues" width={1440} height={1800} loading="lazy" decoding="async" className="size-full object-cover object-center transition duration-700 group-hover:scale-[1.02]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8"><p className="text-lg font-extrabold text-white sm:text-xl">Wesley Rodrigues</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-amber-300">Low Ticket na Prática</p></figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e8e1d4] px-5 py-24 text-stone-950 sm:px-8 lg:px-14 lg:py-36">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="max-w-4xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">09 / Clareza antes da escala</p><h2 className="mt-5 text-[clamp(2.3rem,5vw,5.2rem)] font-extrabold leading-[0.96] tracking-[-0.055em]">O que muda quando existe um caminho.</h2></div>
          <div className="mt-14 grid overflow-hidden rounded-[2rem] border border-stone-950/10 lg:grid-cols-2">
            <div className="bg-stone-950 p-7 text-stone-50 sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-300">Antes</p><div className="mt-8 space-y-5">{c.journey.before.map((item) => <div key={item} className="flex gap-3 border-b border-white/10 pb-5 last:border-b-0"><X className="mt-1 size-4 shrink-0 text-red-300/70" aria-hidden="true" /><p className="text-sm leading-6 text-stone-400">{item}</p></div>)}</div></div>
            <div className="bg-white/45 p-7 sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-700">Depois do conhecimento</p><div className="mt-8 space-y-5">{c.journey.after.map((item) => <div key={item} className="flex gap-3 border-b border-stone-950/10 pb-5 last:border-b-0"><Check className="mt-1 size-4 shrink-0 text-amber-700" aria-hidden="true" /><p className="text-sm font-medium leading-6 text-stone-700">{item}</p></div>)}</div></div>
          </div>
          <p className="mt-5 text-xs leading-5 text-stone-500">A comparação descreve aprendizado e organização — não promessa de faturamento.</p>
        </Reveal>
      </section>

      <section id="oferta" className="offer-glow px-5 py-24 sm:px-8 lg:px-14 lg:py-40">
        <Reveal className="mx-auto max-w-[1180px]">
          <div className="overflow-hidden rounded-[2.25rem] border border-amber-400/25 bg-[#11110f] shadow-[0_50px_140px_rgba(0,0,0,0.5)]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b border-white/10 p-7 sm:p-12 lg:border-b-0 lg:border-r lg:p-16"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">10 / A oferta</p><h2 className="mt-5 text-[clamp(2.7rem,6vw,6rem)] font-extrabold leading-[0.91] tracking-[-0.06em] text-stone-50">Comece sua jornada no <span className="text-amber-400">Low Ticket.</span></h2><p className="mt-7 max-w-xl text-base leading-7 text-stone-400">Eu organizei uma estrutura pensada para transformar conceitos soltos em um processo mais claro de produto, oferta, aquisição e otimização.</p><div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">Nome do treinamento</p><p className="mt-2 text-xl font-bold text-stone-300">{c.offer.name}</p></div></div>
              <div className="bg-amber-400 p-7 text-stone-950 sm:p-12 lg:p-14"><p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-stone-800/60">Investimento</p><p className="mt-3 text-[clamp(2.4rem,5vw,4.8rem)] font-extrabold leading-none tracking-[-0.06em]">{c.offer.price}</p><p className="mt-3 text-xs font-semibold text-stone-800/65">{c.offer.payment}</p><div className="my-8 h-px bg-stone-950/15" /><ul className="space-y-4">{c.offer.items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3 text-sm font-semibold"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-stone-950 text-amber-300"><Check className="size-3" aria-hidden="true" /></span>{item}</li>)}</ul><div className="mt-10"><CTAButton label="Quero me inscrever" light unlocked={ctaUnlocked} /></div><p className="mt-5 text-center text-[10px] leading-4 text-stone-800/65">Pagamento seguro via PIX ou cartão de crédito.</p></div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative overflow-hidden border-y border-amber-400/20 bg-amber-400 px-5 py-24 text-stone-950 sm:px-8 lg:px-14 lg:py-36">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_60%_50%,rgba(255,255,255,0.25),transparent_55%)]" />
        <Reveal className="relative mx-auto max-w-[1100px] text-center"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-800/60">11 / O próximo passo</p><h2 className="mx-auto mt-5 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.07em]">Todo resultado começa de algum lugar.</h2><p className="mx-auto mt-7 max-w-2xl text-base font-medium leading-7 text-stone-800/75 sm:text-lg sm:leading-8">Eu também tive um ponto de partida. Antes dos sete dígitos, tomei a decisão de começar e aprender uma nova habilidade.</p><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-800/65">Se você quer conhecer a estratégia que faz parte da minha trajetória, o próximo passo está aqui.</p><div className="mt-9"><CTAButton light unlocked={ctaUnlocked} /></div></Reveal>
      </section>

      <footer className="border-t border-white/10 bg-[#070707] px-5 py-12 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between"><div><span className="grid size-11 place-items-center rounded-full border border-amber-400/40 font-mono text-xs font-bold text-amber-300">{c.brand.initials}</span><p className="mt-4 text-lg font-extrabold text-stone-100">{c.brand.name}</p><a href={c.brand.instagramUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-amber-300"><AtSign className="size-4" aria-hidden="true" />{c.brand.instagramLabel}</a></div><nav aria-label="Links legais" className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-stone-500"><a href={c.links.terms} className="hover:text-stone-200">Termos de Uso</a><a href={c.links.privacy} className="hover:text-stone-200">Política de Privacidade</a><a href={c.links.contact} className="hover:text-stone-200">Contato</a></nav></div>
          <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-4xl text-[10px] leading-5 text-stone-600">{c.disclaimer}</p><p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-stone-700">© {new Date().getFullYear()} Wesley Rodrigues</p></div>
        </div>
      </footer>
    </main>
  );
}
