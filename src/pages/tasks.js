import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import styles from '../styles/TaskAdmin.module.css';

export default function TaskAdmin() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newStatus, setNewStatus] = useState('pending');
  const [newPriority, setNewPriority] = useState('low');
  const [newDescription, setNewDescription] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTasks(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchTasks = async (userId) => {
    if (!userId) return;
    const tasksCollection = collection(db, 'users', userId, 'tasks');
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(tasksList);
  };

  const handleAddTask = async () => {
    if (newTask.trim() === '' || !user) return;

    const tasksCollection = collection(db, 'users', user.uid, 'tasks');
    const docRef = await addDoc(tasksCollection, {
      text: newTask,
      status: newStatus,
      priority: newPriority,
      description: newDescription,
      createdAt: Timestamp.now()
    });
    setTasks([...tasks, {
      id: docRef.id,
      text: newTask,
      status: newStatus,
      priority: newPriority,
      description: newDescription,
      createdAt: Timestamp.now()
    }]);
    setNewTask('');
    setNewStatus('pending');
    setNewPriority('low');
    setNewDescription('');
  };

  const handleUpdateTask = async (id, newText, newStatus, newPriority, newDescription) => {
    if (!user) return;
    const taskDoc = doc(db, 'users', user.uid, 'tasks', id);
    await updateDoc(taskDoc, { text: newText, status: newStatus, priority: newPriority, description: newDescription });
    setTasks(tasks.map(task => (task.id === id ? { ...task, text: newText, status: newStatus, priority: newPriority, description: newDescription } : task)));
  };

  const handleDeleteTask = async (id) => {
    if (!user) return;
    const taskDoc = doc(db, 'users', user.uid, 'tasks', id);
    await deleteDoc(taskDoc);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('idToken'); // Eliminar el token del almacenamiento local
      router.push('/login'); // Redirigir a la página de login
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={`${styles.heading} text-center`}>Task Administration</h2>
    
      <button className="btn btn-secondary mb-3" onClick={handleLogout}>Logout</button>
      <div className="mb-3">
        <label className={`form-label ${styles.labelTitle}`}><h4>Registro de tareas</h4></label>
        <label className={`form-label ${styles.labelSubTitle}`}><h6>Ingrese su tarea</h6></label>
        <input
          type="text"
          className="form-control"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <label className={`form-label mt-2 ${styles.labelSubTitle}`}><h6>Estado de la tarea:</h6></label>
        <select
          className="form-select"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="pending">Pendiente</option>
          <option value="completed">Completada</option>
        </select>
        <label className={`form-label mt-2 ${styles.labelSubTitle}`}><h6>Prioridad:</h6></label>
        <select
          className="form-select"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="low">Baja</option>
          <option value="medium">Regular</option>
          <option value="high">Alta</option>
        </select>
        <label className={`form-label mt-2 ${styles.labelSubTitle}`}><h6>Descripción</h6></label>
        <textarea
          className="form-control"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddTask}>Registrar</button>
      </div>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className={`list-group-item d-flex justify-content-between align-items-center ${styles.listGroupItem}`}>
            <div className="d-flex flex-column flex-grow-1">
              <input
                type="text"
                className="form-control mb-2"
                value={task.text}
                onChange={(e) => handleUpdateTask(task.id, e.target.value, task.status, task.priority, task.description)}
              />
              <select
                className="form-select mb-2"
                value={task.status}
                onChange={(e) => handleUpdateTask(task.id, task.text, e.target.value, task.priority, task.description)}
              >
                <option value="pending">Pendiente</option>
                <option value="completed">Completa</option>
              </select>
              <select
                className="form-select mb-2"
                value={task.priority}
                onChange={(e) => handleUpdateTask(task.id, task.text, task.status, e.target.value, task.description)}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
              <textarea
                className="form-control mb-2"
                value={task.description}
                onChange={(e) => handleUpdateTask(task.id, task.text, task.status, task.priority, e.target.value)}
              />
              <small className="text-muted">Fecha: {task.createdAt?.toDate().toLocaleString()}</small>
            </div>
            <button className="btn btn-danger ml-2" style={{ marginLeft: '1rem' }}  onClick={() => handleDeleteTask(task.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
