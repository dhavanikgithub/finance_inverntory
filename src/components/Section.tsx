"use client";

import React, { ReactElement, ReactNode } from "react";
interface SectionHeaderLeftProps{
    children: ReactNode;
}
// SectionHeaderLeft component to handle left content
const SectionHeaderLeft:React.FC<SectionHeaderLeftProps> = ({ children }) => {
    return <div className="flex flex-col">{children}</div>;
};

interface SectionHeaderRightProps{
    children: ReactNode;
}
// SectionHeaderRight component to handle right content
const SectionHeaderRight:React.FC<SectionHeaderRightProps> = ({ children }) => {
    return <div className="flex flex-col gap-2 shrink-0 sm:flex-row">{children}</div>;
};

interface SectionHeaderProps{
    children: ReactNode;
}
// SectionHeader component to handle both left and right sections dynamically
const SectionHeader:React.FC<SectionHeaderProps> = ({ children }) => {
    // Split the children into left and right components
    const left = React.Children.toArray(children).find(child => (child as ReactElement).type === SectionHeaderLeft);
    const right = React.Children.toArray(children).find(child => (child as ReactElement).type === SectionHeaderRight);

    return (
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 rounded-none bg-clip-border ">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                {left}
                {/* Right Section */}
                {right}
            </div>
        </div>
    );
};

interface HeadingProps{
    children: ReactNode;
}
const Heading:React.FC<HeadingProps> = ({children}) => {
    return (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200">{children}</h3>
    )
}

interface SubHeadingProps{
    children: ReactNode;
}
const SubHeading:React.FC<SubHeadingProps> = ({children}) => {
    return (
        <p className="text-slate-500">{children}</p>
    )
}

interface SectionProps{
    children: ReactNode;
}
// Section component for wrapping main content
const Section:React.FC<SectionProps> = ({ children }) => {
    return (
        <div className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-900 ">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface SectionContentProps{
    children: ReactNode;
}
const SectionContent:React.FC<SectionContentProps> = ({children}) => {
    return (
        <div>
            {children}
        </div>
    )
}

export { SectionHeader, SectionHeaderLeft, SectionHeaderRight, Section, SectionContent, Heading, SubHeading };
