"use client";

import React from "react";
import { cn } from "@/utils/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
	return (
		<div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props}>
			{children}
		</div>
	);
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
	return (
		<div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
	return (
		<h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props}>
			{children}
		</h3>
	);
}

export function CardContent({ className, children, ...props }: CardContentProps) {
	return (
		<div className={cn("p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
}

// Helper functions for programmatic card creation
export function createCard(props: CardProps) {
	return Card(props);
}

export function createCardHeader(props: CardHeaderProps) {
	return CardHeader(props);
}

export function createCardTitle(props: CardTitleProps) {
	return CardTitle(props);
}

export function createCardContent(props: CardContentProps) {
	return CardContent(props);
}
