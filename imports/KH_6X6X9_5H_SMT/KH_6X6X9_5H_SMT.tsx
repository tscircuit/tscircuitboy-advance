import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

export const KH_6X6X9_5H_SMT = (props: ChipProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <chip
      name={name}
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematictext text="{NAME}" schY={0.85} fontSize={0.16} />
          <port name="pin4" pinNumber={4} aliases={["4"]} direction="right" schX={0.4} schY={-0.2} schStemLength={0.2} />
          <port name="pin2" pinNumber={2} aliases={["2"]} direction="left" schX={-0.4} schY={-0.2} schStemLength={0.2} />
          <port name="pin3" pinNumber={3} aliases={["3"]} direction="right" schX={0.4} schY={0.2} schStemLength={0.2} />
          <port name="pin1" pinNumber={1} aliases={["1"]} direction="left" schX={-0.4} schY={0.2} schStemLength={0.2} />
          <schematicpath points={[{"x":-0.04,"y":0.08},{"x":-0.08,"y":-0.08}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0.2,"y":-0.2},{"x":-0.2,"y":-0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0,"y":-0.115},{"x":0,"y":-0.195}]} strokeColor="#880000" />
          <schematiccircle center={{ x: 0, y: -0.075 }} radius={0.03} strokeWidth={0.02} color="#880000" />
          <schematicpath points={[{"x":-0.2,"y":0.2},{"x":0.2,"y":0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0,"y":0.12},{"x":0,"y":0.2}]} strokeColor="#880000" />
          <schematiccircle center={{ x: 0, y: 0.08 }} radius={0.03} strokeWidth={0.02} color="#880000" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C3038675"
  ]
}}
      manufacturerPartNumber="KH-6X6X9.5H-SMT"
      footprint={<footprint>
<smtpad portHints={["pin1"]} pcbX="-4.200017mm" pcbY="2.232152mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="4.200017mm" pcbY="2.267966mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="4.200017mm" pcbY="-2.267966mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-4.200017mm" pcbY="-2.267966mm" width="1.999996mm" height="1.1999976mm" shape="rect" />

        <silkscreenpath route={[{"x":-3.000044800000069,"y":2.9820869999999786},{"x":2.9999431999999615,"y":2.9820869999999786},{"x":2.9999431999999615,"y":-3.017900999999938},{"x":-3.000044800000069,"y":-3.017900999999938},{"x":-3.000044800000069,"y":2.9820869999999786}]} />
<silkscreencircle pcbX="1.999869mm" pcbY="-2.01803mm" radius="0.36068mm" />
<silkscreencircle pcbX="-2.000123mm" pcbY="-2.01803mm" radius="0.36068mm" />
<silkscreencircle pcbX="-2.000123mm" pcbY="1.981962mm" radius="0.36068mm" />
<silkscreencircle pcbX="1.999869mm" pcbY="1.981962mm" radius="0.36068mm" />
<silkscreencircle pcbX="-0.000127mm" pcbY="-0.01778mm" radius="1.400048mm" />
<silkscreentext text="{NAME}" pcbX="-0.017145mm" pcbY="4.018282mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.450015000000008,"y":3.250044800000069},{"x":5.450014999999894,"y":3.250044800000069},{"x":5.450014999999894,"y":-3.249943199999848},{"x":-5.450015000000008,"y":-3.249943199999848},{"x":-5.450015000000008,"y":3.250044800000069}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3038675.obj",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3038675.step",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.00005079999993995443, y: 0.00044919999994630366, z: -0.5 },
      }}
      {...restProps}
    />
  )
}