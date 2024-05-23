import { Button } from "antd";
import {
  Chart as ChartJS,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";
import annotationPlugin, { EventContext } from "chartjs-plugin-annotation";
import "./index.css";
import { Line } from "react-chartjs-2";
import Popup from "reactjs-popup";
import { DeformationGraphProps } from "../../utils/types";

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

type Props = {
  termData: DeformationGraphProps[];
  termTrendData: DeformationGraphProps[];
  criticalTemperature: number;
};

export const TermTrendPopup = (props: Props) => {
  const { termData, termTrendData, criticalTemperature } = props;
  console.log(termData);
  const maxTemp = {
    borderColor: "orange",
    borderWidth: 2,
    label: {
      title: "End date",
      display: false,
      drawTime: "afterDatasetsDraw",
      content: `Tₑ max, °C: ${criticalTemperature}`,
    },
    scaleID: "y",
    value: criticalTemperature,
    pointColor: "#19283F",
    pointHighlightColor: "#28AFFA",
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
  };

  const options = {
    response: true,
    scales: {
      x: {
        type: "time" as const,

        time: {
          displayFormats: {
            quarter: "YYYY",
          },
        },
        title: {
          display: true,
          text: "Дата",
        },
      },
      y: {
        title: {
          display: true,
          text: "Температура, С",
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          maxTemp,
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Tₑ, C",
        data: termData,
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: "Тренд Tₑ",
        data: termTrendData,
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "Tₑ max, °C",
        borderColor: "orange",
        backgroundColor: "orange",
        data: [],
      },
    ],
  };

  return (
    <Popup
      trigger={<Button className="button">Open Term Trend Modal</Button>}
      modal
      nested
    >
      <div className="modal">
        <Line data={data} options={options} />
      </div>
    </Popup>
  );
};
