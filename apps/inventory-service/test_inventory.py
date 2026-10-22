import os
import tempfile
import unittest
_data = tempfile.TemporaryDirectory()
os.environ["DATA_DIR"] = _data.name
from app import products, availability, Availability, Item

class InventoryTests(unittest.TestCase):
    def test_catalog_and_quote(self):
        self.assertEqual(len(products()), 15)
        self.assertEqual(availability(Availability(items=[Item(sku="NS-001", quantity=1)]))["total_minor"], 2500)

    def test_invalid_quantities(self):
        from pydantic import ValidationError
        for quantity in [0, -1, 1.5, True]:
            with self.assertRaises(ValidationError):
                Item(sku="NS-001", quantity=quantity)
