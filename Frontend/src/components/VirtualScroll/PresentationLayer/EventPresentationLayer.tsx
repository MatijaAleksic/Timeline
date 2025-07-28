"use client";

import { useEffect, useMemo } from "react";
import styles from "./EventPresentationLayer.module.scss";
import DummyDataService from "@/util/data/DummyDataService";
import { EventDTO } from "@/util/DTO/EventDTO";
import MeterService from "@/util/service/MeterService";
import MeterConstants from "@/util/constants/MeterConstants";
import { VirtualItem } from "../../../util/DTO/VirtualScrollDTO/VirtualItem";

interface IProps {
  elementWidth: number;
  level: number;
  virtualItems: VirtualItem[];
}

const EventPresentationLayer = ({
  level,
  elementWidth,
  virtualItems,
}: IProps) => {
  const dummyEvents = useMemo(
    () => DummyDataService.getDataForLevel(level),
    [level]
  );

  return (
    <>
      {dummyEvents.map((eventObject: EventDTO, index: number) => {
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
              console.log(`${eventObject.label} CLICKED!`);
            }}
            style={{
              left: MeterService.calculateOffsetForLevelAndDate(
                eventObject.startDate,
                level,
                elementWidth
              ), // Offset eventa na presentation layeru
              width: MeterService.calculateEventWidth(
                eventObject.startDate,
                eventObject.endDate,
                level,
                elementWidth
              ),
              top: 0 * MeterConstants.eventWidth, // Top Margina sa vrha presentation layera
            }}
          >
            <div className={styles.periodContent}>{`${eventObject.label}`}</div>
          </div>
        );
      })}
    </>
  );
};
export default EventPresentationLayer;
