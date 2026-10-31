# Local speaker and connector revision

Use **Same Sky CMS-23558N-L152B**, 23 mm diameter × 5.5 mm nominal depth, 8 Ω,
1 W rated. The supplied JST-SH SHR-02V-S-B plug mates with **J_SPK:
BM02B-SRSS-TB(LF)(SN), JLCPCB C160388**, 2-pin, 1.0 mm pitch, top entry.
The new component uses the imported supplier footprint, OBJ and STEP model.

- J_SPK pin 1 connects to filtered PAM8403 L+ through FB_SPK_POS.
- J_SPK pin 2 connects to filtered PAM8403 L− through FB_SPK_NEG.
- Imported footprint pads 3/4 are mechanical solder tabs, retaining ground ties.
- Neither speaker wire is ground. Check supplied red/black polarity by continuity.

The speaker is **1 W rated**, not a 3 W replacement. A firmware output limiter
must be calibrated to keep continuous power at or below 1 W (2.83 Vrms for
nominal 8 Ω) under supply/load/gain tolerances. There is no firmware in this repo;
this revision does not implement that limiter. Start physical testing at low volume.

Enclosure R4 keeps the front GBA-style grille and localized four-AA rear bay.
A smaller, shallower mount reserves the speaker drawing's maximum 23.2 × 5.8 mm
body, with a removable printed retaining ring. Route and restrain the supplied
152 mm lead clear of buttons, FPC, screws, SD slot and battery door.
Display/FPC and physical print-fit qualifications remain outstanding.

Sources: [DigiKey speaker](https://www.digikey.com/en/products/detail/same-sky-formerly-cui-devices/CMS-23558N-L152B/13563557),
[manufacturer drawing](https://www.mouser.com/datasheet/3/6118/1/cms-23558n-l152.pdf),
[JLCPCB connector](https://jlcpcb.com/partdetail/JST-BM02B_SRSS_TB_LF_SN/C160388).
