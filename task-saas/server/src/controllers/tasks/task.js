const mongoose = require('mongoose');
const { TaskSchema: Task } = require('../../models/tasks/taskmodel'); 


exports.listTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      completed,
      priority,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 10,
      dueFrom,
      dueTo,
    } = req.query;

    const filter = { user: userId };

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (priority) {
      filter.priority = priority; // LOW|MEDIUM|HIGH
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (dueFrom || dueTo) {
      filter.dueDate = {};
      if (dueFrom) filter.dueDate.$gte = new Date(dueFrom);
      if (dueTo) filter.dueDate.$lte = new Date(dueTo);
    }

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(filter),
    ]);

    res.json({
      items,
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

// GET /tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findOne({ _id: id, user: userId }).lean();
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// POST /tasks
exports.createTask = async (req, res, next) => {
  console.log(req.body,'req.body')
  console.log(req.user.id,'req.user')
  try {
    const userId = req.user.id;
    const { title, description, completed, priority, dueDate } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      completed: completed ?? false,
      priority: priority ?? 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: userId,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PATCH /tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const allowed = ['title', 'description', 'completed', 'priority', 'dueDate'];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.title && typeof updates.title === 'string') {
      updates.title = updates.title.trim();
    }
    if (updates.description && typeof updates.description === 'string') {
      updates.description = updates.description.trim();
    }
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // completed true olanda istəyirsənsə completedAt kimi ayrıca field də saxlaya bilərsən.
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
