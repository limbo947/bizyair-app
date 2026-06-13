import { ErrorBoundary } from '../../src/components/layout/ErrorBoundary';
import { HistoryScreen } from '../../src/screens/history/HistoryScreen';

export default function HistoryTab() {
  return (
    <ErrorBoundary>
      <HistoryScreen />
    </ErrorBoundary>
  );
}
