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
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Basic",
        price: "80",
        description: "Απλή Παρουσία",
        features: ["Συμμόρφωση ΓΕΜΗ", "Στοιχεία Επικοινωνίας", "Basic SEO", "Responsive Design", "Φιλοξενία & Domain"],
    },
    {
        name: "Pro",
        price: "100",
        description: "Επαγγελματική Λύση",
        popular: true,
        features: ["Custom Μοντέρνος Σχεδιασμός", "Blog / Νέα", "Advanced SEO", "Google Maps Integration", "Social Media Διασύνδεση", "Μηνιαία Υποστήριξη"],
    },
    {
        name: "Premium",
        price: "120",
        description: "Ολοκληρωμένη Εικόνα",
        features: ["Σύστημα Κρατήσεων", "E-shop Features (Basic)", "Priority Support", "Email Marketing Setup", "Αναλυτικά Statistics"],
    },
];

export default function Services() {
    return (
        <section id="services" className="py-20 md:py-32">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                        Υπηρεσίες & Κόστος
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Ξεκάθαρες χρεώσεις, χωρίς κρυφά κόστη. Επιλέξτε το πακέτο που ταιριάζει στις ανάγκες σας.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative flex flex-col ${plan.popular ? 'border-accent shadow-lg scale-105 z-10 bg-background/60 backdrop-blur-md' : 'border-border shadow-sm bg-background/40 backdrop-blur-sm'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mr-2 -mt-2 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-sm">
                                    POPULAR
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-base font-medium text-foreground/80">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold">€{plan.price}</span>
                                    <span className="text-muted-foreground ml-1">/μήνα</span>
                                </div>
                                {/* One time fee notice */}
                                <div className="text-xs text-muted-foreground mb-6 p-2 bg-secondary rounded-md text-center">
                                    + One-time Setup Fee
                                </div>

                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center">
                                            <Check className="h-4 w-4 text-accent mr-2 shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className={`w-full ${plan.popular ? 'bg-primary' : ''}`} variant={plan.popular ? 'default' : 'outline'} asChild>
                                    <Link href="#contact">Επιλογή</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
