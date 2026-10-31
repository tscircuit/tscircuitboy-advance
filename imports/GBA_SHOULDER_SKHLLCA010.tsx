import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

export const GBA_SHOULDER_SKHLLCA010 = (props: ChipProps<typeof pinLabels>) => {
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
      // Exact imported C139766 geometry. Electrical terminal 1 -> pin1,
      // terminal 2 -> pin4. The two mechanical case stakes are pin2/pin3;
      // both remain without electrical traces, preserving existing controls.
      supplierPartNumbers={{jlcpcb:["C139766"]}}
      manufacturerPartNumber="SKHLLCA010"
      footprint={<footprint>
        <platedhole  portHints={["pin1"]} pcbX="-2.499995mm" pcbY="-1.3699998mm" outerDiameter="1.7999964mm" holeDiameter="1.1999976mm" shape="circle" />
<platedhole  portHints={["pin4"]} pcbX="2.499995mm" pcbY="-1.3699998mm" outerDiameter="1.7999964mm" holeDiameter="1.1999976mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="3.499993mm" pcbY="1.1700002mm" outerDiameter="2.1999956mm" holeDiameter="1.5000224mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="-3.499993mm" pcbY="1.1700002mm" outerDiameter="2.1999956mm" holeDiameter="1.5000224mm" shape="circle" />
<silkscreenpath route={[{"x":-3.7001196000001073,"y":2.8299918000002435},{"x":3.699865599999953,"y":2.8299918000002435}]} />
<silkscreenpath route={[{"x":3.699865599999953,"y":2.8299918000002435},{"x":3.699865599999953,"y":-3.969969199999923}]} />
<silkscreenpath route={[{"x":3.699865599999953,"y":-3.969969199999923},{"x":-3.7001196000001073,"y":-3.9699945999998363}]} />
<silkscreenpath route={[{"x":-3.7001196000001073,"y":-3.969969199999923},{"x":-3.7001196000001073,"y":2.8299918000002435}]} />
<silkscreenpath route={[{"x":-1.500124000000028,"y":-5.220004799999856},{"x":1.4998699999998735,"y":-5.220004799999856}]} />
<silkscreenpath route={[{"x":1.4998699999998735,"y":-5.220004799999856},{"x":1.4998699999998735,"y":-3.969969199999923}]} />
<silkscreenpath route={[{"x":-1.500124000000028,"y":-5.220004799999856},{"x":-1.500124000000028,"y":-3.969969199999923}]} />
<silkscreentext text="{NAME}" pcbX="-0.000127mm" pcbY="3.8210002mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.849990800000114,"y":2.8599770000000717},{"x":4.8499908000000005,"y":2.8599770000000717},{"x":4.8499908000000005,"y":-5.25999760000002},{"x":-4.849990800000114,"y":-5.25999760000002},{"x":-4.849990800000114,"y":2.8599770000000717}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C139766.obj?uuid=863d9133cc184422bb17583ca295bbc5",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C139766.step?uuid=863d9133cc184422bb17583ca295bbc5",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: 1.290010299999917, z: -0.000006999999999646178 },
      }}
      {...props}
    />
  )
}
