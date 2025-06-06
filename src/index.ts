/**
 * OnTheMinute - Executes callbacks every minute on the minute
 *
 * This class aligns timer execution with the clock, so callbacks
 * are triggered precisely at the start of each minute, regardless
 * of when the timer was instantiated.
 */
export class OnTheMinute {
  private timerId: NodeJS.Timeout | null = null;
  private callbacks: Array<() => void> = [];

  /**
   * Creates a new OnTheMinute and starts it
   */
  constructor() {
    this.start();
  }

  /**
   * Registers a callback to be executed every minute
   * @param callback The function to execute every minute
   * @returns A function that can be called to unregister the callback
   */
  public registerCallback(callback: () => void): () => void {
    this.callbacks.push(callback);

    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Starts the timer, aligning with the clock
   */
  public start(): void {
    this.stop();
    this.scheduleNextTick();
  }

  /**
   * Schedules the next execution of callbacks precisely at the start of the next minute.
   *
   * After executing the callbacks, it reschedules itself based on the current clock time
   * to ensure consistent, drift-free minute alignment.
   */
  private scheduleNextTick(): void {
    const msUntilNextMinute = this.millisecondsUntilNextMinute();
    this.timerId = setTimeout(() => {
      this.executeCallbacks();
      this.scheduleNextTick();
    }, msUntilNextMinute);
  }

  /**
   * Calculates the milliseconds until the next minute
   * @returns milliseconds until the next minute
   */
  private millisecondsUntilNextMinute(): number {
    const now = new Date();
    const secondsRemaining = 60 - now.getSeconds();
    const millisecondsRemaining =
      secondsRemaining * 1000 - now.getMilliseconds();
    return millisecondsRemaining;
  }

  /**
   * Executes all registered callbacks
   */
  private executeCallbacks(): void {
    // Create a copy of callbacks to avoid issues if callbacks modify the array
    const callbacksToExecute = [...this.callbacks];

    for (const callback of callbacksToExecute) {
      try {
        callback();
      } catch (error) {
        console.error("Error in minute timer callback:", error);
      }
    }
  }

  /**
   * Stops the timer and clears all callbacks
   */
  public stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Cleans up resources when the timer is no longer needed
   */
  public destroy(): void {
    this.stop();
    this.callbacks = [];
  }
}
