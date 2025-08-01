"use client";

import React from "react";
import { cn } from "@/utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	children: React.ReactNode;
}

export function Button({ className, variant = "default", size = "default", children, ...props }: ButtonProps) {
	const baseClasses = "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50";

	const variantClasses = {
		default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
		destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
		outline: "border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
		ghost: "hover:bg-accent hover:text-accent-foreground",
		link: "text-primary underline-offset-4 hover:underline",
	};

	const sizeClasses = {
		default: "h-9 px-4 py-2",
		sm: "h-8 rounded-md px-3 text-xs",
		lg: "h-10 rounded-md px-8",
		icon: "h-9 w-9",
	};

	return (
		<button className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...props}>
			{children}
		</button>
	);
}

// Helper function for programmatic button creation
export function createButton(props: ButtonProps) {
	return Button(props);
}
