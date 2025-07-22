export interface UpdatePeriodDTO {
    /**
     * 
     * @type {string}
     * @memberof UpdatePeriodDTO
     */
    title?: string | null;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    level?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    startDay?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    startMonth?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    startYear?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    endDay?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    endMonth?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    endYear?: number;
}

/**
 * Check if a given object implements the UpdatePeriodDTO interface.
 */
export function instanceOfUpdatePeriodDTO(value: object): value is UpdatePeriodDTO {
    return true;
}

export function UpdatePeriodDTOFromJSON(json: any): UpdatePeriodDTO {
    return UpdatePeriodDTOFromJSONTyped(json, false);
}

export function UpdatePeriodDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdatePeriodDTO {
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

export function UpdatePeriodDTOToJSON(json: any): UpdatePeriodDTO {
    return UpdatePeriodDTOToJSONTyped(json, false);
}

export function UpdatePeriodDTOToJSONTyped(value?: UpdatePeriodDTO | null, ignoreDiscriminator: boolean = false): any {
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

