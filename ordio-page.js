const meIconUrl = chrome.runtime.getURL('me.svg');

function addMagicEdenButton() {
  const inscriptionSpan = document.querySelector('.text-lg.font-medium.uppercase.text-muted-foreground');
  if (!inscriptionSpan) return;

  const inscriptionId = window.location.pathname.slice(1);
  if (!inscriptionId) return;

  // Создаем кнопку
  const button = document.createElement('button');
  button.innerHTML = `
    <img src="${meIconUrl}" alt="Magic Eden" style="width: 20px; height: 20px;">
  `;
  button.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 2px solid #98a3ad;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: transparent;
    margin-left: 8px;
    vertical-align: middle;
    position: relative;
    top: -2px;
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

  inscriptionSpan.insertAdjacentElement('afterend', button);
}

// Запускаем скрипт после загрузки страницы
document.addEventListener('DOMContentLoaded', addMagicEdenButton);
addMagicEdenButton(); 