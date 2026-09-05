from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.models import Product

class CatalogSearchEngine:
    @staticmethod
    def search_and_score(
        db: Session,
        intent: Dict[str, Any],
        budget_limit: float
    ) -> List[Tuple[Product, float, Dict[str, Any]]]:
        """
        Queries the catalog based on parsed intent, scores each matching product,
        and returns a sorted list of (Product, score, score_breakdown).
        """
        category = intent.get("category", "Laptops & Computing")
        target_tags = intent.get("target_tags", [])
        brand_affinity = intent.get("brand_affinity")
        use_case = intent.get("use_case", "")

        # Base query filtered by category
        query = db.query(Product).filter(
            Product.category == category,
            Product.in_stock == True
        )

        candidates = query.all()
        if not candidates:
            # Fallback to all in-stock products if category has no match
            candidates = db.query(Product).filter(Product.in_stock == True).all()

        scored_candidates = []

        for p in candidates:
            score = 0.0
            breakdown = {}

            # 1. Budget Constraint Score (Max 35 pts)
            # If price <= budget_limit, grant high score; if price <= max_price, bonus.
            # If price > budget_limit, apply heavy penalty.
            if p.price <= budget_limit:
                # Value efficiency: closer to sweet spot (between 60% and 95% of budget)
                ratio = p.price / budget_limit if budget_limit > 0 else 1.0
                if 0.5 <= ratio <= 1.0:
                    budget_score = 35.0
                else:
                    budget_score = 30.0
                breakdown["budget_compliance"] = f"Passes budget limit (${p.price:,.2f} <= ${budget_limit:,.2f})"
            else:
                over_pct = ((p.price - budget_limit) / budget_limit) * 100
                budget_score = max(0.0, 35.0 - (over_pct * 1.5))
                breakdown["budget_compliance"] = f"Exceeds budget by ${p.price - budget_limit:,.2f} (-{35.0 - budget_score:.1f} pts)"

            score += budget_score

            # 2. Tag & Keyword Match Score (Max 25 pts)
            tag_matches = 0
            product_tags = set(p.tags or [])
            for target_tag in target_tags:
                if target_tag in product_tags or target_tag in p.title.lower() or target_tag in p.description.lower():
                    tag_matches += 1

            tag_score = min(25.0, tag_matches * 8.5)
            breakdown["tag_alignment"] = f"{tag_matches} target criteria matched (+{tag_score:.1f} pts)"
            score += tag_score

            # 3. Hardware / Feature Suitability Score (Max 20 pts)
            feature_score = 0.0
            p_specs = p.specs or {}
            
            if "Video Editing" in use_case:
                # Needs RAM >= 16, Dedicated GPU or Arc AI, OLED / High Gamut
                if p_specs.get("ram_gb", 0) >= 16:
                    feature_score += 7.0
                if "RTX" in str(p_specs.get("gpu", "")) or "Arc" in str(p_specs.get("gpu", "")) or "Radeon 680M" in str(p_specs.get("gpu", "")):
                    feature_score += 8.0
                if "OLED" in p.title or "OLED" in str(p_specs.get("display", "")) or "100% sRGB" in str(p_specs.get("display", "")):
                    feature_score += 5.0
            elif "Travel" in use_case:
                if p_specs.get("battery_hours", 0) >= 20 or p_specs.get("battery_hours", 0) >= 10:
                    feature_score += 10.0
                if "anc" in product_tags or "noise" in p.description.lower():
                    feature_score += 10.0
            elif "Programming" in use_case or "Software" in use_case:
                if p_specs.get("ram_gb", 0) >= 16 or "keyboard" in product_tags or "mouse" in product_tags:
                    feature_score += 10.0
                if p_specs.get("battery_hours", 0) >= 10:
                    feature_score += 5.0
                if "thinkpad" in product_tags or "developer" in product_tags:
                    feature_score += 5.0
            else:
                feature_score = 12.0

            score += min(20.0, feature_score)
            breakdown["hardware_suitability"] = f"Spec fit for {use_case} (+{feature_score:.1f} pts)"

            # 4. Rating & Social Proof Score (Max 12 pts)
            rating_score = (p.rating / 5.0) * 12.0
            score += rating_score
            breakdown["social_proof"] = f"Rating {p.rating}★ across {p.review_count} reviews (+{rating_score:.1f} pts)"

            # 5. Brand Preference & Value Discount Score (Max 8 pts)
            bonus_score = 0.0
            if brand_affinity and brand_affinity.lower() in p.brand.lower():
                bonus_score += 5.0
            if p.original_price and p.original_price > p.price:
                discount_pct = ((p.original_price - p.price) / p.original_price) * 100
                bonus_score += min(3.0, discount_pct * 0.15)

            score += bonus_score
            breakdown["brand_and_deal_bonus"] = f"Deal / Brand alignment (+{bonus_score:.1f} pts)"

            final_score = round(min(100.0, score), 1)
            scored_candidates.append((p, final_score, breakdown))

        # Sort descending by score
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        return scored_candidates
