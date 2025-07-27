import { Github } from "lucide-react";

export default function Footer() {

    return (
        <footer className="footer">
            <ul className="footer-list">
                <li><a href="#" className="footer-item">Terms and conditions</a></li>
                <li><a href="#" className="footer-item">Privacy Policy</a></li>
                <li><a href="#" className="footer-item">Licensing</a></li>
                <li><a href="#" className="footer-item">Cookie Policy</a></li>
                <li><a href="#" className="footer-item">Contact</a></li>
            </ul>
            <div className="footer-social-links">
                <a
                    href="https://github.com/dhavanikgithub/finance_inverntory"
                    className="footer-social-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github className="h-5 w-5" />
                </a>
            </div>
        </footer>
    )
}