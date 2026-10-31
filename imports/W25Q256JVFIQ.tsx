import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["IO3"], pin2: ["VCC"], pin3: ["RESET_N"],
  pin4: ["NC4"], pin5: ["NC5"], pin6: ["NC6"],
  pin7: ["CS"], pin8: ["IO1"], pin9: ["IO2"], pin10: ["GND"],
  pin11: ["NC11"], pin12: ["NC12"], pin13: ["NC13"], pin14: ["NC14"],
  pin15: ["IO0"], pin16: ["CLK"],
} as const

// NC4–NC6 and NC11–NC14 intentionally unconnected (Winbond datasheet, p7).
const pinAttributes = {
  pin2: {requiresPower: true},
  pin10: {requiresGround: true}
} as const

export const W25Q256JVFIQ = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C779876"
  ]
}}
      manufacturerPartNumber="W25Q256JVFIQ"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-4.445mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin2"]} pcbX="-3.175mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin3"]} pcbX="-1.905mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin4"]} pcbX="-0.635mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="0.635mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin6"]} pcbX="1.905mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin7"]} pcbX="3.175mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin8"]} pcbX="4.445mm" pcbY="-4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin16"]} pcbX="-4.445mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin15"]} pcbX="-3.175mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin14"]} pcbX="-1.905mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin13"]} pcbX="-0.635mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin12"]} pcbX="0.635mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin11"]} pcbX="1.905mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin10"]} pcbX="3.175mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<smtpad portHints={["pin9"]} pcbX="4.445mm" pcbY="4.750308mm" width="0.5739892mm" height="2.4005032mm" radius="0.2869946mm" shape="pill" />
<silkscreenpath route={[{"x":-5.226202400000034,"y":-3.3214056000000483},{"x":-5.226202400000034,"y":3.3214055999999346},{"x":5.226202400000034,"y":3.3214055999999346},{"x":5.226202400000034,"y":-3.3214056000000483},{"x":-5.226202400000034,"y":-3.3214056000000483}]} />
<silkscreencircle pcbX="-4.445mm" pcbY="-2.568956mm" radius="0.150114mm" />
<silkscreencircle pcbX="-5.184394mm" pcbY="-4.750308mm" radius="0.150114mm" />
<silkscreentext text="{NAME}" pcbX="-0.0508mm" pcbY="6.6642mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.4000023999999485,"y":6.200559600000133},{"x":5.399977000000035,"y":6.200559600000133},{"x":5.399977000000035,"y":-6.20055960000002},{"x":-5.4000023999999485,"y":-6.20055960000002},{"x":-5.4000023999999485,"y":6.200559600000133}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C779876.obj?uuid=5eab397ba6c7470199f8f0425efad579",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C779876.step?uuid=5eab397ba6c7470199f8f0425efad579",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: 0, z: -0.049425 },
      }}
      {...props}
    />
  )
}