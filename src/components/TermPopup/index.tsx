import { Button } from "antd";
import { EventContext } from "chartjs-plugin-annotation";
import "./index.css";
import { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import Popup from "reactjs-popup";
import { TermDataProps } from "../../utils/types";

type Props = {
  termData: TermDataProps[];
  criticalTemperature: number;
};

const colors = [
  "red",
  "yellow",
  "green",
  "black",
  "blue",
  "pink",
  "purple",
  "orange",
  "brown",
  "grey",
];

type PointsData = {
  x: number;
  y: number;
};

type GraphDataProps = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  showLine?: boolean;
  data?: PointsData[];
};

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const TermPopup = (props: Props) => {
  const { termData, criticalTemperature } = props;

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (termData.length) {
      const res: GraphDataProps[] = [
        {
          label: "Tₑ max, °C",
          backgroundColor: "red",
          borderColor: "red",
        },
      ];
      const pointsData = [];
      for (let i = 0; i < termData.length; i++) {
        for (const [key, value] of Object.entries(termData[i])) {
          if (key === "time" || key === "temp" || key === "nativeTime") {
            continue;
          }
          pointsData.push({
            x: +value,
            y: +key,
          });
        }
        const color = colors[getRandomInt(0, 9)];
        res.push({
          label: termData[i].time,
          backgroundColor: color,
          borderColor: color,
          showLine: true,
          data: [...pointsData],
        });
        pointsData.length = 0;
      }
      setGraphData([...res] as never);
    }
  }, [termData]);

  const data = {
    datasets: graphData,
  };

  return (
    <Popup
      trigger={<Button className="button">Open Term Modal</Button>}
      modal
      nested
    >
      <div className="modal">
        <Scatter
          data={data}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Температура, °С",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Глубина, м",
                },
                reverse: true,
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (datasets) {
                    return `Глубина: ${datasets.formattedValue}\nТемпература ${datasets.label}`;
                  },
                },
              },
              annotation: {
                annotations: [
                  {
                    type: "line",
                    borderColor: "red",
                    borderWidth: 2,
                    label: {
                      drawTime: "afterDatasetsDraw",
                      content: `Tₑ max, °C: ${criticalTemperature}`,
                    },
                    scaleID: "x",
                    value: criticalTemperature,
                    borderDash: [10, 5],
                    enter(context: EventContext) {
                      // @ts-ignore
                      context.element.options.label.enabled = true;
                      context.chart.draw();
                    },
                    leave(context: EventContext) {
                      // @ts-ignore
                      context.element.options.label.enabled = false;
                      context.chart.draw();
                    },
                  },
                ],
              },
            },
          }}
        />
      </div>
    </Popup>
  );
};
