import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

export const GBA_SHOULDER_B3F3152 = (props: ChipProps<typeof pinLabels>) => {
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
      // Omron drawing page 5: two 1 mm electrical holes, two 1.5 mm case-ground stakes.
      // Preserve pin1/pin4 switch terminals and pin2/pin3 unconnected case stakes.
      // Supplier STEP/OBJ is imported, not constructed for this project.
      supplierPartNumbers={{jlcpcb:["C231320"]}}
      manufacturerPartNumber="B3F-3152"
      footprint={<footprint insertionDirection="from_bottom">
        <platedhole portHints={["pin1"]} pcbX={-2.25} pcbY={0} outerDiameter={1.6} holeDiameter={1} shape="circle" />
        <platedhole portHints={["pin4"]} pcbX={2.25} pcbY={0} outerDiameter={1.6} holeDiameter={1} shape="circle" />
        <platedhole portHints={["pin2"]} pcbX={3.5} pcbY={2.5} outerDiameter={2.1} holeDiameter={1.5} shape="circle" />
        <platedhole portHints={["pin3"]} pcbX={-3.5} pcbY={2.5} outerDiameter={2.1} holeDiameter={1.5} shape="circle" />
        <courtyardoutline outline={[{x:-4.65,y:-6.55},{x:4.65,y:-6.55},{x:4.65,y:4.4},{x:-4.65,y:4.4}]} />
      </footprint>}
      cadModel={<cadmodel
        modelUrl="https://modelcdn.tscircuit.com/easyeda_models/assets/C231320.obj"
        stepUrl="https://modelcdn.tscircuit.com/easyeda_models/assets/C231320.step"
        pcbRotationOffset={0}
        modelOriginPosition={{x:0,y:0,z:0}}
        // Footprint bounds centre is1.375 mm inward of the authored pin origin.
        // CadModel positionOffset is applied in board coordinates: restore the
        // supplier model's pin origin at pcbY39.6 for both180-degree switches.
        positionOffset={{x:0,y:1.375,z:0}}
      />}
      {...props}
    />
  )
}
