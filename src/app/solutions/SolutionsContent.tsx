"use client";

import React, { useState } from 'react';
import {
  Shield,
  Server,
  Network,
  Cloud,
  Mail,
  Package,
  Award,
} from 'lucide-react';

import SolutionsHero from './components/SolutionsHero';
import SolutionsTabBar from './components/SolutionsTabBar';
import type { SolutionData } from './components/types';
import SolutionDetail from './components/SolutionDetail';
import SolutionsGrid from './components/SolutionsGrid';
import CTASection from './components/CTASection';
import ResumeSection from './components/ResumeSection';

/* ------------------------------------------------------------------ */
/*  SOLUTIONS DATA (content preserved from original)                   */
/* ------------------------------------------------------------------ */

const SOLUTIONS: SolutionData[] = [
  {
    id: "resume",
    title: "رزومه توانمندی‌ها",
    shortTitle: "رزومه",
    icon: <Award className="w-5 h-5" />,
    heroImage: "",
    description: "رزومه توانمندی‌ها و سوابق اجرایی شرکت ویرا شبکه آران",
    features: [],
    color: {
      primary: "text-cyan-400",
      light: "text-cyan-300",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      glow: "shadow-lg",
    },
  },
  {
    id: "import",
    title: "واردات تجهیزات شبکه و سرور",
    shortTitle: "واردات",
    icon: <Package className="w-5 h-5" />,
    heroImage: "",
    featureSectionTitle: "مراحل واردات تجهیزات",
    description:
      "ویرا شبکه آران با تجربه‌ای طولانی در واردات تمامی تجهیزات سرور و شبکه، کالای مورد نظر شما را در کمترین زمان ممکن از گمرک ترخیص می‌نماید. از اخذ کارت بازرگانی تا ترخیص کالا، همه مراحل را به صورت حرفه‌ای و تخصصی انجام می‌دهیم.",
    features: [
      "اخذ کارت بازرگانی",
      "پیدا کردن تامین‌کننده مناسب از طریق نمایشگاه‌ها و اتاق بازرگانی",
      "ثبت سفارش در وزارت صمت",
      "تخصیص ارز از بانک مرکزی",
      "تهیه پروفرما (پیش‌فاکتور معتبر)",
      "ترخیص کالا از گمرک در کمترین زمان",
      "مشاوره تخصصی برای عبور از تحریم‌ها و نوسانات ارزی",
    ],
    details:
      "تولید سرور و تجهیزات شبکه در کشور بسیار اندک و محدود می‌باشد، لذا واردکنندگان باید برای واردات این تجهیزات اقدام نمایند که پروسه‌ای زمان‌بر و نیازمند تخصص است. مشکلاتی مانند تحریم‌ها، نوسانات قیمت ارز، مسیر طولانی واردات و قرارگیری اشتباه اقلام در لیست ممنوعیت، فرایند واردات را پیچیده می‌کند. ویرا شبکه آران با داشتن تجربه و دانش فنی لازم، این مسیر را برای شما هموار می‌سازد.",
    color: {
      primary: "text-amber-400",
      light: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      glow: "shadow-lg",
    },
  },
  {
    id: "security",
    title: "امنیت شبکه",
    shortTitle: "امنیت",
    icon: <Shield className="w-5 h-5" />,
    heroImage: "",
    featureSectionTitle: "خدمات امنیت شبکه",
    description:
      "امروزه سیستم‌های مدیریت اطلاعات تحت شبکه، امکان دسترسی سریع به اطلاعات را فراهم می‌کنند. هر چه استفاده از این سیستم‌ها گسترش یابد، ضرورت توجه به سلامت و امنیت آنها نیز اهمیت بیشتری می‌یابد. گروه امنیت اطلاعات ویرا شبکه آران با ارائه راهکارهای مناسب و سریع، ضعف‌های امنیتی شبکه‌های کامپیوتری را برطرف ساخته و اطمینان مدیران را به سیستم‌های اطلاعاتی افزایش می‌دهد.",
    features: [
      "بهینه‌سازی زیرساخت IP و ارتباطی",
      "بازبینی Routing, NAT, Cache, Proxy",
      "مشاوره و طراحی سیاست امنیت شبکه",
      "ارائه و تنظیم NIDS, Firewall, HIDS",
      "ارزیابی خطرات و آسیب‌پذیری‌ها و آنالیز و تحلیل",
      "بهینه‌سازی سرورها، کلاینت‌ها و وب‌سایت",
      "توافق‌نامه ارائه خدمات فوریتی امنیت شبکه",
      "رمزنگاری و VPN",
      "آزمایش استحکام سیستم‌ها با سعی در شکستن آنها",
    ],
    steps: [
      { title: "مشاوره", desc: "شما درخواستی ارسال می‌کنید و مدیر ما با شما تماس می‌گیرد." },
      { title: "رزرو جلسه", desc: "ریسک‌ها و نیازمندی‌های سازمان شما بررسی و گزارش جامع آماده می‌گردد." },
      { title: "پیاده‌سازی", desc: "تجهیزات و راهکارهای امنیت طبق زمان‌بندی پیاده‌سازی می‌گردد." },
      { title: "ارزیابی", desc: "راهکارهای پیاده‌سازی شده با جدیدترین روش‌ها بررسی و ارزیابی نهایی آماده می‌گردد." },
    ],
    details:
      "تأیید اصالت کاربران و مشخص کردن منابعی که مجاز به استفاده از آنها هستند، جزئی از سیاست‌نامه امنیتی است. نفوذگرها با اهداف خرابکارانه خود سعی بر آن دارند که دسترسی به اطلاعات سازمان را مختل کنند. حملات برای ازکارانداختن سرویس‌ها در جهت از بین بردن ویژگی در دسترس بودن اطلاعات، از انواع معمول حملات شبکه می‌باشد.",
    advantages: [
      "طراحی و پیاده‌سازی راهکارهای جامع امنیتی NOC, SOC",
      "طراحی و اجرای مراکز داده و شبکه‌های LAN, WAN",
      "ارزیابی امنیتی سازمان (Penetration Test)",
      "مدیریت امنیت اطلاعات ISMS, ISO-27001",
      "راهکارهای جامع پیام‌رسانی و ارتباطی",
      "راهکارهای جامع پشتیبان‌گیری و ذخیره اطلاعات",
    ],
    color: {
      primary: "text-rose-400",
      light: "text-rose-300",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      glow: "shadow-lg",
    },
  },
  {
    id: "datacenter",
    title: "دیتاسنتر",
    shortTitle: "دیتاسنتر",
    icon: <Server className="w-5 h-5" />,
    heroImage: "",
    featureSectionTitle: "خدمات مرکز داده",
    description:
      "پیاده‌سازی راهکارهای مبتنی بر دیتاسنتر در داخل و خارج کشور. شرکت آران به واسطه تسلط به فناوری‌های روز جهانی و بهره‌گیری از سال‌ها تجربه ارزشمند در زمینه مشاوره، طراحی، راه‌اندازی، بهره‌برداری و پایش مراکز داده، آماده ارائه خدمات فنی و مهندسی منطبق بر استانداردهای TIA942، ANSI/BICSI 002-201، ISO20000 و CISCO SAFE می‌باشد.",
    features: [
      "ایجاد زیرساخت دیتاسنتر",
      "مجازی‌سازی",
      "استقرار امنیت",
      "استقرار زیرساخت ذخیره‌سازی اطلاعات",
      "راه‌اندازی سیستم مانیتورینگ",
      "برقراری زیرساخت‌های ارتباطی",
      "پشتیبان‌گیری مداوم و پیوسته",
    ],
    details:
      "مرکز داده (Data Center) مجموعه‌ای است از تجهیزات ذخیره‌سازی، بسترهای مجازی‌سازی، زیرساخت‌های ارتباطی، تجهیزات و سرویس‌های تحت شبکه و امنیتی. سازمان‌ها می‌توانند با به کارگیری سرویس‌های ارائه شده از طرف مرکز داده، اطلاعات و سرویس‌های مبتنی بر شبکه را بر روی بسترهای مختلف در اختیار داشته باشند. با ظهور پدیده‌هایی مانند دیتاسنترهای ماژولار، تعاریف استاندارد نیاز به اصلاح دارد.",
    color: {
      primary: "text-violet-400",
      light: "text-violet-300",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      glow: "shadow-lg",
    },
  },
  {
    id: "sdwan",
    title: "SD-WAN",
    shortTitle: "SD-WAN",
    icon: <Network className="w-5 h-5" />,
    heroImage: "",
    featureSectionTitle: "قابلیت‌های SD-WAN",
    description:
      "SD-WAN یا شبکۀ گسترده بر مبنای نرم‌افزار، یک شبکۀ گستردۀ مجازی است که به سازمان‌ها اجازه می‌دهد تا برای اتصال کاربران به برنامه‌های کاربردی، از هر ترکیب دلخواهی از سرویس‌های انتقال داده (MPLS, LTE, اینترنت) استفاده نمایند. ویرا شبکه آران با تجربه‌ای کامل در زمینه راه‌اندازی، پیاده‌سازی و پشتیبانی SD-WAN به همراه ارائه لایسنس‌های معتبر، می‌تواند شما را در این مسیر همراهی کند.",
    features: [
      "مسیریابی هوشمند و بهینه‌سازی ترافیک شبکه",
      "پشتیبانی از MPLS، اینترنت و 4G/LTE",
      "داشبورد مدیریتی یکپارچه (vManage)",
      "کنترل متمرکز با قابلیت پیکربندی خودکار (ZTP)",
      "انعطاف‌پذیری نقاط پایانی (مجازی یا فیزیکی)",
      "تحلیل و اطمینان در زمان حقیقی",
      "کاهش زمان اجرا و هزینه‌ها",
      "معماری مقیاس‌پذیر برای هزاران شعبه",
    ],
    details:
      "معماری SD-WAN بر مبنای ساختار روترهای ماژولار است و شامل سه مؤلفه Control Plane، I/O (Data Plane) و Switch Fabric می‌باشد. مؤلفه‌های اساسی شامل vManage (سیستم مدیریت شبکه)، vSmart Controller (اجرای سیاست‌های Control Plane)، vEdge (روترهای فیزیکی یا مجازی لبه شبکه) و vBond (رهبری ارتباطات) است. پیاده‌سازی می‌تواند تحت سرویس ابری سیسکو یا در مرکز داده خصوصی بر روی ESXi یا KVM انجام شود.",
    color: {
      primary: "text-emerald-400",
      light: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      glow: "shadow-lg",
    },
  },
  {
    id: "virtualization",
    title: "مجازی‌سازی",
    shortTitle: "مجازی‌سازی",
    icon: <Cloud className="w-5 h-5" />,
    heroImage: "",
    featureSectionTitle: "راهکارهای مجازی‌سازی",
    description:
      "به‌روزترین راهکارهای مجازی‌سازی. در سال‌های اخیر، فناوری‌های مجازی‌سازی به عنوان یکی از روندهای پیشرو در حوزه فناوری اطلاعات مطرح گردیده و فرصت‌های جدیدی نظیر رایانش ابری را فراهم نموده است. شرکت آران دارای تجربه غنی در ارائه مشاوره، طراحی، پیاده‌سازی و پشتیبانی زیرساخت مجازی در سازمان‌های مختلف می‌باشد.",
    features: [
      "پروژه‌های شناخت، تحلیل و طراحی مجازی‌سازی (Citrix, VMware, Microsoft)",
      "مشاوره، طراحی و پشتیبانی VMware vSphere",
      "ذخیره‌سازی مبتنی بر NAS (به جای SAN) برای کسب‌وکارهای کوچک و متوسط",
      "مهاجرت از محیط فیزیکی یا مجازی کنونی با حداقل اختلال",
      "مانیتورینگ اختصاصی تجهیزات مجازی‌سازی",
      "پشتیبان‌گیری از محیط‌های مجازی",
      "VMware NSX برای محافظت و مدیریت شبکه",
      "Disaster Recovery با VMware SRM",
      "مجازی‌سازی دسکتاپ (VDI) با VMware Horizon View",
      "High Availability، Failover Cluster و Load Balancing",
    ],
    color: {
      primary: "text-[var(--accent)]",
      light: "text-[var(--accent-hover)]",
      bg: "bg-[var(--accent-hover)]/10",
      border: "border-[var(--accent)]/30",
      glow: "shadow-lg",
    },
  },
  {
    id: "email",
    title: "ایمیل سرور Exchange",
    shortTitle: "ایمیل سرور",
    icon: <Mail className="w-5 h-5" />,
    heroImage: "",
    featureSectionTitle: "امکانات ایمیل سرور",
    description:
      "راه‌اندازی میل سرور Exchange یکی از روش‌های نرم‌افزاری است که به منظور ارسال نامه‌های الکترونیکی استفاده می‌شود. میل سرور Exchange پلتفرم ایمیل، تقویم، تماس، برنامه‌ریزی و همکاری مایکروسافت است که برای استفاده تجاری بر روی سیستم عامل ویندوز سرور مستقر شده است.",
    features: [
      "راه‌اندازی میل سرور Microsoft Exchange",
      "دسترسی از دستگاه‌های تلفن همراه، رایانه‌های رومیزی و وب",
      "پشتیبانی از پیام‌های صوتی",
      "تقویم اشتراکی و به اشتراک‌گذاری اسناد",
      "ویژگی‌های ذخیره‌سازی و امنیتی",
      "سرویس قابل اطمینان برای تبادل پیام‌ها و اسناد",
      "همکاری تیمی از طریق تقویم و اسناد مشترک",
    ],
    details:
      "در صورت نیاز به دریافت خدمات راه‌اندازی میل سرور می‌توانید با شماره تلفن 02191090702 با شرکت ویرا شبکه آران تماس حاصل فرمایید. مایکروسافت Exchange Server برای دسترسی کاربران به پلتفرم پیام‌رسانی از طریق دستگاه‌های تلفن همراه، رایانه‌های رومیزی و سیستم‌های مبتنی بر وب طراحی شده است.",
    color: {
      primary: "text-orange-400",
      light: "text-orange-300",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      glow: "shadow-lg",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function SolutionsContent() {
  const [activeId, setActiveId] = useState<string>("resume");

  const active = SOLUTIONS.find((s) => s.id === activeId) ?? SOLUTIONS[0];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SolutionsHero />
      <SolutionsTabBar
        solutions={SOLUTIONS}
        activeId={activeId}
        onSelect={setActiveId}
      />
      {activeId === "resume" ? (
        <ResumeSection color={active.color} />
      ) : (
        <SolutionDetail solution={active} />
      )}
      <SolutionsGrid
        solutions={SOLUTIONS}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <CTASection color={{ primary: active.color.primary, bg: active.color.bg, border: active.color.border }} />
      </div>
    </div>
  );
}
