<script>
import { computed } from 'vue'

export default {
  data() {
    return {
      name: '',
      type: '', 
      dueDate: '', 
      status: 'Pending', 
      todos: JSON.parse(localStorage.getItem('todos')) || [] 
    }
  },
  watch: {
    todos: {
      handler(newVal) {
        localStorage.setItem('todos', JSON.stringify(newVal));
      },
      deep: true
    }
  },
  methods: {
    addNewTask() {
      if (!this.name || !this.type || !this.dueDate) {
        alert('Please fill in all fields');
        return;
      }
      
      // Add the new task to the todos array
      this.todos.push({
        name: this.name,
        type: this.type,
        dueDate: this.dueDate,
        status: this.status,
        createdAt: new Date().getTime()
      });

      // Clear form fields
      this.name = '';
      this.type = '';
      this.dueDate = '';
      this.status = 'Pending';

      // Reload and redirect
      setTimeout(() => {
        window.location.href = '/todo/list';
      }, 500);
    }
  }
}
</script>

<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">New Task</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="row">
        <!-- Name Field -->
        <div class="col-md-6 mb-3">
          <label class="form-label">Name</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            placeholder="e.g Visiting the sick"
          />
        </div>
        <!-- Report Type -->
        <label class="form-label">Report Type</label>
        <div class="form-selectgroup-boxes row mb-3">
          <div class="col-lg-6">
            <label class="form-selectgroup-item">
              <input
                type="radio"
                v-model="type"
                value="Business"
                class="form-selectgroup-input"
              />
              <span class="form-selectgroup-label d-flex align-items-center p-3">
                <span class="me-3">
                  <span class="form-selectgroup-check"></span>
                </span>
                <span class="form-selectgroup-label-content">
                  <span class="form-selectgroup-title strong mb-1">Business</span>
                  <span class="d-block text-secondary">Basic data needed</span>
                </span>
              </span>
            </label>
          </div>
          <div class="col-lg-6">
            <label class="form-selectgroup-item">
              <input
                type="radio"
                v-model="type"
                value="Personal"
                class="form-selectgroup-input"
              />
              <span class="form-selectgroup-label d-flex align-items-center p-3">
                <span class="me-3">
                  <span class="form-selectgroup-check"></span>
                </span>
                <span class="form-selectgroup-label-content">
                  <span class="form-selectgroup-title strong mb-1">Personal</span>
                  <span class="d-block text-secondary">Additional analyses</span>
                </span>
              </span>
            </label>
          </div>
        </div>
        <!-- Status -->
        <div class="col-md-6 mb-3">
          <label class="form-label">Status</label>
          <select v-model="status" class="form-select">
            <option value="Pending">Pending</option>
            <option value="InProgress">InProgress</option>
            <option value="Completed">Completed</option>
            <option value="OverDue">OverDue</option>
          </select>
        </div>
        <!-- Due Date -->
        <div class="col-md-6 mb-3">
          <label class="form-label">Reporting Period</label>
          <input
            v-model="dueDate"
            type="date"
            class="form-control"
          />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal">Cancel</a>
      <button @click="addNewTask" class="btn btn-primary ms-auto">Add New Task</button>
    </div>
  </div>
</template>
