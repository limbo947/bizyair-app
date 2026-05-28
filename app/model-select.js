import { useRouter } from 'expo-router';
import { ModelSelectScreen } from '../src/screens/ModelSelectScreen';
import { useHistoryContext } from '../src/context/HistoryContext';

export default function ModelSelectRoute() {
  const router = useRouter();
  const { saveHomeState, homeState } = useHistoryContext();

  return (
    <ModelSelectScreen
      currentModelId={homeState.modelId}
      onSelectModel={(modelId, mode) => {
        saveHomeState({ modelId, ...(mode ? { mode } : {}) });
        router.back();
      }}
      onBack={() => router.back()}
    />
  );
}
