import SearchLogo from "../../assets/search.svg";
import { Button, DatePicker, Space, Table } from "antd";
import { SortOrder } from "antd/es/table/interface";
import "./index.css";
import moment from "moment/moment";
import { useEffect, useMemo, useState } from "react";
import { TermTrendPopup } from "../TermTrendPopup";
import { TermPopup } from "../TermPopup";
import { filterColumn } from "../../utils";
import {
  TermResponseProps,
  TermTrendResponseProps,
} from "../../utils/jsonTypes";
import { DeformationGraphProps, TermDataProps } from "../../utils/types";

export const Term = () => {
  const { Column, ColumnGroup } = Table;
  const [columns, setColumns] = useState<number[]>([]);
  const [term, setTerm] = useState<TermResponseProps>();
  const [termData, setTermData] = useState<TermDataProps[]>([]);
  const [filteredTermData, setFilteredTermData] = useState<TermDataProps[]>([]);
  const [termTrend, setTermTrend] = useState<TermTrendResponseProps>();
  const [termGraphData, setTermGraphData] = useState<DeformationGraphProps[]>(
    []
  );
  const [filteredTermGraphData, setFilteredTermGraphData] = useState<
    DeformationGraphProps[]
  >([]);
  const [termTrendGraphData, setTermTrendGraphData] = useState<
    DeformationGraphProps[]
  >([]);
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3001/term")
      .then((response) => response.json())
      .then((json: TermResponseProps) => setTerm(json));

    fetch("http://localhost:3001/term_trend")
      .then((response) => response.json())
      .then((json: TermTrendResponseProps) => setTermTrend(json));
  }, []);

  const criticalTemperature = term?.data?.[0]?.criticalTemperature;

  const colsSet = useMemo(() => new Set<number>(), []);

  useEffect(() => {
    if (term) {
      const graphData: DeformationGraphProps[] = [];
      const termJson = term?.data?.map((item) => {
        graphData.push({
          x: item.time,
          y: item.averageTemperature,
        });
        let res = {};
        for (const [key, value] of Object.entries(item?.data)) {
          res = { ...res, [key]: value?.value.toFixed(2) };
          colsSet.add(+key);
        }
        return {
          time: moment(item.time).utc(false).format("DD.MM.YYYY kk:mm"),
          nativeTime: item.time,
          temp: item.averageTemperature.toFixed(2),
          ...res,
        };
      });
      setTermGraphData(graphData);
      setFilteredTermGraphData(graphData);
      setTermData(termJson as unknown as TermDataProps[]);
      setFilteredTermData(termJson as unknown as TermDataProps[]);
    }
  }, [term, colsSet]);

  useEffect(() => {
    if (termTrend) {
      const res = [];
      for (const [key, value] of Object.entries(termTrend?.data?.points)) {
        res.push({
          x: key,
          y: Number(value),
        });
      }
      setTermTrendGraphData(res);
    }
  }, [termTrend]);

  useEffect(() => {
    if (colsSet.size) {
      const cols = Array.from(colsSet).sort((a, b) => a - b);
      setColumns(cols);
    }
  }, [colsSet.size, colsSet]);

  const clearFilter = () => {
    setFilteredTermData(termData);
    setFilteredTermGraphData(termGraphData);
  };

  const onFilter = () => {
    setFilteredTermData(
      termData.filter(
        (item: TermDataProps) =>
          moment(item.nativeTime).isBefore(moment(endDateFilter)) &&
          moment(item.nativeTime).isAfter(moment(startDateFilter))
      )
    );
    setFilteredTermGraphData(
      termGraphData.filter(
        (item: DeformationGraphProps) =>
          moment(item.x).isBefore(moment(endDateFilter)) &&
          moment(item.x).isAfter(moment(startDateFilter))
      )
    );
  };

  return (
    <div className="wrapper">
      <Space>
        <Space className="space-wrapper">
          <Table
            dataSource={filteredTermData}
            pagination={false}
            scroll={{
              scrollToFirstRowOnChange: false,
              y: 400,
              x: 3000,
            }}
          >
            <Column
              title="Дата и время измерения"
              dataIndex="time"
              key="time"
              width={300}
              className="date-col"
              filterDropdown={
                <div className="date-picker">
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
                      className="search-button"
                      disabled={
                        !startDateFilter ||
                        !endDateFilter ||
                        moment(endDateFilter).isBefore(moment(startDateFilter))
                      }
                    >
                      Search
                    </Button>
                    <Button type="link" size="small" onClick={clearFilter}>
                      Clear
                    </Button>
                  </Space>
                </div>
              }
              filterIcon={
                <img src={SearchLogo} alt="React Logo" width={20} height={20} />
              }
              sorter={(a: TermDataProps, b: TermDataProps) =>
                moment(a.nativeTime).diff(moment(b.nativeTime))
              }
            />
            <Column
              title="Temp"
              dataIndex="temp"
              key="temp"
              width={100}
              className="temp-col"
              sorter={(a: TermDataProps, b: TermDataProps) => a.temp - b.temp}
            />
            <ColumnGroup title="Глубина, м">
              {columns?.map((item, index) => (
                <Column
                  title={item}
                  dataIndex={item}
                  key={index}
                  className="value-col"
                  sorter={(
                    a: TermDataProps,
                    b: TermDataProps,
                    sortOrder: SortOrder | undefined
                  ) => {
                    return filterColumn(
                      a[item],
                      b[item],
                      sortOrder as SortOrder
                    );
                  }}
                />
              ))}
            </ColumnGroup>
          </Table>
        </Space>
      </Space>
      <div className="buttons-wrapper">
        <TermPopup
          termData={filteredTermData}
          criticalTemperature={criticalTemperature as number}
        />
        <TermTrendPopup
          termData={filteredTermGraphData}
          termTrendData={termTrendGraphData}
          criticalTemperature={criticalTemperature as number}
        />
      </div>
    </div>
  );
};
