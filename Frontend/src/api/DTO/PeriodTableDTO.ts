import type { PeriodDTO } from './PeriodDTO';
import {
    PeriodDTOFromJSON,
    PeriodDTOFromJSONTyped,
    PeriodDTOToJSON,
    PeriodDTOToJSONTyped,
} from './PeriodDTO';

/**
 * 
 * @export
 * @interface PeriodTableDTO
 */
export interface PeriodTableDTO {
    /**
     * 
     * @type {Array<PeriodDTO>}
     * @memberof PeriodTableDTO
     */
    periods: Array<PeriodDTO>;
    /**
     * 
     * @type {number}
     * @memberof PeriodTableDTO
     */
    totalCount: number;
}

/**
 * Check if a given object implements the PeriodTableDTO interface.
 */
export function instanceOfPeriodTableDTO(value: object): value is PeriodTableDTO {
    if (!('periods' in value) || value['periods'] === undefined) return false;
    if (!('totalCount' in value) || value['totalCount'] === undefined) return false;
    return true;
}

export function PeriodTableDTOFromJSON(json: any): PeriodTableDTO {
    return PeriodTableDTOFromJSONTyped(json, false);
}

export function PeriodTableDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): PeriodTableDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'periods': ((json['periods'] as Array<any>).map(PeriodDTOFromJSON)),
        'totalCount': json['totalCount'],
    };
}

export function PeriodTableDTOToJSON(json: any): PeriodTableDTO {
    return PeriodTableDTOToJSONTyped(json, false);
}

export function PeriodTableDTOToJSONTyped(value?: PeriodTableDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'periods': ((value['periods'] as Array<any>).map(PeriodDTOToJSON)),
        'totalCount': value['totalCount'],
    };
}

