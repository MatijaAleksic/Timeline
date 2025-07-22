export interface CreateEventDTO {
    /**
     * 
     * @type {string}
     * @memberof CreateEventDTO
     */
    title?: string | null;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    level?: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    day?: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    month?: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    year?: number;
}

/**
 * Check if a given object implements the CreateEventDTO interface.
 */
export function instanceOfCreateEventDTO(value: object): value is CreateEventDTO {
    return true;
}

export function CreateEventDTOFromJSON(json: any): CreateEventDTO {
    return CreateEventDTOFromJSONTyped(json, false);
}

export function CreateEventDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateEventDTO {
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

export function CreateEventDTOToJSON(json: any): CreateEventDTO {
    return CreateEventDTOToJSONTyped(json, false);
}

export function CreateEventDTOToJSONTyped(value?: CreateEventDTO | null, ignoreDiscriminator: boolean = false): any {
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

