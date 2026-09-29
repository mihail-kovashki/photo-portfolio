export interface PortfolioConfig {
  /**
   * The series to highlight in the top navigation header next to "All Works".
   * Specify up to 3 collection IDs (or names) in the order you want them displayed.
   * Collection ids are the series name slugified ("Český Krumlov 26" -> "cesky-krumlov-26");
   * the full list is `seriesList` in src/data/photos.ts.
   */
  featuredSeriesIds: string[];
}

export const portfolioConfig: PortfolioConfig = {
  featuredSeriesIds: [
    "prague-26",
    "cesky-krumlov-26",
    "kutna-hora-26",
  ],
};
