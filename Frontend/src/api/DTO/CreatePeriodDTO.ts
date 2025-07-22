export interface CreatePeriodDTO {
    /**
     * 
     * @type {string}
     * @memberof CreatePeriodDTO
     */
    title?: string | null;
    /**
     * 
     * @type {number}
     * @memberof CreatePeriodDTO
     */
    level?: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePeriodDTO
     */
    startDay?: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePeriodDTO
     */
    startMonth?: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePeriodDTO
     */
    startYear?: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePeriodDTO
     */
    endDay?: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePeriodDTO
     */
    endMonth?: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePeriodDTO
     */
    endYear?: number;
}

/**
 * Check if a given object implements the CreatePeriodDTO interface.
 */
export function instanceOfCreatePeriodDTO(value: object): value is CreatePeriodDTO {
    return true;
}

export function CreatePeriodDTOFromJSON(json: any): CreatePeriodDTO {
    return CreatePeriodDTOFromJSONTyped(json, false);
}

export function CreatePeriodDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePeriodDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'] == null ? undefined : json['title'],
        'level': json['level'] == null ? undefined : json['level'],
        'startDay': json['startDay'] == null ? undefined : json['startDay'],
        'startMonth': json['startMonth'] == null ? undefined : json['startMonth'],
        'startYear': json['startYear'] == null ? undefined : json['startYear'],
        'endDay': json['endDay'] == null ? undefined : json['endDay'],
        'endMonth': json['endMonth'] == null ? undefined : json['endMonth'],
        'endYear': json['endYear'] == null ? undefined : json['endYear'],
    };
}

export function CreatePeriodDTOToJSON(json: any): CreatePeriodDTO {
    return CreatePeriodDTOToJSONTyped(json, false);
}

export function CreatePeriodDTOToJSONTyped(value?: CreatePeriodDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'title': value['title'],
        'level': value['level'],
        'startDay': value['startDay'],
        'startMonth': value['startMonth'],
        'startYear': value['startYear'],
        'endDay': value['endDay'],
        'endMonth': value['endMonth'],
        'endYear': value['endYear'],
    };
}

