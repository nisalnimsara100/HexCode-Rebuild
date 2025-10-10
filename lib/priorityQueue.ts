interface PriorityQueueItem<T> {
  element: T;
  priority: number;
}

export class PriorityQueue<T> {
  private items: PriorityQueueItem<T>[] = [];

  /**
   * Add an element with a priority to the queue
   * @param element - The element to add
   * @param priority - The priority value (higher = higher priority)
   */
  enqueue(element: T, priority: number): void {
    const newItem: PriorityQueueItem<T> = { element, priority };
    let added = false;

    // Insert in order of priority (highest first)
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority < priority) {
        this.items.splice(i, 0, newItem);
        added = true;
        break;
      }
    }

    // If not added, append to end (lowest priority)
    if (!added) {
      this.items.push(newItem);
    }
  }

  /**
   * Remove and return the highest priority element
   * @returns The element with highest priority or undefined if empty
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.shift()?.element;
  }

  /**
   * Get the highest priority element without removing it
   * @returns The element with highest priority or undefined if empty
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[0]?.element;
  }

  /**
   * Check if the queue is empty
   * @returns True if queue is empty, false otherwise
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Get the size of the queue
   * @returns Number of elements in the queue
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Clear all elements from the queue
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Convert queue to array in priority order
   * @returns Array of elements sorted by priority (highest first)
   */
  toArray(): T[] {
    return this.items.map(item => item.element);
  }

  /**
   * Get top N elements from the queue without removing them
   * @param n - Number of top elements to return
   * @returns Array of top N elements
   */
  getTopN(n: number): T[] {
    return this.items.slice(0, n).map(item => item.element);
  }

  /**
   * Update priority of an element if it exists
   * @param element - Element to update
   * @param newPriority - New priority value
   * @param compareFn - Function to compare elements (optional)
   */
  updatePriority(element: T, newPriority: number, compareFn?: (a: T, b: T) => boolean): void {
    const index = this.items.findIndex(item => 
      compareFn ? compareFn(item.element, element) : item.element === element
    );
    
    if (index !== -1) {
      // Remove the element
      this.items.splice(index, 1);
      // Re-add with new priority
      this.enqueue(element, newPriority);
    }
  }
}

/**
 * Utility function to create a priority queue from an array of items
 * @param items - Array of items with priority property
 * @param priorityKey - Key name for priority property
 * @returns New PriorityQueue instance
 */
export function createPriorityQueueFromArray<T>(
  items: T[], 
  priorityKey: keyof T
): PriorityQueue<T> {
  const queue = new PriorityQueue<T>();
  
  items.forEach(item => {
    const priority = Number(item[priorityKey]);
    if (!isNaN(priority)) {
      queue.enqueue(item, priority);
    }
  });
  
  return queue;
}