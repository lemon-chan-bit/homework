const monthYear = document.getElementById('monthYear');
const todayLabel = document.getElementById('todayLabel');
const calendarGrid = document.getElementById('calendarGrid');
const selectedDateLabel = document.getElementById('selectedDateLabel');
const noteText = document.getElementById('noteText');
const saveNote = document.getElementById('saveNote');
const deleteNote = document.getElementById('deleteNote');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');

let selectedDate = null;
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

const storageKey = 'calendarNoteToolData';
const data = loadData();

function loadData() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function renderCalendar() {
  calendarGrid.innerHTML = '';
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthYear.textContent = `${currentYear} 年 ${currentMonth + 1} 月`;
  todayLabel.textContent = `今天：${formatDisplayDate(today)}`;

  for (let i = 0; i < startWeekday; i += 1) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'day-cell inactive';
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(currentYear, currentMonth, day);
    const key = formatDateKey(date);
    const noteExists = Boolean(data[key]);

    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'day-cell';

    if (selectedDate && selectedDate.getTime() === date.getTime()) {
      cell.classList.add('selected');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;

    cell.appendChild(dayNumber);

    if (noteExists) {
      const dot = document.createElement('div');
      dot.className = 'note-dot';
      cell.appendChild(dot);
    }

    cell.addEventListener('click', () => {
      selectDate(date);
    });

    calendarGrid.appendChild(cell);
  }
}

function selectDate(date) {
  selectedDate = date;
  selectedDateLabel.textContent = formatDisplayDate(date);
  const key = formatDateKey(date);
  noteText.value = data[key] || '';
  renderCalendar();
}

function handleSave() {
  if (!selectedDate) {
    alert('請先選取日期。');
    return;
  }

  const key = formatDateKey(selectedDate);
  const content = noteText.value.trim();

  if (content.length > 0) {
    data[key] = content;
  } else {
    delete data[key];
  }

  saveData();
  renderCalendar();
  alert('記事已儲存。');
}

function handleDelete() {
  if (!selectedDate) {
    alert('請先選取日期。');
    return;
  }

  const key = formatDateKey(selectedDate);
  if (data[key]) {
    delete data[key];
    saveData();
    noteText.value = '';
    renderCalendar();
    alert('記事已刪除。');
  } else {
    alert('該日期沒有記事可刪除。');
  }
}

prevMonth.addEventListener('click', () => {
  currentMonth -= 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  }
  renderCalendar();
});

nextMonth.addEventListener('click', () => {
  currentMonth += 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderCalendar();
});

saveNote.addEventListener('click', handleSave);
deleteNote.addEventListener('click', handleDelete);

renderCalendar();
