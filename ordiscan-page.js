const meIconUrl = chrome.runtime.getURL('me.svg');

function addMagicEdenButton() {
  const h1 = document.querySelector('.text-\\[38px\\]');
  if (!h1 || !h1.textContent.includes('Inscription')) return;

  // Получаем ID из заголовка или URL
  const inscriptionId = window.location.pathname.split('/').pop() || h1.textContent.replace('Inscription ', '');
  if (!inscriptionId) return;

  // Создаем контейнер для заголовка и кнопки
  const container = document.createElement('div');
  container.style.cssText = 'display: inline-flex; align-items: center; gap: 8px;';

  // Перемещаем h1 в контейнер
  h1.parentNode.insertBefore(container, h1);
  container.appendChild(h1);

  // Создаем кнопку
  const button = document.createElement('button');
  button.innerHTML = `
    <img src="${meIconUrl}" alt="Magic Eden" style="width: 25px; height: 25px;">
  `;
  button.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border: 2px solid #98a3ad;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: transparent;
  `;
  
  button.title = 'visit ME';
  
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'rgba(247, 250, 252, 0.1)';
  });
  
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'transparent';
  });

  button.addEventListener('click', () => {
    window.open(`https://magiceden.io/ordinals/item-details/${inscriptionId}`, '_blank');
  });

  container.appendChild(button);
}

// Запускаем скрипт после загрузки страницы
document.addEventListener('DOMContentLoaded', addMagicEdenButton);
addMagicEdenButton(); 