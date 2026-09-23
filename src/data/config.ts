export interface PortfolioConfig {
  /**
   * The series to highlight in the top navigation header next to "All Works".
   * Specify up to 3 collection IDs (or names) in the order you want them displayed.
   *
   * Available Collection IDs:
   *   - "prague-26"        (Prague 26 · 65 photos)
   *   - "cesky-krumlov-26" (Český Krumlov 26 · 20 photos)
   *   - "kutna-hora-26"    (Kutna Hora 26 · 28 photos)
   *   - "sokcho-25"        (Sokcho 25 · 14 photos)
   *   - "hokkaido-25"      (Hokkaido 25 · 6 photos)
   *   - "seoul-25"         (Seoul 25 · 5 photos)
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
