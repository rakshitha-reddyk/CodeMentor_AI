/**
 * Local Mock Lessons Database
 * This is used when Supabase is unavailable or for offline development
 * Structure: Simple, flat lessons with full content
 */

export interface MockLesson {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number; // minutes
  category: string;
  content: string; // Full lesson content
  codeExample: string; // Code snippet to show
  xp: number; // Experience points for completing
}

export const MOCK_LESSONS: MockLesson[] = [
  {
    id: 1,
    title: "JavaScript Basics",
    description:
      "Learn the fundamentals of JavaScript including variables, data types, and basic operations.",
    difficulty: "Beginner",
    duration: 15,
    category: "JavaScript",
    xp: 50,
    content: `
## JavaScript Basics

JavaScript is a versatile programming language that powers interactive websites and applications.

### What You'll Learn

In this lesson, you'll understand:
- Variables and constants
- Data types (String, Number, Boolean, Array, Object)
- Operators (arithmetic, logical, comparison)
- Basic syntax and best practices

### Why It Matters

JavaScript is the foundation for web development. Understanding these basics is essential before moving to more advanced topics.

### Key Concepts

**Variables**
Variables are containers for storing data values. You can declare variables using var, let, or const.

**Data Types**
JavaScript has several data types:
- String: Text data like "Hello"
- Number: Numeric values like 42
- Boolean: true or false
- Array: List of values [1, 2, 3]
- Object: Key-value pairs {name: "John"}

**Operators**
Operators allow you to perform operations on values:
- Addition: +
- Subtraction: -
- Multiplication: *
- Division: /

### Common Mistakes to Avoid

1. Not declaring variables properly
2. Mixing data types without conversion
3. Forgetting semicolons (though not always required)
4. Using var instead of let/const
    `,
    codeExample: `
// Variables and Constants
const name = "John";
const age = 25;
let city = "New York";

// Data Types
const message = "Hello, World!"; // String
const count = 42; // Number
const isActive = true; // Boolean
const numbers = [1, 2, 3, 4, 5]; // Array
const person = { name: "John", age: 25 }; // Object

// Operators
const sum = 10 + 20; // 30
const difference = 50 - 30; // 20
const product = 5 * 4; // 20
const quotient = 100 / 5; // 20

// Console output
console.log(name); // Output: John
console.log(sum); // Output: 30
console.log(person.name); // Output: John
    `,
  },
  {
    id: 2,
    title: "Variables and Data Types",
    description:
      "Understand how to declare variables and work with different data types in JavaScript.",
    difficulty: "Beginner",
    duration: 20,
    category: "JavaScript",
    xp: 60,
    content: `
## Variables and Data Types

Variables are the building blocks of programming. They allow you to store and manipulate data.

### Three Ways to Declare Variables

**const** (Constant)
- Cannot be reassigned after declaration
- Block-scoped
- Use by default

**let** (Block-scoped)
- Can be reassigned
- Block-scoped
- Use when you need to reassign

**var** (Function-scoped)
- Older way to declare variables
- Function-scoped (not block-scoped)
- Avoid in modern code

### Data Types

**Primitive Types**
- String: Text data
- Number: Integers and decimals
- Boolean: true/false
- undefined: Uninitialized variable
- null: No value

**Complex Types**
- Array: Ordered list of values
- Object: Key-value pairs

### Type Conversion

JavaScript allows converting between types:
- String to Number: parseInt(), parseFloat(), Number()
- Number to String: toString(), String()
- Any to Boolean: Boolean()

### Template Literals

Modern way to create strings with variables:
\`Hello, \${name}!\`
    `,
    codeExample: `
// Using const (recommended)
const firstName = "John";
const lastName = "Doe";
const age = 30;
const isStudent = false;

// Using let (when you need to reassign)
let score = 0;
score = 95; // Reassignment is allowed

// Data types
const text = "Hello"; // String
const number = 42; // Number
const decimal = 3.14; // Number (decimal)
const active = true; // Boolean
const nothing = undefined; // Undefined

// Arrays
const fruits = ["apple", "banana", "orange"];
console.log(fruits[0]); // "apple"

// Objects
const person = {
  name: "John",
  age: 30,
  city: "New York"
};
console.log(person.name); // "John"

// Template literals
const greeting = \`Hello, \${firstName} \${lastName}!\`;
console.log(greeting); // Hello, John Doe!
    `,
  },
  {
    id: 3,
    title: "Loops in JavaScript",
    description:
      "Master different types of loops: for, while, and do-while loops.",
    difficulty: "Beginner",
    duration: 25,
    category: "JavaScript",
    xp: 70,
    content: `
## Loops in JavaScript

Loops allow you to execute code repeatedly without writing it multiple times.

### Types of Loops

**for Loop**
- Best for known number of iterations
- Syntax: for (initialization; condition; increment)

**while Loop**
- Best for unknown number of iterations
- Continues while condition is true

**do-while Loop**
- Executes at least once
- Checks condition after execution

**for...of Loop**
- Iterates over array values
- Modern and readable

**for...in Loop**
- Iterates over object properties
- Not recommended for arrays

### Loop Control

**break**
- Exits the loop immediately

**continue**
- Skips current iteration

### Best Practices

1. Use for loops for known iterations
2. Use while for conditional iterations
3. Use for...of for array iteration
4. Always ensure loop will eventually exit
5. Avoid nested loops when possible
    `,
    codeExample: `
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// While loop
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

// Do-while loop (executes at least once)
let x = 0;
do {
  console.log(x);
  x++;
} while (x < 3);

// For...of loop (iterating arrays)
const numbers = [10, 20, 30];
for (const num of numbers) {
  console.log(num); // 10, 20, 30
}

// For...in loop (iterating objects)
const person = { name: "John", age: 30 };
for (const key in person) {
  console.log(key, person[key]);
}

// Break and continue
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // Skip 3
  if (i === 7) break; // Exit at 7
  console.log(i);
}
    `,
  },
  {
    id: 4,
    title: "Functions in JavaScript",
    description: "Learn how to create and use functions to organize your code.",
    difficulty: "Beginner",
    duration: 20,
    category: "JavaScript",
    xp: 65,
    content: `
## Functions in JavaScript

Functions are reusable blocks of code that perform specific tasks.

### Function Declaration

The traditional way to declare a function:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Arrow Functions

Modern ES6 syntax:
\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

### Function Parameters

Functions can accept zero or more parameters:
- Named parameters
- Default parameters
- Rest parameters (...)

### Return Values

Functions can return values using the return statement:
- Explicit return (using return keyword)
- Implicit return (arrow functions with single expression)

### Scope

Variables declared in functions are local to that function:
- Function scope
- Block scope
- Global scope

### Closures

Functions can access variables from their parent scope:
- Inner functions have access to outer variables
- Useful for data encapsulation
    `,
    codeExample: `
// Function declaration
function add(a, b) {
  return a + b;
}
console.log(add(5, 3)); // 8

// Arrow function
const multiply = (a, b) => a * b;
console.log(multiply(5, 3)); // 15

// Default parameters
function greet(name = "Guest") {
  return \`Hello, \${name}!\`;
}
console.log(greet()); // Hello, Guest!
console.log(greet("John")); // Hello, John!

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Closure example
function counter() {
  let count = 0;
  return {
    increment: () => count++,
    decrement: () => count--,
    getCount: () => count
  };
}

const myCounter = counter();
myCounter.increment();
myCounter.increment();
console.log(myCounter.getCount()); // 2
    `,
  },
  {
    id: 5,
    title: "React Hooks - useState",
    description:
      "Master the useState hook to manage component state in functional components.",
    difficulty: "Intermediate",
    duration: 25,
    category: "React",
    xp: 80,
    content: `
## React Hooks - useState

useState is a React hook that allows you to add state to functional components.

### What is State?

State is data that changes over time:
- User input (form values)
- Toggle states (open/closed)
- Counters
- Lists of items

### useState Syntax

\`\`\`javascript
const [state, setState] = useState(initialValue);
\`\`\`

Where:
- state: Current value
- setState: Function to update state
- initialValue: Starting value

### Updating State

You can update state by calling setState with a new value:
- Direct value: setState(newValue)
- Function: setState(prevState => prevState + 1)

### Rules of Hooks

1. Call hooks at the top level of component
2. Call hooks in the same order every render
3. Only call hooks from React functions

### Common Use Cases

- Form handling
- Toggle visibility
- Counter
- Lists and items
- Loading states
    `,
    codeExample: `
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// With form input
function NameInput() {
  const [name, setName] = useState('');
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}

// Multiple state values
function UserProfile() {
  const [name, setName] = useState('John');
  const [age, setAge] = useState(30);
  const [email, setEmail] = useState('john@example.com');
  
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}
    `,
  },
  {
    id: 6,
    title: "React Hooks - useEffect",
    description:
      "Learn how to use useEffect hook for side effects in React components.",
    difficulty: "Intermediate",
    duration: 30,
    category: "React",
    xp: 85,
    content: `
## React Hooks - useEffect

useEffect allows you to perform side effects in functional components.

### What are Side Effects?

Side effects are operations that affect things outside the component:
- Fetching data from APIs
- Setting up timers or intervals
- Subscribing to events
- Updating the document title
- Local storage operations

### useEffect Syntax

\`\`\`javascript
useEffect(() => {
  // Effect code runs here
  
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
\`\`\`

### Dependency Array

Controls when the effect runs:
- No array: Runs after every render
- Empty array []: Runs only once (on mount)
- [value1, value2]: Runs when value1 or value2 changes

### Cleanup Functions

Return a function from useEffect to clean up:
- Unsubscribe from events
- Clear timers
- Cancel API requests

### Common Patterns

- Fetch data on component mount
- Update document title
- Set up event listeners
- Manage timers
    `,
    codeExample: `
import { useState, useEffect } from 'react';

// Fetch data on mount
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []); // Runs once on mount
  
  return loading ? <p>Loading...</p> : <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Update document title
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]); // Runs when title changes
  
  return <h1>{title}</h1>;
}

// Timer with cleanup
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  
  useEffect(() => {
    if (!running) return;
    
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    // Cleanup: clear interval
    return () => clearInterval(interval);
  }, [running]);
  
  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
    `,
  },
];

export const CATEGORIES = [
  "JavaScript",
  "React",
  "CSS",
  "TypeScript",
  "Node.js",
];

export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

/**
 * Get a lesson by ID
 */
export function getLessonById(id: number): MockLesson | undefined {
  return MOCK_LESSONS.find((lesson) => lesson.id === id);
}

/**
 * Get all lessons
 */
export function getAllLessons(): MockLesson[] {
  return MOCK_LESSONS;
}

/**
 * Get lessons by difficulty
 */
export function getLessonsByDifficulty(
  difficulty: "Beginner" | "Intermediate" | "Advanced",
): MockLesson[] {
  return MOCK_LESSONS.filter((lesson) => lesson.difficulty === difficulty);
}

/**
 * Get lessons by category
 */
export function getLessonsByCategory(category: string): MockLesson[] {
  return MOCK_LESSONS.filter((lesson) => lesson.category === category);
}

/**
 * Search lessons by title or description
 */
export function searchLessons(query: string): MockLesson[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_LESSONS.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(lowerQuery) ||
      lesson.description.toLowerCase().includes(lowerQuery),
  );
}
