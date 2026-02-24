const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mixpanel config
const MIXPANEL_TOKEN = process.env.MIXPANEL_TOKEN || 'e3aa5e545165b01673e69b6d4a7d8f5e';
const MIXPANEL_PROJECT_ID = '3623820';

// In-memory store for demo (replace with real DB in production)
let agentStatus = {
  sage: { name: 'Sage (CEO)', status: 'online', task: 'Managing team', avatar: '🐙' },
  researcher: { name: 'Researcher', status: 'idle', task: 'Waiting for task', avatar: '🔍' },
  analyst: { name: 'Analyst', status: 'online', task: 'Querying Mixpanel', avatar: '📊' },
  coder: { name: 'Coder', status: 'idle', task: 'Waiting for task', avatar: '💻' },
  writer: { name: 'Writer', status: 'online', task: 'Writing blog post', avatar: '✍️' }
};

let tasks = [
  { id: 1, title: 'Research competitor pricing', owner: 'sage', status: 'todo', priority: 'high' },
  { id: 2, title: 'Write blog post about AI', owner: 'user', status: 'todo', priority: 'medium' },
  { id: 3, title: 'Deploy Mission Control v1', owner: 'sage', status: 'todo', priority: 'high' },
  { id: 4, title: 'Mixpanel DAU analysis', owner: 'sage', status: 'inprogress', priority: 'high' },
  { id: 5, title: 'Create social content', owner: 'user', status: 'inprogress', priority: 'medium' },
  { id: 6, title: 'Set up Telegram bot', owner: 'sage', status: 'done', priority: 'high' },
  { id: 7, title: 'Connect Mixpanel API', owner: 'sage', status: 'done', priority: 'high' },
  { id: 8, title: 'Define company vision', owner: 'user', status: 'done', priority: 'medium' }
];

let memories = [
  { id: 1, title: 'Company Vision Discussion', date: 'Feb 24, 2026', content: 'Building an AI company with Sage as CEO. The vision is to create a team of AI agents that work together to accomplish complex tasks.' },
  { id: 2, title: 'Mixpanel Setup', date: 'Feb 24, 2026', content: 'Connected Mixpanel API for project 3623820. Found concerning DAU trend - 74% decline from Feb 17-24.' },
  { id: 3, title: 'Telegram Integration', date: 'Feb 24, 2026', content: 'Enabled Telegram group access for team collaboration.' },
  { id: 4, title: 'DAU Analysis Results', date: 'Feb 24, 2026', content: 'Analysis shows 74% decline in daily active users. Needs attention.' }
];

// API Routes

// Get dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    // Try to get real Mixpanel data
    let dauData = null;
    try {
      const response = await axios.get(
        `https://api.mixpanel.com/engage?project_id=${MIXPANEL_PROJECT_ID}`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(MIXPANEL_TOKEN + ':').toString('base64')}`
          }
        }
      );
      dauData = response.data;
    } catch (e) {
      console.log('Mixpanel API error, using fallback');
    }

    // Calculate real stats from tasks
    const activeTasks = tasks.filter(t => t.status !== 'done').length;
    const onlineAgents = Object.values(agentStatus).filter(a => a.status === 'online').length;
    const completedThisWeek = tasks.filter(t => t.status === 'done').length;

    res.json({
      activeTasks,
      teamMembers: 5,
      onlineAgents,
      completedThisWeek,
      dauTrend: dauData ? null : -74, // Fallback if API fails
      dauData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks
app.get('/api/tasks', (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(tasks.filter(t => t.status === status));
  }
  res.json(tasks);
});

// Update task
app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    Object.assign(task, req.body);
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Get agents
app.get('/api/agents', (req, res) => {
  res.json(agentStatus);
});

// Update agent status
app.patch('/api/agents/:name', (req, res) => {
  const { name } = req.params;
  if (agentStatus[name]) {
    Object.assign(agentStatus[name], req.body);
    res.json(agentStatus[name]);
  } else {
    res.status(404).json({ error: 'Agent not found' });
  }
});

// Get memories
app.get('/api/memories', (req, res) => {
  res.json(memories);
});

// Get memory by id
app.get('/api/memories/:id', (req, res) => {
  const memory = memories.find(m => m.id === parseInt(req.params.id));
  if (memory) {
    res.json(memory);
  } else {
    res.status(404).json({ error: 'Memory not found' });
  }
});

// Add memory
app.post('/api/memories', (req, res) => {
  const newMemory = {
    id: memories.length + 1,
    ...req.body,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
  memories.unshift(newMemory);
  res.json(newMemory);
});

// Get pipeline
app.get('/api/pipeline', (req, res) => {
  const pipeline = {
    ideas: [
      { title: '10 AI Tools Comparison', date: 'Feb 23' },
      { title: 'Product Launch Strategy', date: 'Feb 22' }
    ],
    writing: [
      { title: 'Weekly Newsletter', date: 'Feb 24' }
    ],
    media: [
      { title: 'Twitter Thread - DAU', date: 'Feb 23' }
    ],
    published: [
      { title: 'Mission Control Launch', date: 'Feb 20' }
    ]
  };
  res.json(pipeline);
});

// Get calendar events
app.get('/api/calendar', (req, res) => {
  const events = [
    { day: 17, title: 'Team Sync', type: 'user' },
    { day: 18, title: 'Research Review', type: 'sage' },
    { day: 20, title: 'Content Planning', type: 'user' },
    { day: 22, title: 'Deploy v1', type: 'sage' },
    { day: 24, title: 'Strategy Call', type: 'user' }
  ];
  res.json(events);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mission Control API running on port ${PORT}`);
});
