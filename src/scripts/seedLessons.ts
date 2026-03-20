import { supabase } from "@/integrations/supabase/client";

const dummyLessons = [
  {
    title: "JavaScript Basics",
    difficulty: "Beginner",
    content: `Learn the fundamentals of JavaScript including variables, data types, and basic operations.

JavaScript is a versatile programming language that powers interactive websites. In this lesson, you'll learn:

1. Variables and Constants
2. Data Types (String, Number, Boolean, etc.)
3. Operators
4. Basic Syntax

Example:
const name = "John";
const age = 25;
console.log(name + " is " + age + " years old");`,
  },
  {
    title: "Variables and Data Types",
    difficulty: "Beginner",
    content: `Understand how to declare variables and work with different data types in JavaScript.

Variables are containers for storing data values. JavaScript has several ways to declare variables:

var, let, const

Data Types:
- String: "Hello"
- Number: 42
- Boolean: true/false
- Object: {name: "John"}
- Array: [1, 2, 3]

Example:
let age = 25;
const name = "Alice";
var city = "New York";`,
  },
  {
    title: "Loops in JavaScript",
    difficulty: "Beginner",
    content: `Master different types of loops: for, while, and do-while loops.

Loops are used to execute code repeatedly. JavaScript has three main loop types:

1. For Loop
2. While Loop
3. Do-While Loop

Example:
for (let i = 0; i < 5; i++) {
  console.log(i);
}

while (x < 10) {
  console.log(x);
  x++;
}`,
  },
  {
    title: "Functions in JavaScript",
    difficulty: "Beginner",
    content: `Learn how to create and use functions to organize your code.

Functions are reusable blocks of code. They help organize and modularize your code.

Declaration:
function add(a, b) {
  return a + b;
}

Arrow Function:
const add = (a, b) => a + b;

Usage:
console.log(add(5, 3)); // Output: 8`,
  },
  {
    title: "React Hooks - useState",
    difficulty: "Intermediate",
    content: `Master the useState hook to manage component state in functional components.

useState is a React hook that allows you to add state to functional components.

Syntax:
const [state, setState] = useState(initialValue);

Example:
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
  },
  {
    title: "React Hooks - useEffect",
    difficulty: "Intermediate",
    content: `Learn how to use useEffect hook for side effects in React components.

useEffect allows you to perform side effects in functional components.

Syntax:
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);

Example:
useEffect(() => {
  console.log('Component mounted or dependencies changed');
  
  return () => {
    console.log('Cleanup');
  };
}, [count]);`,
  },
  {
    title: "React Components and Props",
    difficulty: "Beginner",
    content: `Understand React components and how to pass data through props.

React components are JavaScript functions that return JSX. Props allow you to pass data from parent to child components.

Function Component:
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

Usage:
<Welcome name="Alice" />

Props are read-only and cannot be modified by child components.`,
  },
  {
    title: "Arrays in DSA",
    difficulty: "Beginner",
    content: `Learn array fundamentals including indexing, iteration, and common operations.

Arrays are fundamental data structures that store multiple elements.

Key Operations:
1. Access: arr[0]
2. Insert: arr.push(element)
3. Remove: arr.pop()
4. Iterate: for loop, forEach
5. Search: indexOf, find

Example:
const arr = [1, 2, 3, 4, 5];
arr.push(6); // [1, 2, 3, 4, 5, 6]
const first = arr[0]; // 1
arr.forEach(item => console.log(item));`,
  },
  {
    title: "Linked Lists",
    difficulty: "Intermediate",
    content: `Master linked lists: a fundamental data structure for efficient insertions and deletions.

Linked Lists are dynamic data structures that use nodes to store data.

Structure:
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

Advantages: O(1) insertion/deletion at known position
Disadvantages: O(n) search time

Common Operations:
- Insert at beginning
- Insert at end
- Delete node
- Search
- Reverse`,
  },
  {
    title: "Binary Search",
    difficulty: "Intermediate",
    content: `Learn the efficient binary search algorithm for sorted arrays.

Binary Search is an efficient algorithm for searching in sorted arrays with O(log n) time complexity.

Algorithm:
1. Start with middle element
2. If target equals middle, return index
3. If target < middle, search left half
4. If target > middle, search right half
5. Repeat until found

Example:
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  },
  {
    title: "Python Basics",
    difficulty: "Beginner",
    content: `Introduction to Python: syntax, variables, and basic operations.

Python is a beginner-friendly programming language known for its readable syntax.

Basic Concepts:
1. Variables: name = "John"
2. Data Types: int, str, float, bool, list
3. Print: print("Hello, Python!")
4. Input: name = input("Enter your name: ")

Example:
age = 25
name = "Alice"
print(f"{name} is {age} years old")`,
  },
  {
    title: "Python Loops and Functions",
    difficulty: "Beginner",
    content: `Learn loops and function definitions in Python.

Loops in Python:
for i in range(5):
  print(i)

while x < 10:
  print(x)
  x += 1

Functions:
def greet(name):
  return f"Hello, {name}!"

result = greet("Alice")
print(result)`,
  },
  {
    title: "Web Dev Basics - HTML",
    difficulty: "Beginner",
    content: `Learn HTML fundamentals for building web pages.

HTML (HyperText Markup Language) is the foundation of web pages.

Common Tags:
- <h1> to <h6>: Headings
- <p>: Paragraph
- <a>: Link
- <img>: Image
- <button>: Button
- <div>: Container

Example:
<html>
  <head><title>My Page</title></head>
  <body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`,
  },
  {
    title: "CSS Flexbox",
    difficulty: "Intermediate",
    content: `Master CSS Flexbox for creating flexible and responsive layouts.

Flexbox is a powerful CSS layout tool for creating responsive designs.

Key Properties:
- display: flex
- flex-direction: row | column
- justify-content: center | space-between | etc
- align-items: center | flex-start | etc
- gap: spacing between items

Example:
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
}`,
  },
  {
    title: "Fetch API and Async/Await",
    difficulty: "Intermediate",
    content: `Learn how to make HTTP requests using Fetch API and async/await.

Fetch API allows you to make HTTP requests. Async/Await makes handling asynchronous code cleaner.

Basic Fetch:
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

With Async/Await:
async function getData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}`,
  },
  {
    title: "AI and Machine Learning Basics",
    difficulty: "Intermediate",
    content: `Introduction to AI and Machine Learning concepts.

AI (Artificial Intelligence) is a broad field. Machine Learning is a subset that focuses on learning from data.

Key Concepts:
1. Supervised Learning: Learning from labeled data
2. Unsupervised Learning: Learning patterns from unlabeled data
3. Deep Learning: Neural networks with multiple layers
4. Algorithms: Linear Regression, Classification, Clustering

Tools: TensorFlow, PyTorch, Scikit-learn`,
  },
  {
    title: "String Methods in JavaScript",
    difficulty: "Beginner",
    content: `Master JavaScript string methods for text manipulation.

JavaScript strings have many useful methods:

Common Methods:
- length: String length
- toUpperCase(): Convert to uppercase
- toLowerCase(): Convert to lowercase
- substring(): Extract part of string
- split(): Split into array
- includes(): Check if contains substring
- indexOf(): Find index of substring

Example:
const str = "Hello World";
console.log(str.toUpperCase()); // HELLO WORLD
console.log(str.includes("World")); // true`,
  },
  {
    title: "Object-Oriented Programming",
    difficulty: "Advanced",
    content: `Learn OOP concepts including classes, inheritance, and encapsulation.

Object-Oriented Programming helps organize code into reusable objects.

Key Concepts:
1. Classes: Blueprint for objects
2. Inheritance: Child classes inherit from parent
3. Encapsulation: Hide internal details
4. Polymorphism: Multiple forms of methods

Example:
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + " barks");
  }
}`,
  },
  {
    title: "React Context API",
    difficulty: "Advanced",
    content: `Manage global state using React Context API.

Context API allows you to share state across components without prop drilling.

Setup:
const MyContext = createContext();

Provider:
<MyContext.Provider value={value}>
  <App />
</MyContext.Provider>

Usage:
const value = useContext(MyContext);

Benefits: No prop drilling, cleaner component tree`,
  },
  {
    title: "Sorting Algorithms",
    difficulty: "Advanced",
    content: `Master common sorting algorithms: Bubble Sort, Quick Sort, Merge Sort.

Sorting is fundamental to computer science.

Algorithms:
1. Bubble Sort: O(n²) - Simple but slow
2. Quick Sort: O(n log n) average - Efficient
3. Merge Sort: O(n log n) - Stable sort
4. Heap Sort: O(n log n) - In-place

Quick Sort Example:
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
  },
  {
    title: "Advanced React Patterns",
    difficulty: "Advanced",
    content: `Learn advanced React patterns: Custom Hooks, Render Props, Higher-Order Components.

Advanced patterns help you write more reusable and maintainable React code.

1. Custom Hooks: Extract component logic into reusable functions
2. Render Props: Share component logic using props
3. HOC: Wrap components to provide additional functionality
4. Compound Components: Components that work together

Custom Hook Example:
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: e => setValue(e.target.value)
  };
}`,
  },
  {
    title: "Database Design and SQL",
    difficulty: "Advanced",
    content: `Learn database design principles and SQL queries.

