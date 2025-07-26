'use client'
import { useEffect } from 'react';
import gsap from "gsap";
import PageNotFoundIconLight from '../components/404/PageNotFoundIconLight';
import PageNotFoundIconDark from '../components/404/PageNotFoundIconDark';
import { useTheme } from '@/context/ThemeContext';

export default function PageNotFound() {
    const { theme } = useTheme();
    useEffect(() => {
        gsap.set("svg", { visibility: "visible" });
        gsap.to("#headStripe", {
            y: 0.5,
            rotation: 1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            duration: 1
        });
        gsap.to("#spaceman", {
            y: 0.5,
            rotation: 1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            duration: 1
        });
        gsap.to("#craterSmall", {
            x: -3,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: "sine.inOut"
        });
        gsap.to("#craterBig", {
            x: 3,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: "sine.inOut"
        });
        gsap.to("#planet", {
            rotation: -2,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: "sine.inOut",
            transformOrigin: "50% 50%"
        });

        gsap.to("#starsBig g", {
            rotation: "random(-30,30)",
            transformOrigin: "50% 50%",
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
        gsap.fromTo(
            "#starsSmall g",
            { scale: 0, transformOrigin: "50% 50%" },
            { scale: 1, transformOrigin: "50% 50%", yoyo: true, repeat: -1, stagger: 0.1 }
        );
        gsap.to("#circlesSmall circle", {
            y: -4,
            yoyo: true,
            duration: 1,
            ease: "sine.inOut",
            repeat: -1
        });
        gsap.to("#circlesBig circle", {
            y: -2,
            yoyo: true,
            duration: 1,
            ease: "sine.inOut",
            repeat: -1
        });

        gsap.set("#glassShine", { x: -68 });

        gsap.to("#glassShine", {
            x: 80,
            duration: 2,
            rotation: -30,
            ease: "expo.inOut",
            transformOrigin: "50% 50%",
            repeat: -1,
            repeatDelay: 8,
            delay: 2
        });
    }, [])


    return (
        <main className="flex items-center justify-center min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row">

                    {/* SVG Column */}
                    <div className="md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
                        {theme === 'dark' ? (
                            <PageNotFoundIconDark />
                        ) : (
                            <PageNotFoundIconLight />
                        )}
                    </div>

                    {/* Text Column */}
                    <div className="md:w-1/2 flex flex-col justify-center">
                        <h1 className="text-6xl font-bold dark:text-white">404</h1>
                        <h2 className="text-2xl mt-4 font-semibold dark:text-white">UH OH! You're lost.</h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            The page you are looking for does not exist. How you got here is a mystery.
                            But you can click the button below to go back to the homepage.
                        </p>
                        <button className="btn-secondary-outline mt-2" onClick={() => window.location.href = '/'}>
                            HOME
                        </button>
                    </div>

                </div>
            </div>
        </main>


    )
}