<script>
  export let student;
  export let onEdit;
  export let onDelete;
</script>

<div class="student-card">
  <div class="card-header">
    <div class="info">
      <h3>{student.name}</h3>
      <p>{student.course} • ID: {student.studentId}</p>
    </div>
    <div class="gpa-badge" class:low={student.gpa < 2.0}>
      {student.gpa.toFixed(2)}
    </div>
  </div>

  <div class="card-footer">
    <button class="btn-secondary" on:click={() => onEdit(student)}>Edit</button>
    <button class="btn-danger" on:click={() => onDelete(student._id)}>Delete</button>
  </div>
</div>

<style>
  .student-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .student-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #0f172a;
  }

  p {
    margin: 4px 0 0;
    font-size: 0.875rem;
    color: #64748b;
  }

  .gpa-badge {
    background: #dcfce7;
    color: #166534;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .gpa-badge.low {
    background: #fee2e2;
    color: #991b1b;
  }

  .card-footer {
    display: flex;
    gap: 0.75rem;
  }

  button {
    flex: 1;
    padding: 0.5rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    font-weight: 500;
    border: 1px solid transparent;
    transition: 0.2s;
  }

  .btn-secondary {
    background: #f1f5f9;
    color: #475569;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
  }

  .btn-danger {
    background: white;
    color: #ef4444;
    border-color: #fecaca;
  }

  .btn-danger:hover {
    background: #fef2f2;
  }
</style>
