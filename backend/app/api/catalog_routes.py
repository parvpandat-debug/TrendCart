from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.database import get_db
from app.db.models import Product
from app.schemas.product import ProductOut

router = APIRouter(prefix="/products", tags=["Product Catalog"])

@router.get("", response_model=List[ProductOut])
def list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    max_price: Optional[float] = Query(None, description="Max price filter"),
    min_rating: Optional[float] = Query(None, description="Min rating filter"),
    search: Optional[str] = Query(None, description="Keyword search in title or description"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search and filter products across the mock catalog.
    """
    query = db.query(Product)

    if category:
        query = query.filter(Product.category == category)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(or_(
            Product.title.ilike(search_fmt),
            Product.description.ilike(search_fmt),
            Product.brand.ilike(search_fmt)
        ))

    products = query.limit(limit).all()

    if tag:
        # Filter in python for json list tag matching
        products = [p for p in products if tag.lower() in [t.lower() for t in (p.tags or [])]]

    return products

@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    """
    Get all unique categories and product counts.
    """
    categories = db.query(Product.category).distinct().all()
    res = []
    for (cat,) in categories:
        count = db.query(Product).filter(Product.category == cat).count()
        res.append({"name": cat, "count": count})
    return res

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get detailed product specs, pricing, and features by ID.
    """
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return p
