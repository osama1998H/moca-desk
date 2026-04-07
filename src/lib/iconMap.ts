import { type LucideIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";
import { HomeIcon } from "lucide-react";
import { UsersIcon } from "lucide-react";
import { UserIcon } from "lucide-react";
import { SettingsIcon } from "lucide-react";
import { MailIcon } from "lucide-react";
import { PhoneIcon } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { BarChartIcon } from "lucide-react";
import { PieChartIcon } from "lucide-react";
import { LineChartIcon } from "lucide-react";
import { ShoppingCartIcon } from "lucide-react";
import { PackageIcon } from "lucide-react";
import { DollarSignIcon } from "lucide-react";
import { CreditCardIcon } from "lucide-react";
import { BuildingIcon } from "lucide-react";
import { MapPinIcon } from "lucide-react";
import { GlobeIcon } from "lucide-react";
import { FolderIcon } from "lucide-react";
import { ClipboardListIcon } from "lucide-react";
import { CheckSquareIcon } from "lucide-react";
import { TagIcon } from "lucide-react";
import { StarIcon } from "lucide-react";
import { HeartIcon } from "lucide-react";
import { BellIcon } from "lucide-react";
import { ShieldIcon } from "lucide-react";
import { KeyIcon } from "lucide-react";
import { DatabaseIcon } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { TruckIcon } from "lucide-react";
import { WrenchIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText: FileTextIcon,
  Home: HomeIcon,
  Users: UsersIcon,
  User: UserIcon,
  Settings: SettingsIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  Calendar: CalendarIcon,
  BarChart: BarChartIcon,
  PieChart: PieChartIcon,
  LineChart: LineChartIcon,
  ShoppingCart: ShoppingCartIcon,
  Package: PackageIcon,
  DollarSign: DollarSignIcon,
  CreditCard: CreditCardIcon,
  Building: BuildingIcon,
  MapPin: MapPinIcon,
  Globe: GlobeIcon,
  Folder: FolderIcon,
  ClipboardList: ClipboardListIcon,
  CheckSquare: CheckSquareIcon,
  Tag: TagIcon,
  Star: StarIcon,
  Heart: HeartIcon,
  Bell: BellIcon,
  Shield: ShieldIcon,
  Key: KeyIcon,
  Database: DatabaseIcon,
  LayoutDashboard: LayoutDashboardIcon,
  Truck: TruckIcon,
  Wrench: WrenchIcon,
};

export function getIconComponent(name?: string): LucideIcon {
  if (!name) return FileTextIcon;
  return ICON_MAP[name] ?? FileTextIcon;
}
