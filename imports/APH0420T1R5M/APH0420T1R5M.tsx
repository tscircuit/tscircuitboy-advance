import type { InductorProps } from "@tscircuit/props"

export const APH0420T1R5M = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="1.5uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C5349662"
  ]
}}
      manufacturerPartNumber="APH0420T1R5M"
      // APV datasheet land pattern: I=1.50, J=2.20, H=2.50 mm.
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="1.85mm" pcbY="0mm" width="1.5mm" height="2.5mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-1.85mm" pcbY="0mm" width="1.5mm" height="2.5mm" shape="rect" />
<silkscreenpath route={[{"x":-2.2761956000001646,"y":1.2123928000000888},{"x":-2.2761956000001646,"y":2.1761957999999595},{"x":2.276195600000051,"y":2.1761957999999595},{"x":2.276195600000051,"y":1.2123928000000888}]} />
<silkscreenpath route={[{"x":-2.2761956000001646,"y":-1.212392799999975},{"x":-2.2761956000001646,"y":-2.1761957999999595},{"x":2.276195600000051,"y":-2.1761957999999595},{"x":2.276195600000051,"y":-1.212392799999975}]} />
<silkscreentext text="{NAME}" pcbX="0.0127mm" pcbY="3.1844mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.9779345999999123,"y":2.349995799999988},{"x":2.9779345999997986,"y":2.349995799999988},{"x":2.9779345999997986,"y":-2.349995799999874},{"x":-2.9779345999999123,"y":-2.349995799999874},{"x":-2.9779345999999123,"y":2.349995799999988}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5349662.obj",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5349662.step",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}