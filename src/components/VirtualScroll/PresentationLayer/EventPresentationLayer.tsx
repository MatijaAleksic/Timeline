import { useMemo } from "react";
import styles from "./EventPresentationLayer.module.scss";
import DummyDataService from "@/util/data/DummyData";
import { EventDTO } from "@/util/dto/EventDTO";
import MeterService from "@/util/service/MeterService";
import MeterConstants from "@/util/constants/MeterConstants";
import { VirtualItem } from "../VirtualScrollDTO/VirtualItem";

interface IProps {
  elementWidth: number;
  level: number;
  virtualItems: VirtualItem[];
}

const EventPresentationLayer: React.FunctionComponent<IProps> = ({
  level,
  elementWidth,
  virtualItems,
}) => {
  const dummyEvents = useMemo(
    () => DummyDataService.getDataForLevel(level),
    [level]
  );

  return (
    <>
      {dummyEvents.map((eventObject: EventDTO, index: number) => {
        if (
          MeterService.checkIfEventYearSpanInRange(
            eventObject,
            virtualItems,
            elementWidth,
            level
          )
        )
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
              <div
                className={styles.periodContent}
              >{`${eventObject.label}`}</div>
            </div>
          );
      })}
    </>
  );
};
export default EventPresentationLayer;
