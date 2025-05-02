class Task {
  taskDetail;
  submitDate;
  dueDate;
  solarPlantID;
  zoneID;
  avgEfficiency;

  constructor(taskDetail, submitDate, solarPlantID, zoneID) {
    this.taskDetail = taskDetail;
    this.submitDate = submitDate;
    this.solarPlantID = solarPlantID;
    this.zoneID = zoneID;
  }

  get_info() {
    return {
      taskDetail: this.taskDetail,
      submitDate: this.submitDate,
      dueDate: this.dueDate,
      solarPlantID: this.solarPlantID,
      zoneID: this.zoneID,
      avgEfficiency: this.avgEfficiency
    };
  }


  setTaskDetail(value) {
    this.taskDetail = value;
  }


  setSubmitDate(value) {
    this.submitDate = value;
  }

  setdueDate(value) {
    this.dueDate = value;
  }


  setSolarPlantID(value) {
    this.solarPlantID = value;
  }


  setZoneID(value) {
    this.zoneID = value;
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
