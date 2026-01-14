"use client";

import { ShieldCheck, Zap, HeartHandshake, Lock } from "lucide-react";

const reasons = [
    {
        icon: ShieldCheck,
        title: "Νομική Συμμόρφωση (ΓΕΜΗ)",
        description: "Οι ιστοσελίδες μας πληρούν όλες τις προδιαγραφές που απαιτεί η νέα νομοθεσία για τις επιχειρήσεις. Αποφύγετε τα πρόστιμα εύκολα και γρήγορα.",
    },
    {
        icon: Zap,
        title: "Ταχύτητα & Ασφάλεια",
        description: "Φιλοξενία σε ταχύτατους servers με SSL πιστοποιητικά ασφαλείας. Η ιστοσελίδα σας θα 'πετάει' και θα είναι απόλυτα ασφαλής.",
    },
    {
        icon: HeartHandshake,
        title: "Προσωπική Υποστήριξη",
        description: "Δεν είστε απλά ένας αριθμός. Σηκώνουμε το τηλέφωνο και λύνουμε κάθε απορία σας άμεσα. Είμαστε συνεργάτες, όχι απλοί πάροχοι.",
    },
    {
        icon: Lock,
        title: "Αξιοπιστία & Εγγύηση",
        description: "Με δεκάδες ευχαριστημένους πελάτες σε όλη την Ελλάδα, εγγυόμαστε το αποτέλεσμα και την καλή λειτουργία της ιστοσελίδας σας.",
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
                            Η ψηφιακή παρουσία δεν είναι πλέον πολυτέλεια, αλλά αναγκαιότητα. Και όχι μόνο λόγω νόμου.
                        </p>
                        <p className="text-lg text-muted-foreground mb-8">
                            <strong className="text-primary block mb-2">Μην ρισκάρετε πρόστιμα.</strong>
                            Η ιστοσελίδα σας είναι πλέον υποχρεωτική για τη δημοσίευση στοιχείων στο ΓΕΜΗ. Εμείς κάνουμε τη διαδικασία απλή, γρήγορη και οικονομική, χωρίς να θυσιάζουμε την ποιότητα.
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
