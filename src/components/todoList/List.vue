<script>
import { computed } from 'vue'
import NewTaskForm from './NewTaskForm.vue'

export default {
  components: {
    NewTaskForm
  },
  data() {
    return {
      todos: [] // Holds tasks fetched from local storage
    }
  },
  mounted() {
    // Load todos from local storage on mount
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || []
    this.todos = storedTodos
  }
}
</script>
<template>
  <div class="page-header d-print-none p-0 m-1">
    <div class="container-xxl p-0">
      <div class="row g-2 align-items-center m-0 p-0">
        <div class="col m-0">
          <h2 class="page-title">Todo List</h2>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTaskModal">
            New Task
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="page-body">
    <div class="container-xl">
      <div class="card">
        <div class="card-body">
          <div id="table-default" class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                <!-- Dynamically render tasks -->
                <tr v-for="(task, index) in todos" :key="index">
                  <td>{{ task.name }}</td>
                  <td>{{ task.type }}</td>
                  <td>{{ task.status }}</td>
                  <td>{{ task.dueDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--Add Task Modal-->
  <div
    class="modal modal-blur fade"
    id="addTaskModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="addTaskModalLabel"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <NewTaskForm />
    </div>
  </div>
</template>
