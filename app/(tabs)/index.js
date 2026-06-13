import { useRouter } from 'expo-router';
import { ErrorBoundary } from '../../src/components/layout/ErrorBoundary';
import { HomeScreen } from '../../src/screens/HomeScreen';

export default function HomeTab() {
  const router = useRouter();
  return (
    <ErrorBoundary>
      <HomeScreen onOpenModelSelect={() => router.push('/model-select')} />
    </ErrorBoundary>
  );
}
