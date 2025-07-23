export interface CreateEventDTO {
    /**
     * 
     * @type {string}
     * @memberof CreateEventDTO
     */
    title: string;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    level: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    day?: number | null;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    month?: number | null;
    /**
     * 
     * @type {number}
     * @memberof CreateEventDTO
     */
    year: number;
}

/**
 * Check if a given object implements the CreateEventDTO interface.
 */
export function instanceOfCreateEventDTO(value: object): value is CreateEventDTO {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('level' in value) || value['level'] === undefined) return false;
    if (!('year' in value) || value['year'] === undefined) return false;
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
        
        'title': json['title'],
        'level': json['level'],
        'day': json['day'] == null ? undefined : json['day'],
        'month': json['month'] == null ? undefined : json['month'],
        'year': json['year'],
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

