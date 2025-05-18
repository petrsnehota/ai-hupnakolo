# feed_parser.py
import requests
import xml.etree.ElementTree as ET

FEED_URL = "https://feeds.mergado.com/hupnakolo-cz-heureka-cz-produktovy-cz-78dae326a8d1c326c7c3a4de96bca749.xml"

def load_products():
    try:
        response = requests.get(FEED_URL)
        tree = ET.fromstring(response.content)
        items = tree.findall(".//SHOPITEM")
        products = []

        for item in items[:50]:  # omezíme na 50 produktů kvůli rychlosti
            product = {
                "name": item.findtext("PRODUCTNAME"),
                "price": item.findtext("PRICE_VAT"),
                "manufacturer": item.findtext("MANUFACTURER"),
                "category": item.findtext("CATEGORYTEXT"),
                "availability": item.findtext("DELIVERY_DATE"),
                "url": item.findtext("URL")
            }
            products.append(product)

        return products

    except Exception as e:
        print(f"Chyba při načítání feedu: {e}")
        return []
