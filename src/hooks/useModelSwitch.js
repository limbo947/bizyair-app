import { useRef, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getModelModes } from '../utils/modelHelpers';
import { MODEL_STATES_KEY } from '../constants/models';
import { initialState } from '../screens/home/homeReducer';

const MODEL_ID_MIGRATIONS = {
  'wan-2-7-image-pro-offcial': 'wan-2-7-image-pro-official',
  'wan-2-7-offcial': 'wan-2-7-extend-official',
};

export function useModelSwitch({ state, saveHomeState, stateDispatch }) {
  const stateRef = useRef(state);
  const modelStatesRef = useRef({});
  const isSwitchingModelRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
    const { modelId: mid, ...rest } = state;
    modelStatesRef.current[mid] = rest;
  }, [state]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(MODEL_STATES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) || {};
          let migrated = false;
          for (const [oldId, newId] of Object.entries(MODEL_ID_MIGRATIONS)) {
            if (parsed[oldId]) {
              parsed[newId] = parsed[oldId];
              delete parsed[oldId];
              migrated = true;
            }
          }
          if (migrated) {
            await AsyncStorage.setItem(MODEL_STATES_KEY, JSON.stringify(parsed));
          }
          modelStatesRef.current = parsed;
        }
      } catch (_e) { /* ignore */ }
    })();
  }, []);

  const persistModelStates = useCallback(() => {
    AsyncStorage.setItem(MODEL_STATES_KEY, JSON.stringify(modelStatesRef.current)).catch(() => {});
  }, []);

  const switchToModel = useCallback((newId) => {
    const oldId = stateRef.current.modelId;
    if (oldId === newId) return;

    isSwitchingModelRef.current = true;

    const { modelId: _, ...oldSnapshot } = stateRef.current;
    modelStatesRef.current[oldId] = oldSnapshot;

    const cached = modelStatesRef.current[newId];
    const newModes = getModelModes(newId);
    let updates;
    if (cached) {
      updates = { ...cached, modelId: newId };
      if (newModes.length > 0 && !newModes.includes(cached.mode)) {
        updates.mode = newModes[0];
      }
    } else {
      updates = { ...initialState, modelId: newId };
      if (newModes.length > 0) updates.mode = newModes[0];
    }

    saveHomeState({ modelId: newId, mode: updates.mode });
    stateDispatch({ type: 'SET_PARAMS', params: updates });
    persistModelStates();

    isSwitchingModelRef.current = false;
  }, [saveHomeState, persistModelStates, stateDispatch]);

  return { switchToModel, modelStatesRef, persistModelStates, isSwitchingModelRef, stateRef };
}
