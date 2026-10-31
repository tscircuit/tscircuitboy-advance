import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["CE"],
  pin2: ["SIO1"],
  pin3: ["SIO2"],
  pin4: ["VSS"],
  pin5: ["SIO0"],
  pin6: ["SCLK"],
  pin7: ["SIO3"],
  pin8: ["VDD"],
  pin9: ["EP"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin8: {requiresPower: true}
} as const

export const APS6404L_3SQR_ZR_Fabrication = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C3040877"
  ]
}}
      manufacturerPartNumber="APS6404L-3SQR-ZR"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.750062mm" pcbY="-1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.249936mm" pcbY="-1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.249936mm" pcbY="-1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.750062mm" pcbY="-1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-0.750062mm" pcbY="1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-0.249936mm" pcbY="1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="0.249936mm" pcbY="1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="0.750062mm" pcbY="1.50749mm" width="0.2800096mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="0mm" pcbY="0mm" width="1.6999966mm" height="0.2999994mm" shape="rect" />




<courtyardoutline outline={[{"x":-1.2679557999999815,"y":2.0574894000000086},{"x":1.2520553999999038,"y":2.0574894000000086},{"x":1.2520553999999038,"y":-2.0574894000000086},{"x":-1.2679557999999815,"y":-2.0574894000000086},{"x":-1.2679557999999815,"y":2.0574894000000086}]} />
      <silkscreenpath strokeWidth="0.15mm" route={[{"x":1.15,"y":-1.5760446000000456},{"x":1.15,"y":1.5763240000001133}]} />
<silkscreenpath strokeWidth="0.15mm" route={[{"x":-1.15,"y":1.5763240000001133},{"x":-1.15,"y":-1.5760446000000456}]} />
<silkscreencircle pcbX="-0.762mm" pcbY="-2.19mm" radius="0.100076mm" strokeWidth="0.15mm" />
<silkscreentext text="{NAME}" pcbX="0.003556mm" pcbY="2.813306mm" anchorAlignment="center" fontSize="1mm" />
</footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3040877.obj?uuid=2b35e1c3dcc44b77887d4f445b51370a",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3040877.step?uuid=2b35e1c3dcc44b77887d4f445b51370a",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.00795020000009572, y: 0.027940000000057807, z: 0 },
      }}
      {...props}
    />
  )
}
