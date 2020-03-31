import { DateTimeHelper } from '@data-at-hand/core/utils/time';
import { FitbitServiceMeasure } from './FitbitServiceMeasure';
import { fastConcatTo } from '@data-at-hand/core/utils';

export abstract class FitbitRangeMeasure<
  QueryResultType> extends FitbitServiceMeasure {

  protected abstract resourcePropertyKey: string;
  protected abstract maxQueryRangeLength: number;
  protected abstract queryFunc(startDate: number, endDate: number): Promise<QueryResultType>

  protected abstract handleQueryResultEntry(entries: any[], now: Date): Promise<void>

  protected async fetchAndCacheFitbitData(
    startDate: number,
    endDate: number,
  ): Promise<void> {
    console.log(
      'Load Fitbit ',
      this.key,
      ' data from ',
      startDate,
      'to',
      endDate,
    );
    const benchMarkStart = Date.now();
    const chunks = DateTimeHelper.splitRange(startDate, endDate, this.maxQueryRangeLength);

    const queryResult: Array<QueryResultType> = await Promise.all(
      chunks.map(chunk => this.queryFunc(chunk[0], chunk[1]))
    );

    const result: Array<any> = []
    
    for(let i = 0; i < queryResult.length; i ++){
      fastConcatTo(result, (queryResult[i] as any)[this.resourcePropertyKey])
    }

    console.log(
      'Finished Loading',
      this.key,
      'data - ',
      result.length,
      'rows. Took',
      Date.now() - benchMarkStart,
      'millis.',
    );

    const now = this.service.core.getToday()

    /*
    this.service.realm.write(() => {
      result[this.resourcePropertyKey].forEach(entry => {
        this.handleQueryResultEntry(this.service.realm, entry, now)
      });
    });*/

    this.handleQueryResultEntry(result, now)

    console.log('Finish storing data into DB.');
  }
}
