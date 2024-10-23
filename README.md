# RuleCraft: Advanced Rule Engine with AST

RuleCraft is a flexible rule engine designed to evaluate user eligibility based on various attributes such as age, department, and income. Utilizing Abstract Syntax Trees (AST), this application supports a modern 3-tier architecture that enables efficient creation, combination, and evaluation of complex business rules.

## Table of Contents

- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technologies Used](#-technologies-used)
- [Implementation Details](#-implementation-details)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Data Structures](#-data-structures)
- [Testing with Postman](#-Testing-with-Postman)
- [Screenshots](#Screenshots)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🌟 Key Features

- **Dynamic Rule Creation**: Build complex rules using an intuitive UI
- **AST-Based Evaluation**: Efficient rule processing using Abstract Syntax Trees
- **Rule Combination**: Merge multiple rules with smart optimization
- **Real-time Validation**: Instant feedback on rule syntax and structure
- **Attribute Catalog**: Pre-defined set of valid attributes for rule creation
- **User-Friendly Interface**: Modern, responsive design for easy rule management

## 🚀 Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Testing**: Postman

## 🏗 Architecture

RuleCraft follows a robust 3-tier architecture:


```
├── Frontend (React + TypeScript)
│   ├── Rule Builder UI
│   ├── Rule Visualization
│   └── Results Dashboard
│
├── API Layer (Express.js)
│   ├── Rule Management
│   ├── Evaluation Engine
│   └── Combination Logic
│
└── Data Layer (MongoDB)
    ├── Rule Storage
    ├── User Data
    └── Evaluation History
```

Repository Structure

```
RuleCraft/
├── server/                  # Backend code
│   ├── models/             # Database models
│   │   └── Rule.js
│   ├── routes/             # API routes
│   │   └── rules.js
│   ├── controllers/        # Request handling logic
│   ├── utils/             # Utility functions
│   │   └── ruleEngine.js
│   ├── config/            # Configuration files
│   └── index.js           # Entry point
│
├── src/                    # Frontend code
│   ├── components/        # React components
│   │   ├── Dashboard.tsx
│   │   ├── Navbar.tsx
│   │   ├── RuleList.tsx
│   │   ├── RuleCreator.tsx
│   │   ├── RuleEvaluator.tsx
│   │   └── RuleCombiner.tsx
│   ├── pages/            # Page components
│   ├── utils/            # Frontend utilities
│   ├── App.tsx           # Main application
│   └── index.tsx         # Entry point
│
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite configuration
└── README.md             # Documentation
```

## 💻 Implementation Details

### Backend Implementation

#### Rule Model (models/Rule.js)
```javascript
const RuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  expression: {
    type: String,
    required: true,
  },
  ast: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
```

#### Rule Engine (utils/ruleEngine.js)
```javascript
// Create a new rule
export function createRule(ruleString) {
  const cleanedString = ruleString.replace(/\s+/g, ' ').trim();
  const jsExpression = cleanedString
    .replace(/AND/g, '&&')
    .replace(/OR/g, '||')
    .replace(/(\w+)\s*=\s*'(\w+)'/g, "$1 === '$2'");
  
  const ast = parse(jsExpression);
  return ast.body[0].expression;
}

// Combine multiple rules
export function combineRules(rules) {
  return rules.reduce((combined, rule) => ({
    type: 'LogicalExpression',
    operator: '&&',
    left: combined,
    right: rule
  }));
}

// Evaluate a rule
export function evaluateRule(ast, data) {
  function evaluate(node) {
    switch (node.type) {
      case 'BinaryExpression':
        const left = evaluate(node.left);
        const right = evaluate(node.right);
        return performOperation(node.operator, left, right);
      case 'LogicalExpression':
        return evaluateLogical(node);
      case 'Identifier':
        return getData(node.name);
      case 'Literal':
        return node.value;
    }
  }
  return evaluate(ast);
}
```

### Frontend Implementation

#### App Component (App.tsx)
```typescript
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rules" element={<RuleList />} />
            <Route path="/create" element={<RuleCreator />} />
            <Route path="/evaluate" element={<RuleEvaluator />} />
            <Route path="/combine" element={<RuleCombiner />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Satyamkumarnavneet/rulecraft.git
   cd rulecraft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Backend Server:
   ```bash
   node server/index.js
   ```
3. Start the Frontend Development Server:
   ```bash
   npm run dev
   ```   
   

## 🔌 API Endpoints

### Rule Management

```typescript
// Get all rules
GET /api/rules

// Create a new rule
POST /api/rules
Body: {
  "name": "SalesRule",
  "expression": "(age > 30 AND department = 'Sales') OR salary > 50000"
}

// Delete a rule
DELETE /api/rules/:id

// Evaluate a rule
POST /api/evaluate
Body: {
  "ruleId": "rule123",
  "userData": {
    "age": 35,
    "department": "Sales",
    "salary": 60000
  }
}

// Combine rules
POST /api/combine-rules
Body: {
  "ruleIds": ["rule1ID", "rule2ID"],
  "name": "CombinedRule"
}
```

## 📊 Data Structures

### Rule Node
```typescript
interface RuleNode {
  type: "operator" | "condition";
  operator?: "AND" | "OR" | ">" | "<" | "=" | ">=";
  field?: string;
  value?: any;
  left?: RuleNode;
  right?: RuleNode;
}
```

### Sample Rules
```javascript
// Rule 1: Sales and Marketing Rule
const rule1 = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";

// Rule 2: Marketing Experience Rule
const rule2 = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";
```

## 🛠 Advanced Features

- **Rule Templates**: Pre-defined rule patterns for common use cases
- **Version Control**: Track changes in rules over time
- **Batch Evaluation**: Process multiple records efficiently
- **Custom Functions**: Support for user-defined evaluation functions
- **Rule Export/Import**: Share rules across systems

## 🧪 Testing with Postman

You can find the Postman documentation for the RuleCraft API [here](https://documenter.getpostman.com/view/16476251/2sAY4rDPzX).

## Screenshots

## 1. Home 
<img width="1470" alt="Combine Rules" src="https://github.com/user-attachments/assets/a15bcb4a-8890-44d0-9f72-4246e6504e0c">


## 2. Get All Rules
<img width="1470" alt="Evaluate Rule" src="https://github.com/user-attachments/assets/e30b2bcb-c720-46d7-883c-4152c09742e2">

## 3. Create a New Rule
<img width="1470" alt="Create New Rule" src="https://github.com/user-attachments/assets/2dfcafd5-7035-4215-9c32-71fc3c7ec70c">

## 4. Evaluate a Rule
<img width="1470" alt="Get All Rules" src="https://github.com/user-attachments/assets/60f8d923-2aac-4d5a-a949-009907e65c82">

## 5. Combine Rules
<img width="1470" alt="Home" src="https://github.com/user-attachments/assets/65454543-b536-406e-9790-ad4dec3dd942">


## 📈 Performance

- Optimized AST traversal
- Caching for frequently used rules
- Batch processing capabilities
- Response time < 100ms for standard rules


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE]([LICENSE](https://github.com/Satyamkumarnavneet/RuleCraft?tab=Apache-2.0-1-ov-file)) file for details.

## 📞 Support

For support, email `navneetsatyamkumar@gmail.com`.

---
