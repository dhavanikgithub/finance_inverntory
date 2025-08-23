import { ReactNode } from "react";
import { Section } from "../Section";
import Footer from "./Footer";

interface MainContentProps {
    children: ReactNode; // Typing the children prop
}

export default function MainContent ({ children }: MainContentProps ){
    return (
        <div id="main-content" className="main-content">
            <main>
                <div className="main-content-section">
                    <Section>
                        {children}
                    </Section>
                </div>
            </main>
            <Footer />
        </div>
    );
}   