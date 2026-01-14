"use client";

import Link from "next/link";
import { Zap, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground py-12 md:py-16">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="bg-primary-foreground p-1.5 rounded-lg">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-primary-foreground">
                                Diktium
                            </span>
                        </Link>
                        <p className="text-primary-foreground/70 max-w-xs leading-relaxed">
                            Σύγχρονες λύσεις web development για την ελληνική αγορά.
                            Συμμόρφωση ΓΕΜΗ, ταχύτητα, και αισθητική που ξεχωρίζει.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4">Υπηρεσίες</h4>
                        <ul className="space-y-2 text-primary-foreground/70">
                            <li><Link href="#services" className="hover:text-primary-foreground transition-colors">Κατασκευή Ιστοσελίδων</Link></li>
                            <li><Link href="#services" className="hover:text-primary-foreground transition-colors">E-shop</Link></li>
                            <li><Link href="#services" className="hover:text-primary-foreground transition-colors">Συντήρηση & Support</Link></li>
                            <li><Link href="#why-us" className="hover:text-primary-foreground transition-colors">Συμμόρφωση ΓΕΜΗ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4">Επικοινωνία</h4>
                        <ul className="space-y-2 text-primary-foreground/70">
                            <li><a href="mailto:info@diktium.gr" className="hover:text-primary-foreground transition-colors">info@diktium.gr</a></li>
                            <li><a href="tel:+302101234567" className="hover:text-primary-foreground transition-colors">+30 210 1234567</a></li>
                            <li>
                                <div className="flex gap-4 mt-4">
                                    <a href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
                                    <a href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
                                    <a href="#" className="hover:text-accent transition-colors"><Linkedin className="h-5 w-5" /></a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-primary-foreground/50">
                    <p>© {new Date().getFullYear()} Diktium. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-primary-foreground">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary-foreground">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
