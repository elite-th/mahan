"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { textToBg } from './utils';
import type { SolutionColor } from './types';

interface ResumeProjectsProps {
  color: SolutionColor;
}

interface ProjectData {
  title: string;
  clients?: string[];
  services: string[];
}

const PROJECTS: ProjectData[] = [
  {
    title: "تأمین تجهیزات شبکه و سرور",
    clients: ["همراه اول", "فن‌آوا", "سینادارو", "تسکا صنعت", "سروکوه", "هرمزنت"],
    services: [
      "تأمین تجهیزات Active دیتاسنتر",
      "تأمین تجهیزات Passive دیتاسنتر",
      "مشاوره راه‌اندازی شبکه هسته دیتاسنتر",
      "تأمین تجهیزات شبکه و فایروال",
    ],
  },
  {
    title: "راه‌اندازی شبکه شرکت نفت سپاهان",
    services: [
      "تجهیز شبکه دیتاسنتر",
      "راه‌اندازی Domain Services",
      "راه‌اندازی ایمیل سازمانی Exchange",
      "راه‌اندازی زیرساخت مجازی‌سازی VMware",
      "راه‌اندازی شبکه مبتنی بر Cisco و MikroTik",
    ],
  },
];

/**
 * ResumeProjects – Sample project cards with glassmorphic styling.
 *
 * Each card shows a project title with Briefcase icon,
 * optional client badges, and a services list with colored bullets.
 */
export default function ResumeProjects({ color }: ResumeProjectsProps) {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Section title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className="text-xl font-bold text-[var(--text)] mb-5 flex items-center gap-2"
      >
        <span className={`w-1 h-5 rounded-full ${textToBg(color.primary)}`} />
        نمونه پروژه‌ها
      </motion.h3>

      {/* Project cards */}
      {PROJECTS.map((project, pIdx) => (
        <motion.div
          key={pIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: pIdx * 0.12, ease: 'easeOut' as const }}
          className="bg-[var(--surface-1)] border border-[var(--border)] rounded-xl p-6"
        >
          {/* Project title */}
          <h4 className="text-[var(--text)] font-bold text-lg mb-4 flex items-center gap-2">
            <Briefcase className={`w-5 h-5 ${color.primary}`} aria-hidden="true" />
            {project.title}
          </h4>

          {/* Client badges (if any) */}
          {project.clients && project.clients.length > 0 && (
            <div className="mb-4">
              <span className="text-[var(--text-muted)] text-sm ml-2">کارفرمایان:</span>
              <div className="inline-flex flex-wrap gap-2 mt-1">
                {project.clients.map((client, cIdx) => (
                  <span
                    key={cIdx}
                    className={`inline-block ${color.bg} ${color.light} text-xs font-medium px-3 py-1 rounded-full border ${color.border}`}
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services list */}
          <ul className="space-y-1" role="list" aria-label={`خدمات پروژه ${project.title}`}>
            {project.services.map((service, sIdx) => (
              <motion.li
                key={sIdx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: pIdx * 0.12 + sIdx * 0.04 }}
                className="flex items-start gap-2.5 py-1"
              >
                {/* Small colored bullet */}
                <span
                  className={`mt-1.5 shrink-0 w-1 h-1 rounded-full ${textToBg(color.primary)}`}
                  aria-hidden="true"
                />
                <span className="text-[var(--text-muted)] text-sm leading-relaxed">{service}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
