from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class ProductBase(BaseModel):
    title: str
    brand: str
    category: str
    subcategory: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    rating: float = 4.5
    review_count: int = 0
    description: str
    specs: Dict[str, Any] = {}
    features: List[str] = []
    image_url: Optional[str] = None
    in_stock: bool = True
    stock_quantity: int = 20
    delivery_days: int = 2
    tags: List[str] = []

class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

class ProductFilterParams(BaseModel):
    category: Optional[str] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
    search: Optional[str] = None
    tag: Optional[str] = None
