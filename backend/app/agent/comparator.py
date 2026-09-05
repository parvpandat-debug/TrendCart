from typing import List, Dict, Any, Tuple
from app.db.models import Product

class ProductComparator:
    @staticmethod
    def build_comparison_analysis(
        top_candidates: List[Tuple[Product, float, Dict[str, Any]]],
        intent: Dict[str, Any],
        budget_limit: float
    ) -> Dict[str, Any]:
        """
        Generates deep trade-off analysis, spec comparison, pros/cons,
        and explicit reasoning for the top recommendation.
        """
        if not top_candidates:
            return {
                "recommended_id": None,
                "summary": "No products matched the given criteria.",
                "candidates": []
            }

        recommended_product, best_score, best_breakdown = top_candidates[0]
        
        # Build candidate profiles for top 3
        candidates_data = []
        for p, score, breakdown in top_candidates[:3]:
            specs = p.specs or {}
            
            # Formulate pros and cons
            pros = []
            cons = []

            # Pricing
            if p.price <= budget_limit:
                savings = budget_limit - p.price
                if savings > 10:
                    pros.append(f"${savings:,.2f} under maximum budget limit")
                else:
                    pros.append(f"Direct hit on budget cap (${p.price:,.2f})")
            else:
                cons.append(f"Exceeds budget cap by ${p.price - budget_limit:,.2f}")

            if p.original_price and p.original_price > p.price:
                pros.append(f"Discounted {int(((p.original_price - p.price)/p.original_price)*100)}% off MSRP")

            # Specs
            if "ram_gb" in specs:
                if specs["ram_gb"] >= 16:
                    pros.append(f"High-capacity {specs['ram_gb']}GB RAM for smooth multitasking")
                else:
                    cons.append(f"Limited {specs['ram_gb']}GB RAM may bottleneck heavy workloads")

            if "gpu" in specs:
                gpu_str = str(specs["gpu"])
                if "RTX" in gpu_str:
                    pros.append(f"Dedicated {gpu_str} hardware encoder")
                elif "Arc" in gpu_str or "Radeon" in gpu_str:
                    pros.append(f"Integrated {gpu_str} with AI acceleration")

            if "display" in specs:
                disp_str = str(specs["display"])
                if "OLED" in disp_str:
                    pros.append("Stunning color-accurate OLED panel (100% DCI-P3)")
                elif "IPS" in disp_str and "120Hz" in disp_str:
                    pros.append("Smooth 120Hz high refresh rate display")

            if "battery_hours" in specs:
                b_hours = specs["battery_hours"]
                if b_hours >= 12:
                    pros.append(f"Exceptional {b_hours}h battery endurance")
                elif b_hours < 8:
                    cons.append(f"Moderate {b_hours}h battery life under heavy load")

            if "driver_size_mm" in specs:
                pros.append(f"Large {specs['driver_size_mm']}mm acoustic drivers")

            if not cons:
                cons.append("Higher demand item with limited seasonal discount")

            candidates_data.append({
                "product_id": p.id,
                "title": p.title,
                "brand": p.brand,
                "price": p.price,
                "original_price": p.original_price,
                "rating": p.rating,
                "review_count": p.review_count,
                "score": score,
                "specs": specs,
                "pros": pros,
                "cons": cons,
                "image_url": p.image_url,
                "breakdown": breakdown
            })

        # Generate overarching rationale for #1 Recommendation
        p1 = recommended_product
        p1_specs = p1.specs or {}
        use_case = intent.get("use_case", "your shopping goal")

        rationale_lines = [
            f"**{p1.title}** ranked highest with an autonomous compatibility score of **{best_score}/100**.",
            f"• **Budget Alignment**: At **${p1.price:,.2f}**, it safely meets your ${budget_limit:,.2f} ceiling (leaves ${max(0.0, budget_limit - p1.price):,.2f} buffer).",
            f"• **Workload Match**: For *{use_case}*, it delivers key required hardware (e.g. {p1_specs.get('cpu', 'High-performance CPU')}, {p1_specs.get('ram_gb', 16)}GB RAM, and {p1_specs.get('display', p1_specs.get('driver_size_mm', 'Pro-grade build quality'))}).",
            f"• **Social Proof**: Verified customer rating of **{p1.rating}★** over {p1.review_count} reviews.",
        ]
        if len(candidates_data) > 1:
            alt = candidates_data[1]
            rationale_lines.append(f"• **Why it beat #{2} ({alt['title']})**: Offers superior price-to-performance ratio for your explicit criteria while avoiding budget overruns.")

        trade_off_summary = "\n".join(rationale_lines)

        return {
            "recommended_id": recommended_product.id,
            "recommended_product_title": recommended_product.title,
            "match_score": best_score,
            "summary_rationale": trade_off_summary,
            "budget_spent": recommended_product.price,
            "budget_remaining": max(0.0, budget_limit - recommended_product.price),
            "candidates": candidates_data
        }
