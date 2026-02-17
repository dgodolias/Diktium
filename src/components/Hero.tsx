"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 text-secondary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-secondary">
                        <span className="flex h-2 w-2 rounded-full bg-accent"></span>
                        Σύγχρονες Ιστοσελίδες για κάθε Επιχείρηση
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-6 max-w-4xl mx-auto leading-tight">
                        Κατασκευή Ιστοσελίδων για Επιχειρήσεις που θέλουν να <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ξεχωρίζουν</span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Μοντέρνος σχεδιασμός, SEO και πλήρης συμμόρφωση ΓΕΜΗ.
                        Δημιουργούμε την ψηφιακή εικόνα που αξίζει στην επιχείρησή σας.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all" asChild>
                            <Link href="#contact">
                                Ζητήστε Προσφορά <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
                            <Link href="#portfolio">
                                Δείτε Έργα μας
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span>Μοντέρνος Σχεδιασμός</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span>SEO Optimized</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span>Συμμόρφωση ΓΕΜΗ</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
