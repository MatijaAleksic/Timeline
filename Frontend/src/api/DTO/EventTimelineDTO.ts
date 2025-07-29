export interface EventTimelineDTO {
    /**
     * 
     * @type {string}
     * @memberof EventTimelineDTO
     */
    title: string;
    /**
     * 
     * @type {number}
     * @memberof EventTimelineDTO
     */
    level: number;
    /**
     * 
     * @type {number}
     * @memberof EventTimelineDTO
     */
    day?: number | null;
    /**
     * 
     * @type {number}
     * @memberof EventTimelineDTO
     */
    month?: number | null;
    /**
     * 
     * @type {number}
     * @memberof EventTimelineDTO
     */
    year: number;
}

/**
 * Check if a given object implements the EventTimelineDTO interface.
 */
export function instanceOfEventTimelineDTO(value: object): value is EventTimelineDTO {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('level' in value) || value['level'] === undefined) return false;
    if (!('year' in value) || value['year'] === undefined) return false;
    return true;
}

export function EventTimelineDTOFromJSON(json: any): EventTimelineDTO {
    return EventTimelineDTOFromJSONTyped(json, false);
}

export function EventTimelineDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventTimelineDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'],
        'level': json['level'],
        'day': json['day'] == null ? undefined : json['day'],
        'month': json['month'] == null ? undefined : json['month'],
        'year': json['year'],
    };
}

export function EventTimelineDTOToJSON(json: any): EventTimelineDTO {
    return EventTimelineDTOToJSONTyped(json, false);
}

export function EventTimelineDTOToJSONTyped(value?: EventTimelineDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'title': value['title'],
        'level': value['level'],
        'day': value['day'],
        'month': value['month'],
        'year': value['year'],
    };
}

