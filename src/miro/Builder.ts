export class Builder {
  private static instance: Builder;

  private constructor() {}

  public static getInstance(): Builder {
    if (!Builder.instance) {
      Builder.instance = new Builder();
    }

    return Builder.instance;
  }
}
