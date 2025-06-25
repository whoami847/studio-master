
import type { LucideIcon } from "lucide-react";

export type ProductOption = {
  name: string;
  price: number;
  icon?: LucideIcon | string;
};

export type FormField = {
  name: 'playerId' | 'email' | 'accountType' | 'emailPhone' | 'password' | 'twoStepCode' | 'quantity';
  label: string;
  placeholder?: string;
  type: 'text' | 'email' | 'password' | 'number_input' | 'select';
  options?: string[];
  required: boolean;
  defaultValue?: string | number;
};

export type Product = {
  title: string;
  name: string; // For the card display
  imageUrl: string;
  slug: string;
  type: 'games' | 'vouchers';
  formType: 'uid' | 'ingame' | 'voucher';
  category: string;
  options: ProductOption[];
  formFields: FormField[];
  description: string[];
  selectLabel?: string;
};

export type MainCategory = {
    name: string;
    slug: string;
    imageUrl: string;
};

export const defaultMainCategories: MainCategory[] = [
    { name: "FREE FIRE", slug: "free-fire", imageUrl: "https://images.unsplash.com/photo-1593438358459-54b22378a484?q=80&w=400&h=500&fit=crop" },
    { name: "VOUCHERS", slug: "vouchers", imageUrl: "https://images.unsplash.com/photo-1614036911732-817d3550993a?q=80&w=400&h=500&fit=crop" },
    { name: "PUBG TOP UP", slug: "pubg", imageUrl: "https://images.unsplash.com/photo-1587213812845-9ec1543884a4?q=80&w=400&h=500&fit=crop" },
]

