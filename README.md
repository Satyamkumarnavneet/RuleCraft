# RuleCraft: Advanced Rule Engine with AST

A flexible rule engine that utilizes Abstract Syntax Trees (AST) to evaluate user eligibility based on attributes like age, department, and income. Built with a modern 3-tier architecture, RuleCraft enables efficient creation, combination, and evaluation of complex business rules.

![RuleCraft Dashboard](https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60)

## Table of Contents

- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technologies Used](#-technologies-used)
- [Implementation Details](#-implementation-details)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Data Structures](#-data-structures)
- [Advanced Features](#-advanced-features)
- [Security](#-security)
- [Testing](#-testing)
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
- **Testing**: Vitest, Postman
- **Documentation**: OpenAPI/Swagger

## 🏗 Architecture

RuleCraft follows a robust 3-tier architecture:

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
├── .env                   # Environment variables
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
   git clone https://github.com/yourusername/rulecraft.git
   cd rulecraft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
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
  "ruleIds": ["rule1", "rule2"],
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

## 🔒 Security

- Input validation for all API endpoints
- Sanitization of rule expressions
- Role-based access control
- Audit logging for rule modifications

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Coverage report:
```bash
npm run test:coverage
```

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@rulecraft.com or join our [Discord community](https://discord.gg/rulecraft).

---

Built with ❤️ by the RuleCraft Team
