export class RetryError extends Error {
  constructor(
    message: string,
    public readonly retries: number
  ) {
    super(message);
    this.name = "RetryError";
    this.retries = retries;
  }
}

export class RetryUtil {
  public static async retry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number = 1000
  ): Promise<T> {
    let retryCount = 0;
    while (retryCount < retries) {
      try {
        return await fn();
      } catch (error) {
        if (retryCount === retries) {
          throw error;
        }
      }
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, delay * retryCount));
    }
    throw new RetryError("Retry limit reached", retries);
  }
}
