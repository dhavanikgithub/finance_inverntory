"use client"
import { createContext, useState, useEffect, useContext } from 'react';
const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}



export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');




  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // If no saved theme, check the system's theme preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        setTheme(systemTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      // Function to change the favicon based on the theme
      function updateFavicon() {
        // Get the favicon element by ID, ensure it's of type HTMLLinkElement
        const favicon = document.getElementById('favicon');

        // Check if the favicon element exists
        if (!favicon) return;

        // Check if the user prefers dark mode
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Change favicon based on the theme
        if (isDarkMode) {
          favicon.href = '/favicon-dark.svg'; // Dark mode favicon
        } else {
          favicon.href = '/favicon-light.svg'; // Light mode favicon
        }
      }

      // Initially set the favicon based on the current theme
      updateFavicon();

      // Listen for theme changes and update the favicon
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      // Apply the theme class to the HTML element
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save theme to localStorage
      localStorage.setItem('theme', theme);
    }

  }, [theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
