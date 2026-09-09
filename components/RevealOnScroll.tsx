"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
  type?: "default" | "fade" | "left" | "right";
}

export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  type = "default",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getRevealClass = () => {
    switch (type) {
      case "fade":
        return "reveal-fade";
      case "left":
        return "reveal-left";
      case "right":
        return "reveal-right";
      default:
        return "reveal";
    }
  };

  return (
    <Tag
      ref={ref as never}
      className={`${getRevealClass()} ${visible ? `${getRevealClass()}--visible` : ""} ${
        delay ? `reveal--delay-${delay}` : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

interface RevealImageProps {
  children: ReactNode;
  className?: string;
}

export function RevealImage({ children, className = "" }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-image ${visible ? "reveal-image--visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function RevealScale({ children, className = "" }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-scale ${visible ? "reveal-scale--visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
