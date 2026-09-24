"""
Asset Configuration System
Centralized definition of supported assets, ticker mappings, and metadata.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class AssetConfig(BaseModel):
    id: str
    name: str
    symbol_yfinance: str
    symbol_twelve_data: str
    asset_type: str  # "stock" or "crypto"
    currency: str
    exchange: Optional[str] = None
    description: str

ASSETS: Dict[str, AssetConfig] = {
    "reliance": AssetConfig(
        id="reliance",
        name="Reliance Industries Ltd.",
        symbol_yfinance="RELIANCE.NS",
        symbol_twelve_data="RELIANCE",
        asset_type="stock",
        currency="INR",
        exchange="NSE",
        description="India's largest conglomerate spanning energy, retail, telecom, and digital services."
    ),
    "bitcoin": AssetConfig(
        id="bitcoin",
        name="Bitcoin",
        symbol_yfinance="BTC-USD",
        symbol_twelve_data="BTC/USD",
        asset_type="crypto",
        currency="USD",
        exchange="CRYPTO",
        description="The pioneer decentralized digital cryptocurrency based on blockchain technology."
    ),
    "google": AssetConfig(
        id="google",
        name="Google (Alphabet Inc.)",
        symbol_yfinance="GOOGL",
        symbol_twelve_data="GOOGL",
        asset_type="stock",
        currency="USD",
        exchange="NASDAQ",
        description="Global technology leader in online search, cloud computing, AI, and advertising."
    )
}

def get_asset_config(asset_id: str) -> AssetConfig:
    key = asset_id.lower()
    if key not in ASSETS:
        raise ValueError(f"Unknown asset_id '{asset_id}'. Valid assets are: {list(ASSETS.keys())}")
    return ASSETS[key]

def list_all_assets() -> List[AssetConfig]:
    return list(ASSETS.values())
