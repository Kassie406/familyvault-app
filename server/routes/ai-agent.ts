import express from 'express';
import axios from 'axios';

const router = express.Router();

// Security fix: Use environment variable instead of hardcoded URL
const MCP_SERVER = process.env.MCP_SERVER_URL || 'https://3eb6ec39-b907-4c70-9a5b-e192bacee3ba-00-1739ki91gyn4k.kirk.replit.dev/mcp';

// Naive prompt-to-intent mapping (replace with NLP/AI logic later)
function inferIntent(prompt: string): { method: string; params: any } {
  const lower = prompt.toLowerCase();

  if (lower.includes('task')) {
    return {
      method: 'manage_design_tasks',
      params: {
        project: 'FamilyVault AI',
        task: prompt,
        priority: 'High',
        assigned_to: 'UI Team',
      },
    };
  }

  if (lower.includes('audit') || lower.includes('design system')) {
    return {
      method: 'audit_design_system',
      params: {
        scope: 'full',
        note: prompt,
      },
    };
  }

  if (lower.includes('add') && lower.includes('member')) {
    return {
      method: 'add_family_member',
      params: {
        name: 'Sarah',
        role: 'guardian',
      },
    };
  }

  return {
    method: 'track_project_progress',
    params: {
      project: 'FamilyVault AI',
    },
  };
}

router.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const { method, params } = inferIntent(prompt);

  try {
    const mcpRes = await axios.post(MCP_SERVER, {
      method,
      params,
    }, {
      withCredentials: true,
    });

    return res.json({ response: JSON.stringify(mcpRes.data, null, 2) });
  } catch (err: any) {
    console.error('[MCP_ERROR]', err.message);
    return res.status(500).json({ error: 'MCP request failed' });
  }
});

export default router;