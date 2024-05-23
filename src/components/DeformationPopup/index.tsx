import { Button } from "antd";
import "chartjs-adapter-moment";
import annotationPlugin, { EventContext } from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./index.css";
import moment from "moment";
import { Line } from "react-chartjs-2";
import Popup from "reactjs-popup";
import { DeformationGraphProps } from "../../utils/types";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  zoomPlugin
);

type Props = {
  deformationData: DeformationGraphProps[];
  deformationTrendData: DeformationGraphProps[];
  endDate: string;
  maxDelta: number;
};

export const DeformationPopup = (props: Props) => {
  const { deformationData, deformationTrendData, endDate, maxDelta } = props;

  const endOfOperation = {
    borderColor: "black",
    borderWidth: 5,
    label: {
      title: "End date",
      display: false,
      drawTime: "afterDatasetsDraw",
      content: `Конец эксплуатации: ${moment(endDate)
        .utc(false)
        .format("DD.MM.YYYY kk:mm")}`,
    },
    scaleID: "x",
    value: endDate,
    enter(context: EventContext) {
      //@ts-ignore
      context.element.options.label.enabled = true;
      context.chart.draw();
    },
    leave(context: EventContext) {
      //@ts-ignore
      context.element.options.label.enabled = false;
      context.chart.draw();
    },
  };

  const maxDeltaAnnotation = {
    borderColor: "orange",
    borderWidth: 2,
    label: {
      title: "Макс. Δ, м",
      display: false,
      drawTime: "afterDatasetsDraw",
      content: `Макс. Δ, м: ${maxDelta.toFixed(4)}`,
    },
    scaleID: "y",
    value: maxDelta,
    pointColor: "#19283F",
    pointHighlightColor: "#28AFFA",
    borderDash: [10, 5],
    enter(context: EventContext) {
      //@ts-ignore
      context.element.options.label.enabled = true;
      context.chart.draw();
    },
    leave(context: EventContext) {
      //@ts-ignore
      context.element.options.label.enabled = false;
      context.chart.draw();
    },
  };

  const mixDeltaAnnotation = {
    borderColor: "green",
    borderWidth: 2,
    label: {
      title: "Мин. Δ, м",
      display: false,
      drawTime: "afterDatasetsDraw",
      content: `Макс. Δ, м: ${-Math.abs(Number(maxDelta.toFixed(4)))}`,
    },
    scaleID: "y",
    value: -Math.abs(maxDelta),
    pointColor: "#19283F",
    pointHighlightColor: "#28AFFA",
    borderDash: [10, 5],
    enter(context: EventContext) {
      //@ts-ignore
      context.element.options.label.enabled = true;
      context.chart.draw();
    },
    leave(context: EventContext) {
      //@ts-ignore
      context.element.options.label.enabled = false;
      context.chart.draw();
    },
  };

  const options = {
    response: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Дата",
        },
        type: "time" as const,
        time: {
          displayFormats: {
            quarter: "MMM. YYYY",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Смещение (Δ), м",
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          endOfOperation,
          maxDeltaAnnotation,
          mixDeltaAnnotation,
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const,
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Δ",
        data: deformationData,
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: "Тренд Δ",
        data: deformationTrendData,
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "Конец эксплуатации",
        data: [],
        borderColor: "black",
        backgroundColor: "black",
      },
      {
        label: "Макс. Δ, м",
        data: [],
        borderColor: "orange",
        backgroundColor: "orange",
      },
      {
        label: "Мин. Δ, м",
        data: [],
        borderColor: "green",
        backgroundColor: "green",
      },
    ],
  };

  return (
    <Popup
      trigger={<Button className="button"> Open Deformation Modal </Button>}
      modal
      nested
    >
      <div className="modal">
        <Line data={data} options={options} />
      </div>
    </Popup>
  );
};
