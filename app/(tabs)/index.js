import { useRouter } from 'expo-router';
import { HomeScreen } from '../../src/screens/HomeScreen';

export default function HomeTab() {
  const router = useRouter();
  return <HomeScreen onOpenModelSelect={() => router.push('/model-select')} />;
}
