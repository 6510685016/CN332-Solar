class Task {
  constructor(taskId, taskDetail) {
    this.taskId = taskId;
    this.taskDetail = taskDetail;
  }

  get() {
    return { taskId: this.taskId, taskDetail: this.taskDetail };
  }

  createTask(detail) {
    this.taskDetail = detail;
    return `Task created: ${detail}`;
  }

  editTask(newDetail) {
    this.taskDetail = newDetail;
    return `Task updated: ${newDetail}`;
  }

  deleteTask() {
    const oldDetail = this.taskDetail;
    this.taskDetail = null;
    return `Task deleted: ${oldDetail}`;
  }
}
