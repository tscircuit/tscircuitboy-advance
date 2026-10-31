import type { InductorProps } from "@tscircuit/props"

export const AOTA_B201610S3R3_101_T = (
  props: Omit<InductorProps, "inductance">,
) => {
  return (
    <inductor
      inductance="3.3uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C42411119"
  ]
}}
      manufacturerPartNumber="AOTA_B201610S3R3_101_T"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="0.999998mm" pcbY="0mm" width="0.999998mm" height="1.5999968mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-0.999998mm" pcbY="0mm" width="0.999998mm" height="1.5999968mm" shape="rect" />
<silkscreenpath route={[{"x":-0.2688590000000204,"y":-0.7999984000001632},{"x":0.2688590000000204,"y":-0.7999984000001632}]} />
<silkscreenpath route={[{"x":-0.2688590000000204,"y":0.7999983999999358},{"x":0.2688590000000204,"y":0.7999983999999358}]} />
<silkscreencircle pcbX="0.899922mm" pcbY="1.100074mm" radius="0.127mm" />
<silkscreentext text="{NAME}" pcbX="-0.009398mm" pcbY="2.2192mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.7499970000000076,"y":1.0550021999998762},{"x":1.7499970000000076,"y":1.0550021999998762},{"x":1.7499970000000076,"y":-1.0550022000001036},{"x":-1.7499970000000076,"y":-1.0550022000001036},{"x":-1.7499970000000076,"y":1.0550021999998762}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C42411119.obj?uuid=1fea8f9ef5b64dc68dc98052e0860c3b",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C42411119.step?uuid=1fea8f9ef5b64dc68dc98052e0860c3b",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.0050000000000000044, z: -0.05 },
      }}
      {...props}
    />
  )
}
