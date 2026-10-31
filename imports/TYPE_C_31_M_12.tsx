// Exact C165948 imported footprint/CAD; canonical project pin IDs preserve the existing USB netlist.
// Imported-to-project pin mapping: {"1": 9, "2": 11, "3": 10, "4": 8, "5": 19, "6": 18, "7": 17, "8": 16, "9": 12, "10": 13, "11": 14, "12": 15, "13": 23, "14": 22, "15": 20, "16": 21}
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

export const TYPE_C_31_M_12 = (props: ConnectorProps) => {
  return (
    <connector
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C165948"
  ]
}}
      manufacturerPartNumber="TYPE-C-31-M-12"
      footprint={<footprint>
        <hole pcbX="-2.899918mm" pcbY="0.9055672mm" diameter="0.5999988mm" />
<hole pcbX="2.899918mm" pcbY="0.9055672mm" diameter="0.5999988mm" />
<platedhole  portHints={["pin11"]} pcbX="4.325112mm" pcbY="-2.7741308mm" holeWidth="0.7999984mm" holeHeight="1.1999976mm" outerWidth="1.1999976mm" outerHeight="1.7999964mm" shape="pill" />
<platedhole  portHints={["pin9"]} pcbX="4.325112mm" pcbY="1.4056932mm" holeWidth="0.7999984mm" holeHeight="1.499997mm" outerWidth="1.1999976mm" outerHeight="1.999996mm" shape="pill" />
<platedhole  portHints={["pin8"]} pcbX="-4.325112mm" pcbY="1.4056932mm" holeWidth="0.7999984mm" holeHeight="1.499997mm" outerWidth="1.1999976mm" outerHeight="1.999996mm" shape="pill" />
<platedhole  portHints={["pin10"]} pcbX="-4.325112mm" pcbY="-2.7741308mm" holeWidth="0.7999984mm" holeHeight="1.1999976mm" outerWidth="1.1999976mm" outerHeight="1.7999964mm" shape="pill" />
<smtpad portHints={["pin19"]} pcbX="-1.75006mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-1.249934mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-0.750062mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-0.249936mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="0.249936mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="0.750062mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="1.24968mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="1.75006mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin23"]} points={[{x: "-2.8999688mm", y: "1.524108mm"}, {x: "-2.8999688mm", y: "2.8241308mm"}, {x: "-2.8999688mm", y: "2.8241308mm"}, {x: "-3.1999682mm", y: "2.8241308mm"}, {x: "-3.1999682mm", y: "2.8241308mm"}, {x: "-3.1999682mm", y: "2.8239784mm"}, {x: "-3.1999682mm", y: "2.8239784mm"}, {x: "-3.4999422mm", y: "2.8239784mm"}, {x: "-3.4999422mm", y: "2.8239784mm"}, {x: "-3.4999422mm", y: "1.5239556mm"}, {x: "-3.4999422mm", y: "1.5239556mm"}, {x: "-3.1999428mm", y: "1.5239556mm"}, {x: "-3.1999428mm", y: "1.5239556mm"}, {x: "-3.1999428mm", y: "1.524108mm"}, {x: "-3.1999428mm", y: "1.524108mm"}, {x: "-2.8999688mm", y: "1.524108mm"}]} shape="polygon" />
<smtpad portHints={["pin22"]} points={[{x: "2.8999942mm", y: "2.8241308mm"}, {x: "2.8999942mm", y: "1.5241588mm"}, {x: "2.8999942mm", y: "1.5241588mm"}, {x: "3.1999936mm", y: "1.5241588mm"}, {x: "3.1999936mm", y: "1.5241588mm"}, {x: "3.200019mm", y: "1.5241588mm"}, {x: "3.200019mm", y: "1.5241588mm"}, {x: "3.5000184mm", y: "1.5241588mm"}, {x: "3.5000184mm", y: "1.5241588mm"}, {x: "3.5000184mm", y: "2.8241308mm"}, {x: "3.5000184mm", y: "2.8241308mm"}, {x: "3.200019mm", y: "2.8241308mm"}, {x: "3.200019mm", y: "2.8241308mm"}, {x: "3.1999936mm", y: "2.8241308mm"}, {x: "3.1999936mm", y: "2.8241308mm"}, {x: "2.8999942mm", y: "2.8241308mm"}]} shape="polygon" />
<smtpad portHints={["pin20"]} points={[{x: "2.7001724mm", y: "1.5241588mm"}, {x: "2.7001724mm", y: "2.8241308mm"}, {x: "2.7001724mm", y: "2.8241308mm"}, {x: "2.400173mm", y: "2.8241308mm"}, {x: "2.400173mm", y: "2.8241308mm"}, {x: "2.4001476mm", y: "2.8241308mm"}, {x: "2.4001476mm", y: "2.8241308mm"}, {x: "2.1001482mm", y: "2.8241308mm"}, {x: "2.1001482mm", y: "2.8241308mm"}, {x: "2.1001482mm", y: "1.5241588mm"}, {x: "2.1001482mm", y: "1.5241588mm"}, {x: "2.4001476mm", y: "1.5241588mm"}, {x: "2.4001476mm", y: "1.5241588mm"}, {x: "2.400173mm", y: "1.5241588mm"}, {x: "2.400173mm", y: "1.5241588mm"}, {x: "2.7001724mm", y: "1.5241588mm"}]} shape="polygon" />
<smtpad portHints={["pin21"]} points={[{x: "-2.0999704mm", y: "1.5240064mm"}, {x: "-2.0999704mm", y: "2.8239784mm"}, {x: "-2.0999704mm", y: "2.8239784mm"}, {x: "-2.3999952mm", y: "2.8239784mm"}, {x: "-2.3999952mm", y: "2.8239784mm"}, {x: "-2.3999952mm", y: "2.823953mm"}, {x: "-2.3999952mm", y: "2.823953mm"}, {x: "-2.6999438mm", y: "2.823953mm"}, {x: "-2.6999438mm", y: "2.823953mm"}, {x: "-2.6999438mm", y: "1.523981mm"}, {x: "-2.6999438mm", y: "1.523981mm"}, {x: "-2.399919mm", y: "1.523981mm"}, {x: "-2.399919mm", y: "1.523981mm"}, {x: "-2.399919mm", y: "1.5240064mm"}, {x: "-2.399919mm", y: "1.5240064mm"}, {x: "-2.0999704mm", y: "1.5240064mm"}]} shape="polygon" />
<silkscreenpath route={[{"x":-4.4689776000000165,"y":-1.6757585999999947},{"x":-4.4689776000000165,"y":0.18715359999987413}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-5.394140800000059},{"x":-4.4689776000000165,"y":-5.394140800000059},{"x":-4.4689776000000165,"y":-3.91283820000001}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-1.676114200000029},{"x":4.471009600000116,"y":0.18750920000002225}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-5.394140800000059},{"x":4.471009600000116,"y":-3.912482600000203}]} />
<silkscreentext text="{NAME}" pcbX="0.002794mm" pcbY="3.8286012mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.17511079999997,"y":3.074130799999921},{"x":5.17511079999997,"y":3.074130799999921},{"x":5.17511079999997,"y":-5.60002099999997},{"x":-5.17511079999997,"y":-5.60002099999997},{"x":-5.17511079999997,"y":3.074130799999921}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.obj?uuid=617b05f9bba7410b96c001093d8189e4",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.step?uuid=617b05f9bba7410b96c001093d8189e4",
        pcbRotationOffset: 180,
        // Align the model's y=0 front shell stakes with the imported front slots.
        modelOriginPosition: { x: 0, y: -2.3490872499999984, z: 0.000010999999999872223 },
      }}
      {...props}
    />
  )
}