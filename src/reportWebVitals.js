import log from './logger';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Log metrics using logger by default
reportWebVitals(metric => {
  log.info(`[web-vitals] ${metric.name}: ${metric.value}`);
});

export default reportWebVitals;