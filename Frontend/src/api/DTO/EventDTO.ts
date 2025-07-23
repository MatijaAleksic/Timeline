export interface EventDTO {
    /**
     * 
     * @type {string}
     * @memberof EventDTO
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof EventDTO
     */
    title: string;
    /**
     * 
     * @type {number}
     * @memberof EventDTO
     */
    level: number;
    /**
     * 
     * @type {number}
     * @memberof EventDTO
     */
    day?: number | null;
    /**
     * 
     * @type {number}
     * @memberof EventDTO
     */
    month?: number | null;
    /**
     * 
     * @type {number}
     * @memberof EventDTO
     */
    year: number;
}

/**
 * Check if a given object implements the EventDTO interface.
 */
export function instanceOfEventDTO(value: object): value is EventDTO {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('level' in value) || value['level'] === undefined) return false;
    if (!('year' in value) || value['year'] === undefined) return false;
    return true;
}

export function EventDTOFromJSON(json: any): EventDTO {
    return EventDTOFromJSONTyped(json, false);
}

export function EventDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'title': json['title'],
        'level': json['level'],
        'day': json['day'] == null ? undefined : json['day'],
        'month': json['month'] == null ? undefined : json['month'],
        'year': json['year'],
    };
}

export function EventDTOToJSON(json: any): EventDTO {
    return EventDTOToJSONTyped(json, false);
}

export function EventDTOToJSONTyped(value?: EventDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'title': value['title'],
        'level': value['level'],
        'day': value['day'],
        'month': value['month'],
        'year': value['year'],
    };
}

