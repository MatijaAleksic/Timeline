export interface UpdatePeriodDTO {
    /**
     * 
     * @type {string}
     * @memberof UpdatePeriodDTO
     */
    title: string;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    level: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    startDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    startMonth?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    startYear: number;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    endDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    endMonth?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UpdatePeriodDTO
     */
    endYear: number;
}

/**
 * Check if a given object implements the UpdatePeriodDTO interface.
 */
export function instanceOfUpdatePeriodDTO(value: object): value is UpdatePeriodDTO {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('level' in value) || value['level'] === undefined) return false;
    if (!('startYear' in value) || value['startYear'] === undefined) return false;
    if (!('endYear' in value) || value['endYear'] === undefined) return false;
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
        
        'title': json['title'],
        'level': json['level'],
        'startDay': json['startDay'] == null ? undefined : json['startDay'],
        'startMonth': json['startMonth'] == null ? undefined : json['startMonth'],
        'startYear': json['startYear'],
        'endDay': json['endDay'] == null ? undefined : json['endDay'],
        'endMonth': json['endMonth'] == null ? undefined : json['endMonth'],
        'endYear': json['endYear'],
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

