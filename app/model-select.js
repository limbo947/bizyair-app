import { useRouter } from 'expo-router';
import { ModelSelectScreen } from '../src/screens/ModelSelectScreen';
import { useHomeStateContext } from '../src/context/history';
import { getModelModes } from '../src/utils/modelHelpers';

export default function ModelSelectRoute() {
  const router = useRouter();
  const { saveHomeState, homeState } = useHomeStateContext();

  return (
    <ModelSelectScreen
      currentModelId={homeState.modelId}
      onSelectModel={(modelId, mode) => {
        const updates = { modelId };
        if (mode) {
          updates.mode = mode;
        } else {
          const newModes = getModelModes(modelId);
          if (newModes.length > 0 && !newModes.includes(homeState.mode)) {
            updates.mode = newModes[0];
          }
        }
        saveHomeState(updates);
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }}
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }}
    />
  );
}
