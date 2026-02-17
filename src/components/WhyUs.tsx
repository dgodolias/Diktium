"use client";

import { ShieldCheck, Zap, HeartHandshake, Lock } from "lucide-react";

const reasons = [
    {
        icon: Zap,
        title: "Μοντέρνος Σχεδιασμός",
        description: "Ιστοσελίδες που εντυπωσιάζουν τους πελάτες σας. Σύγχρονη αισθητική, responsive design και animations που κάνουν τη διαφορά.",
    },
    {
        icon: Lock,
        title: "Ταχύτητα & Ασφάλεια",
        description: "Φιλοξενία σε ταχύτατους servers με SSL πιστοποιητικά ασφαλείας. Η ιστοσελίδα σας θα 'πετάει' και θα είναι απόλυτα ασφαλής.",
    },
    {
        icon: ShieldCheck,
        title: "Συμμόρφωση ΓΕΜΗ",
        description: "Πληρούμε όλες τις προδιαγραφές που απαιτεί η νομοθεσία για τις ΙΚΕ. Αποφύγετε τα πρόστιμα εύκολα και γρήγορα.",
    },
    {
        icon: HeartHandshake,
        title: "Προσωπική Υποστήριξη",
        description: "Δεν είστε απλά ένας αριθμός. Σηκώνουμε το τηλέφωνο και λύνουμε κάθε απορία σας άμεσα. Είμαστε συνεργάτες, όχι απλοί πάροχοι.",
    },
];

export default function WhyUs() {
    return (
        <section id="why-us" className="py-20 md:py-32 relative z-10">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-6">
                            Γιατί να επιλέξετε την Diktium;
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Η ψηφιακή παρουσία δεν είναι πλέον πολυτέλεια, αλλά αναγκαιότητα. Κάθε επιχείρηση αξίζει μια ιστοσελίδα που εντυπωσιάζει.
                        </p>
                        <p className="text-lg text-muted-foreground mb-8">
                            Δημιουργούμε ιστοσελίδες που κερδίζουν πελάτες — και παράλληλα εξασφαλίζουν πλήρη συμμόρφωση με το ΓΕΜΗ. Απλά, γρήγορα και οικονομικά.
                        </p>
                    </div>

                    <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {reasons.map((reason, index) => (
                            <div key={index} className="p-6 rounded-xl bg-secondary/30 border border-secondary hover:bg-secondary/50 transition-colors">
                                <reason.icon className="h-10 w-10 text-accent mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">{reason.title}</h3>
                                <p className="text-sm text-muted-foreground">{reason.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
