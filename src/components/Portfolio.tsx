"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
    {
        title: "Οφθαλμίατρος Γκοντόλιας",
        category: "Health Sector",
        url: "https://ofthalmiatros-chania.gr/",
        image: "/screenshots/ofthalmiatros.png",
    },
    {
        title: "Med Oncology",
        category: "Health Sector",
        url: "https://med-oncology.gr/",
        image: "/screenshots/med-oncology.png",
    },
    {
        title: "Ρευματολόγος Γκόνη",
        category: "Health Sector",
        url: "https://gkoni-revmatologos.gr/",
        image: "/screenshots/gkoni.png",
    },
    {
        title: "Auto Frigo Trans",
        category: "Transport / Industrial",
        url: "https://autofrigotransltd.gr/",
        image: "/screenshots/autofrigo.png",
    },
    {
        title: "Master Frigo",
        category: "Transport / Industrial",
        url: "https://www.masterfrigo.gr/",
        image: "/screenshots/masterfrigo.png",
    },
    {
        title: "Mag Frigo",
        category: "Transport / Industrial",
        url: "https://magfrigo.gr/",
        image: "/screenshots/magfrigo.png",
    },
];

export default function Portfolio() {
    return (
        <section id="portfolio" className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <Badge className="mb-4" variant="secondary">Our Work</Badge>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                        Πρόσφατα Έργα
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Δείγματα δουλειάς που συνδυάζουν αισθητική, ταχύτητα και αποτελεσματικότητα.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50"
                        >
                            {/* Image Container with Overlay */}
                            <div className="relative h-64 w-full overflow-hidden bg-muted">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Floating Action Button */}
                                <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                                    <div className="bg-white/90 dark:bg-slate-900/90 p-2 rounded-full shadow-lg backdrop-blur-sm">
                                        <ArrowUpRight className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 relative">
                                <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{project.category}</p>
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <div className="h-px w-full bg-border my-4 group-hover:bg-primary/20 transition-colors" />
                                <Button size="sm" variant="ghost" className="w-full group-hover:text-primary group-hover:bg-primary/5 transition-all justify-between" asChild>
                                    <Link href={project.url} target="_blank" rel="noopener noreferrer">
                                        Επίσκεψη Ιστοσελίδας <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