Databases store and retrieve data efficiently.

Key Concepts:
1. Normalization: Organize data to reduce redundancy
2. Primary Keys: Unique identifier for each row
3. Foreign Keys: Link between tables
4. Indexes: Speed up queries

Basic SQL:
SELECT * FROM users WHERE age > 18;
INSERT INTO users (name, age) VALUES ('John', 25);
UPDATE users SET age = 26 WHERE id = 1;
DELETE FROM users WHERE id = 1;`,
  },
  {
    title: "TypeScript Basics",
    difficulty: "Intermediate",
    content: `Learn TypeScript: type safety and modern JavaScript features.

TypeScript adds type safety to JavaScript.

Key Features:
1. Type Annotations: let name: string = "John";
2. Interfaces: Define object shapes
3. Enums: Named constants
4. Generics: Write reusable components

Example:
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return "Hello, " + user.name;
}

const user: User = { name: "Alice", age: 25 };
console.log(greet(user));`,
  },
];

export async function seedLessons() {
  try {
    console.log("🌱 Starting to seed lessons...");

    // Check if lessons already exist
    const { data: existingLessons, error: checkError } = await supabase
      .from("lessons")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("❌ Error checking existing lessons:", checkError);
      console.error(
        "   This might be due to RLS policies. Lessons table might not have read access.",
      );
      throw checkError;
    }

    if (existingLessons && existingLessons.length > 0) {
      console.log(
        `✅ Found ${existingLessons.length} existing lessons, skipping seed`,
      );
      return existingLessons;
    }

    console.log(`📝 Inserting ${dummyLessons.length} lessons...`);

    // Insert all dummy lessons in batches to avoid payload size issues
    const batchSize = 5;
    const allData: any[] = [];

    for (let i = 0; i < dummyLessons.length; i += batchSize) {
      const batch = dummyLessons.slice(i, i + batchSize);
      console.log(
        `   📦 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dummyLessons.length / batchSize)}...`,
      );

      const { data, error } = await supabase
        .from("lessons")
        .insert(batch)
        .select();

      if (error) {
        console.error(
          `❌ Error seeding lessons batch ${i / batchSize + 1}:`,
          error,
        );
        throw new Error(`Batch insert failed: ${error.message}`);
      }

      if (data) {
        allData.push(...data);
      }
    }

    console.log(`✅ Successfully seeded ${allData.length} lessons!`);
    return allData;
  } catch (error) {
    console.error("❌ Error in seedLessons:", error);
    console.error("   Please check that:");
    console.error("   1. 'lessons' table exists in Supabase");
    console.error(
      "   2. Row Level Security (RLS) policies allow read/insert access",
    );
    console.error("   3. Database connection is working");
    throw error;
  }
}
