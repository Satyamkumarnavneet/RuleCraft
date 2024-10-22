import express from 'express';
import Rule from '../models/Rule.js';
import { createRule, combineRules, evaluateRule } from '../utils/ruleEngine.js';

const router = express.Router();

// Get all rules
router.get('/rules', async (req, res) => {
  try {
    const rules = await Rule.find().select('name expression');
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new rule
router.post('/rules', async (req, res) => {
  try {
    const { name, expression } = req.body;
    const ast = createRule(expression); // Convert to AST
    const rule = new Rule({ name, expression, ast });
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a rule
router.delete('/rules/:id', async (req, res) => {
  try {
    await Rule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Evaluate a rule
router.post('/evaluate', async (req, res) => {
  try {
    const { ruleId, userData } = req.body;
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    const result = evaluateRule(rule.ast, userData); // Evaluate rule AST
    res.json({ result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Combine rules
router.post('/combine-rules', async (req, res) => {
  try {
    const { ruleIds, name } = req.body;
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    if (rules.length !== ruleIds.length) {
      return res.status(400).json({ message: 'One or more rules not found' });
    }
    const combinedAst = combineRules(rules.map(rule => rule.ast));
    const combinedExpression = rules.map(rule => `(${rule.expression})`).join(' AND ');
    const newRule = new Rule({ name, expression: combinedExpression, ast: combinedAst });
    await newRule.save();
    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;