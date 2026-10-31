# External purchased parts

| Item | Selected part | Quantity | Supplier link |
|---|---|---:|---|
| Four-AA holder, wire leads | MPD BH4AAW | 1 | [Mouser search for exact part](https://www.mouser.com/c/?q=BH4AAW) |
| Speaker, supplied JST-SH plug | Same Sky CMS-23558N-L152B, 8 ohm, 1 W | 1 | [DigiKey](https://www.digikey.com/en/products/detail/same-sky-formerly-cui-devices/CMS-23558N-L152B/13563557) |
| Retained display | BuyDisplay ER-TFT035IPS-6, 3.5 inch, 320x480 IPS | 1 | [BuyDisplay](https://www.buydisplay.com/3-5-inch-ips-320x480-tft-lcd-display-capacitive-touch-screen) |

The board uses four-wire SPI, a 50-pin 0.5 mm FPC and capacitive-touch wiring. The source and mechanical stack retain the previous capacitive-touch display; do not order the reverted 3.2 inch ST7789 panel. Confirm the store option and production FPC contact face before purchase.

The BH4AAW has bare wire leads, not a ready-made JST-PH plug. The assembly also requires one [JST PHR-2 housing](https://www.digikey.com/en/products/result?keywords=PHR-2) and two [SPH-002T-P0.5S crimp contacts](https://www.digikey.com/en/products/result?keywords=SPH-002T-P0.5S), or an equivalent professionally crimped harness. These are additional sourcing requirements, not previously confirmed purchased parts.

Other non-JLCPCB items: four alkaline AA cells, microSD card, printed PETG parts, CNC Kitchen heat-set inserts, machine screws and specified foam/silicone pieces. Their exact order quantities and dimensions are in mechanical/manifest.json and mechanical/insert-mounts.json. Stock of external parts was not live-verified in this revision.

R13 hardware: seven M2x4 and two M2x5 ISO7046 Type-H screws, four M3x6 ISO7045 screws, four M2.5x16 ISO7046 Type-H screws, four nylon washers (3.2mm ID,7mm OD,0.5mm thick), and9 M2/4 M3/4 M2.5 heat-set inserts. These are separate mechanical supplies; see ASSEMBLY_GUIDE.md and mechanical/insert-mounts.json. External stock has not been verified.
