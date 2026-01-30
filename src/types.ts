/**
 * Options for the delay.until function
 */
export interface DelayUntilOptions {
  /**
   * Polling interval in milliseconds.
   * How often to check the condition.
   * @default 200
   */
  interval?: number;

  /**
   * Maximum time to wait in milliseconds.
   * If the condition is not met within this time, an error is thrown.
   * @default 30000
   */
  timeout?: number;
}

/**
 * A synchronous condition function that returns a boolean
 */
export type SyncCondition = () => boolean;

/**
 * An asynchronous condition function that returns a Promise<boolean>
 */
export type AsyncCondition = () => Promise<boolean>;

/**
 * A condition function that can be either sync or async
 */
export type Condition = SyncCondition | AsyncCondition;
