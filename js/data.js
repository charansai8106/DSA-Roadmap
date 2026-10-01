/**
 * Data layer for DSA Roadmap:
 * Topic definitions, curated LeetCode problems, color themes, and pattern frameworks.
 */

// Card dimensions on the interactive canvas
const CARD_WIDTH = 232;
const CARD_HEIGHT = 104;

// Track colors for visual grouping
const TRACK_COLORS = {
  core: { base: "#3b82f6", soft: "rgba(59,130,246,0.14)", ring: "#60a5fa" },
  structures: { base: "#8b5cf6", soft: "rgba(139,92,246,0.14)", ring: "#a78bfa" },
  trees: { base: "#10b981", soft: "rgba(16,185,129,0.14)", ring: "#34d399" },
  graphs: { base: "#f59e0b", soft: "rgba(245,158,11,0.14)", ring: "#fbbf24" },
  dp: { base: "#ef4444", soft: "rgba(239,68,68,0.14)", ring: "#f87171" },
  advanced: { base: "#06b6d4", soft: "rgba(6,182,212,0.14)", ring: "#22d3ee" },
  design: { base: "#ec4899", soft: "rgba(236,72,153,0.14)", ring: "#f472b6" },
};

// Difficulty badge colors
const DIFF_COLORS = {
  Easy: "#22c55e",
  Medium: "#eab308",
  Hard: "#ef4444",
};

/**
 * Factory function to create a problem item
 */
function createProblem(name, slug, difficulty, tags = "", companies = "") {
  return {
    id: uid("p"),
    name,
    slug,
    difficulty,
    tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    companies: companies.split(",").map((s) => s.trim()).filter(Boolean),
  };
}
const P = createProblem; // Compact alias

/**
 * Factory function to create a topic node
 */
function createTopic(id, title, category, track, level, description, prereqs, estimate, x, y, problems = []) {
  return {
    id,
    title,
    category,
    track,
    level,
    description,
    prereqs,
    estimate,
    x,
    y,
    problems,
    custom: false,
  };
}
const T = createTopic; // Compact alias

/**
 * High-level algorithmic guidance per track
 */
const PATTERN_HINTS = {
  core: "Start by clarifying constraints, then brute force with nested loops or a hash map lookup. Optimize by trading space for time (hashing) or exploiting sorted order (two pointers / binary search).",
  structures: "Identify which operations need to be O(1) or O(log n) — that dictates the structure (stack, queue, monotonic stack, or a hashmap + doubly linked list combo).",
  trees: "Default to DFS (recursion) for path/subtree problems, and BFS (queue) for level-based problems. Ask: what needs to be true about children before I can compute the parent?",
  graphs: "Model the problem as nodes + edges first. Use BFS for shortest unweighted path, DFS/Union-Find for connectivity, and Dijkstra/topological sort when edges are weighted or ordered.",
  dp: "Define the state precisely (what does dp[i] or dp[i][j] represent?), find the recurrence between states, and only then worry about the base case and iteration order.",
  advanced: "These structures trade extra preprocessing time/space for fast repeated queries — build the structure once, then reason about update and query complexity separately.",
  design: "Sketch the public API first (what methods, what complexity per method), then pick internal data structures that satisfy every operation's complexity budget simultaneously.",
};

/**
 * Generates conceptual hints and time/space complexity guidance for a problem
 */
function getSolutionFramework(topic, problem) {
  const hint = PATTERN_HINTS[topic.track] || PATTERN_HINTS.core;
  return {
    intuition: `Read the constraints first — they usually rule out at least one approach. For "${problem.name}", ask what's changing as you scan the input (an index, a running sum, a window) and what you'd need to remember about the past to avoid recomputing it.`,
    brute: "The brute force is almost always: try every combination / every pair / every substring, and check validity directly. This establishes correctness and a baseline complexity to beat.",
    optimal: hint,
    complexity: problem.difficulty === "Easy"
      ? "Most easy-tier problems in this topic land on O(n) time and O(1) or O(n) space once the right structure is chosen."
      : problem.difficulty === "Medium"
      ? "Medium-tier problems here typically resolve to O(n log n) or O(n) time with O(n) auxiliary space — watch for a nested loop hiding an easy hash/sort optimization."
      : "Hard-tier problems often combine two patterns (e.g. DP + binary search, or graph + heap) — isolate each sub-problem before merging them.",
    caveat: "This is a general framework for this problem's pattern, not a verified problem-specific editorial — pair it with LeetCode's official solution/discussion tab for exact edge cases.",
  };
}

/**
 * Complete roadmap topic dataset with problem sets
 */
