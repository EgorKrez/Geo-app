import SearchLogo from "../../assets/search.svg";
import { Button, DatePicker, Space, Table } from "antd";
import { DeformationPopup } from "../DeformationPopup";
import "./index.css";
import { SortOrder } from "antd/es/table/interface";
import moment from "moment";
import { useEffect, useState } from "react";
import { convertNumber, filterColumn } from "../../utils";
import {
  DeformationResponseDataProps,
  DeformationResponseProps,
  DeformationTrendResponseProps,
} from "../../utils/jsonTypes";
import {
  DeformationGraphProps,
  DeformationTableProps,
} from "../../utils/types";

export const Deformation = () => {
  const { Column } = Table;

  const [deformation, setDeformation] = useState<DeformationResponseProps>();
  const [deformationData, setDeformationData] = useState<
    DeformationTableProps[]
  >([]);
  const [deformationTrend, setDeformationTrend] =
    useState<DeformationTrendResponseProps>();
  const [deformationGraphData, setDeformationGraphData] = useState<
    DeformationGraphProps[]
  >([]);
  const [deformationTrendData, setDeformationTrendData] = useState<
    DeformationGraphProps[]
  >([]);
  const [maxDetla, setMaxDelta] = useState<number>(0);
  const [startDateFilter, setStartDateFilter] = useState<Date>();
  const [endDateFilter, setEndDateFilter] = useState<Date>();

  const [filteredDeformationData, setFilteredDeformationData] = useState<
    DeformationTableProps[]
  >([]);
  const [filteredDeformationGraphData, setFilteredDeformationGraphData] =
    useState<DeformationGraphProps[]>([]);

  const onFilter = () => {
    setFilteredDeformationData(
      deformationData.filter(
        (item: DeformationTableProps) =>
          moment(item.nativeTime).isBefore(moment(endDateFilter)) &&
          moment(item.nativeTime).isAfter(moment(startDateFilter))
      )
    );

    setFilteredDeformationGraphData(
      deformationGraphData.filter(
        (item: DeformationGraphProps) =>
          moment(item.x).isBefore(moment(endDateFilter)) &&
          moment(item.x).isAfter(moment(startDateFilter))
      )
    );
  };

  useEffect(() => {
    fetch("http://localhost:3001/deformation")
      .then((response) => response.json())
      .then((json: DeformationResponseProps) => setDeformation(json));
    fetch("http://localhost:3001/deformation_trend")
      .then((response) => response.json())
      .then((json: DeformationTrendResponseProps) => setDeformationTrend(json));
  }, []);

  const clearFilter = () => {
    setFilteredDeformationData(deformationData);
  };

  const filterDropdown = () => (
    <div className="filter-dropdown-wrapper">
      <Space>
        <DatePicker
          format="DD.MM.YYYY hh:mm"
          onChange={(e) => {
            setStartDateFilter(
              // @ts-ignore
              e.$d
            );
          }}
          allowClear={false}
        />
        <DatePicker
          format="DD.MM.YYYY hh:mm"
          onChange={(e) => {
            setEndDateFilter(
              // @ts-ignore
              e.$d
            );
          }}
          allowClear={false}
        />
      </Space>
      <Space>
        <Button
          type="primary"
          onClick={onFilter}
          size="small"
          disabled={
            !startDateFilter ||
            !endDateFilter ||
            moment(endDateFilter).isBefore(moment(startDateFilter))
          }
          className="search-button"
        >
          Search
        </Button>
        <Button type="link" size="small" onClick={clearFilter}>
          Clear
        </Button>
      </Space>
    </div>
  );
  const filterIcon = () => (
    <img src={SearchLogo} alt="React Logo" width={20} height={20} />
  );

  useEffect(() => {
    if (deformation) {
      const deformationJson = deformation?.data?.map(
        (item: DeformationResponseDataProps, index: number) => {
          return {
            key: index,
            cycle: convertNumber(deformation.data.length - index),
            time: moment(item.time).utc(false).format("DD.MM.YYYY kk:mm"),
            nativeTime: item.time,
            value: item.data.value,
            delta: item.data.delta ? +item.data.delta?.toFixed(4) : null,
          };
        }
      );

      const deltaArray: number[] = [];

      const deformationGraphJson = deformation?.data?.map(
        (item: DeformationResponseDataProps) => {
          if (item?.data?.delta) {
            deltaArray.push(item?.data?.delta);
          }
          return {
            x: item.time,
            y: +item.data.delta?.toFixed(4),
          };
        }
      );
      setMaxDelta(Math.max(...deltaArray));
      setDeformationGraphData(deformationGraphJson);
      setDeformationData(deformationJson as DeformationTableProps[]);
      setFilteredDeformationData(deformationJson as DeformationTableProps[]);
      setFilteredDeformationGraphData(deformationGraphJson);
    }
  }, [deformation]);

  useEffect(() => {
    if (deformationTrend) {
      const res = [];
      for (const [key, value] of Object.entries(
        deformationTrend?.data?.points
      )) {
        res.push({
          x: key,
          y: Number(value),
        });
      }
      setDeformationTrendData(res);
    }
  }, [deformationTrend]);

  return (
    <Space className="wrapper">
      <Space className="deformation-space-wrapper">
        <Table
          dataSource={filteredDeformationData}
          pagination={false}
          scroll={{
            scrollToFirstRowOnChange: false,
            y: 400,
            x: 1000,
          }}
        >
          <Column
            title="Дата и время изменения"
            dataIndex="time"
            key="time"
            className="date-col"
            filterDropdown={filterDropdown}
            filterIcon={filterIcon}
            sorter={(a: DeformationTableProps, b: DeformationTableProps) =>
              moment(a.nativeTime).diff(moment(b.nativeTime))
            }
          />
          <Column
            title="Цикл измерения"
            dataIndex="cycle"
            key="key"
            sorter={(a: DeformationTableProps, b: DeformationTableProps) =>
              b.key - a.key
            }
          />
          <Column
            title="Отметка"
            dataIndex="value"
            key="value"
            className="value-col"
            sorter={(a: DeformationTableProps, b: DeformationTableProps) =>
              a.value - b.value
            }
          />
          <Column
            title="Дельта"
            dataIndex="delta"
            key="delta"
            className="delta-col"
            sorter={(
              a: DeformationTableProps,
              b: DeformationTableProps,
              sortOrder: SortOrder | undefined
            ) => {
              return filterColumn(
                String(a.delta),
                String(b.delta),
                sortOrder as SortOrder
              );
            }}
          />
        </Table>
        <DeformationPopup
          deformationData={filteredDeformationGraphData}
          deformationTrendData={deformationTrendData}
          endDate={deformationTrend?.data?.endDate as string}
          maxDelta={maxDetla}
        />
      </Space>
    </Space>
  );
};