export const defaultProducts: Record<string, Product> = {
  'free-fire-diamond-bd': {
    title: 'DIAMOND TOP UP [BD]',
    name: "DIAMOND TOP UP [BD]",
    imageUrl: "https://telegra.ph/file/0c9b0e2553b3b4f620436.jpg",
    slug: 'free-fire-diamond-bd',
    type: 'games',
    category: 'free-fire',
    formType: 'uid',
    selectLabel: "Select Recharge",
    options: [
      { name: '25 Diamond', price: 22 },
      { name: '50 Diamond', price: 42 },
      { name: '100 Diamond', price: 82 },
      { name: '210 Diamond', price: 164 },
      { name: '530 Diamond', price: 405 },
      { name: '1080 Diamond', price: 810 },
      { name: '2200 Diamond', price: 1600 },
      { name: '5600 Diamond', price: 3950 },
      { name: 'Weekly', price: 144 },
      { name: 'Monthly', price: 710 },
      { name: 'Level Up Pass', price: 145 },
    ],
    formFields: [
      { name: 'playerId', label: 'PLAYER ID *', placeholder: 'Enter Player ID (UID)', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
        "অনুগ্রহ করে Bangladesh সার্ভারের ID Code দিয়ে টপ আপ করবেন।",
        "Player ID Code ভুল দিলে Diamond না পেলে কর্তৃপক্ষ দায়ী নয়।"
    ],
  },
  'free-fire-weekly-monthly': {
    title: 'WEEKLY MONTHLY OFFER',
    name: "WEEKLY MONTHLY OFFER",
    imageUrl: "https://images.unsplash.com/photo-1541797341323-87a1c706249e?q=80&w=400&h=500&fit=crop",
    slug: 'free-fire-weekly-monthly',
    type: 'games',
    category: 'free-fire',
    formType: 'uid',
    selectLabel: "Select Offer",
    options: [
        { name: 'Weekly', price: 144 },
        { name: '2 Weekly', price: 288 },
        { name: '3 Weekly', price: 432 },
        { name: '5 Weekly', price: 720 },
        { name: 'Monthly', price: 710 },
        { name: '2 Monthly', price: 1420 },
        { name: '3 Monthly', price: 2130 },
        { name: '10Weekly+5Monthly', price: 4910 },
    ],
    formFields: [
      { name: 'playerId', label: 'PLAYER ID *', placeholder: 'Enter Player ID (UID)', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
      "অনুগ্রহ করে Bangladesh সার্ভারের ID Code দিয়ে টপ আপ করবেন।",
      "Player ID Code ভুল দিলে Diamond না পেলে কর্তৃপক্ষ দায়ী নয়।"
    ],
  },
  'free-fire-in-game': {
    title: 'FF IN-GAME TOP UP',
    name: "FF IN-GAME TOP UP",
    imageUrl: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=400&h=500&fit=crop",
    slug: 'free-fire-in-game',
    type: 'games',
    category: 'free-fire',
    formType: 'ingame',
    selectLabel: "Select Diamond Amount",
    options: [
        { name: '520 Diamond', price: 250 },
        { name: '1060 Diamond', price: 500 },
        { name: '2180 Diamond', price: 1000 },
        { name: '5600 Diamond', price: 2380 },
    ],
    formFields: [
      { name: 'accountType', label: 'SELECT ACCOUNT TYPE *', type: 'select', options: ['Facebook', 'Google'], required: true, placeholder: "Select account type" },
      { name: 'emailPhone', label: 'EMAIL / PHONE *', placeholder: 'Enter your Email or Phone', type: 'text', required: true },
      { name: 'password', label: 'PASSWORD *', placeholder: 'Enter your password', type: 'password', required: true },
      { name: 'twoStepCode', label: 'TWO STEP CODE', placeholder: 'Enter your two-step code if enabled', type: 'text', required: false },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
      "অর্ডার করার আগে আইডি/পাসওয়ার্ড চেক করে নিবেন।",
      "Facebook এ ২ স্টেপ চালু থাকলে ব্যাকআপ কোড অবশ্যই দিবেন।",
      "Gmail আইডি হলে Backup Code সাথে দিবেন।"
    ],
  },
  'free-fire-airdrop': {
    title: 'AIRDROP [INGAME]',
    name: "AIRDROP [INGAME]",
    imageUrl: "https://images.unsplash.com/photo-1560037807-6804a749d2e4?q=80&w=400&h=500&fit=crop",
    slug: 'free-fire-airdrop',
    type: 'games',
    category: 'free-fire',
    formType: 'ingame',
    selectLabel: "Select Airdrop",
    options: [
        { name: '96% Airdrop', price: 55 },
        { name: 'Airdrop 1', price: 75 },
        { name: 'Mixed Bundle 1', price: 80 },
        { name: 'Mixed Bundle 2', price: 85 },
    ],
    formFields: [
      { name: 'accountType', label: 'SELECT ACCOUNT TYPE *', type: 'select', options: ['Facebook', 'Google'], required: true, placeholder: "Select account type" },
      { name: 'emailPhone', label: 'EMAIL / PHONE *', placeholder: 'Enter your Email or Phone', type: 'text', required: true },
      { name: 'password', label: 'PASSWORD *', placeholder: 'Enter your password', type: 'password', required: true },
      { name: 'twoStepCode', label: 'TWO STEP CODE', placeholder: 'Enter your two-step code if enabled', type: 'text', required: false },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
        "অর্ডার করার আগে আইডি/পাসওয়ার্ড চেক করে নিবেন।",
        "Facebook এ ২ স্টেপ চালু থাকলে ব্যাকআপ কোড অবশ্যই দিবেন।",
        "Gmail আইডি হলে Backup Code সাথে দিবেন।"
    ],
  },
  'free-fire-indonesia': {
    title: 'INDONESIA TOPUP',
    name: "INDONESIA TOPUP",
    imageUrl: "https://images.unsplash.com/photo-1587099423851-d413346b0a88?q=80&w=400&h=500&fit=crop",
    slug: 'free-fire-indonesia',
    type: 'games',
    category: 'free-fire',
    formType: 'uid',
    selectLabel: "Select Top-up",
    options: [
        { name: '5 Diamond', price: 14 },
        { name: '100 Diamond', price: 135 },
        { name: '140 Diamond', price: 185 },
        { name: '355 Diamond', price: 450 },
        { name: 'Booyah Pass', price: 455 },
    ],
    formFields: [
      { name: 'playerId', label: 'PLAYER ID *', placeholder: 'Enter Player ID', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
        "অনুগ্রহ করে Indonesia সার্ভারের ID Code দিয়ে টপ আপ করবেন।",
        "অর্ডার কনফার্ম হওয়ার পরেও আইডি/ভিডিওতে ডায়মন্ড না পেলে চেক করার জন্য ID Pass দিতে হবে।"
    ],
  },
  'garena-shells-my': {
    title: 'Garena Shells MY',
    name: "Garena Shells MY",
    imageUrl: "https://images.unsplash.com/photo-1598438859663-3e3c5409a25b?q=80&w=400&h=500&fit=crop",
    slug: 'garena-shells-my',
    type: 'vouchers',
    category: 'vouchers',
    formType: 'voucher',
    selectLabel: "Select Shells Amount",
    options: [
      { name: '65 Shell MY', price: 125 },
      { name: '125 Shell MY', price: 250 },
      { name: '315 Shell MY', price: 570 },
      { name: '630 Shell MY', price: 1060 },
      { name: '1300 Shell MY', price: 2060 },
    ],
    formFields: [
      { name: 'email', label: 'EMAIL *', placeholder: 'Enter your email', type: 'email', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
      "Garena Shells can be used to purchase in-game items on the Garena platform.",
      "The code will be sent to the email address you provide."
    ],
  },
  'unipin-voucher-bd': {
    title: 'UNIPIN VOUCHER BD',
    name: "UNIPIN VOUCHER BD",
    imageUrl: "https://images.unsplash.com/photo-1614036911732-817d3550993a?q=80&w=400&h=500&fit=crop",
    slug: 'unipin-voucher-bd',
    type: 'vouchers',
    category: 'vouchers',
    formType: 'voucher',
    selectLabel: "Select Voucher",
    options: [
        { name: '25 Diamond / 20 UC', price: 19 },
        { name: '50 Diamond / 40 UC', price: 38 },
        { name: '100 Diamond / 85 UC', price: 75 },
        { name: '1000 UC Gift Card', price: 871 },
        { name: '2000 UC Gift Card', price: 1742 },
    ],
    formFields: [
      { name: 'email', label: 'EMAIL *', placeholder: 'Enter your email', type: 'email', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
        "প্রথমে কত ডায়মন্ড কিনতে চান সে অনুযায়ী Unipin Voucher পিন সিলেক্ট করুন।",
        "তারপর Garena ওয়েবসাইটে গিয়ে আপনার একাউন্টে লগইন করে Process to Payment করুন।"
    ],
  },
  'pubg-mobile-uc': {
    title: 'PUBG MOBILE UC',
    name: "PUBG MOBILE UC",
    imageUrl: "https://images.unsplash.com/photo-1587213812845-9ec1543884a4?q=80&w=400&h=500&fit=crop",
    slug: 'pubg-mobile-uc',
    type: 'games',
    category: 'pubg',
    formType: 'uid',
    selectLabel: "Select UC Amount",
    options: [
        { name: '60 UC', price: 115 },
        { name: '325 UC', price: 540 },
        { name: '660 UC', price: 1080 },
        { name: '1800 UC', price: 2700 },
        { name: '3850 UC', price: 5400 },
        { name: '8100 UC', price: 10800 },
    ],
    formFields: [
      { name: 'playerId', label: 'PLAYER ID *', placeholder: 'Enter Player ID (UID)', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 },
    ],
    description: [
      "Player ID Code ভুল দিলে UC না পেলে কর্তৃপক্ষ দায়ী নয়।",
      "অর্ডার কনফার্ম হওয়ার পরেও আইডি/ভিডিওতে ডায়মন্ড না পেলে চেক করার জন্য ID Pass দিতে হবে।"
    ],
  },
};
