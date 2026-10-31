import { USB4110VisualModel } from "./USB4110_VisualModel"
import type { ConnectorProps } from "@tscircuit/props"

const pinLabels = {
  pin8: ["SHELL4"],
  pin9: ["SHELL3"],
  pin10: ["SHELL2"],
  pin11: ["SHELL1"],
  pin12: ["A7","DN1"],
  pin13: ["B6","DP2"],
  pin14: ["A8","SBU1"],
  pin15: ["B5","CC2"],
  pin16: ["A6","DP1"],
  pin17: ["B7","DN2"],
  pin18: ["A5","CC1"],
  pin19: ["B8","SBU2"],
  pin20: ["B4A9","VBUS1"],
  pin21: ["A4B9","VBUS2"],
  pin22: ["B1A12","GND1"],
  pin23: ["A1B12","GND2"]
} as const

export const USB4110_GF_A = (props: ConnectorProps) => {
  return (
    <connector
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C5143397"
  ]
}}
      manufacturerPartNumber="USB4110-GF-A"
      footprint={<footprint>
        <hole pcbX="2.890012mm" pcbY="1.3899896mm" diameter="0.649986mm" />
<hole pcbX="-2.890012mm" pcbY="1.3899896mm" diameter="0.649986mm" />
<smtpad portHints={["pin11"]} pcbX="5.1099974mm" pcbY="-2.040001mm" width="2.1800058mm" height="1.999996mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-5.1099974mm" pcbY="-2.040001mm" width="2.1800058mm" height="1.999996mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="5.1099974mm" pcbY="1.8899886mm" width="2.1800058mm" height="1.999996mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-5.1099974mm" pcbY="1.8899886mm" width="2.1800058mm" height="1.999996mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="0.249936mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="0.750062mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="1.249934mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="1.75006mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-0.249936mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-0.750062mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-1.249934mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="-1.75006mm" pcbY="2.4649938mm" width="0.2999994mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="2.3999952mm" pcbY="2.4649938mm" width="0.5999988mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="-2.3999952mm" pcbY="2.4649938mm" width="0.5999988mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="3.1999936mm" pcbY="2.4649938mm" width="0.5999988mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="-3.1999936mm" pcbY="2.4649938mm" width="0.5999988mm" height="1.1500104mm" shape="rect" />
<silkscreenpath route={[{"x":-4.5999908000000005,"y":-0.8088629999999739},{"x":-4.5999908000000005,"y":0.6588505999998233}]} />
<silkscreenpath route={[{"x":4.599990799999887,"y":-3.2711389999999483},{"x":4.599990799999887,"y":-4.887493400000039},{"x":-4.5999908000000005,"y":-4.887493400000039},{"x":-4.5999908000000005,"y":-3.2711389999999483}]} />
<silkscreenpath route={[{"x":4.599990799999887,"y":0.6588505999998233},{"x":4.599990799999887,"y":-0.8088629999999739}]} />
<silkscreenpath route={[{"x":3.731133,"y":2.4124919999999292},{"x":3.7888417999998865,"y":2.4124919999999292}]} />
<silkscreenpath route={[{"x":-3.788841800000114,"y":2.4124919999999292},{"x":-3.7311330000001135,"y":2.4124919999999292}]} />
<silkscreentext text="{NAME}" pcbX="0.009906mm" pcbY="4.0329886mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":-3.0903926000000865,"y":0.5422391999999263},{"x":2.9095953999999438,"y":0.5422391999999263},{"x":2.9095953999999438,"y":0.0422401999998101},{"x":-3.0903926000000865,"y":0.0422401999998101},{"x":-3.0903926000000865,"y":0.5422391999999263}]} strokeWidth="0mm" isFilled hasStroke={false} />
<fabricationnotepath route={[{"x":-3.5903915999999754,"y":-4.957775200000015},{"x":-3.5903915999999754,"y":0.5422391999999263},{"x":-3.0903926000000865,"y":0.5422391999999263},{"x":-3.0903926000000865,"y":-4.957775200000015},{"x":-3.5903915999999754,"y":-4.957775200000015}]} strokeWidth="0mm" isFilled hasStroke={false} />
<fabricationnotepath route={[{"x":3.4095943999999463,"y":-4.957775200000015},{"x":3.4095943999999463,"y":0.5422391999999263},{"x":2.9095953999999438,"y":0.5422391999999263},{"x":2.9095953999999438,"y":-4.957775200000015},{"x":3.4095943999999463,"y":-4.957775200000015}]} strokeWidth="0mm" isFilled hasStroke={false} />
<courtyardoutline outline={[{"x":-6.437693999999965,"y":3.2829885999998396},{"x":6.457505999999967,"y":3.2829885999998396},{"x":6.457505999999967,"y":-5.218011400000137},{"x":-6.437693999999965,"y":-5.218011400000137},{"x":-6.437693999999965,"y":3.2829885999998396}]} />
      </footprint>}
      
      cadModel={USB4110VisualModel}
      {...props}
    />
  )
}
