import { useContext } from 'react';
import { HistoryListContext, HomeStateContext, PollingContext } from './contexts';

export function useHistoryListContext() {
  const context = useContext(HistoryListContext);
  if (!context) throw new Error('useHistoryListContext 必须在 HistoryProvider 内部使用');
  return context;
}

export function useHomeStateContext() {
  const context = useContext(HomeStateContext);
  if (!context) throw new Error('useHomeStateContext 必须在 HistoryProvider 内部使用');
  return context;
}

export function usePollingContext() {
  const context = useContext(PollingContext);
  if (!context) throw new Error('usePollingContext 必须在 HistoryProvider 内部使用');
  return context;
}

export function useHistoryContext() {
  const listCtx = useContext(HistoryListContext);
  const homeCtx = useContext(HomeStateContext);
  const pollCtx = useContext(PollingContext);
  if (!listCtx || !homeCtx || !pollCtx) throw new Error('useHistoryContext 必须在 HistoryProvider 内部使用');
  return { ...listCtx, ...homeCtx, ...pollCtx };
}
