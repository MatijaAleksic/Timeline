export interface PeriodTimelineDTO {
    /**
     * 
     * @type {string}
     * @memberof PeriodTimelineDTO
     */
    title: string;
    /**
     * 
     * @type {number}
     * @memberof PeriodTimelineDTO
     */
    level: number;
    /**
     * 
     * @type {number}
     * @memberof PeriodTimelineDTO
     */
    startDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodTimelineDTO
     */
    startMonth?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodTimelineDTO
     */
    startYear: number;
    /**
     * 
     * @type {number}
     * @memberof PeriodTimelineDTO
     */
    endDay?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodTimelineDTO
     */
    endMonth?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PeriodTimelineDTO
     */
    endYear: number;
}

/**
 * Check if a given object implements the PeriodTimelineDTO interface.
 */
export function instanceOfPeriodTimelineDTO(value: object): value is PeriodTimelineDTO {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('level' in value) || value['level'] === undefined) return false;
    if (!('startYear' in value) || value['startYear'] === undefined) return false;
    if (!('endYear' in value) || value['endYear'] === undefined) return false;
    return true;
}

export function PeriodTimelineDTOFromJSON(json: any): PeriodTimelineDTO {
    return PeriodTimelineDTOFromJSONTyped(json, false);
}

export function PeriodTimelineDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): PeriodTimelineDTO {
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

export function PeriodTimelineDTOToJSON(json: any): PeriodTimelineDTO {
    return PeriodTimelineDTOToJSONTyped(json, false);
}

export function PeriodTimelineDTOToJSONTyped(value?: PeriodTimelineDTO | null, ignoreDiscriminator: boolean = false): any {
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

