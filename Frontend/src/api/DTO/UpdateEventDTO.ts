export interface UpdateEventDTO {
    /**
     * 
     * @type {string}
     * @memberof UpdateEventDTO
     */
    title?: string | null;
    /**
     * 
     * @type {number}
     * @memberof UpdateEventDTO
     */
    level?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateEventDTO
     */
    day?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateEventDTO
     */
    month?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateEventDTO
     */
    year?: number;
}

/**
 * Check if a given object implements the UpdateEventDTO interface.
 */
export function instanceOfUpdateEventDTO(value: object): value is UpdateEventDTO {
    return true;
}

export function UpdateEventDTOFromJSON(json: any): UpdateEventDTO {
    return UpdateEventDTOFromJSONTyped(json, false);
}

export function UpdateEventDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateEventDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'] == null ? undefined : json['title'],
        'level': json['level'] == null ? undefined : json['level'],
        'day': json['day'] == null ? undefined : json['day'],
        'month': json['month'] == null ? undefined : json['month'],
        'year': json['year'] == null ? undefined : json['year'],
    };
}

export function UpdateEventDTOToJSON(json: any): UpdateEventDTO {
    return UpdateEventDTOToJSONTyped(json, false);
}

export function UpdateEventDTOToJSONTyped(value?: UpdateEventDTO | null, ignoreDiscriminator: boolean = false): any {
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

