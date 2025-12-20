// Home.jsx
const { useState } = React;
const { Fragment } = React;

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Miehen leikkaus (fade)',
    date: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekdayTimes = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30',
    '15:00','15:30','16:00','16:30','17:00','17:30'
  ];
  const saturdayTimes = ['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30'];

  const getAvailableTimes = () => {
    if (!formData.date) return weekdayTimes;
    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) return [];
    if (dayOfWeek === 6) return saturdayTimes;
    return weekdayTimes;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = 'https://script.google.com/macros/s/AKfycbwv1x6aTgcySCwKcXUpiq_YPUyTXyYlN72SnYmASwt5gsmdrCdtNGB6x2zvY54Ks7rfug/exec';

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('timestamp', new Date().toLocaleString('fi-FI'));

    fetch(url, { method: 'POST', body: data })
      .then(() => {
        alert('Varaus lähetetty! Otamme sinuun yhteyttä.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'Miehen leikkaus (fade)',
          date: '',
          time: ''
        });
      })
      .catch(() => alert('Virhe lähetettäessä.'))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>M Room Parturi</h1>
      <form onSubmit={handleSubmit}>
        <label>Nimi:</label><br/>
        <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} required /><br/><br/>

        <label>Puhelinnumero:</label><br/>
        <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} required /><br/><br/>

        <label>Email:</label><br/>
        <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} required /><br/><br/>

        <label>Palvelu:</label><br/>
        <select value={formData.service} onChange={(e)=>setFormData({...formData,service:e.target.value})}>
          <option value="Miehen leikkaus (fade)">Miehen leikkaus (fade)</option>
          <option value="Naisten kampaus">Naisten kampaus</option>
        </select><br/><br/>

        <label>Päivämäärä:</label><br/>
        <input type="date" value={formData.date} onChange={(e)=>setFormData({...formData,date:e.target.value,time:''})} required min={new Date().toISOString().split('T')[0]} /><br/><br/>

        <label>Kellonaika:</label><br/>
        <select value={formData.time} onChange={(e)=>setFormData({...formData,time:e.target.value})} required disabled={!formData.date}>
          {!formData.date && <option>Valitse ensin päivämäärä</option>}
          {getAvailableTimes().map(time => <option key={time} value={time}>{time}</option>)}
          {getAvailableTimes().length === 0 && <option disabled>Suljettu sunnuntaisin</option>}
        </select><br/><br/>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Varataan...' : 'Varaa aika'}
        </button>
      </form>
    </div>
  );
}
