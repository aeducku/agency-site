const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

// Production API (Render)
const API = 'https://telegram-lead-server-3zc1.onrender.com/submit';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const payload = {
    name: data.get('name')?.trim(),
    email: data.get('email')?.trim(),
    company: data.get('company')?.trim(),
    budget: data.get('budget'),
    message: data.get('message')?.trim(),
  };

  const required = ['name','email','budget','message'];
  for (const k of required) {
    if (!payload[k]) {
      note.textContent = 'Пожалуйста, заполните обязательные поля.';
      return;
    }
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    note.textContent = 'Спасибо! Заявка отправлена в Telegram.';
    form.reset();
  } catch (err) {
    note.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
  }
});