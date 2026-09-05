import re
from typing import Dict, Any, List

class IntentParser:
    @staticmethod
    def parse_goal(user_query: str, default_budget: float = 1000.0) -> Dict[str, Any]:
        """
        Parses a user shopping query into structured constraints and intent.
        Extracts: category, max_price, priority_features, target_use_case, and required tags.
        """
        query_lower = user_query.lower()

        # 1. Extract Price Cap / Budget
        extracted_price = None
        price_patterns = [
            r'under\s*\$?(\d+(?:\.\d{1,2})?)',
            r'below\s*\$?(\d+(?:\.\d{1,2})?)',
            r'less\s*than\s*\$?(\d+(?:\.\d{1,2})?)',
            r'within\s*\$?(\d+(?:\.\d{1,2})?)',
            r'budget\s*(?:of)?\s*\$?(\d+(?:\.\d{1,2})?)',
            r'\$(\d+(?:\.\d{1,2})?)'
        ]
        for pat in price_patterns:
            match = re.search(pat, query_lower)
            if match:
                try:
                    extracted_price = float(match.group(1))
                    break
                except ValueError:
                    pass

        max_price = extracted_price if extracted_price is not None else default_budget

        # 2. Determine Category
        laptop_keywords = ["laptop", "notebook", "ultrabook", "macbook", "computer", "pc", "thinkpad", "dell xps", "zenbook", "vivobook", "ideapad"]
        audio_keywords = ["headphone", "headphones", "earbuds", "earphone", "audio", "mic", "microphone", "sound", "anc", "sony wh", "bose", "sennheiser", "shure", "podcast"]
        workspace_keywords = ["desk", "chair", "mouse", "keyboard", "monitor", "dock", "light", "screenbar", "ergonomic", "workspace", "smart home", "thunderbolt"]

        category = "Laptops & Computing"
        if any(kw in query_lower for kw in laptop_keywords):
            category = "Laptops & Computing"
        elif any(kw in query_lower for kw in audio_keywords):
            category = "Audio & Headphones"
        elif any(kw in query_lower for kw in workspace_keywords):
            category = "Smart Home & Workspace"
        else:
            # Fallback based on specific keywords
            if "listen" in query_lower or "music" in query_lower or "call" in query_lower:
                category = "Audio & Headphones"
            elif "sit" in query_lower or "typing" in query_lower or "table" in query_lower:
                category = "Smart Home & Workspace"

        # 3. Detect Use-Case and Key Priorities
        target_tags = []
        priorities = []
        use_case = "General Productivity"

        if "video editing" in query_lower or "premiere" in query_lower or "davinci" in query_lower or "render" in query_lower or "creator" in query_lower:
            use_case = "Video Editing & Content Creation"
            target_tags.extend(["video-editing", "creator", "oled", "rtx"])
            priorities.append("High RAM (>=16GB)")
            priorities.append("Color-Accurate Display or Dedicated GPU")

        elif "programming" in query_lower or "coding" in query_lower or "developer" in query_lower or "software" in query_lower:
            use_case = "Software Engineering & Development"
            target_tags.extend(["developer", "lightweight", "linux", "thinkpad"])
            priorities.append("Ergonomic Keyboard & Multitasking CPU")
            priorities.append("RAM >= 16GB")

        elif "gaming" in query_lower or "steam" in query_lower or "fps" in query_lower:
            use_case = "Gaming & High Performance"
            target_tags.extend(["gaming", "rtx", "high-end"])
            priorities.append("Dedicated GPU (NVIDIA RTX)")
            priorities.append("High Refresh Rate Screen")

        elif "travel" in query_lower or "flight" in query_lower or "commute" in query_lower or "airplane" in query_lower:
            use_case = "Travel & Mobile Productivity"
            target_tags.extend(["travel", "anc", "lightweight", "portable"])
            priorities.append("Active Noise Cancellation (ANC)")
            priorities.append("Long Battery Life")

        elif "podcast" in query_lower or "streaming" in query_lower or "voice" in query_lower or "record" in query_lower:
            use_case = "Podcasting & Audio Recording"
            target_tags.extend(["podcast", "microphone", "studio", "streaming"])
            priorities.append("Cardioid / Voice Isolation")
            priorities.append("Acoustic Clarity")

        elif "ergonomic" in query_lower or "posture" in query_lower or "back pain" in query_lower or "comfort" in query_lower:
            use_case = "Ergonomic Workspace Health"
            target_tags.extend(["ergonomic", "chair", "standing-desk", "mouse"])
            priorities.append("Ergonomic Support & Posture Alignment")

        # Budget sensitivity
        if "budget" in query_lower or "cheap" in query_lower or "affordable" in query_lower or max_price <= 750:
            target_tags.append("budget")
            priorities.append(f"Strict Budget Cap: under ${max_price:,.2f}")

        # Extract brand affinity if mentioned
        brand_affinity = None
        brands = ["apple", "dell", "lenovo", "asus", "acer", "hp", "sony", "bose", "sennheiser", "shure", "logitech", "keychron", "samsung", "caldigit"]
        for b in brands:
            if b in query_lower:
                brand_affinity = b.capitalize()
                break

        return {
            "category": category,
            "max_price": max_price,
            "budget_limit": max_price,
            "use_case": use_case,
            "priorities": priorities,
            "target_tags": target_tags,
            "brand_affinity": brand_affinity,
            "raw_query": user_query
        }
