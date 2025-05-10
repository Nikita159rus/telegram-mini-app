// Конфигурация
const API_URL = "https://script.google.com/macros/s/AKfycbyz9TDwOI1OFeHvnaoIh9BjbBgHOeHnc0gtmEF6VBUBcyNLWyXf2GAdOqy0RP9vwm3w-Q/exec";
let currentTab = 0;

// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.expand();
  tg.setHeaderColor("#2b2d42");
}

// Загрузка данных
async function loadData(sheetName) {
  try {
    const response = await axios.post(API_URL, { 
      action: "getMaterials", 
      sheetName: sheetName 
    }, {
      headers: { "Content-Type": "application/json" }
});
    renderTable(response.data.data || []);
  } catch (error) {
    console.error("Ошибка:", error);
    document.getElementById("myTabContent").innerHTML = 
      <div class="alert alert-danger">
        Ошибка загрузки данных: ${error.message}
      </div>
    ;
  }
}

// Рендер таблицы
function renderTable(data) {
  let html = '<table class="table"><thead><tr>';
  
  // Заголовки (адаптивные)
  const headers = currentTab === 0 
    ? ["ID", "Название", "Ед.изм.", "Кол-во", "Минимум"] 
    : ["ID", "Название", "По проекту", "Куплено", "Передано", "Остаток", "Докупить"];
  
  headers.forEach(h => html += <th>${h}</th>);
  html += </tr></thead><tbody>;
  
  // Данные
  data.forEach(row => {
    html += <tr>;
    row.forEach(cell => html += <td>${cell}</td>);
    html += </tr>;
  });
  
  document.getElementById("myTabContent").innerHTML = html + "</tbody></table>";
}

// Инициализация вкладок
function initTabs() {
  const tabs = ["Склад", ...Array.from({length: 10}, (_, i) => Объект ${i+1})];
  let tabHtml = '';
  
  tabs.forEach((tab, index) => {
    tabHtml += '
      <li class="nav-item">
        <button class="nav-link ${index === 0 ? 'active' : ''}" 
                onclick="changeTab(${index})">${tab}</button>
      </li>
    ';
  });
  
  document.getElementById("myTab").innerHTML = tabHtml;
  loadData(tabs[0]);
}

// Смена вкладки
window.changeTab = (index) => {
  currentTab = index;
  const sheetName = index === 0 ? "Склад" : Объект ${index};
  loadData(sheetName);
};

// Запуск
document.addEventListener("DOMContentLoaded", initTabs);

// Проверяем, что мы в Telegram
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  
  // Настройки интерфейса
  tg.expand();  // Растягиваем на весь экран
  tg.setHeaderColor('#2b2d42');  // Фиолетовая шапка
  
  // Получаем данные пользователя
  const user = tg.initDataUnsafe.user;
  console.log('Привет, ', user?.first_name);
  
  // Кнопка "Закрыть"
  tg.BackButton.show();
  tg.BackButton.onClick(() => tg.close());
}