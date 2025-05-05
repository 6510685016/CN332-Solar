class Task {
  taskId;
  taskName;
  taskDetail;
  dueDate;
  solarPlantID;
  zoneID;
  status;
  avgEfficiency;

  constructor(taskId, taskName, taskDetail, solarPlantID, zoneID, status = "Created") {
    this.taskId = taskId;
    this.taskName = taskName;
    this.taskDetail = taskDetail;
    this.solarPlantID = solarPlantID;
    this.zoneID = zoneID;
    this.status = status;
  }

  get_info() {
    return {
      taskId: this.taskId,
      taskName: this.taskName,
      taskDetail: this.taskDetail,
      dueDate: this.dueDate,
      solarPlantID: this.solarPlantID,
      zoneID: this.zoneID,
      status: this.status,
      avgEfficiency: this.avgEfficiency
    };
  }

  // เพิ่ม set/get ถ้าต้องการ
  setTaskId(value) {
    this.taskId = value;
  }

  setTaskName(value) {
    this.taskName = value;
  }

  setTaskDetail(value) {
    this.taskDetail = value;
  }

  setDueDate(value) {
    this.dueDate = value;
  }

  setSolarPlantID(value) {
    this.solarPlantID = value;
  }

  setZoneID(value) {
    this.zoneID = value;
  }

  setStatus(value) {
    this.status = value;
  }

  setAvgEfficiency(value) {
    this.avgEfficiency = value;
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
