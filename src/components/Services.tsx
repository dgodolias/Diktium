"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Sparkles, Building2, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Plan = {
    name: string;
    price: string;
    annual: string;
    description: string;
    popular?: boolean;
    features: string[];
    icon: React.ReactNode;
    tier: "ike" | "business";
};

const businessPlans: Plan[] = [
    {
        name: "Business",
        price: "390",
        annual: "160",
        description: "Επαγγελματική παρουσία που εμπνέει εμπιστοσύνη",
        tier: "business",
        icon: <Building2 className="h-5 w-5" />,
        features: [
            "AI-Powered Σχεδιασμός",
            "Responsive Design",
            "SSL Πιστοποιητικό",
            "SEO Optimization",
            "AI Web Optimization",
            "Google Maps Integration",
            "Φόρμα Επικοινωνίας",
            "Social Media Διασύνδεση",
            "Φιλοξενία & Domain",
            "Τεχνική Υποστήριξη",
        ],
    },
    {
        name: "Premium",
        price: "590",
        annual: "190",
        description: "Ολοκληρωμένη λύση που δουλεύει για εσάς 24/7",
        popular: true,
        tier: "business",
        icon: <Globe className="h-5 w-5" />,
        features: [
            "Όλα τα Business +",
            "AI Content & Design Proposals",
            "AI Search Optimization (GEO)",
            "Blog / Νέα Section",
            "Email Marketing Setup",
            "Analytics & Reporting",
            "Priority Support",
            "Σύστημα Κρατήσεων ή E-shop",
            "Speed & Performance Optimization",
        ],
    },
];

const ikePlans: Plan[] = [
    {
        name: "Βασικό",
        price: "80",
        annual: "80",
        description: "Συμμόρφωση χωρίς περιττά έξοδα",
        tier: "ike",
        icon: <Shield className="h-5 w-5" />,
        features: [
            "Πλήρης Συμμόρφωση ΓΕΜΗ",
            "Responsive Design",
            "SSL Πιστοποιητικό",
            "Βασικά Στοιχεία Επιχείρησης",
            "Φιλοξενία & Domain",
            "Basic SEO",
        ],
    },
    {
        name: "Pro",
        price: "120",
        annual: "120",
        description: "Η υποχρέωση γίνεται ανταγωνιστικό πλεονέκτημα",
        popular: true,
        tier: "ike",
        icon: <Sparkles className="h-5 w-5" />,
        features: [
            "Όλα τα Βασικά +",
            "Μοντέρνος Custom Σχεδιασμός",
            "Advanced SEO",
            "GEO — AI Search Optimization",
            "Google Maps Integration",
            "Social Media Links",
            "Analytics Dashboard",
            "Μηνιαία Υποστήριξη",
        ],
    },
];

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
    const isBusiness = plan.tier === "business";
    const isPremium = isBusiness && plan.popular;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex"
        >
            {/* Gradient border wrapper for business tier */}
            <div className={cn(
                "flex w-full rounded-xl",
                isPremium && "p-[1px] bg-gradient-to-br from-amber-400/70 via-amber-500/30 to-accent/40",
                isBusiness && !plan.popular && "p-[1px] bg-gradient-to-br from-accent/60 via-accent/20 to-primary/40",
            )}>
                <Card
                    className={cn(
                        "relative flex flex-col w-full transition-all duration-300",
                        // Premium (business popular)
                        isPremium && "bg-background/70 backdrop-blur-md border-transparent shadow-2xl shadow-amber-500/10 scale-[1.04]",
                        // Business (non-popular)
                        isBusiness && !plan.popular && "bg-background/70 backdrop-blur-md border-transparent shadow-lg",
                        // IKE tier
                        !isBusiness && plan.popular && "border-accent shadow-xl shadow-accent/10 scale-[1.02] bg-background/60 backdrop-blur-md",
                        !isBusiness && !plan.popular && "border-border shadow-sm bg-background/40 backdrop-blur-sm hover:shadow-lg hover:border-accent/30",
                    )}
                >
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            {isPremium ? (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 px-4 py-1 text-xs font-bold tracking-wider">
                                    ΚΟΡΥΦΑΙΑ ΕΠΙΛΟΓΗ
                                </Badge>
                            ) : (
                                <Badge className="bg-accent text-accent-foreground shadow-lg shadow-accent/20 px-4 py-1 text-xs font-bold tracking-wider">
                                    ΔΗΜΟΦΙΛΕΣ
                                </Badge>
                            )}
                        </div>
                    )}

                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn(
                                "p-2 rounded-lg",
                                isBusiness && plan.popular && "bg-amber-500/15 text-amber-500",
                                isBusiness && !plan.popular && "bg-accent/15 text-accent",
                                !isBusiness && plan.popular && "bg-accent/15 text-accent",
                                !isBusiness && !plan.popular && "bg-primary/10 text-primary",
                            )}>
                                {plan.icon}
                            </div>
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            {isBusiness && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-accent/40 text-accent font-medium">
                                    AI
                                </Badge>
                            )}
                        </div>
                        <CardDescription className="text-sm font-medium text-foreground/70">
                            {plan.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                        <div className="mb-2">
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold tracking-tight">
                                    €{plan.price}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">εφάπαξ κατασκευή</p>
                        </div>

                        <div className="text-sm text-muted-foreground mb-6 p-2.5 bg-secondary/60 rounded-lg text-center font-medium">
                            + €{plan.annual}/χρόνο φιλοξενία & συντήρηση
                        </div>

                        <ul className="space-y-3 text-sm">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2.5">
                                    <Check className={cn(
                                        "h-4 w-4 mt-0.5 shrink-0",
                                        (feature.includes("GEO") || feature.includes("AI")) ? "text-amber-500" : "text-accent"
                                    )} />
                                    <span className={cn(
                                        (feature.includes("GEO") || feature.includes("AI"))
                                            ? "text-foreground font-semibold"
                                            : "text-muted-foreground"
                                    )}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>

                    <CardFooter className="pt-4">
                        <Button
                            className={cn(
                                "w-full h-11 text-base font-semibold",
                                isPremium && "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20",
                                plan.popular && !isPremium && "bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20",
                                isBusiness && !plan.popular && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md",
                            )}
                            variant={plan.popular || isBusiness ? "default" : "outline"}
                            asChild
                        >
                            <Link href="#contact">Ξεκινήστε Τώρα</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    );
}

