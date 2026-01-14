"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-20 md:py-32">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                        Επικοινωνήστε Μαζί μας
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Είστε έτοιμοι να αναβαθμίσετε την επιχείρησή σας; Συμπληρώστε τη φόρμα ή καλέστε μας.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-foreground">Στοιχεία Επικοινωνίας</h3>
                        <p className="text-muted-foreground">
                            Είμαστε εδώ για να απαντήσουμε σε κάθε ερώτηση σχετικά με την κατασκευή της ιστοσελίδας σας και τη συμμόρφωση με το ΓΕΜΗ.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-accent mt-1" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Email</h4>
                                    <a href="mailto:info@diktium.gr" className="text-muted-foreground hover:text-primary">info@diktium.gr</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-accent mt-1" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Τηλέφωνο</h4>
                                    <p className="text-muted-foreground">+30 210 1234567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-accent mt-1" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Διεύθυνση</h4>
                                    <p className="text-muted-foreground">Αθήνα, Ελλάδα</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <Card className="shadow-lg border-border bg-background/40 backdrop-blur-md">
                        <CardContent className="p-8">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Όνομα</Label>
                                        <Input id="name" placeholder="Το όνομά σας" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Τηλέφωνο</Label>
                                        <Input id="phone" placeholder="+30 69..." type="tel" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder="example@company.com" type="email" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company">Επωνυμία Επιχείρησης</Label>
                                    <Input id="company" placeholder="Η επωνυμία της επιχείρησής σας" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Μήνυμα</Label>
                                    <Textarea id="message" placeholder="Πείτε μας πώς μπορούμε να βοηθήσουμε..." className="min-h-[120px]" />
                                </div>

                                <Button type="submit" className="w-full text-lg h-12">Αποστολή Μηνύματος</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
