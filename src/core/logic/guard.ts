import { Result } from './errors-handler';

export type GuardResponse = string;

export interface IGuardArgument {
  arg: any;
  argName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: Result<any>[]): Result<GuardResponse> {
    for (const result of guardResults) {
      if (result.isFailed) return result;
    }

    return Result.ok<GuardResponse>();
  }

  public static greaterThan(
    minValue: number,
    actualValue: number,
  ): Result<GuardResponse> {
    return actualValue > minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `Number given {${actualValue}} is not greater than {${minValue}}`,
        );
  }

  public static againstAtLeast(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    return text.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(`Text is not at least ${numChars} chars.`);
  }

  public static againstAtMost(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    return text.length <= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(`Text is not at most ${numChars} chars.`);
  }

  public static againstNullOrUndefined(
    arg: any,
    argName: string,
  ): Result<GuardResponse> {
    if (arg === null || arg === undefined) {
      return Result.fail<GuardResponse>(`${argName} is null or undefined`);
    } else {
      return Result.ok<GuardResponse>();
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection,
  ): Result<GuardResponse> {
    for (const each of args) {
      const result = this.againstNullOrUndefined(each.arg, each.argName);
      if (result.isFailed) return result;
    }

    return Result.ok<GuardResponse>();
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argName: string,
  ): Result<GuardResponse> {
    let isValid = false;
    for (const each of validValues) {
      if (value === each) {
        isValid = true;
        break;
      }
    }

    if (isValid) {
      return Result.ok<GuardResponse>();
    } else {
      return Result.fail<GuardResponse>(
        `${argName} isn't one of the correct types in ${JSON.stringify(
          validValues,
        )}. Got "${value}".`,
      );
    }
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argName: string,
  ): Result<GuardResponse> {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail<GuardResponse>(
        `${argName} isn't within range ${min} to ${max}.`,
      );
    } else {
      return Result.ok<GuardResponse>();
    }
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argName: string,
  ): Result<GuardResponse> {
    let failingResult: Result<GuardResponse> = null;

    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argName);
      if (!numIsInRangeResult.isFailed) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return Result.fail<GuardResponse>(`${argName} is not within the range.`);
    } else {
      return Result.ok<GuardResponse>();
    }
  }
}