export default function Services() {
    return (
        <section id="services" className="py-20 md:py-32">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                        Υπηρεσίες & Τιμοκατάλογος
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Ξεκάθαρες τιμές, χωρίς κρυφά κόστη. Επιλέξτε αυτό που ταιριάζει στην επιχείρησή σας.
                    </p>
                </div>

                {/* Ιστοσελίδες ΙΚΕ */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className="h-px w-8 bg-accent/50" />
                            <h3 className="text-2xl font-bold text-primary">Ιστοσελίδες ΙΚΕ</h3>
                            <div className="h-px w-8 bg-accent/50" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Νομική υποχρέωση; Εμείς την κάνουμε ευκαιρία.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {ikePlans.map((plan, index) => (
                            <PlanCard key={plan.name} plan={plan} index={index} />
                        ))}
                    </div>
                </div>

                {/* Section divider */}
                <div className="max-w-lg mx-auto my-8 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
                    <Sparkles className="h-4 w-4 text-accent/40" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
                </div>

                {/* Επαγγελματικές Ιστοσελίδες */}
                <div className="max-w-4xl mx-auto relative">
                    {/* Subtle gradient glow behind the section */}
                    <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-b from-accent/[0.03] via-accent/[0.06] to-transparent -z-10" />

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent/50" />
                            <h3 className="text-2xl font-bold text-primary">Επαγγελματικές Ιστοσελίδες</h3>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/50" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Σχεδιασμένες με AI · Βελτιστοποιημένες για AI Search
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {businessPlans.map((plan, index) => (
                            <PlanCard key={plan.name} plan={plan} index={index} />
                        ))}
                    </div>
                </div>

                {/* Trust note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs text-muted-foreground mt-12"
                >
                    Όλα τα πακέτα περιλαμβάνουν SSL, responsive design και τεχνική υποστήριξη.
                </motion.p>
            </div>
        </section>
    );
}
