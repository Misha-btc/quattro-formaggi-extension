function createOrdiscanButton() {
  // Check extension state
  if (!chrome.runtime?.id) {
    console.log('Extension was disabled or reloaded');
    return;
  }

  // Add error handling for URL icons
  let ordioIcon, ordinalsIcon;
  try {
    ordioIcon = `<img src="${chrome.runtime.getURL('ordio.svg')}" class="ordio-icon" alt="Ord.io">`;
    ordinalsIcon = `<img src="${chrome.runtime.getURL('ordinals.svg')}" class="ordinals-icon" alt="Ordinals">`;
  } catch (e) {
    console.error('Ошибка при загрузке иконок:', e);
    return;
  }

  // Function for safe access to chrome.storage
  function safeStorageGet(callback) {
    try {
      if (chrome.runtime?.id) {
        chrome.storage.sync.get('defaultService', callback);
      }
    } catch (e) {
      console.error('Ошибка при доступе к storage:', e);
      callback({ defaultService: 'ordiscan' });
    }
  }

  // Create SVG icons for both services
  const ordiscanIcon = `
    <svg class="ordiscan-icon" viewBox="0 0 33 34" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.346 29.877a16.657 16.657 0 0 0 10.338 3.585 16.657 16.657 0 0 0 10.337-3.585H6.346Zm23.137-2.39H3.884a16.009 16.009 0 0 1-2.318-3.585H31.8a16.008 16.008 0 0 1-2.318 3.585ZM.645 21.512h32.077c.344-1.169.56-2.37.645-3.586H0a16.82 16.82 0 0 0 .645 3.586Zm0-9.562h32.077c.344 1.169.56 2.37.645 3.586H0a16.82 16.82 0 0 1 .645-3.586Zm28.838-5.975H3.885A16.01 16.01 0 0 0 1.566 9.56h30.235a16.008 16.008 0 0 0-2.318-3.585Zm-2.462-2.39A16.658 16.658 0 0 0 16.684 0 16.656 16.656 0 0 0 6.346 3.585H27.02Z" fill="currentColor"/>
    </svg>
  `;

  function getIconForService(service) {
    switch(service) {
      case 'ordiscan': return ordiscanIcon;
      case 'ordio': return ordioIcon;
      case 'ordinals': return ordinalsIcon;
      default: return ordiscanIcon;
    }
  }

  function getTitleForService(service) {
    switch(service) {
      case 'ordiscan': return 'Open in Ordiscan';
      case 'ordio': return 'Open in Ord.io';
      case 'ordinals': return 'Open in Ordinals';
      default: return 'Open in Ordiscan';
    }
  }

  function getUrlForService(service, inscriptionId) {
    switch(service) {
      case 'ordiscan': return `https://ordiscan.com/inscription/${inscriptionId}`;
      case 'ordio': return `https://www.ord.io/${inscriptionId}`;
      case 'ordinals': return `https://ordinals.com/inscription/${inscriptionId}`;
      default: return `https://ordiscan.com/inscription/${inscriptionId}`;
    }
  }

  // Функция для добавления кнопки
  function addButton(element) {
    if (!chrome.runtime?.id) return;

    const inscriptionId = element.querySelector('a')?.href?.match(/[a-f0-9]{64}i\d+/)?.[0];
    if (!inscriptionId) return;

    if (element.querySelector('.ordiscan-button')) return;

    const button = document.createElement('button');
    button.className = 'ordiscan-button';
    
    safeStorageGet(function(data) {
      const service = data.defaultService || 'ordiscan';
      button.innerHTML = getIconForService(service);
      button.title = getTitleForService(service);
    });
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      safeStorageGet(function(data) {
        const service = data.defaultService || 'ordiscan';
        const url = getUrlForService(service, inscriptionId);
        window.open(url, '_blank');
      });
    });

    // Create or find container for buttons in the top part of the card
    let buttonContainer = element.querySelector('.tw-absolute.tw-flex.tw-items-center.tw-gap-x-2.tw-z-10.tw-top-2');
    
    if (!buttonContainer) {
      buttonContainer = document.createElement('div');
      buttonContainer.className = 'tw-absolute tw-flex tw-items-center tw-gap-x-2 tw-z-10 tw-top-2 @md:group-[.standard]/grid:tw-top-3 tw-right-2 @md:group-[.standard]/grid:tw-right-3';
      
      // Find parent container with image
      const imageContainer = element.querySelector('.tw-relative.tw-w-full.tw-aspect-square');
      if (imageContainer) {
        imageContainer.appendChild(buttonContainer);
      }
    }

    buttonContainer.appendChild(button);
  }

  // Observe changes in DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const elements = node.querySelectorAll('.tw-bg-gray-100.tw-border');
          elements.forEach(addButton);
        }
      });
    });
  });

  // Add buttons to existing elements
  document.querySelectorAll('.tw-bg-gray-100.tw-border').forEach(addButton);

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Change storage handler
  try {
    if (chrome.runtime?.id) {
      chrome.storage.onChanged.addListener(function(changes) {
        if (changes.defaultService) {
          document.querySelectorAll('.ordiscan-button').forEach(button => {
            button.innerHTML = getIconForService(changes.defaultService.newValue);
            button.title = getTitleForService(changes.defaultService.newValue);
          });
        }
      });
    }
  } catch (e) {
    console.error('Error setting storage listener:', e);
  }
}

// Change script launch
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createOrdiscanButton);
  } else {
    createOrdiscanButton();
  }
} catch (e) {
  console.error('Error starting script:', e);
}