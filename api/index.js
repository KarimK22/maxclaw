// Vercel serverless API handler
module.exports = (req, res) => {
  const path = req.url;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // In-memory data (in production, use a database)
  const agentStatus = {
    sage: { name: 'Sage (CEO)', status: 'online', task: 'Managing team', avatar: '🐙' },
    researcher: { name: 'Researcher', status: 'idle', task: 'Waiting for task', avatar: '🔍' },
    analyst: { name: 'Analyst', status: 'online', task: 'Querying Mixpanel', avatar: '📊' },
    coder: { name: 'Coder', status: 'idle', task: 'Waiting for task', avatar: '💻' },
    writer: { name: 'Writer', status: 'online', task: 'Writing blog post', avatar: '✍️' }
  };

  const tasks = [
    { id: 1, title: 'Research competitor pricing', owner: 'sage', status: 'todo', priority: 'high' },
    { id: 2, title: 'Write blog post about AI', owner: 'user', status: 'todo', priority: 'medium' },
    { id: 3, title: 'Deploy Mission Control v1', owner: 'sage', status: 'todo', priority: 'high' },
    { id: 4, title: 'Mixpanel DAU analysis', owner: 'sage', status: 'inprogress', priority: 'high' },
    { id: 5, title: 'Create social content', owner: 'user', status: 'inprogress', priority: 'medium' },
    { id: 6, title: 'Set up Telegram bot', owner: 'sage', status: 'done', priority: 'high' },
    { id: 7, title: 'Connect Mixpanel API', owner: 'sage', status: 'done', priority: 'high' },
    { id: 8, title: 'Define company vision', owner: 'user', status: 'done', priority: 'medium' }
  ];

  const memories = [
    { id: 1, title: 'Company Vision Discussion', date: 'Feb 24, 2026', content: 'Building an AI company with Sage as CEO. The vision is to create a team of AI agents that work together to accomplish complex tasks.' },
    { id: 2, title: 'Mixpanel Setup', date: 'Feb 24, 2026', content: 'Connected Mixpanel API for project 3623820. Found concerning DAU trend - 74% decline from Feb 17-24.' },
    { id: 3, title: 'Telegram Integration', date: 'Feb 24, 2026', content: 'Enabled Telegram group access for team collaboration.' },
    { id: 4, title: 'DAU Analysis Results', date: 'Feb 24, 2026', content: 'Analysis shows 74% decline in daily active users. Needs attention.' }
  ];

  // Route handling
  if (path === '/api/stats' || path === '/api/stats/') {
    const activeTasks = tasks.filter(t => t.status !== 'done').length;
    const onlineAgents = Object.values(agentStatus).filter(a => a.status === 'online').length;
    const completedThisWeek = tasks.filter(t => t.status === 'done').length;
    
    return res.json({
      activeTasks,
      teamMembers: 5,
      onlineAgents,
      completedThisWeek,
      dauTrend: -74
    });
  }
  
  if (path === '/api/tasks' || path === '/api/tasks/') {
    const { status } = req.query;
    if (status) {
      return res.json(tasks.filter(t => t.status === status));
    }
    return res.json(tasks);
  }
  
  if (path === '/api/agents' || path === '/api/agents/') {
    return res.json(agentStatus);
  }
  
  if (path === '/api/memories' || path === '/api/memories/') {
    return res.json(memories);
  }
  
  if (path === '/api/pipeline' || path === '/api/pipeline/') {
    return res.json({
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
    });
  }
  
  if (path === '/api/calendar' || path === '/api/calendar/') {
    return res.json([
      { day: 17, title: 'Team Sync', type: 'user' },
      { day: 18, title: 'Research Review', type: 'sage' },
      { day: 20, title: 'Content Planning', type: 'user' },
      { day: 22, title: 'Deploy v1', type: 'sage' },
      { day: 24, title: 'Strategy Call', type: 'user' }
    ]);
  }

  // Default: serve static files from public
  const fs = require('fs');
  const publicPath = './public' + (path === '/' ? '/index.html' : path);
  
  try {
    if (fs.existsSync(publicPath)) {
      const content = fs.readFileSync(publicPath);
      const ext = publicPath.split('.').pop();
      const contentTypes = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json'
      };
      res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
      return res.send(content);
    }
  } catch (e) {}
  
  res.status(404).json({ error: 'Not found' });
};
