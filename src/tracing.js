import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { trace } from '@opentelemetry/api';

const provider = new WebTracerProvider({
  spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
});
provider.register();

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      ignoreUrls: [/localhost:3000\/metrics/],
    }),
  ],
});

// TEST SPAN with visible console logs
const tracer = trace.getTracer('test-tracer');
const span = tracer.startSpan('test-span');
console.log('OpenTelemetry: test-span started', span);
span.addEvent('OpenTelemetry: test-span event');
span.end();
console.log('OpenTelemetry: test-span ended', span);