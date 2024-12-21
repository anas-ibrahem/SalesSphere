import {
  Star,
  Medal,
  UserPlus,
  TrendingUp,
  BarChart2,
  List,
  X,
  User,
  UsersRound,
  Trophy,
  Target,
  HandCoins,
  DollarSign,
  MapPin,
  Calendar,
  Flag,
  BookCheck,
  Rocket,
  CircleUserRound,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

const EmployeeRoles = {
  DealOpener: 0,
  DealExecutor: 1,
  Manager: 2,
};

const TargetTypes = {
  OpenDeals: 0,
  CloseDeals: 1,
  AddCustomers: 2,
  Revenue: 3,
};

const BadgeTypes = {
  OpenDeals: 0,
  CloseDeals: 1,
  AddCustomers: 2,
  Revenue: 3,
  Badges: 4,
};

const VerificationStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

const CustomerTypes = {
  Individual: 0,
  Company: 1,
};

const ContactTypes = {
  Email: false,
  Phone: true,
};

const DealStatus = ["Open", "Claimed", "Closed Won", "Closed Lost"];

const PaymentMethods = {
  Cash: 0,
  Card: 1,
  BankTransfer: 2,
  ElectronicPayment: 3,
  Other: 4,
};

const NotificationPriority = {
  Low: 0,
  High: 1,
};

const NotificationTypes = {
  General: 0,
  Customer: 1,
  Deal: 2,
  Deadline: 3,
  Target: 4,
  BadgeAward: 5,
  Finances: 6,
};

const AdminPrivileges = {
  Normal: 0,
  Super: 1,
};

const FinancialRecordTypes = {
  Expense: 0,
  Income: 1,
};

const LogTypes = {
  Business: 0,
  Employee: 1,
  Customer: 2,
  Deal: 3,
  Target: 4,
  Finances: 5,
};

// Mapping of Badge Types to Icons
const BadgeIcons = {
  [BadgeTypes.OpenDeals]: AddCardIcon,
  [BadgeTypes.CloseDeals]:  CreditScoreIcon,
  [BadgeTypes.AddCustomers]: CircleUserRound,
  [BadgeTypes.Revenue]: CircleDollarSign,
  [BadgeTypes.Badges]: WorkspacePremiumIcon,
};

// Mapping of Target Types to Icons
const TargetIcons = {
  [TargetTypes.OpenDeals]: List,
  [TargetTypes.CloseDeals]: Flag,
  [TargetTypes.AddCustomers]: UsersRound,
  [TargetTypes.Revenue]: DollarSign,
};

const BusinessTypes = [
  "Retail",
  "Services",
  "Real Estate",
  "Food",
  "Clothing",
  "Electronics",
  "Software",
  "Sales",
  "Digital Marketing",
  "Other",
];

// Export all enums
export {
  NotificationTypes,
  BadgeIcons,
  EmployeeRoles,
  VerificationStatus,
  CustomerTypes,
  ContactTypes,
  DealStatus,
  PaymentMethods,
  FinancialRecordTypes,
  NotificationPriority,
  AdminPrivileges,
  BadgeTypes,
  TargetTypes,
  TargetIcons,
  BusinessTypes,
  LogTypes,
};
