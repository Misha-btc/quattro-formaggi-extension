document.addEventListener('DOMContentLoaded', function() {
  // Получаем сохраненный сервис
  chrome.storage.sync.get('defaultService', function(data) {
    const defaultService = data.defaultService || 'ordiscan';
    
    // Отмечаем активную кнопку
    const activeButton = document.querySelector(`[data-service="${defaultService}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  });

  // Обработчики для кнопок
  document.querySelectorAll('.service-button').forEach(button => {
    button.addEventListener('click', function() {
      const service = this.dataset.service;
      
      // Сохраняем выбор
      chrome.storage.sync.set({ defaultService: service }, function() {
        // Обновляем активную кнопку
        document.querySelectorAll('.service-button').forEach(btn => {
          btn.classList.remove('active');
        });
        this.classList.add('active');
      }.bind(this));
    });
  });
}); 