import pkg from 'abstract-syntax-tree';
const { parse } = pkg;

const ATTRIBUTE_CATALOG = ['age', 'department', 'salary', 'experience']; // Example attributes

// Helper function to validate attributes
function validateAttributes(expression) {
  for (const attr of ATTRIBUTE_CATALOG) {
    if (expression.includes(attr)) {
      return true;
    }
  }
  throw new Error('Invalid attribute in rule expression');
}

export function createRule(ruleString) {
  try {
    // Clean and format the rule string (remove extra whitespace)
    const cleanedString = ruleString.replace(/\s+/g, ' ').trim();

    // Convert user-friendly logical operators to JavaScript equivalents
    const jsExpression = cleanedString
      .replace(/AND/g, '&&')
      .replace(/OR/g, '||')
      .replace(/(\w+)\s*=\s*'(\w+)'/g, "$1 === '$2'");

    // Parse the expression to AST
    const ast = parse(jsExpression);

    // Return only the expression, discarding the 'Program' node
    if (ast.type === 'Program' && ast.body.length > 0 && ast.body[0].type === 'ExpressionStatement') {
      return ast.body[0].expression;  // Extract and return the relevant expression node
    }

    throw new Error('Invalid rule expression');
  } catch (error) {
    throw new Error('Invalid rule expression: ' + error.message);
  }
}


export function combineRules(rules) {
  if (rules.length === 0) return null;
  if (rules.length === 1) return rules[0];

  // Combine multiple rules into a logical AND expression
  return rules.reduce((combined, rule) => ({
    type: 'LogicalExpression',
    operator: '&&',
    left: combined,
    right: rule
  }));
}

export function evaluateRule(ast, data) {
  if (!ast || typeof ast !== 'object') {
    throw new Error('Invalid AST provided');
  }

  function evaluate(node) {
    if (!node || typeof node !== 'object') {
      throw new Error('Invalid node in AST');
    }

    // Handle nested Program and ExpressionStatement nodes
    if (node.type === 'Program' && node.body.length > 0) {
      return evaluate(node.body[0]);
    }
    if (node.type === 'ExpressionStatement') {
      return evaluate(node.expression);
    }

    switch (node.type) {
      case 'BinaryExpression':
        const left = evaluate(node.left);
        const right = evaluate(node.right);
        switch (node.operator) {
          case '>': return left > right;
          case '<': return left < right;
          case '>=': return left >= right;
          case '<=': return left <= right;
          case '===': return left === right;
          case '!==': return left !== right;
          default: throw new Error(`Unsupported operator: ${node.operator}`);
        }
      case 'LogicalExpression':
        switch (node.operator) {
          case '&&': return evaluate(node.left) && evaluate(node.right);
          case '||': return evaluate(node.left) || evaluate(node.right);
          default: throw new Error(`Unsupported logical operator: ${node.operator}`);
        }
      case 'Identifier':
        if (!(node.name in data)) {
          throw new Error(`Undefined attribute: ${node.name}`);
        }
        return data[node.name];
      case 'Literal':
        return node.value;
      default:
        console.error('Unsupported node type:', JSON.stringify(node, null, 2));
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }

  try {
    return evaluate(ast);
  } catch (error) {
    console.error('Rule evaluation error:', error);
    throw new Error('Rule evaluation failed: ' + error.message);
  }
}