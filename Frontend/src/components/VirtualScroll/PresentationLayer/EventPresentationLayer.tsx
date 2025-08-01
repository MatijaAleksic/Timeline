"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./EventPresentationLayer.module.scss";
import MeterService from "@/util/service/MeterService";
import MeterConstants from "@/util/constants/MeterConstants";
import { VirtualItem } from "../../../util/dto/VirtualScrollDTO/VirtualItem";
import React from "react";
import {
  EventTimelineDTO,
  PeriodTimelineDTO,
  TimelinePresentationLayerDTO,
} from "@/api/DTO";
import { TimelineApi } from "@/api/interfaces/timeline";
import TimelineQueryDTO from "@/util/dto/VirtualScrollDTO/QueryTimelineDTO";

interface IProps {
  elementWidth: number;
  level: number;
  virtualItems: VirtualItem[];
}

const EventPresentationLayer = React.memo<IProps>(
  ({ level, elementWidth, virtualItems }) => {
    const [events, setEvents] = useState<EventTimelineDTO[]>([]);
    const [periods, setPeriods] = useState<PeriodTimelineDTO[]>([]);

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
      let timelineElements: TimelinePresentationLayerDTO = {
        events: [],
        periods: [],
      };
      try {
        timelineElements = await TimelineApi.GetTimelineElements(timelineQuery);
      } catch {}
      setEvents(timelineElements.events);
      setPeriods(timelineElements.periods);
    };
    if (virtualItems.length === 0) return;

    // console.log("events", events);
    // console.log("periods", periods);
    // console.log("elementWidth", elementWidth);
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
