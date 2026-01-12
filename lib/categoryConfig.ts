/**
 * Configuration for category display on home page
 * Adjust these settings to control which categories appear on the home page
 */

export const HOME_CATEGORIES_COUNT = 8

/**
 * Get the top N categories by item count
 * This ensures the most important categories (with most items) appear on the home page
 * Uses stable sort (by ID as secondary key) to ensure consistent results between server and client
 */
export function getTopCategoriesByItemCount<T extends { items: any[]; id: string }>(
  categories: T[],
  count: number = HOME_CATEGORIES_COUNT
): T[] {
  return [...categories]
    .sort((a, b) => {
      // Primary sort: by item count (descending)
      const countDiff = b.items.length - a.items.length
      if (countDiff !== 0) {
        return countDiff
      }
      // Secondary sort: by ID (ascending) for stable, deterministic ordering
      return a.id.localeCompare(b.id)
    })
    .slice(0, count)
}

/**
 * Get category image - uses category imageUrl if available, otherwise first item's image or fallback
 */
export function getCategoryImage(category: { 
  imageUrl?: string | null
  items: Array<{ imageUrl?: string | null }> 
}): string {
  // First priority: category's own image
  if (category.imageUrl) {
    return category.imageUrl
  }
  
  // Second priority: first item's image in category
  const firstItemWithImage = category.items.find((item) => item.imageUrl)
  if (firstItemWithImage?.imageUrl) {
    return firstItemWithImage.imageUrl
  }
  
  // Fallback to default category image
  return '/assets/fallback-food.svg'
}

