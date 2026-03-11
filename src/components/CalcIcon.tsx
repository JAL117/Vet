import {
  AlertCircle,
  Apple,
  Baby,
  BarChart2,
  BookOpen,
  CalendarClock,
  Calculator,
  Droplets,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  Home,
  Pill,
  Ruler,
  Scale,
  ScanLine,
  Search,
  Syringe,
  TrendingUp,
  Utensils,
  type LucideProps,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  "alert-circle": AlertCircle,
  apple: Apple,
  baby: Baby,
  "bar-chart-2": BarChart2,
  "book-open": BookOpen,
  "calendar-clock": CalendarClock,
  calculator: Calculator,
  droplets: Droplets,
  "file-text": FileText,
  "flask-conical": FlaskConical,
  gauge: Gauge,
  "heart-pulse": HeartPulse,
  home: Home,
  pill: Pill,
  ruler: Ruler,
  scale: Scale,
  "scan-line": ScanLine,
  search: Search,
  syringe: Syringe,
  "trending-up": TrendingUp,
  utensils: Utensils,
};

interface CalcIconProps extends LucideProps {
  name: string;
}

export default function CalcIcon({ name, ...props }: CalcIconProps) {
  const Icon = iconMap[name] ?? AlertCircle;
  return <Icon {...props} />;
}
