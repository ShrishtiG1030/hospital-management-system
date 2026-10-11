import { useState, useEffect } from 'react';

function App() {
  const [patients, setPatients] = useState([]); // Initialized as an empty array to prevent structural crashes
  const [form, setForm] = useState({ name: '', age: '', disease: '' });

  // Fetch patients from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/patients')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load database content.');
        return res.json();
      })
      .then(data => setPatients(data))
      .catch(err => console.error('Initial fetch failed:', err));
  }, []); // Added dependency array to stop infinite rendering loops

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const admitPatient = async (e) => {
    e.preventDefault();
    
    // Alert if fields are left empty
    if (!form.name || !form.age || !form.disease) {
      alert('Please fill out all patient fields before submitting.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error(`Server returned status code: ${res.status}`);
      }

      const data = await res.json();
      setPatients([data, ...patients]);
      setForm({ name: '', age: '', disease: '' }); // Clear input fields
      alert('Patient admitted successfully!');
    } catch (err) {
      console.error(err);
      alert(`Submission Failed! Make sure your Node backend server is running on port 5000. Error details: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: '"Times New Roman", Times, serif', maxWidth: '600px', margin: '0 auto', color: '#ffffff' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        <span style={{ fontSize: '40px' }}>🏥</span>
        <h1 style={{ color: '#007bff', margin: 0, fontSize: '32px', textAlign: 'center' }}>
          Hospital Patient Management
        </h1>
      </div>
      
      <form onSubmit={admitPatient} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', color: '#333333' }}>
        <h3 style={{ marginTop: 0, textAlign: 'center', color: '#333333' }}>Admit New Patient</h3>
        <div style={{ marginBottom: '12px' }}>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Patient Name" 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontFamily: '"Times New Roman", Times, serif' }} 
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <input 
            type="number" 
            name="age" 
            value={form.age} 
            onChange={handleChange} 
            placeholder="Age" 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontFamily: '"Times New Roman", Times, serif' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            name="disease" 
            value={form.disease} 
            onChange={handleChange} 
            placeholder="Diagnosis / Disease" 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontFamily: '"Times New Roman", Times, serif' }} 
          />
        </div>
        <button type="submit" style={{ background: '#28a745', color: '#fff', padding: '12px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontSize: '16px', fontWeight: 'bold', fontFamily: '"Times New Roman", Times, serif' }}>
          Admit Patient
        </button>
      </form>

      <h3 style={{ textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
        Currently Admitted Patients ({patients.length})
      </h3>
      
      <div style={{ paddingTop: '10px' }}>
        {patients.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaaaaa', fontStyle: 'italic' }}>No patients currently admitted.</p>
        ) : null}
        
        {patients.map(patient => (
          <div key={patient._id} style={{ padding: '15px', background: '#ffffff', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '12px', color: '#333333' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{patient.name}</span> 
            <span style={{ color: '#666', marginLeft: '10px' }}>(Age: {patient.age})</span>
            <div style={{ color: '#dc3545', fontSize: '15px', marginTop: '6px', fontWeight: 'bold' }}>
              Condition: {patient.disease}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
