const form = document.querySelector('#request-form');
const modal = document.querySelector('#preview');
const phone = form.elements.phone;
const normalize = value => {
  if (!/^[+\d\s()\-]+$/.test(value.trim())) return '';
  let digits = value.replace(/\D/g, '');
  if (digits.length === 10) digits = '7' + digits;
  if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.slice(1);
  return /^7\d{10}$/.test(digits) ? '+' + digits : '';
};
phone.addEventListener('input', () => phone.setCustomValidity(''));
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    form.elements.service.value = button.dataset.service;
    document.querySelectorAll('[data-service]').forEach(item => item.classList.toggle('selected', item === button));
    document.querySelector('#request').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  phone.setCustomValidity(normalize(phone.value) ? '' : 'Укажите российский номер: +7 и 10 цифр.');
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const text = [
    'Тестовая заявка: ' + document.body.dataset.kind,
    'Услуга: ' + data.service,
    'Модель / размер: ' + (data.model.trim() || 'Уточнить в переписке'),
    'Описание: ' + data.problem.trim(),
    'Имя: ' + data.name.trim(),
    'Телефон: ' + normalize(data.phone),
    'Город и район: ' + data.area.trim(),
    'Удобное время: ' + (data.time.trim() || 'Согласуем'),
    'Связь: ' + data.reply,
    'Прошу уточнить стоимость и подтвердить время.'
  ].join('\n');
  document.querySelector('#message').textContent = text;
  document.querySelector('#whatsapp').href = 'https://wa.me/79139287881?text=' + encodeURIComponent(text);
  document.querySelector('#copy-status').textContent = '';
  modal.showModal();
});
modal.querySelector('.close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  if (event.target !== modal) return;
  const r = modal.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close();
});
modal.querySelector('.copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector('#message').textContent);
    document.querySelector('#copy-status').textContent = 'Текст скопирован.';
  } catch {
    document.querySelector('#copy-status').textContent = 'Выделите и скопируйте текст сообщения вручную.';
  }
});
