import type { StaticImageData } from "next/image";

import orderEntry from "../public/pos-demo/order-entry.webp";
import kitchenOrder from "../public/pos-demo/kitchen-order.webp";
import floorProgress from "../public/pos-demo/floor-progress.webp";
import checkoutReport from "../public/pos-demo/checkout-report.webp";
import bilingual from "../public/pos-demo/core/bilingual.webp";
import offlineBackup from "../public/pos-demo/core/offline_backup.webp";
import menuManagement from "../public/pos-demo/core/menu_management.webp";
import soldOut from "../public/pos-demo/core/sold_out.webp";
import delivery from "../public/pos-demo/add-ons/delivery.webp";
import financeInventory from "../public/pos-demo/add-ons/finance_inventory.webp";
import scheduling from "../public/pos-demo/add-ons/scheduling.webp";
import reservations from "../public/pos-demo/add-ons/reservations.webp";
import reviews from "../public/pos-demo/add-ons/reviews.webp";
import foodSafety from "../public/pos-demo/add-ons/food_safety.webp";
import allergens from "../public/pos-demo/add-ons/allergens.webp";
import recipeCosting from "../public/pos-demo/add-ons/recipe_costing.webp";
import customDomain from "../public/pos-demo/add-ons/custom_domain.webp";
import signage from "../public/pos-demo/add-ons/signage.webp";

export type PosFeatureImageId =
  | "order-entry"
  | "kitchen-order"
  | "floor-progress"
  | "checkout-report"
  | "bilingual"
  | "offline_backup"
  | "menu_management"
  | "sold_out"
  | "delivery"
  | "finance_inventory"
  | "scheduling"
  | "reservations"
  | "reviews"
  | "food_safety"
  | "allergens"
  | "recipe_costing"
  | "custom_domain"
  | "signage";

export const POS_FEATURE_IMAGES: Record<PosFeatureImageId, StaticImageData> = {
  "order-entry": orderEntry,
  "kitchen-order": kitchenOrder,
  "floor-progress": floorProgress,
  "checkout-report": checkoutReport,
  "bilingual": bilingual,
  "offline_backup": offlineBackup,
  "menu_management": menuManagement,
  "sold_out": soldOut,
  "delivery": delivery,
  "finance_inventory": financeInventory,
  "scheduling": scheduling,
  "reservations": reservations,
  "reviews": reviews,
  "food_safety": foodSafety,
  "allergens": allergens,
  "recipe_costing": recipeCosting,
  "custom_domain": customDomain,
  "signage": signage,
};
