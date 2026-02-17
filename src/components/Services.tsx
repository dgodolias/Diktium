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

type Plan = {
    name: string;
    price: string;
    annual: string;
    description: string;
    popular?: boolean;
    features: string[];
    icon: React.ReactNode;
};

const businessPlans: Plan[] = [
    {
        name: "Business",
        price: "390",
        annual: "160",
        description: "Επαγγελματική παρουσία που εμπνέει εμπιστοσύνη",
        icon: <Building2 className="h-5 w-5" />,
        features: [
            "Custom Σχεδιασμός",
            "Responsive Design",
            "SSL Πιστοποιητικό",
            "SEO Optimization",
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
        icon: <Globe className="h-5 w-5" />,
        features: [
            "Όλα τα Business +",
            "Advanced SEO & GEO",
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex"
        >
            <Card
                className={`relative flex flex-col w-full transition-all duration-300 ${
                    plan.popular
                        ? "border-accent shadow-xl shadow-accent/10 scale-[1.02] bg-background/60 backdrop-blur-md"
                        : "border-border shadow-sm bg-background/40 backdrop-blur-sm hover:shadow-lg hover:border-accent/30"
                }`}
            >
                {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-accent text-accent-foreground shadow-lg shadow-accent/20 px-4 py-1 text-xs font-bold tracking-wider">
                            ΔΗΜΟΦΙΛΕΣ
                        </Badge>
                    </div>
                )}

                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${plan.popular ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>
                            {plan.icon}
                        </div>
                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm font-medium text-foreground/70">
                        {plan.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                    <div className="mb-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-extrabold tracking-tight">€{plan.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">εφάπαξ κατασκευή</p>
                    </div>

                    <div className="text-sm text-muted-foreground mb-6 p-2.5 bg-secondary/60 rounded-lg text-center font-medium">
                        + €{plan.annual}/χρόνο φιλοξενία & συντήρηση
                    </div>

                    <ul className="space-y-3 text-sm">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2.5">
                                <Check className={`h-4 w-4 mt-0.5 shrink-0 ${
                                    feature.includes("GEO") ? "text-amber-500" : "text-accent"
                                }`} />
                                <span className={`${
                                    feature.includes("GEO")
                                        ? "text-foreground font-semibold"
                                        : "text-muted-foreground"
                                }`}>
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>

                <CardFooter className="pt-4">
                    <Button
                        className={`w-full h-11 text-base font-semibold ${
                            plan.popular ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20" : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        asChild
                    >
                        <Link href="#contact">Ξεκινήστε Τώρα</Link>
                    </Button>
                </CardFooter>
            </Card>
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

                {/* Επαγγελματικές Ιστοσελίδες */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className="h-px w-8 bg-accent/50" />
                            <h3 className="text-2xl font-bold text-primary">Επαγγελματικές Ιστοσελίδες</h3>
                            <div className="h-px w-8 bg-accent/50" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Η online παρουσία που αξίζει η επιχείρησή σας.
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
