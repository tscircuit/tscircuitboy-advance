# tscircuit-boy-advance

RP2350 handheld gaming board, PCB sources, enclosure references, and assembly documentation.

Imported from [abse/gameboy-advance v0.0.39](https://tscircuit.com/abse/gameboy-advance/releases/177d61c9-c3d5-4c57-9418-e8109df44741). The original package name and registry URLs are retained so published dependencies and CAD assets keep resolving. The repository is named **tscircuit-boy-advance**.

`dist/index/` contains the published release outputs; those reports describe the published build. They are not a new stock check or physical prototype qualification. See `REGISTRY_SOURCE.json` for the upstream file hashes.

USB-C replacement, regulator and decoupling revision. The 3.5-inch BuyDisplay ER-TFT035IPS-6 display with capacitive touch is retained, with four-AA default and optional three-AA assembly.

## Build

Run `npm ci && npm run build`. This fully authored board uses unmodified tscircuit 0.0.2827 / core 0.0.2130 with the documented `routeRemaining={false}` setting. Obsolete automatic rerouting phases are removed so the native router does not replace the supplied copper. Native rendering, copper-pour generation, DRC, length checks, original electrical partition checks, all 17 project physical checks, and PCB-style checks remain enabled. No dependency patch is applied.

`bun checks/manual-routing-smoke.tsx` verifies exact authored route preservation and that missing required copper and a deliberate short still fail the physical checks.

## Schematic

The schematic uses eleven A4 sheets instead of sections: processor/clock/debug, RP2350 core power, USB, AA power, 3.234V logic supply, flash, PSRAM, microSD, audio, display/touch, and controls. Every one of the123 components has a short purpose and connection note placed immediately beside its symbol. Custom symbols include reference labels; supply/ground branches face the rails, bypass banks are grouped, and the clock RC pair is drawn together.

`npm run check:schematic` runs the schematic placement and style checks and verifies sheet assignment, source validity, and note coverage. The full build runs this check too. Open `dist/index/schematic-review.html` for a local sheet-by-sheet review. The website's right-click Run Style Analysis was also checked with this local Circuit JSON loaded only into the browser; it reported no style issues across all sheets. The component-adjacent annotations are included in v0.0.23.

## Hardware changes

- HRO TYPE-C-31-M-12 / C165948: 16-contact USB 2.0, 5 A, supplier-imported OBJ and STEP models. Supplier search reported 400,610 in stock at selection; USB and nearby power copper rerouted for its four plated mounting slots.

- Copper cutbacks beneath the regulator inductor and LX path; switching copper 0.25 mm and output copper 0.4 mm.
- Same-side 10 uF input / 4.7 uF output capacitors and compact local regulator ground loop.
- Dedicated top-layer feedback path from the output capacitor, separate from the DVDD load routes and away from the coil; the 5.5 mm project limit remains unchanged.
- Analog-filter capacitor with its own short ground-plane connection.
- Shorter far-DVDD bulk and PSRAM bypass paths with local ground returns.

## Validation and enclosure R8 (v0.0.31)

The board preserves all 133 original electrical groups and 462 component ports. Validation requires zero circuit errors, physical DRC errors, shorts and split physical nets. All 499 through vias have at least 0.3 mm holes and 0.45 mm pads. Twenty-three requested-width warnings remain; reviewed finite trace-length limits are documented in checks/trace-length-review.md. Critical primary decoupling and regulator feedback limits remain unchanged.

USB-C, microSD, power and volume reach the enclosure edges using local PCB support tongues and trim collars. Genuine Omron B3F-3152 supplier STEP/OBJ models and wider captive shoulder paddles preserve the face-button diamond. The battery cover uses an integral bending-plastic edge tab and two opposite locating tongues, with no separate spring or latch hardware. Shallow rear finger grooves retain the compact outline. The display remains centered.

All 72 enclosure models load from immutable public GLB URLs. Seventeen printable bodies and seventeen screw/heat-set insert mounts pass CAD fit, print mesh, fastener, display-flex and button/latch motion checks. The battery door uses no screws. Physical printed fit, latch fatigue, switch feel, display-flex qualification, firmware and factory CAM/DFM review remain required before fabrication signoff.

J_SPK uses JLCPCB C160388 (JST-SH top entry), mating with the supplied plug on CMS-23558N-L152B. See SPEAKER_ASSEMBLY.md for the speaker and 1 W operating requirement.

## Enclosure R12 (v0.0.32)

Plain rounded sides replace grip experiments. The central battery transition uses exact rounded profiles and a smooth degree-three loft, with finer preview tessellation. Oversized slots beneath the shoulder buttons are replaced by internal clearance pockets. The sourced holder remains attached to rear-shell M2 heat-set inserts independently of the PCB. Current CAD component, print, fastener and motion checks pass; physical printed fit remains required. Electrical PCB geometry remains the validated v0.0.31 routing.

## R13 (v0.0.33)

Stocked C7417180 replaces the battery inductor. See the current PARTS_STOCK_REVIEW.md, INDUCTOR_REPLACEMENT.md and PROTOTYPE_ORDER_REVIEW.md. Assembly access, screw drives, cap loading, shoulder insertion and hardware sizes are corrected; see ASSEMBLY_GUIDE.md for the diagram and steps. Four insulating PCB washers are specified. All required CAD/electrical checks pass; physical qualification remains necessary.

PCB assembly revision 0.0.34 adds polarity/pin-1 silkscreen, fabrication and user notes, and a manufacturer-datasheet contact audit for all 14 buttons. The Kinghelm schematic symbol common pairs are corrected; copper routing and via geometry are unchanged. See PCB_FABRICATION_NOTES.txt, PCB_USER_NOTES.txt and BUTTON_CONTACT_REVIEW.txt.

Revision 0.0.35 replaces the 6 mm circular battery-wire hole with an 8 x8 mm rectangular non-plated plug feed-through. One 0.8 mm ground branch detours clear of the opening; all 133 electrical net groups remain unchanged. A new build audit enforces at least0.3 mm copper-to-cutout clearance. See CONNECTOR_ACCESS_REVIEW.txt and the included JST PH housing drawing.

Revision0.0.36 aligns both shoulder supplier meshes using explicit cadmodel offsets and corrects the ALPS9.3 mm stake pitch, wheel height and enclosure opening. All114 supplier mesh contact projections pass; the volume reference is checked against the ALPS drawing. All77 component-fit checks,43 assembly-access checks and17 printable meshes pass. See MODEL_ALIGNMENT_REVIEW.txt.

## Current electrical prototype revision (v0.0.39)

APH0420T1R5M/C5349662 replaces the expensive battery inductor. AP63200
with a precision divider and300ohm trim produces nominal3.23394V logic.
A low-DCR ferrite preserves RP2350 analog supply margin; a0.6mm feed
connects the output directly. A330kohm amplifier input resistor limits audio
gain for the8ohm1W speaker. See ELECTRICAL_PROTOTYPE_REVIEW.txt for the
voltage/load/temperature calculation, current stock and bench bring-up limits.
This is a small-prototype candidate, with physical testing still required.
