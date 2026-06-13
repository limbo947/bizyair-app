import { ErrorBoundary } from '../../src/components/layout/ErrorBoundary';
import { WebappScreen } from '../../src/screens/webapp/WebappScreen';

export default function WebappTab() {
  return (
    <ErrorBoundary>
      <WebappScreen />
    </ErrorBoundary>
  );
}
