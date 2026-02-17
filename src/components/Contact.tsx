"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const contactMethods = [
    {
        icon: Mail,
        title: "Email",
        description: "Στείλτε μας email και θα απαντήσουμε εντός 24 ωρών.",
        info: "diktium@gmail.com",
        href: "mailto:diktium@gmail.com",
        cta: "Στείλτε Email",
    },
    {
        icon: Phone,
        title: "Τηλέφωνο",
        description: "Καλέστε μας για άμεση εξυπηρέτηση.",
        info: ["+30 698 290 4056", "+30 696 907 5196"],
        href: "tel:+306982904056",
        cta: "Καλέστε μας",
    },
    {
        icon: MapPin,
        title: "Τοποθεσία",
        description: "Εξυπηρετούμε επιχειρήσεις σε όλη την Ελλάδα.",
        info: "Αθήνα, Ελλάδα",
        href: null,
        cta: null,
    },
];

export default function Contact() {
    return (
        <section id="contact" className="py-20 md:py-32">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                        Επικοινωνήστε Μαζί μας
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Είστε έτοιμοι να αναβαθμίσετε την επιχείρησή σας; Επιλέξτε τον τρόπο που σας βολεύει.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                    {contactMethods.map((method, index) => (
                        <motion.div
                            key={method.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <Card className="h-full text-center border-border bg-background/40 backdrop-blur-md hover:shadow-lg hover:border-accent/30 transition-all duration-300">
                                <CardContent className="p-8 flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-accent/10">
                                        <method.icon className="h-8 w-8 text-accent" />
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground">{method.title}</h3>
                                    <p className="text-sm text-muted-foreground">{method.description}</p>

                                    <div className="text-foreground font-semibold">
                                        {Array.isArray(method.info) ? (
                                            method.info.map((item) => (
                                                <a
                                                    key={item}
                                                    href={`tel:${item.replace(/\s/g, "")}`}
                                                    className="block hover:text-accent transition-colors"
                                                >
                                                    {item}
                                                </a>
                                            ))
                                        ) : method.href ? (
                                            <a href={method.href} className="hover:text-accent transition-colors">
                                                {method.info}
                                            </a>
                                        ) : (
                                            <span>{method.info}</span>
                                        )}
                                    </div>

                                    {method.href && method.cta && (
                                        <Button variant="outline" className="mt-2" asChild>
                                            <a href={method.href}>
                                                {method.cta} <ArrowRight className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center p-10 rounded-2xl bg-secondary/40 border border-border/50 backdrop-blur-sm"
                >
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        Έτοιμοι να ξεκινήσετε;
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Πείτε μας τι χρειάζεστε και θα σας ετοιμάσουμε προσφορά εντός 24 ωρών.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-base shadow-lg" asChild>
                            <a href="mailto:diktium@gmail.com">
                                <Mail className="mr-2 h-4 w-4" /> Στείλτε Email
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                            <a href="tel:+306982904056">
                                <Phone className="mr-2 h-4 w-4" /> Καλέστε μας
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
