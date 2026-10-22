# Order export shows unexpected totals

Resolved for application display; external spreadsheet follow-up open.

After the March release, an old export example treated the new total as decimal dollars. The executable API returned total_minor while a support note still referenced total.

Evidence collected: migration 002, Orders response for ord-001, and ORD-76. A stored value of 2500 should display as 25.00 USD. There was no evidence of a changed product price.

The application formatting was checked. The spreadsheet owner did not attend the review, so whether every downstream workbook was corrected remains unknown.
