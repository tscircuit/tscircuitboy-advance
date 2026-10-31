import objPath from "./SKHLLCA010.obj"
import stepPath from "./SKHLLCA010.step"
import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"]
} as const

export const SKHLLCA010 = (props: PushButtonProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <pushbutton
      name={name}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C139766"
  ]
}}
      manufacturerPartNumber="SKHLLCA010"
      footprint={<footprint>
        <platedhole  portHints={["pin1"]} pcbX="-2.499995mm" pcbY="-1.3699998mm" outerDiameter="1.7999964mm" holeDiameter="1.1999976mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="2.499995mm" pcbY="-1.3699998mm" outerDiameter="1.7999964mm" holeDiameter="1.1999976mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="3.499993mm" pcbY="1.1700002mm" outerDiameter="2.1999956mm" holeDiameter="1.5000224mm" shape="circle" />
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
        objUrl: objPath,
        stepUrl: stepPath,
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: 1.290010299999917, z: -0.000006999999999646178 },
      }}
      {...restProps}
    />
  )
}