import type { InductorProps } from "@tscircuit/props"

export const XGL4020_152MEC = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="1.5uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C7417180"
  ]
}}
      manufacturerPartNumber="XGL4020-152MEC"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="1.18491mm" pcbY="0mm" width="0.999998mm" height="3.3999932mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.18491mm" pcbY="0mm" width="0.999998mm" height="3.3999932mm" shape="rect" />
<silkscreenpath route={[{"x":1.99999600000001,"y":1.99999600000001},{"x":1.99999600000001,"y":-1.9999959999998964},{"x":-1.99999600000001,"y":-1.9999959999998964},{"x":-1.99999600000001,"y":1.99999600000001}]} />
<silkscreenpath route={[{"x":-1.99999600000001,"y":1.99999600000001},{"x":1.99999600000001,"y":1.99999600000001}]} />
<silkscreentext text="{NAME}" pcbX="-0.0127mm" pcbY="3.0066mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.24999600000001,"y":2.2549997999999505},{"x":2.24999600000001,"y":2.2549997999999505},{"x":2.24999600000001,"y":-2.2549997999999505},{"x":-2.24999600000001,"y":-2.2549997999999505},{"x":-2.24999600000001,"y":2.2549997999999505}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C7417180.obj",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C7417180.step",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.004999999999999893, z: -0.1 },
      }}
      {...props}
    />
  )
}