import { ExplorationType, ParameterKey } from "../../exploration/types"
import { ElementType } from "../../../components/exploration/DateRangeBar"
import { DataSourceType } from "../../../measure/DataSourceSpec"
import { CycleDimension } from "../../exploration/cyclic_time"

export enum SpeechContextType {
    Global = "global",
    Time = "time",
    DateElement = "dateElement",
    RangeElement = "rangeElement",
    CycleDimensionElement = "cycleDimensionElement"
}

export interface SpeechContext {
    type: SpeechContextType
}

export interface GlobalSpeechContext extends SpeechContext {
    explorationType: ExplorationType
}

export interface TimeSpeechContext extends SpeechContext {
    timeElementType: ElementType | 'date',
    parameterKey?: ParameterKey
}

export interface DateElementSpeechContext extends SpeechContext {
    explorationType: ExplorationType,
    date: number,
    dataSource: DataSourceType
}

export interface RangeElementSpeechContext extends SpeechContext {
    explorationType: ExplorationType,
    range: [number, number],
    dataSource: DataSourceType
}

export interface CycleDimensionElementSpeechContext extends SpeechContext {
    cycleDimension: CycleDimension,
    dataSource: DataSourceType
}

export namespace SpeechContextHelper {
    export function makeGlobalContext(explorationType: ExplorationType): GlobalSpeechContext {
        return {
            type: SpeechContextType.Global,
            explorationType
        }
    }

    export function makeTimeSpeechContext(timeElementType: ElementType | 'date', parameterKey:ParameterKey = undefined): TimeSpeechContext {
        return {
            type: SpeechContextType.Time,
            timeElementType,
            parameterKey
        }
    }

    export function makeDateElementSpeechContext(explorationType: ExplorationType, date: number, dataSource: DataSourceType): DateElementSpeechContext {
        return {
            type: SpeechContextType.DateElement,
            explorationType,
            date,
            dataSource
        }
    }

    export function makeRangeElementSpeechContext(explorationType: ExplorationType, range: [number, number], dataSource: DataSourceType): RangeElementSpeechContext {
        return {
            type: SpeechContextType.RangeElement,
            explorationType,
            range,
            dataSource
        }
    }


    export function makeCycleDimentionElementSpeechContext(cycleDimension: CycleDimension, dataSource: DataSourceType): CycleDimensionElementSpeechContext {
        return {
            type: SpeechContextType.CycleDimensionElement,
            cycleDimension,
            dataSource
        }
    }
}