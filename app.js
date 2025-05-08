// Конфигурация
const API_URL = "https://script.google.com/macros/s/AKfycbxYCUO9iAmyAl6ZfLLuziAYs5AXphDqcSqQVj2ma-u_j2tosjhcOyMW3JGSsC7ipJG2pw/exec";
let currentTab = 0;

// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  Telegram.WebApp.expand();
  Telegram.WebApp.enableClosingConfirmation();
}

// Загрузка данных
async function loadData(sheetName) {
  try {
    const response = await axios.post(API_URL, { 
      action: "getData", 
      sheetName 
    });
    renderTable(response.data.data || []);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

// Рендер таблицы
function renderTable(data) {
  let html = <table class="table"><thead><tr>;
  
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
    tabHtml += <li class="nav-item">
      <button class="nav-link ${index === 0 ? 'active' : ''}" 
              onclick="changeTab(${index})">${tab}</button>
    </li>;
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