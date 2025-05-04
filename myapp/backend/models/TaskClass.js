class Task {
  taskDetail;
  dueDate;
  solarPlantID;
  zoneID;
  status;
  avgEfficiency;

  constructor(taskDetail, solarPlantID, zoneID, status = "Created") {
    this.taskDetail = taskDetail;
    this.solarPlantID = solarPlantID;
    this.zoneID = zoneID;
    this.status = status;
  }

  get_info() {
    return {
      taskDetail: this.taskDetail,
      dueDate: this.dueDate,
      solarPlantID: this.solarPlantID,
      zoneID: this.zoneID,
      status: this.status,
      avgEfficiency: this.avgEfficiency
    };
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
