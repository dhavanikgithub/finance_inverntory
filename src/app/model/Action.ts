import { JSX } from "react";

export type Action = {
    icon: JSX.Element; // `JSX.Element` type for React components or elements
    label: string;
    onClick: (data: any) => void; // `onClick` is a function that takes no arguments and returns void
};