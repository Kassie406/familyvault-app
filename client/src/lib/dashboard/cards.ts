export type CardId =
  | "familyMembers"
  | "documents"
  | "messages"
  | "photos"
  | "sharedLists"
  | "recipeBook"
  | "budget"
  | "couples"
  | "mealPlanner"
  | "familyVacation"
  | "babysitter"
  | "emergencyContacts"
  | "chores"
  | "allowancePoints"
  | "quickActions"
  | "uploadCenter"
  | "familyActivity"
  | "familyUpdates"
  | "calendar";

export type CardDef = { id: CardId; title: string; span?: string };

export const CARD_REGISTRY: CardDef[] = [
  { id: "familyMembers", title: "Family Members" },
  { id: "documents", title: "Documents Shared" },
  { id: "messages", title: "Messages & Video Meetings" },
  { id: "photos", title: "Photos Uploaded" },
  { id: "sharedLists", title: "Shared Lists" },
  { id: "recipeBook", title: "Recipe Book" },
  { id: "budget", title: "Budget Tracker" },
  { id: "couples", title: "Couple's Connection" },
  { id: "mealPlanner", title: "Meal Planner" },
  { id: "familyVacation", title: "Family Vacation" },
  { id: "babysitter", title: "Babysitter" },
  { id: "emergencyContacts", title: "Emergency Contacts" },
  { id: "chores", title: "Chores & Allowance", span: "col-span-8" },
  { id: "allowancePoints", title: "Allowance", span: "col-span-4" },
  { id: "quickActions", title: "Quick Actions", span: "col-span-12" },
  { id: "uploadCenter", title: "Upload Center", span: "col-span-12" },
  { id: "familyActivity", title: "Family Activity" },
  { id: "familyUpdates", title: "Family Updates" },
  { id: "calendar", title: "Calendar" },
];

export type LayoutItem = { id: CardId; hidden?: boolean };
export type Layout = LayoutItem[];

// Default layouts per role
export const DEFAULTS: Record<"parent" | "teen", Layout> = {
  parent: [
    { id: "familyMembers" }, { id: "emergencyContacts" }, { id: "messages" }, { id: "photos" },
    { id: "sharedLists" }, { id: "recipeBook" }, { id: "budget" }, { id: "couples" },
    { id: "mealPlanner" }, { id: "familyVacation" }, { id: "babysitter" }, { id: "documents" },
    { id: "chores" }, { id: "allowancePoints" }, { id: "quickActions" }, { id: "uploadCenter" },
    { id: "familyActivity" }, { id: "familyUpdates" }, { id: "calendar" },
  ],
  teen: [
    { id: "messages" }, { id: "photos" }, { id: "sharedLists" }, { id: "chores" },
    { id: "allowancePoints" }, { id: "familyVacation" }, { id: "babysitter" },
    { id: "mealPlanner", hidden: true }, { id: "documents", hidden: true },
    { id: "budget", hidden: true }, { id: "couples", hidden: true }, 
    { id: "uploadCenter", hidden: true },
  ],
};