import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

export const LXW_TS_6X6X5_SMD = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematictext text="{NAME}" schY={0.85} fontSize={0.16} />
          <port name="pin4" pinNumber={4} aliases={["4"]} direction="right" schX={0.4} schY={-0.2} schStemLength={0.2} />
          <port name="pin3" pinNumber={3} aliases={["3"]} direction="left" schX={-0.4} schY={-0.2} schStemLength={0.2} />
          <port name="pin2" pinNumber={2} aliases={["2"]} direction="right" schX={0.4} schY={0.2} schStemLength={0.2} />
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
    "C53447020"
  ]
}}
      manufacturerPartNumber="LXW-TS-6X6X5-SMD"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-3.599942mm" pcbY="2.249932mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-3.599942mm" pcbY="-2.249932mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="3.599942mm" pcbY="-2.249932mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="3.599942mm" pcbY="2.249932mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<silkscreenpath route={[{"x":-2.9211270000000695,"y":-3.048000000000002},{"x":2.9208730000000287,"y":-3.048000000000002}]} />
<silkscreenpath route={[{"x":-2.9211270000000695,"y":3.048000000000002},{"x":2.9208730000000287,"y":3.048000000000002}]} />
<silkscreenpath route={[{"x":-3.000248000000056,"y":1.2688570000000254},{"x":-3.000248000000056,"y":1.4187931999999819}]} />
<silkscreenpath route={[{"x":2.999765400000001,"y":1.2688570000000254},{"x":2.999765400000001,"y":-1.2688569999999117}]} />
<silkscreenpath route={[{"x":-3.000248000000056,"y":1.2688570000000254},{"x":-3.000248000000056,"y":-1.2688569999999117}]} />
<silkscreencircle pcbX="2.032mm" pcbY="-2.032mm" radius="0.567944mm" />
<silkscreencircle pcbX="2.09296mm" pcbY="1.97104mm" radius="0.567944mm" />
<silkscreencircle pcbX="-1.97104mm" pcbY="-2.09296mm" radius="0.567944mm" />
<silkscreencircle pcbX="-2.032mm" pcbY="2.032mm" radius="0.567944mm" />
<silkscreencircle pcbX="0mm" pcbY="0mm" radius="1.708658mm" />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="4.048mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.849939999999947,"y":3.249994000000015},{"x":4.849939999999833,"y":3.249994000000015},{"x":4.849939999999833,"y":-3.249994000000015},{"x":-4.849939999999947,"y":-3.249994000000015},{"x":-4.849939999999947,"y":3.249994000000015}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C53447020.obj?uuid=b0ab90694d704cafb01e19fabed227f5",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C53447020.step?uuid=b0ab90694d704cafb01e19fabed227f5",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.0004999999999999449, z: -0.5 },
      }}
      {...props}
    />
  )
}