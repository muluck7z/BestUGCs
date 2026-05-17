import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { playClickSound } from "@/lib/sound";
import { IconArrowRight, IconCrown, IconDiamond, IconLightning, IconShield, IconStar, IconTrophy } from "@/components/icons";

const ROBLOX_GROUP_URL = "https://www.roblox.com/communities/6148928275/BestUGCs#!/about";

const UGC_ITEMS_BASE = [
  { id: 139607718,  name: "Korblox Deathspeaker Right Leg", url: "https://www.roblox.com/catalog/139607718" },
  { id: 134082579,  name: "Classic Roblox Item",            url: "https://www.roblox.com/catalog/134082579" },
  { id: 21070012,   name: "Dominus Empyreus",               url: "https://www.roblox.com/catalog/21070012"  },
  { id: 494291269,  name: "Super Super Happy Face",         url: "https://www.roblox.com/catalog/494291269" },
  { id: 1365767,    name: "Valkyrie Helm",                  url: "https://www.roblox.com/catalog/1365767"   },
  { id: 4390891467, name: "Ice Valkyrie",                   url: "https://www.roblox.com/catalog/4390891467"},
];

export default function Home() {
  const handleCtaClick = () => {
    playClickSound();
    window.open(ROBLOX_GROUP_URL, "_blank");
  };

  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});

  useEffect(() => {
    const ids = UGC_ITEMS_BASE.map(i => i.id).join(",");
    fetch(`/api/roblox/thumbnails?ids=${ids}`)
      .then(r => r.json())
      .then(data => {
        const map: Record<number, string> = {};
        for (const entry of data.data ?? []) {
          if (entry.imageUrl) map[entry.targetId] = entry.imageUrl;
        }
        setThumbnails(map);
      })
      .catch(() => {});
  }, []);

  const ugcItems = UGC_ITEMS_BASE.map(item => ({
    ...item,
    src: thumbnails[item.id] ?? null,
  }));

  const features = [
    { icon: <IconDiamond className="w-8 h-8 text-primary" />, title: "Exclusive Drops", desc: "Get notified first when the most coveted items hit the marketplace." },
    { icon: <IconCrown className="w-8 h-8 text-primary" />, title: "Premium Curation", desc: "We only showcase the absolute highest quality UGC on Roblox." },
    { icon: <IconShield className="w-8 h-8 text-primary" />, title: "Verified Creators", desc: "Direct connections with the best 3D artists in the community." },
    { icon: <IconLightning className="w-8 h-8 text-primary" />, title: "Fast Alerts", desc: "Never miss a limited item with our instant community alerts." }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="bg-noise" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <IconCrown className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight">BestUGCs</span>
        </div>
        <button 
          onClick={handleCtaClick}
          className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform duration-200"
        >
          Join Group
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 relative flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <IconStar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">The Premier Roblox UGC Community</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            Elevate Your <br/>
            <span className="text-gradient-primary">Avatar Game</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Discover, collect, and flex the most incredible User Generated Content in the metaverse. Join thousands of passionate Roblox fashion enthusiasts.
          </p>
          
          <button 
            onClick={handleCtaClick}
            className="group relative inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(220,20,60,0.5)]"
          >
            Join BestUGCs Now
            <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 px-6 md:px-12 relative z-10 bg-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">Featured Collection</h2>
              <p className="text-muted-foreground text-lg max-w-xl">A curated selection of the most coveted items currently trending in our community.</p>
            </div>
            <button onClick={handleCtaClick} className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Items <IconArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {ugcItems.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={item.id}
                className="group relative rounded-2xl bg-card border border-white/10 overflow-hidden aspect-square flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                onMouseEnter={() => setHoveredImage(item.id)}
                onMouseLeave={() => setHoveredImage(null)}
                onClick={() => { playClickSound(); window.open(item.url, "_blank"); }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                {item.src ? (
                  <motion.img
                    src={item.src}
                    alt={item.name}
                    className="w-3/4 h-3/4 object-contain"
                    animate={{ scale: hoveredImage === item.id ? 1.1 : 1, y: hoveredImage === item.id ? -10 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <div className="w-3/4 h-3/4 rounded-xl bg-white/5 animate-pulse" />
                )}
                <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="font-bold text-xl">{item.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">View Details</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center"
            >
              <h3 className="text-6xl font-black text-white mb-2">50k+</h3>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Active Members</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-primary p-10 rounded-3xl text-center flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-20" />
              <h3 className="text-6xl font-black text-white mb-2 relative z-10">1000+</h3>
              <p className="text-white/80 font-medium uppercase tracking-widest text-sm relative z-10">Items Showcased</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center"
            >
              <h3 className="text-6xl font-black text-white mb-2">24/7</h3>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Community Activity</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 md:px-12 relative z-10 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Why Join BestUGCs?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We aren't just a group; we're a movement. Here is what you get when you become a member of the most exclusive UGC club.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-colors flex gap-6"
              >
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 md:px-12 relative z-10">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <IconTrophy className="w-16 h-16 text-primary mx-auto mb-8" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Ready to upgrade your inventory?</h2>
          <p className="text-xl text-muted-foreground mb-12">Join 50,000+ other players who are already dominating the metaverse with the best items.</p>
          <button 
            onClick={handleCtaClick}
            className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-all duration-300"
          >
            Join BestUGCs on Roblox
            <IconArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6 md:px-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-6">
          <IconCrown className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-lg text-white">BestUGCs</span>
        </div>
        <p className="text-sm">Not affiliated with Roblox Corporation. BestUGCs is a community group.</p>
      </footer>
    </div>
  );
}