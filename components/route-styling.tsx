"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteStyling() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const path = pathname.replace(/\/$/, "") || "/";
    const chapterMatch = path.match(/^\/philippians\/(\d+)$/);

    html.classList.add("dark");
    html.style.colorScheme = "dark";
    body.classList.add("mbe-shell-managed");
    body.removeAttribute("data-philippians-chapter");

    if (path === "/") body.dataset.philippiansRoute = "home";
    else if (path === "/background") body.dataset.philippiansRoute = "introduction";
    else if (path === "/articles" || path.startsWith("/articles/")) body.dataset.philippiansRoute = "articles";
    else if (chapterMatch) {
      body.dataset.philippiansRoute = "commentary";
      body.dataset.philippiansChapter = chapterMatch[1];
    } else body.removeAttribute("data-philippians-route");
  }, [pathname]);

  return null;
}
