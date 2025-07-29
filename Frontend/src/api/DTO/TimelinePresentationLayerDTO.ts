import type { EventTimelineDTO } from './EventTimelineDTO';
import { EventTimelineDTOFromJSON, EventTimelineDTOToJSON } from './EventTimelineDTO';
import type { PeriodTimelineDTO } from './PeriodTimelineDTO';
import { PeriodTimelineDTOFromJSON, PeriodTimelineDTOToJSON } from './PeriodTimelineDTO';

/**
 * 
 * @export
 * @interface TimelinePresentationLayerDTO
 */
export interface TimelinePresentationLayerDTO {
    /**
     * 
     * @type {Array<EventTimelineDTO>}
     * @memberof TimelinePresentationLayerDTO
     */
    events: Array<EventTimelineDTO>;
    /**
     * 
     * @type {Array<PeriodTimelineDTO>}
     * @memberof TimelinePresentationLayerDTO
     */
    periods: Array<PeriodTimelineDTO>;
}

/**
 * Check if a given object implements the TimelinePresentationLayerDTO interface.
 */
export function instanceOfTimelinePresentationLayerDTO(value: object): value is TimelinePresentationLayerDTO {
    if (!('events' in value) || value['events'] === undefined) return false;
    if (!('periods' in value) || value['periods'] === undefined) return false;
    return true;
}

export function TimelinePresentationLayerDTOFromJSON(json: any): TimelinePresentationLayerDTO {
    return TimelinePresentationLayerDTOFromJSONTyped(json, false);
}

export function TimelinePresentationLayerDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimelinePresentationLayerDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'events': ((json['events'] as Array<any>).map(EventTimelineDTOFromJSON)),
        'periods': ((json['periods'] as Array<any>).map(PeriodTimelineDTOFromJSON)),
    };
}

export function TimelinePresentationLayerDTOToJSON(json: any): TimelinePresentationLayerDTO {
    return TimelinePresentationLayerDTOToJSONTyped(json, false);
}

export function TimelinePresentationLayerDTOToJSONTyped(value?: TimelinePresentationLayerDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'events': ((value['events'] as Array<any>).map(EventTimelineDTOToJSON)),
        'periods': ((value['periods'] as Array<any>).map(PeriodTimelineDTOToJSON)),
    };
}

