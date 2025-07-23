import type { EventDTO } from './EventDTO';
import {
    EventDTOFromJSON,
    EventDTOFromJSONTyped,
    EventDTOToJSON,
    EventDTOToJSONTyped,
} from './EventDTO';

/**
 * 
 * @export
 * @interface EventTableDTO
 */
export interface EventTableDTO {
    /**
     * 
     * @type {Array<EventDTO>}
     * @memberof EventTableDTO
     */
    events: Array<EventDTO>;
    /**
     * 
     * @type {number}
     * @memberof EventTableDTO
     */
    totalCount: number;
}

/**
 * Check if a given object implements the EventTableDTO interface.
 */
export function instanceOfEventTableDTO(value: object): value is EventTableDTO {
    if (!('events' in value) || value['events'] === undefined) return false;
    if (!('totalCount' in value) || value['totalCount'] === undefined) return false;
    return true;
}

export function EventTableDTOFromJSON(json: any): EventTableDTO {
    return EventTableDTOFromJSONTyped(json, false);
}

export function EventTableDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventTableDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'events': ((json['events'] as Array<any>).map(EventDTOFromJSON)),
        'totalCount': json['totalCount'],
    };
}

export function EventTableDTOToJSON(json: any): EventTableDTO {
    return EventTableDTOToJSONTyped(json, false);
}

export function EventTableDTOToJSONTyped(value?: EventTableDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'events': ((value['events'] as Array<any>).map(EventDTOToJSON)),
        'totalCount': value['totalCount'],
    };
}

