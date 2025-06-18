
self.addEventListener('install', (event) => {
  console.log('SW: Evento de instalación');
  self.skipWaiting(); // Forzar la activación del nuevo SW
});

self.addEventListener('activate', (event) => {
  console.log('SW: Evento de activación');
  event.waitUntil(self.clients.claim()); // Tomar control inmediato de la página
});

self.addEventListener('push', event => {
  try {
    console.log('SW: push event recibido');
    const data = event.data ? event.data.json() : {};
    const options = {
      body: data.body,
      icon: data.icon,
      badge: '/favicon.ico',
      data: {
        url: data.data?.url,
      },
    };
    console.log('SW: mostrando notificación con datos:', data, options);
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (err) {
    console.error('SW: error en evento push:', err);
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  console.log('SW: notificationclick, abriendo:', url);
  event.waitUntil(
    clients.openWindow(url)
  );
});