const INITIAL_TOPICS = [
  T("arrays-hashing", "Arrays & Hashing", "Fundamentals", "core", "Beginner",
    "The foundation of almost every interview problem. Master hash maps/sets for O(1) lookups and frequency counting.",
    [], "4-6 hrs", 60, 380, [
      P("Two Sum", "two-sum", "Easy", "Array,Hashing", "Amazon,Google,Apple"),
      P("Contains Duplicate", "contains-duplicate", "Easy", "Array,Hashing", "Amazon"),
      P("Valid Anagram", "valid-anagram", "Easy", "String,Hashing", "Amazon,Bloomberg"),
      P("Group Anagrams", "group-anagrams", "Medium", "String,Hashing", "Amazon,Uber,Facebook"),
      P("Top K Frequent Elements", "top-k-frequent-elements", "Medium", "Hashing,Heap,Bucket Sort", "Amazon,Facebook"),
      P("Product of Array Except Self", "product-of-array-except-self", "Medium", "Array,Prefix Product", "Amazon,Microsoft,Facebook"),
      P("Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium", "Array,Hashing,Union Find", "Google,Amazon"),
      P("Valid Sudoku", "valid-sudoku", "Medium", "Array,Hashing,Matrix", "Amazon,Apple"),
      P("Encode and Decode Strings", "encode-and-decode-strings", "Medium", "String,Design", "Google,Facebook"),
      P("Majority Element", "majority-element", "Easy", "Array,Hashing,Boyer-Moore", "Amazon,Adobe"),
      P("Find All Duplicates in an Array", "find-all-duplicates-in-an-array", "Medium", "Array,Hashing"),
      P("Rotate Array", "rotate-array", "Medium", "Array,Math", "Amazon,Microsoft"),
      P("Best Time to Buy and Sell Stock II", "best-time-to-buy-and-sell-stock-ii", "Medium", "Array,Greedy,DP"),
      P("Squares of a Sorted Array", "squares-of-a-sorted-array", "Easy", "Array,Two Pointers,Sorting"),
      P("First Missing Positive", "first-missing-positive", "Hard", "Array,Hashing", "Amazon,Microsoft"),
    ]),

  T("two-pointers", "Two Pointers", "Array Technique", "core", "Beginner",
    "Use two moving indices to shrink the search space, usually on sorted arrays or strings.",
    ["arrays-hashing"], "3-4 hrs", 380, 140, [
      P("Valid Palindrome", "valid-palindrome", "Easy", "String,Two Pointers", "Facebook,Microsoft"),
      P("Two Sum II - Input Array Is Sorted", "two-sum-ii-input-array-is-sorted", "Medium", "Array,Two Pointers", "Amazon"),
      P("3Sum", "3sum", "Medium", "Array,Two Pointers,Sorting", "Amazon,Facebook,Adobe"),
      P("Container With Most Water", "container-with-most-water", "Medium", "Array,Two Pointers,Greedy", "Google,Bloomberg"),
      P("Trapping Rain Water", "trapping-rain-water", "Hard", "Array,Two Pointers,Stack,DP", "Google,Amazon,Goldman Sachs"),
      P("Sort Colors", "sort-colors", "Medium", "Array,Two Pointers,Sorting", "Microsoft,Facebook"),
      P("Move Zeroes", "move-zeroes", "Easy", "Array,Two Pointers", "Facebook,Amazon"),
      P("Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "Easy", "Array,Two Pointers"),
      P("3Sum Closest", "3sum-closest", "Medium", "Array,Two Pointers,Sorting"),
      P("4Sum", "4sum", "Medium", "Array,Two Pointers,Sorting"),
      P("Boats to Save People", "boats-to-save-people", "Medium", "Array,Two Pointers,Greedy"),
    ]),

  T("prefix-sum", "Prefix Sum", "Array Technique", "core", "Beginner",
    "Precompute running totals to answer range-sum style queries in O(1) after O(n) setup.",
    ["arrays-hashing"], "2-3 hrs", 380, 380, [
      P("Range Sum Query - Immutable", "range-sum-query-immutable", "Easy", "Array,Prefix Sum,Design"),
      P("Find Pivot Index", "find-pivot-index", "Easy", "Array,Prefix Sum"),
      P("Subarray Sum Equals K", "subarray-sum-equals-k", "Medium", "Array,Hashing,Prefix Sum", "Facebook,Google"),
      P("Continuous Subarray Sum", "continuous-subarray-sum", "Medium", "Array,Prefix Sum,Hashing"),
      P("Range Sum Query 2D - Immutable", "range-sum-query-2d-immutable", "Medium", "Matrix,Prefix Sum,Design"),
      P("Product of the Last K Numbers", "product-of-the-last-k-numbers", "Medium", "Design,Prefix Product"),
      P("Subarray Sums Divisible by K", "subarray-sums-divisible-by-k", "Medium", "Array,Prefix Sum,Hashing"),
      P("Contiguous Array", "contiguous-array", "Medium", "Array,Prefix Sum,Hashing"),
      P("Corporate Flight Bookings", "corporate-flight-bookings", "Medium", "Array,Prefix Sum"),
    ]),

  T("sorting", "Sorting", "Array Technique", "core", "Beginner",
    "Know how to implement and reason about merge sort/quick sort, and when built-in sort + custom comparator is enough.",
    ["arrays-hashing"], "3-4 hrs", 380, 620, [
      P("Merge Sorted Array", "merge-sorted-array", "Easy", "Array,Two Pointers,Sorting", "Facebook"),
      P("Sort an Array", "sort-an-array", "Medium", "Sorting,Divide and Conquer"),
      P("Kth Largest Element in an Array", "kth-largest-element-in-an-array", "Medium", "Heap,Sorting,Quickselect", "Facebook,Amazon"),
      P("Largest Number", "largest-number", "Medium", "Sorting,Greedy,String"),
      P("H-Index", "h-index", "Medium", "Sorting,Array,Counting"),
      P("Sort List", "sort-list", "Medium", "Linked List,Sorting,Merge Sort", "Microsoft"),
      P("Relative Sort Array", "relative-sort-array", "Easy", "Array,Sorting"),
      P("Wiggle Sort II", "wiggle-sort-ii", "Medium", "Array,Sorting"),
    ]),

  T("sliding-window", "Sliding Window", "Array Technique", "core", "Beginner",
    "Maintain a variable/fixed size window over an array or string to avoid recomputation.",
    ["two-pointers"], "4-5 hrs", 700, 140, [
      P("Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy", "Array,DP,Sliding Window", "Amazon,Facebook"),
      P("Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium", "String,Sliding Window,Hashing", "Amazon,Adobe,Bloomberg"),
      P("Longest Repeating Character Replacement", "longest-repeating-character-replacement", "Medium", "String,Sliding Window"),
      P("Permutation in String", "permutation-in-string", "Medium", "String,Sliding Window,Hashing", "Facebook"),
      P("Max Consecutive Ones III", "max-consecutive-ones-iii", "Medium", "Array,Sliding Window"),
      P("Minimum Window Substring", "minimum-window-substring", "Hard", "String,Sliding Window,Hashing", "Facebook,Litton"),
      P("Sliding Window Maximum", "sliding-window-maximum", "Hard", "Array,Monotonic Queue,Sliding Window", "Amazon,Google"),
      P("Minimum Size Subarray Sum", "minimum-size-subarray-sum", "Medium", "Array,Sliding Window"),
      P("Frequency of the Most Frequent Element", "frequency-of-the-most-frequent-element", "Medium", "Array,Sliding Window,Greedy"),
      P("Longest Subarray of 1's After Deleting One Element", "longest-subarray-of-1s-after-deleting-one-element", "Medium", "Array,Sliding Window,DP"),
      P("Subarrays with K Different Integers", "subarrays-with-k-different-integers", "Hard", "Array,Sliding Window,Hashing"),
    ]),

  T("binary-search", "Binary Search", "Searching", "core", "Beginner",
    "Halve the search space on monotonic data — works on arrays, and cleverly on 'answer spaces' too.",
    ["sorting"], "4-5 hrs", 700, 380, [
      P("Binary Search", "binary-search", "Easy", "Binary Search"),
      P("Search a 2D Matrix", "search-a-2d-matrix", "Medium", "Binary Search,Matrix", "Amazon"),
      P("Koko Eating Bananas", "koko-eating-bananas", "Medium", "Binary Search,Answer Space", "Google"),
      P("Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "Medium", "Binary Search,Array", "Microsoft,Amazon"),
      P("Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "Medium", "Binary Search,Array", "Facebook,Microsoft,Amazon"),
      P("Time Based Key-Value Store", "time-based-key-value-store", "Medium", "Binary Search,Design,Hashing", "Amazon"),
      P("Capacity To Ship Packages Within D Days", "capacity-to-ship-packages-within-d-days", "Medium", "Binary Search,Answer Space"),
      P("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "Hard", "Binary Search,Array,Divide and Conquer", "Google,Amazon,Apple"),
      P("Find First and Last Position of Element in Sorted Array", "find-first-and-last-position-of-element-in-sorted-array", "Medium", "Array,Binary Search", "Amazon,Facebook"),
      P("Search Insert Position", "search-insert-position", "Easy", "Array,Binary Search"),
      P("Find Peak Element", "find-peak-element", "Medium", "Array,Binary Search"),
      P("Split Array Largest Sum", "split-array-largest-sum", "Hard", "Binary Search,Answer Space,DP"),
    ]),

  T("stack", "Stack", "Data Structures", "structures", "Beginner",
    "LIFO structure that's the backbone of parsing, matching, and undo-style problems.",
    ["arrays-hashing"], "3-4 hrs", 700, 620, [
      P("Valid Parentheses", "valid-parentheses", "Easy", "Stack,String", "Amazon,Google,Facebook"),
      P("Min Stack", "min-stack", "Medium", "Stack,Design", "Amazon"),
      P("Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "Medium", "Stack,Array,Math"),
      P("Generate Parentheses", "generate-parentheses", "Medium", "Stack,Backtracking,String", "Google,Uber"),
      P("Daily Temperatures", "daily-temperatures", "Medium", "Stack,Monotonic Stack", "Amazon,Facebook"),
      P("Car Fleet", "car-fleet", "Medium", "Stack,Sorting,Array"),
      P("Basic Calculator", "basic-calculator", "Hard", "Stack,String,Math", "Google,Facebook"),
      P("Simplify Path", "simplify-path", "Medium", "Stack,String"),
      P("Decode String", "decode-string", "Medium", "Stack,String,Recursion", "Google,Amazon"),
      P("Asteroid Collision", "asteroid-collision", "Medium", "Stack,Array"),
      P("Remove All Adjacent Duplicates In String", "remove-all-adjacent-duplicates-in-string", "Easy", "Stack,String"),
    ]),

  T("monotonic-stack", "Monotonic Stack", "Data Structures", "structures", "Intermediate",
    "A stack kept strictly increasing/decreasing — unlocks O(n) 'next greater/smaller element' problems.",
    ["stack"], "3 hrs", 1020, 140, [
      P("Next Greater Element I", "next-greater-element-i", "Easy", "Stack,Monotonic Stack,Hashing"),
      P("Next Greater Element II", "next-greater-element-ii", "Medium", "Stack,Monotonic Stack,Array"),
      P("Online Stock Span", "online-stock-span", "Medium", "Stack,Monotonic Stack,Design"),
      P("Sum of Subarray Minimums", "sum-of-subarray-minimums", "Medium", "Stack,Monotonic Stack,DP", "Amazon"),
      P("Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "Hard", "Stack,Monotonic Stack,Array", "Google,Amazon"),
      P("Maximal Rectangle", "maximal-rectangle", "Hard", "Stack,Matrix,DP", "Facebook"),
      P("Remove K Digits", "remove-k-digits", "Medium", "Stack,Monotonic Stack,Greedy"),
      P("132 Pattern", "132-pattern", "Medium", "Stack,Monotonic Stack,Array"),
    ]),

  T("queue", "Queue", "Data Structures", "structures", "Beginner",
    "FIFO structure underpinning BFS, scheduling, and rate-limiting problems.",
    ["arrays-hashing"], "2-3 hrs", 1020, 380, [
      P("Implement Queue using Stacks", "implement-queue-using-stacks", "Easy", "Stack,Queue,Design"),
      P("Number of Recent Calls", "number-of-recent-calls", "Easy", "Queue,Design"),
      P("Design Circular Queue", "design-circular-queue", "Medium", "Queue,Array,Design"),
      P("Design Hit Counter", "design-hit-counter", "Medium", "Queue,Design", "Google (premium alt.)"),
      P("Design Circular Deque", "design-circular-deque", "Medium", "Queue,Design,Array"),
      P("Moving Average from Data Stream", "moving-average-from-data-stream", "Easy", "Queue,Design", "Google (premium alt.)"),
    ]),

  T("linked-list", "Linked List", "Data Structures", "structures", "Beginner",
    "Pointer manipulation without the safety net of indices — fast/slow pointers, reversal, and merging are core moves.",
    ["arrays-hashing"], "5-6 hrs", 1020, 620, [
      P("Reverse Linked List", "reverse-linked-list", "Easy", "Linked List,Recursion", "Amazon,Microsoft,Facebook"),
      P("Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", "Linked List,Recursion", "Amazon,Apple"),
      P("Linked List Cycle", "linked-list-cycle", "Easy", "Linked List,Two Pointers", "Amazon,Microsoft"),
      P("Reorder List", "reorder-list", "Medium", "Linked List,Two Pointers,Stack", "Facebook,Amazon"),
      P("Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium", "Linked List,Two Pointers", "Facebook"),
      P("Copy List with Random Pointer", "copy-list-with-random-pointer", "Medium", "Linked List,Hashing", "Amazon,Bloomberg"),
      P("Add Two Numbers", "add-two-numbers", "Medium", "Linked List,Math", "Amazon,Microsoft,Adobe"),
      P("Find the Duplicate Number", "find-the-duplicate-number", "Medium", "Linked List,Two Pointers,Binary Search", "Apple"),
      P("LRU Cache", "lru-cache", "Medium", "Linked List,Hashing,Design", "Amazon,Facebook,Uber"),
      P("Merge k Sorted Lists", "merge-k-sorted-lists", "Hard", "Linked List,Heap,Divide and Conquer", "Amazon,Google,Facebook"),
      P("Reverse Nodes in k-Group", "reverse-nodes-in-k-group", "Hard", "Linked List,Recursion", "Microsoft,Amazon"),
      P("Palindrome Linked List", "palindrome-linked-list", "Easy", "Linked List,Two Pointers", "Amazon"),
      P("Middle of the Linked List", "middle-of-the-linked-list", "Easy", "Linked List,Two Pointers"),
      P("Odd Even Linked List", "odd-even-linked-list", "Medium", "Linked List"),
      P("Rotate List", "rotate-list", "Medium", "Linked List,Two Pointers"),
      P("Flatten a Multilevel Doubly Linked List", "flatten-a-multilevel-doubly-linked-list", "Medium", "Linked List,DFS", "Facebook"),
    ]),

  T("recursion", "Recursion", "Foundations", "core", "Intermediate",
    "The mental model that unlocks trees, backtracking, and divide-and-conquer: trust the recursive call.",
    ["linked-list"], "3-4 hrs", 1340, 140, [
      P("Fibonacci Number", "fibonacci-number", "Easy", "Recursion,DP,Math"),
      P("Climbing Stairs", "climbing-stairs", "Easy", "Recursion,DP", "Amazon,Adobe"),
      P("Reverse String", "reverse-string", "Easy", "Recursion,Two Pointers,String"),
      P("Swap Nodes in Pairs", "swap-nodes-in-pairs", "Medium", "Recursion,Linked List", "Amazon"),
      P("Pow(x, n)", "powx-n", "Medium", "Recursion,Math,Divide and Conquer", "LinkedIn"),
      P("Different Ways to Add Parentheses", "different-ways-to-add-parentheses", "Medium", "Recursion,Divide and Conquer,Math"),
      P("Sqrt(x)", "sqrtx", "Easy", "Recursion,Binary Search,Math"),
      P("Count Good Numbers", "count-good-numbers", "Medium", "Recursion,Math,Combinatorics"),
    ]),

  T("bit-manipulation", "Bit Manipulation", "Foundations", "core", "Intermediate",
    "AND/OR/XOR tricks that turn O(n) problems into O(1) or O(log n) with clever bit tricks.",
    ["arrays-hashing"], "2-3 hrs", 1340, 380, [
      P("Single Number", "single-number", "Easy", "Bit Manipulation,Hashing", "Amazon,Palantir"),
      P("Number of 1 Bits", "number-of-1-bits", "Easy", "Bit Manipulation"),
      P("Counting Bits", "counting-bits", "Easy", "Bit Manipulation,DP", "Google"),
      P("Reverse Bits", "reverse-bits", "Easy", "Bit Manipulation", "Apple"),
      P("Missing Number", "missing-number", "Easy", "Bit Manipulation,Array,Math", "Amazon,Microsoft"),
      P("Sum of Two Integers", "sum-of-two-integers", "Medium", "Bit Manipulation,Math", "Facebook"),
      P("Bitwise AND of Numbers Range", "bitwise-and-of-numbers-range", "Medium", "Bit Manipulation"),
      P("Power of Two", "power-of-two", "Easy", "Bit Manipulation,Math"),
      P("Power of Four", "power-of-four", "Easy", "Bit Manipulation,Math"),
      P("Maximum XOR of Two Numbers in an Array", "maximum-xor-of-two-numbers-in-an-array", "Medium", "Bit Manipulation,Trie", "Google"),
      P("XOR Queries of a Subarray", "xor-queries-of-a-subarray", "Medium", "Bit Manipulation,Prefix Sum"),
    ]),

  T("math-geometry", "Math & Geometry", "Foundations", "core", "Intermediate",
    "Matrix rotations, spiral traversal, and number theory that pop up more often than you'd expect.",
    ["arrays-hashing"], "3-4 hrs", 1340, 620, [
      P("Rotate Image", "rotate-image", "Medium", "Matrix,Math", "Microsoft,Apple,Facebook"),
      P("Spiral Matrix", "spiral-matrix", "Medium", "Matrix,Simulation", "Amazon,Microsoft"),
      P("Set Matrix Zeroes", "set-matrix-zeroes", "Medium", "Matrix,Array", "Amazon,Microsoft"),
      P("Happy Number", "happy-number", "Easy", "Math,Two Pointers,Hashing"),
      P("Plus One", "plus-one", "Easy", "Array,Math", "Google"),
      P("Multiply Strings", "multiply-strings", "Medium", "Math,String,Simulation", "Facebook"),
      P("Detect Squares", "detect-squares", "Medium", "Hashing,Design,Geometry"),
      P("Roman to Integer", "roman-to-integer", "Easy", "Math,String,Hashing", "Amazon,Microsoft"),
      P("Integer to Roman", "integer-to-roman", "Medium", "Math,String"),
      P("Count Primes", "count-primes", "Medium", "Math,Sieve of Eratosthenes"),
      P("Excel Sheet Column Number", "excel-sheet-column-number", "Easy", "Math,String"),
    ]),

  T("trees", "Trees", "Trees", "trees", "Intermediate",
    "Binary trees and BSTs: DFS/BFS traversal patterns underlie a huge chunk of interview questions.",
    ["recursion"], "6-8 hrs", 1660, 380, [
      P("Invert Binary Tree", "invert-binary-tree", "Easy", "Tree,DFS,BFS", "Google (famous)"),
      P("Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy", "Tree,DFS,BFS"),
      P("Diameter of Binary Tree", "diameter-of-binary-tree", "Easy", "Tree,DFS", "Facebook"),
      P("Balanced Binary Tree", "balanced-binary-tree", "Easy", "Tree,DFS"),
      P("Same Tree", "same-tree", "Easy", "Tree,DFS"),
      P("Subtree of Another Tree", "subtree-of-another-tree", "Easy", "Tree,DFS"),
      P("Lowest Common Ancestor of a Binary Search Tree", "lowest-common-ancestor-of-a-binary-search-tree", "Medium", "Tree,BST,DFS", "Amazon,Facebook"),
      P("Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium", "Tree,BFS", "Amazon,Microsoft"),
      P("Binary Tree Right Side View", "binary-tree-right-side-view", "Medium", "Tree,BFS,DFS", "Facebook"),
      P("Count Good Nodes in Binary Tree", "count-good-nodes-in-binary-tree", "Medium", "Tree,DFS"),
      P("Validate Binary Search Tree", "validate-binary-search-tree", "Medium", "Tree,BST,DFS", "Amazon,Facebook,Microsoft"),
      P("Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "Medium", "Tree,BST,DFS", "Facebook,Amazon"),
      P("Construct Binary Tree from Preorder and Inorder Traversal", "construct-binary-tree-from-preorder-and-inorder-traversal", "Medium", "Tree,DFS,Array", "Microsoft,Amazon"),
      P("Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "Hard", "Tree,DFS,DP", "Facebook,Microsoft"),
      P("Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "Hard", "Tree,Design,BFS", "Amazon,Facebook,Google"),
      P("Path Sum", "path-sum", "Easy", "Tree,DFS"),
      P("Path Sum II", "path-sum-ii", "Medium", "Tree,DFS,Backtracking"),
      P("Flatten Binary Tree to Linked List", "flatten-binary-tree-to-linked-list", "Medium", "Tree,DFS,Linked List", "Microsoft"),
      P("Binary Tree Zigzag Level Order Traversal", "binary-tree-zigzag-level-order-traversal", "Medium", "Tree,BFS", "Amazon,LinkedIn"),
      P("Populating Next Right Pointers in Each Node", "populating-next-right-pointers-in-each-node", "Medium", "Tree,BFS,DFS"),
      P("Convert Sorted Array to Binary Search Tree", "convert-sorted-array-to-binary-search-tree", "Easy", "Tree,BST,Divide and Conquer"),
      P("Delete Node in a BST", "delete-node-in-a-bst", "Medium", "Tree,BST,DFS"),
    ]),

  T("tries", "Tries", "Trees", "trees", "Intermediate",
    "Prefix trees that make word/prefix lookups extremely fast — common in autocomplete-style problems.",
    ["trees"], "2-3 hrs", 1980, 140, [
      P("Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "Medium", "Trie,Design", "Google,Amazon"),
      P("Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "Medium", "Trie,DFS,Design"),
      P("Word Search II", "word-search-ii", "Hard", "Trie,Backtracking,Matrix", "Airbnb"),
      P("Longest Word in Dictionary", "longest-word-in-dictionary", "Medium", "Trie,String,DFS"),
      P("Replace Words", "replace-words", "Medium", "Trie,String"),
    ]),

  T("heap", "Heap / Priority Queue", "Trees", "trees", "Intermediate",
    "Efficiently track the min/max element — a workhorse for scheduling, top-K, and streaming problems.",
    ["trees"], "4-5 hrs", 1980, 380, [
      P("Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "Easy", "Heap,Design"),
      P("Last Stone Weight", "last-stone-weight", "Easy", "Heap,Array"),
      P("K Closest Points to Origin", "k-closest-points-to-origin", "Medium", "Heap,Sorting,Quickselect", "Facebook,Amazon"),
      P("Task Scheduler", "task-scheduler", "Medium", "Heap,Greedy,Array", "Facebook,Amazon"),
      P("Design Twitter", "design-twitter", "Medium", "Heap,Hashing,Design", "Twitter"),
      P("Find Median from Data Stream", "find-median-from-data-stream", "Hard", "Heap,Design", "Amazon,Google"),
      P("Reorganize String", "reorganize-string", "Medium", "Heap,Greedy,String"),
      P("Top K Frequent Words", "top-k-frequent-words", "Medium", "Heap,Hashing,Sorting", "Amazon"),
      P("IPO", "ipo", "Hard", "Heap,Greedy"),
    ]),

  T("backtracking", "Backtracking", "Trees", "trees", "Intermediate",
    "Explore, prune, and backtrack through decision trees — permutations, subsets, and combinatorial search.",
    ["recursion"], "5-6 hrs", 1980, 620, [
      P("Subsets", "subsets", "Medium", "Backtracking,Array", "Facebook,Amazon"),
      P("Permutations", "permutations", "Medium", "Backtracking,Array", "Amazon,Microsoft"),
      P("Combination Sum", "combination-sum", "Medium", "Backtracking,Array", "Amazon,Uber"),
      P("Combination Sum II", "combination-sum-ii", "Medium", "Backtracking,Array"),
      P("Subsets II", "subsets-ii", "Medium", "Backtracking,Array"),
      P("Word Search", "word-search", "Medium", "Backtracking,Matrix,DFS", "Microsoft,Amazon"),
      P("Palindrome Partitioning", "palindrome-partitioning", "Medium", "Backtracking,String,DP"),
      P("Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "Medium", "Backtracking,String", "Amazon,Google"),
      P("N-Queens", "n-queens", "Hard", "Backtracking,Matrix", "Microsoft"),
      P("Combinations", "combinations", "Medium", "Backtracking"),
      P("Permutations II", "permutations-ii", "Medium", "Backtracking,Array"),
      P("Sudoku Solver", "sudoku-solver", "Hard", "Backtracking,Matrix", "Amazon"),
      P("Restore IP Addresses", "restore-ip-addresses", "Medium", "Backtracking,String"),
    ]),

  T("graphs", "Graphs", "Graphs", "graphs", "Advanced",
    "DFS/BFS over grids and adjacency lists — islands, cloning, and connectivity problems live here.",
    ["trees"], "6-8 hrs", 2300, 380, [
      P("Number of Islands", "number-of-islands", "Medium", "Graph,DFS,BFS,Matrix", "Amazon,Google,Facebook"),
      P("Clone Graph", "clone-graph", "Medium", "Graph,DFS,BFS,Hashing", "Facebook,Google"),
      P("Max Area of Island", "max-area-of-island", "Medium", "Graph,DFS,Matrix"),
      P("Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium", "Graph,DFS,Matrix", "Google"),
      P("Surrounded Regions", "surrounded-regions", "Medium", "Graph,DFS,Matrix", "Amazon,Facebook"),
      P("Rotting Oranges", "rotting-oranges", "Medium", "Graph,BFS,Matrix", "Amazon"),
      P("Walls and Gates", "walls-and-gates", "Medium", "Graph,BFS,Matrix", "Google (premium alt.)"),
      P("Course Schedule", "course-schedule", "Medium", "Graph,Topological Sort,DFS", "Amazon,Facebook"),
      P("Redundant Connection", "redundant-connection", "Medium", "Graph,Union Find", "Facebook"),
      P("Number of Connected Components in an Undirected Graph", "number-of-connected-components-in-an-undirected-graph", "Medium", "Graph,Union Find", "Google (premium alt.)"),
      P("Graph Valid Tree", "graph-valid-tree", "Medium", "Graph,Union Find", "Facebook (premium alt.)"),
      P("Word Ladder", "word-ladder", "Hard", "Graph,BFS,String", "Amazon,LinkedIn"),
      P("Flood Fill", "flood-fill", "Easy", "Graph,DFS,BFS,Matrix"),
      P("Is Graph Bipartite?", "is-graph-bipartite", "Medium", "Graph,DFS,BFS"),
      P("Evaluate Division", "evaluate-division", "Medium", "Graph,DFS,Union Find", "Facebook"),
      P("Minimum Height Trees", "minimum-height-trees", "Medium", "Graph,Topological Sort,BFS"),
      P("Accounts Merge", "accounts-merge", "Medium", "Graph,Union Find,DFS", "Facebook,Amazon"),
      P("01 Matrix", "01-matrix", "Medium", "Graph,BFS,Matrix"),
    ]),

  T("advanced-graphs", "Advanced Graphs", "Graphs", "graphs", "Advanced",
    "Topological sort, Union-Find, Dijkstra's shortest path, and minimum spanning trees.",
    ["graphs"], "5-7 hrs", 2620, 200, [
      P("Course Schedule II", "course-schedule-ii", "Medium", "Topological Sort,Graph", "Amazon,Facebook"),
      P("Network Delay Time", "network-delay-time", "Medium", "Graph,Dijkstra,Shortest Path"),
      P("Min Cost to Connect All Points", "min-cost-to-connect-all-points", "Medium", "Graph,MST,Union Find", "Google"),
      P("Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "Medium", "Graph,Dijkstra,DP", "Google,Amazon"),
      P("Path with Maximum Probability", "path-with-maximum-probability", "Medium", "Graph,Dijkstra"),
      P("Swim in Rising Water", "swim-in-rising-water", "Hard", "Graph,Binary Search,Dijkstra,Union Find"),
      P("Alien Dictionary", "alien-dictionary", "Hard", "Graph,Topological Sort,String", "Facebook,Google (premium alt.)"),
      P("Reconstruct Itinerary", "reconstruct-itinerary", "Hard", "Graph,Eulerian Path,DFS", "Google"),
      P("Find the City With the Smallest Number of Neighbors at a Threshold Distance", "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance", "Medium", "Graph,Shortest Path,Dijkstra"),
      P("Critical Connections in a Network", "critical-connections-in-a-network", "Hard", "Graph,DFS,Bridges (Tarjan's)", "Google"),
    ]),

  T("greedy", "Greedy", "Optimization", "dp", "Intermediate",
    "Make the locally optimal choice at each step and prove it leads to a globally optimal solution.",
    ["sorting", "heap"], "4-5 hrs", 2620, 560, [
      P("Maximum Subarray", "maximum-subarray", "Medium", "Array,Greedy,DP", "Amazon,Microsoft"),
      P("Jump Game", "jump-game", "Medium", "Array,Greedy,DP", "Amazon,Microsoft"),
      P("Jump Game II", "jump-game-ii", "Medium", "Array,Greedy,DP"),
      P("Gas Station", "gas-station", "Medium", "Array,Greedy"),
      P("Hand of Straights", "hand-of-straights", "Medium", "Greedy,Hashing,Sorting"),
      P("Merge Triplets to Form Target Triplet", "merge-triplets-to-form-target-triplet", "Medium", "Array,Greedy"),
      P("Partition Labels", "partition-labels", "Medium", "Greedy,Two Pointers,String", "Facebook"),
      P("Valid Parenthesis String", "valid-parenthesis-string", "Medium", "Greedy,Stack,String"),
      P("Lemonade Change", "lemonade-change", "Easy", "Greedy,Array"),
      P("Non-decreasing Array", "non-decreasing-array", "Medium", "Greedy,Array"),
      P("Candy", "candy", "Hard", "Greedy,Array", "Google"),
      P("Queue Reconstruction by Height", "queue-reconstruction-by-height", "Medium", "Greedy,Sorting,Array"),
    ]),

  T("intervals", "Intervals", "Optimization", "dp", "Intermediate",
    "Sort by start/end and sweep — merging, inserting, and scheduling meetings all reduce to this pattern.",
    ["sorting"], "3-4 hrs", 2940, 200, [
      P("Insert Interval", "insert-interval", "Medium", "Array,Intervals", "Google,Facebook"),
      P("Merge Intervals", "merge-intervals", "Medium", "Array,Intervals,Sorting", "Facebook,Amazon,Google"),
      P("Non-overlapping Intervals", "non-overlapping-intervals", "Medium", "Array,Intervals,Greedy"),
      P("Meeting Rooms", "meeting-rooms", "Easy", "Array,Intervals,Sorting", "Facebook (premium alt.)"),
      P("Meeting Rooms II", "meeting-rooms-ii", "Medium", "Array,Intervals,Heap", "Facebook,Google (premium alt.)"),
      P("Minimum Interval to Include Each Query", "minimum-interval-to-include-each-query", "Hard", "Intervals,Heap,Sorting"),
      P("Interval List Intersections", "interval-list-intersections", "Medium", "Array,Intervals,Two Pointers", "Facebook"),
      P("Employee Free Time", "employee-free-time", "Hard", "Intervals,Sorting,Heap", "Google (premium alt.)"),
    ]),

  T("dp-1d", "1-D Dynamic Programming", "Dynamic Programming", "dp", "Advanced",
    "Break a problem into overlapping subproblems along a single dimension (index or amount).",
    ["recursion", "backtracking"], "6-8 hrs", 2940, 560, [
      P("House Robber", "house-robber", "Medium", "DP,Array", "Amazon,LinkedIn"),
      P("House Robber II", "house-robber-ii", "Medium", "DP,Array"),
      P("Longest Palindromic Substring", "longest-palindromic-substring", "Medium", "DP,String,Two Pointers", "Amazon,Microsoft"),
      P("Palindromic Substrings", "palindromic-substrings", "Medium", "DP,String,Two Pointers"),
      P("Decode Ways", "decode-ways", "Medium", "DP,String", "Facebook"),
      P("Coin Change", "coin-change", "Medium", "DP,Array,BFS", "Amazon,Google"),
      P("Maximum Product Subarray", "maximum-product-subarray", "Medium", "DP,Array", "Amazon,LinkedIn"),
      P("Word Break", "word-break", "Medium", "DP,String,Trie", "Amazon,Facebook"),
      P("Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium", "DP,Binary Search", "Microsoft,Google"),
      P("Partition Equal Subset Sum", "partition-equal-subset-sum", "Medium", "DP,Array,Knapsack"),
      P("Combination Sum IV", "combination-sum-iv", "Medium", "DP,Array"),
      P("Min Cost Climbing Stairs", "min-cost-climbing-stairs", "Easy", "DP,Array"),
      P("Delete and Earn", "delete-and-earn", "Medium", "DP,Array,Hashing"),
      P("Perfect Squares", "perfect-squares", "Medium", "DP,Math,BFS"),
      P("Integer Break", "integer-break", "Medium", "DP,Math"),
      P("Maximum Length of Repeated Subarray", "maximum-length-of-repeated-subarray", "Medium", "DP,Array,Sliding Window"),
      P("Wiggle Subsequence", "wiggle-subsequence", "Medium", "DP,Greedy,Array"),
    ]),

  T("dp-2d", "2-D Dynamic Programming", "Dynamic Programming", "dp", "Advanced",
    "State depends on two indices — grid paths, string alignment, and interval DP live here.",
    ["dp-1d"], "6-8 hrs", 3260, 300, [
      P("Unique Paths", "unique-paths", "Medium", "DP,Matrix,Combinatorics", "Google,Amazon"),
      P("Longest Common Subsequence", "longest-common-subsequence", "Medium", "DP,String", "Amazon,Microsoft"),
      P("Best Time to Buy and Sell Stock with Cooldown", "best-time-to-buy-and-sell-stock-with-cooldown", "Medium", "DP,Array"),
      P("Coin Change II", "coin-change-ii", "Medium", "DP,Array,Knapsack"),
      P("Target Sum", "target-sum", "Medium", "DP,Array,Backtracking", "Facebook"),
      P("Interleaving String", "interleaving-string", "Medium", "DP,String"),
      P("Edit Distance", "edit-distance", "Medium", "DP,String", "Google,Facebook,Uber"),
      P("Longest Increasing Path in a Matrix", "longest-increasing-path-in-a-matrix", "Hard", "DP,DFS,Matrix,Memoization", "Google"),
      P("Distinct Subsequences", "distinct-subsequences", "Hard", "DP,String"),
      P("Burst Balloons", "burst-balloons", "Hard", "DP,Interval DP", "Google,LinkedIn"),
      P("Regular Expression Matching", "regular-expression-matching", "Hard", "DP,String,Recursion", "Facebook,Google,Uber"),
      P("Minimum Path Sum", "minimum-path-sum", "Medium", "DP,Matrix"),
      P("Unique Paths II", "unique-paths-ii", "Medium", "DP,Matrix"),
      P("Maximal Square", "maximal-square", "Medium", "DP,Matrix", "Facebook"),
      P("Cherry Pickup", "cherry-pickup", "Hard", "DP,Matrix"),
      P("Dungeon Game", "dungeon-game", "Hard", "DP,Matrix"),
    ]),

  T("segment-tree", "Segment Tree & Fenwick Tree", "Advanced Structures", "advanced", "Advanced",
    "Range-query data structures that support fast updates alongside range sum/min/max queries.",
    ["trees"], "4-5 hrs", 3260, 620, [
      P("Range Sum Query - Mutable", "range-sum-query-mutable", "Medium", "Fenwick Tree,Segment Tree,Design"),
      P("My Calendar I", "my-calendar-i", "Medium", "Segment Tree,Design,Binary Search"),
      P("Count of Smaller Numbers After Self", "count-of-smaller-numbers-after-self", "Hard", "Fenwick Tree,Segment Tree,Merge Sort", "Google"),
      P("The Skyline Problem", "the-skyline-problem", "Hard", "Segment Tree,Heap,Divide and Conquer", "Google,Microsoft"),
      P("Falling Squares", "falling-squares", "Hard", "Segment Tree,Coordinate Compression"),
    ]),

  T("design", "Design (OOD)", "System Building Blocks", "design", "Intermediate",
    "Object-oriented and data-structure design questions that test API thinking, not just algorithms.",
    ["arrays-hashing"], "4-5 hrs", 3580, 300, [
      P("Insert Delete GetRandom O(1)", "insert-delete-getrandom-o1", "Medium", "Design,Hashing,Array", "Amazon"),
      P("Design Underground System", "design-underground-system", "Medium", "Design,Hashing"),
      P("Encode and Decode TinyURL", "encode-and-decode-tinyurl", "Medium", "Design,Hashing", "Google"),
      P("LFU Cache", "lfu-cache", "Hard", "Design,Hashing,Linked List", "Amazon,Google"),
      P("All O`one Data Structure", "all-oone-data-structure", "Hard", "Design,Linked List,Hashing", "Facebook"),
      P("Design HashMap", "design-hashmap", "Easy", "Design,Hashing,Array"),
      P("Design Browser History", "design-browser-history", "Medium", "Design,Stack,Linked List"),
      P("Design File System", "design-file-system", "Medium", "Design,Trie,Hashing"),
    ]),

  T("strings", "Strings & Pattern Matching", "Strings", "core", "Intermediate",
    "String-specific tricks: prefix functions, careful indexing, and simulation-style parsing.",
    ["arrays-hashing"], "3-4 hrs", 3580, 620, [
      P("Longest Common Prefix", "longest-common-prefix", "Easy", "String"),
      P("Find the Index of the First Occurrence in a String", "find-the-index-of-the-first-occurrence-in-a-string", "Easy", "String,Two Pointers"),
      P("Repeated DNA Sequences", "repeated-dna-sequences", "Medium", "String,Hashing,Bit Manipulation"),
      P("Zigzag Conversion", "zigzag-conversion", "Medium", "String,Simulation"),
      P("Text Justification", "text-justification", "Hard", "String,Simulation", "Google,Airbnb"),
      P("Valid Palindrome II", "valid-palindrome-ii", "Easy", "String,Two Pointers,Greedy"),
      P("String to Integer (atoi)", "string-to-integer-atoi", "Medium", "String,Simulation", "Amazon,Microsoft"),
      P("Compare Version Numbers", "compare-version-numbers", "Medium", "String,Two Pointers"),
      P("Count and Say", "count-and-say", "Medium", "String,Simulation"),
    ]),

  T("string-matching", "String Matching", "Strings", "core", "Advanced",
    "Dedicated pattern-matching algorithms (KMP-style prefix functions, string rotation checks) that go beyond basic string manipulation.",
    ["strings"], "3-4 hrs", 3900, 200, [
      P("Repeated Substring Pattern", "repeated-substring-pattern", "Easy", "String,KMP"),
      P("Rotate String", "rotate-string", "Easy", "String,String Matching"),
      P("Find All Anagrams in a String", "find-all-anagrams-in-a-string", "Medium", "String,Sliding Window,Hashing", "Facebook"),
      P("Repeated String Match", "repeated-string-match", "Medium", "String,String Matching"),
      P("Longest Happy Prefix", "longest-happy-prefix", "Hard", "String,KMP", "Google"),
      P("Shortest Palindrome", "shortest-palindrome", "Hard", "String,KMP", "Google,Apple"),
    ]),

  T("geometry", "Geometry", "Math & Geometry", "core", "Advanced",
    "Coordinate geometry problems — collinearity, convex hulls, and area calculations that show up occasionally in harder rounds.",
    ["math-geometry"], "3-4 hrs", 3900, 440, [
      P("Largest Triangle Area", "largest-triangle-area", "Easy", "Geometry,Math"),
      P("Valid Square", "valid-square", "Medium", "Geometry,Math"),
      P("Minimum Area Rectangle", "minimum-area-rectangle", "Medium", "Geometry,Hashing"),
      P("Max Points on a Line", "max-points-on-a-line", "Hard", "Geometry,Hashing,Math", "Google,LinkedIn"),
      P("Erect the Fence", "erect-the-fence", "Hard", "Geometry,Convex Hull"),
    ]),

  T("sparse-table", "Sparse Table & Binary Lifting", "Advanced Structures", "advanced", "Advanced",
    "Preprocessing structures for O(1)/O(log n) range and ancestor queries. Note: this is more of a competitive-programming staple than a LeetCode one — direct problems are genuinely sparse (Codeforces/AtCoder have far more), so treat this topic as understanding the technique rather than a large drill set.",
    ["segment-tree", "trees"], "3-4 hrs", 3900, 680, [
      P("Kth Ancestor of a Tree Node", "kth-ancestor-of-a-tree-node", "Medium", "Binary Lifting,Tree,Design"),
      P("Constrained Subsequence Sum", "constrained-subsequence-sum", "Hard", "DP,Monotonic Queue,Sparse Structures"),
    ]),

  T("network-flow", "Network Flow", "Graphs", "graphs", "Advanced",
    "Max-flow/min-cut modeling. Genuinely rare as a direct LeetCode category (it's far more common on Codeforces/AtCoder) — included for completeness of the pattern, not as a large drill set.",
    ["advanced-graphs"], "2-3 hrs", 3900, 920, [
      P("Maximum Students Taking Exam", "maximum-students-taking-exam", "Hard", "Bitmask DP,Matching,Graph"),
    ]),

  T("concurrency", "Concurrency", "System Building Blocks", "design", "Advanced",
    "Multithreading primitives — locks, semaphores, and coordination between threads. A distinct interview category at some companies (especially backend-heavy roles).",
    ["design"], "3-4 hrs", 4220, 200, [
      P("Print in Order", "print-in-order", "Easy", "Concurrency,Multithreading"),
      P("Print FooBar Alternately", "print-foobar-alternately", "Medium", "Concurrency,Multithreading"),
      P("Building H2O", "building-h2o", "Medium", "Concurrency,Multithreading"),
      P("The Dining Philosophers", "the-dining-philosophers", "Medium", "Concurrency,Multithreading"),
      P("Web Crawler Multithreaded", "web-crawler-multithreaded", "Medium", "Concurrency,BFS,Design", "Google (premium alt.)"),
    ]),

  T("sql", "SQL Fundamentals", "Data / SQL", "core", "Beginner",
    "Query-writing skills for data-heavy roles and any interview loop with a SQL round — joins, aggregations, and window-style queries.",
    [], "4-5 hrs", 4220, 440, [
      P("Combine Two Tables", "combine-two-tables", "Easy", "SQL,Join"),
      P("Employees Earning More Than Their Managers", "employees-earning-more-than-their-managers", "Easy", "SQL,Join"),
      P("Duplicate Emails", "duplicate-emails", "Easy", "SQL,Group By"),
      P("Rising Temperature", "rising-temperature", "Easy", "SQL,Self Join"),
      P("Second Highest Salary", "second-highest-salary", "Medium", "SQL,Subquery"),
      P("Department Top Three Salaries", "department-top-three-salaries", "Hard", "SQL,Window Function"),
      P("Trips and Users", "trips-and-users", "Hard", "SQL,Join,Aggregation"),
    ]),

  T("design-advanced", "Advanced Design", "System Building Blocks", "design", "Intermediate",
    "More OOD/system-design-flavored LeetCode problems — simulate a real system's state machine and expose a clean API for it.",
    ["design"], "3-4 hrs", 4220, 680, [
      P("Design Parking System", "design-parking-system", "Easy", "Design,OOD"),
      P("Logger Rate Limiter", "logger-rate-limiter", "Easy", "Design,Hashing", "Google (premium alt.)"),
      P("Design a Stack With Increment Operation", "design-a-stack-with-increment-operation", "Medium", "Design,Stack,Array"),
      P("Design Tic-Tac-Toe", "design-tic-tac-toe", "Medium", "Design,Matrix,OOD"),
      P("Snake Game", "snake-game", "Medium", "Design,Queue,Simulation"),
    ]),

  T("simulation-matrix", "Simulation & Matrix", "Math & Geometry", "core", "Intermediate",
    "Follow-the-instructions problems on grids — careful indexing and state-tracking matter more than a clever algorithm here.",
    ["math-geometry"], "3-4 hrs", 4220, 920, [
      P("Robot Return to Origin", "robot-return-to-origin", "Easy", "Simulation,String"),
      P("Image Smoother", "image-smoother", "Easy", "Matrix,Simulation"),
      P("Toeplitz Matrix", "toeplitz-matrix", "Easy", "Matrix,Simulation"),
      P("Spiral Matrix II", "spiral-matrix-ii", "Medium", "Matrix,Simulation"),
      P("Diagonal Traverse", "diagonal-traverse", "Medium", "Matrix,Simulation"),
      P("Game of Life", "game-of-life", "Medium", "Matrix,Simulation", "Google,Amazon"),
    ]),
];
