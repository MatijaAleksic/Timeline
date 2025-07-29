"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./EventPresentationLayer.module.scss";
import DummyDataService from "@/util/data/DummyDataService";
import MeterService from "@/util/service/MeterService";
import MeterConstants from "@/util/constants/MeterConstants";
import { VirtualItem } from "../../../util/DTO/VirtualScrollDTO/VirtualItem";
import React from "react";
import {
  EventTimelineDTO,
  PeriodTimelineDTO,
  TimelinePresentationLayerDTO,
} from "@/api/DTO";
import TimelineQueryDTO from "@/util/DTO/VirtualScrollDTO/QueryTimelineDTO";
import { TimelineApi } from "@/api/interfaces/timeline";
interface EventDTO {
  label: string;
  level: number;
  startDate: Date | number;
  endDate: Date | number;
}

interface IProps {
  elementWidth: number;
  level: number;
  virtualItems: VirtualItem[];
}

const EventPresentationLayer = React.memo<IProps>(
  ({ level, elementWidth, virtualItems }) => {
    const [events, setEvents] = useState<EventTimelineDTO[]>([]);
    const [periods, setPeriods] = useState<PeriodTimelineDTO[]>([]);

    const dummyEvents = useMemo(
      () => DummyDataService.getDataForLevel(level),
      [level]
    );

    useEffect(() => {
      if (virtualItems.length === 0) return;

      const timelineQuery: TimelineQueryDTO =
        MeterService.calculateYearFromVirtualItemIndex(
          level,
          virtualItems[0].index,
          virtualItems[virtualItems.length - 1].index
        );

      const handler = setTimeout(() => {
        console.log("Debounced FETCH");
        fetchTimelineElements(timelineQuery);
      }, 1000);

      return () => clearTimeout(handler);
    }, [virtualItems]);

    const fetchTimelineElements = async (timelineQuery: TimelineQueryDTO) => {
      const timelineElements: TimelinePresentationLayerDTO =
        await TimelineApi.GetTimelineElements(timelineQuery);

      setEvents(timelineElements.events);
      setPeriods(timelineElements.periods);
    };
    if (virtualItems.length === 0) return;

    console.log("events", events);
    console.log("periods", periods);
    console.log("elementWidth", elementWidth);
    return (
      <>
        {periods.map((periodObject: PeriodTimelineDTO, index: number) => {
          // if (
          //   MeterService.checkIfEventYearSpanInRange(
          //     eventObject,
          //     virtualItems,
          //     elementWidth,
          //     level
          //   )
          // )
          return (
            <div
              key={index}
              className={styles.eventContainer}
              onClick={(event: any) => {
                console.log(`${periodObject.title} CLICKED!`);
              }}
              style={{
                left: MeterService.calculateOffsetForLevelAndDate(
                  periodObject.startYear,
                  level,
                  elementWidth
                ), // event offset on presentation layer
                width: MeterService.calculateEventWidth(
                  periodObject.startYear,
                  periodObject.endYear,
                  level,
                  elementWidth
                ),
                top: 0 * MeterConstants.eventWidth, // Top-margin for presentation layer
              }}
            >
              <div
                className={styles.periodContent}
              >{`${periodObject.title}`}</div>
            </div>
          );
        })}
      </>
    );
  },

  (prevProps, nextProps) => {
    if (
      prevProps.virtualItems.length !== 0 &&
      nextProps.virtualItems.length !== 0
    )
      return (
        prevProps.level === nextProps.level &&
        prevProps.virtualItems[0].index === nextProps.virtualItems[0].index &&
        prevProps.virtualItems[prevProps.virtualItems.length - 1].index ===
          nextProps.virtualItems[nextProps.virtualItems.length - 1].index
      );
    return false;
  }
);
EventPresentationLayer.displayName = "EventPresentationLayer";
export default EventPresentationLayer;
