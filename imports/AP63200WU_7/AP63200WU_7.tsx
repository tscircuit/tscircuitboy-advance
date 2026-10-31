import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["FB"],
  pin2: ["EN"],
  pin3: ["VIN"],
  pin4: ["GND"],
  pin5: ["SW"],
  pin6: ["BST"]
} as const

const pinAttributes = {
  pin3: {requiresPower: true},
  pin4: {requiresGround: true}
} as const

export const AP63200WU_7 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2071868"
  ]
}}
      manufacturerPartNumber="AP63200WU-7"
      // Shared Diodes TSOT26 land pattern retained from AP63203.
      footprint={<footprint>
        <smtpad portHints={["pin6"]} pcbX="-1.199896mm" pcbY="-0.94996mm" width="1.0999978mm" height="0.5500116mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-1.199896mm" pcbY="0.0mm" width="1.0999978mm" height="0.5500116mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-1.199896mm" pcbY="0.94996mm" width="1.0999978mm" height="0.5500116mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="1.199896mm" pcbY="0.94996mm" width="1.0999978mm" height="0.5500116mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="1.199896mm" pcbY="0.0mm" width="1.0999978mm" height="0.5500116mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="1.199896mm" pcbY="-0.94996mm" width="1.0999978mm" height="0.5500116mm" shape="rect" />
<silkscreenpath route={[{"x":0.5718555999999353,"y":1.4999969999998939},{"x":0.7999984000000495,"y":1.4999969999998939},{"x":0.7999984000000495,"y":1.4291055999999571}]} />
<silkscreenpath route={[{"x":-0.571855600000049,"y":1.4999969999998939},{"x":-0.7999984000000495,"y":1.4999969999998939},{"x":-0.7999984000000495,"y":1.4291055999999571}]} />
<silkscreenpath route={[{"x":0.5720588000000362,"y":-1.4999970000000076},{"x":0.7999984000000495,"y":-1.4999970000000076},{"x":0.7999984000000495,"y":-1.4291056000000708}]} />
<silkscreenpath route={[{"x":-0.572262000000137,"y":-1.4999970000000076},{"x":-0.7999984000000495,"y":-1.4999970000000076},{"x":-0.7999984000000495,"y":-1.4291056000000708}]} />
<silkscreenpath route={[{"x":-0.571855600000049,"y":1.4999969999998939},{"x":0.5718555999999353,"y":1.4999969999998939}]} />
<silkscreenpath route={[{"x":0.5720588000000362,"y":-1.4999970000000076},{"x":-0.572262000000137,"y":-1.4999970000000076}]} />
<silkscreentext text="{NAME}" pcbX="-2.7526mm" pcbY="0.0mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.999894900000072,"y":-1.700009800000089},{"x":-1.999894900000072,"y":1.6999843999999484},{"x":1.9998948999999584,"y":1.6999843999999484},{"x":1.9998948999999584,"y":-1.700009800000089},{"x":-1.999894900000072,"y":-1.700009800000089}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2071868.obj",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2071868.step",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 0.000025399999913133797, y: -0.0000889000000370288, z: -0.048939 },
      }}
      {...props}
    />
  )
}