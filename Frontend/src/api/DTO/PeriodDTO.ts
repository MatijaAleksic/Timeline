export interface PeriodDTO {
    /**
     * 
     * @type {string}
     * @memberof PeriodDTO
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PeriodDTO
     */
    title: string;
    /**
     * 
     * @type {number}
     * @memberof PeriodDTO
     */
    level: number;
    /**
     * 
     * @type {number}
     * @memberof PeriodDTO
     */
    startDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodDTO
     */
    startMonth?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodDTO
     */
    startYear: number;
    /**
     * 
     * @type {number}
     * @memberof PeriodDTO
     */
    endDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodDTO
     */
    endMonth?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodDTO
     */
    endYear: number;
}

/**
 * Check if a given object implements the PeriodDTO interface.
 */
export function instanceOfPeriodDTO(value: object): value is PeriodDTO {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('level' in value) || value['level'] === undefined) return false;
    if (!('startYear' in value) || value['startYear'] === undefined) return false;
    if (!('endYear' in value) || value['endYear'] === undefined) return false;
    return true;
}

export function PeriodDTOFromJSON(json: any): PeriodDTO {
    return PeriodDTOFromJSONTyped(json, false);
}

export function PeriodDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): PeriodDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
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

export function PeriodDTOToJSON(json: any): PeriodDTO {
    return PeriodDTOToJSONTyped(json, false);
}

export function PeriodDTOToJSONTyped(value?: PeriodDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
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

