// Drawing-based reference visual; GCT USB4110 drawing, not an official STEP model.
// https://gct.co/files/drawings/USB4110.pdf
export const USB4110VisualModel = {
  "jscad": {
    "type": "union",
    "shapes": [
      {
        "type": "colorize",
        "color": [
          0.67,
          0.69,
          0.72
        ],
        "shape": {
          "type": "subtract",
          "shapes": [
            {
              "type": "union",
              "shapes": [
                {
                  "type": "cuboid",
                  "size": [
                    5.779999999999999,
                    7.35,
                    3.16
                  ],
                  "center": [
                    0,
                    -1.2124933999999996,
                    1.68
                  ]
                },
                {
                  "type": "translate",
                  "vector": [
                    -2.8899999999999997,
                    -1.2124933999999996,
                    1.68
                  ],
                  "shape": {
                    "type": "rotate",
                    "angles": [
                      1.5707963267948966,
                      0,
                      0
                    ],
                    "shape": {
                      "type": "cylinder",
                      "height": 7.35,
                      "radius": 1.58,
                      "segments": 48
                    }
                  }
                },
                {
                  "type": "translate",
                  "vector": [
                    2.8899999999999997,
                    -1.2124933999999996,
                    1.68
                  ],
                  "shape": {
                    "type": "rotate",
                    "angles": [
                      1.5707963267948966,
                      0,
                      0
                    ],
                    "shape": {
                      "type": "cylinder",
                      "height": 7.35,
                      "radius": 1.58,
                      "segments": 48
                    }
                  }
                }
              ]
            },
            {
              "type": "union",
              "shapes": [
                {
                  "type": "cuboid",
                  "size": [
                    5.779999999999999,
                    7.1,
                    2.56
                  ],
                  "center": [
                    0,
                    -1.7874933999999998,
                    1.68
                  ]
                },
                {
                  "type": "translate",
                  "vector": [
                    -2.8899999999999997,
                    -1.7874933999999998,
                    1.68
                  ],
                  "shape": {
                    "type": "rotate",
                    "angles": [
                      1.5707963267948966,
                      0,
                      0
                    ],
                    "shape": {
                      "type": "cylinder",
                      "height": 7.1,
                      "radius": 1.28,
                      "segments": 48
                    }
                  }
                },
                {
                  "type": "translate",
                  "vector": [
                    2.8899999999999997,
                    -1.7874933999999998,
                    1.68
                  ],
                  "shape": {
                    "type": "rotate",
                    "angles": [
                      1.5707963267948966,
                      0,
                      0
                    ],
                    "shape": {
                      "type": "cylinder",
                      "height": 7.1,
                      "radius": 1.28,
                      "segments": 48
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {
        "type": "colorize",
        "color": [
          0.07,
          0.07,
          0.08
        ],
        "shape": {
          "type": "cuboid",
          "size": [
            8,
            1,
            2.56
          ],
          "center": [
            0,
            1.9625066,
            1.68
          ]
        }
      },
      {
        "type": "colorize",
        "color": [
          0.07,
          0.07,
          0.08
        ],
        "shape": {
          "type": "cuboid",
          "size": [
            6.69,
            5.3,
            0.7
          ],
          "center": [
            0,
            -0.9,
            1.68
          ]
        }
      },
      {
        "type": "colorize",
        "color": [
          0.67,
          0.69,
          0.72
        ],
        "shape": {
          "type": "cuboid",
          "size": [
            2.1800058,
            1.999996,
            0.3
          ],
          "center": [
            -5.1099974,
            -2.040001,
            0.15
          ]
        }
      },
      {
        "type": "colorize",
        "color": [
          0.67,
          0.69,
          0.72
        ],
        "shape": {
          "type": "cuboid",
          "size": [
            2.1800058,
            1.999996,
            0.3
          ],
          "center": [
            -5.1099974,
            1.8899886,
            0.15
          ]
        }
      },
      {
        "type": "colorize",
        "color": [
          0.67,
          0.69,
          0.72
        ],
        "shape": {
          "type": "cuboid",
          "size": [
            2.1800058,
            1.999996,
            0.3
          ],
          "center": [
            5.1099974,
            -2.040001,
            0.15
          ]
        }
      },
      {
        "type": "colorize",
        "color": [
          0.67,
          0.69,
          0.72
        ],
        "shape": {
          "type": "cuboid",
          "size": [
            2.1800058,
            1.999996,
            0.3
          ],
          "center": [
            5.1099974,
            1.8899886,
            0.15
          ]
        }
      }
    ]
  },
  "pcbRotationOffset": 0
}
