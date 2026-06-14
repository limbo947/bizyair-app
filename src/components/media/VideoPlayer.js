import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Pressable, View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Platform, } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';

const NATIVE = Platform.OS !== 'web';

/* ================================================================
 * WebVideoPlayer — HTML5 <video>，尺寸/音量/控件全部原生可靠
 * ================================================================ */
function WebVideoPlayer({ visible, videoUrl, onClose }) {
  const s = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const vidRef = useRef(null);
  const elRef = useRef(null);
  const rafRef = useRef(null);
  const barRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [mutedVolume, setMutedVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---- create / destroy -------------------------------------------------- */
  useEffect(() => {
    if (!visible || !elRef.current) return;
    setLoading(true);
    setError('');
    setVolume(1); setIsMuted(false); setMutedVolume(1); setIsPlaying(false);
    setPosition(0); setDuration(0);

    const v = document.createElement('video');
    v.src = videoUrl;
    v.preload = 'auto';
    v.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000;';
    v.volume = 1;

    v.addEventListener('loadedmetadata', () => { setDuration(v.duration); setLoading(false); });
    v.addEventListener('canplay', () => setLoading(false));
    v.addEventListener('play',  () => setIsPlaying(true));
    v.addEventListener('pause', () => setIsPlaying(false));
    v.addEventListener('ended', () => { setIsPlaying(false); setPosition(0); });
    v.addEventListener('error', () => { setError('视频加载失败'); setLoading(false); });

    elRef.current.appendChild(v);
    vidRef.current = v;

    rafRef.current = requestAnimationFrame(function tick() {
      if (vidRef.current && !vidRef.current.paused) setPosition(vidRef.current.currentTime);
      if (visible) rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      v.pause();
      v.removeAttribute('src');
      v.load();
      v.remove();
      vidRef.current = null;
    };
  }, [visible, videoUrl]);

  /* ---- controls ---------------------------------------------------------- */
  const togglePlay = () => { if (!vidRef.current) return; if (vidRef.current.paused) { vidRef.current.play(); } else { vidRef.current.pause(); } };

  const toggleMute = () => {
    if (!vidRef.current) return;
    if (isMuted) { vidRef.current.volume = mutedVolume; setVolume(mutedVolume); setIsMuted(false); }
    else         { setMutedVolume(volume); vidRef.current.volume = 0; setVolume(0); setIsMuted(true); }
  };

  const setVol = (v) => { if (!vidRef.current) return; vidRef.current.volume = v; setVolume(v); if (v > 0 && isMuted) setIsMuted(false); };

  const seek = (frac) => { if (!vidRef.current || !duration) return; vidRef.current.currentTime = frac * duration; setPosition(frac * duration); };

  const fmt = (s) => { if (!s || s < 0) return '0:00'; const m = Math.floor(s / 60), sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, '0')}`; };

  const pct = duration > 0 ? (position / duration) * 100 : 0;
  const volPct = isMuted ? 0 : volume * 100;

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={s.full}>
        {/* header */}
        <View style={s.header}>
          <Pressable style={({ pressed }) => [s.btn, pressed && pressedOpacity()]} onPress={onClose}><Ionicons name="chevron-down" size={28} color={colors.textOnOverlay} /></Pressable>
          <Text style={s.title}>视频预览</Text>
          <View style={s.btn} />
        </View>

        {/* video container */}
        <View style={s.videoBox}>
          <div ref={elRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />

          {loading && !error ? <View style={s.loadingOverlay}><ActivityIndicator size="large" color={colors.textOnOverlay} /><Text style={s.loadingText}>加载中...</Text></View> : null}
          {!isPlaying && !loading && !error ? <Pressable style={({ pressed }) => [s.bigPlay, pressed && pressedOpacity()]} onPress={togglePlay}><Ionicons name="play-circle" size={72} color={colors.textOnOverlay} /></Pressable> : null}
          {error ? <View style={s.center}><Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} /><Text style={s.errText}>{error}</Text></View> : null}
        </View>

        {/* controls */}
        <View style={s.ctrlBar}>
          <View style={s.progressRow}>
            <Text style={s.t}>{fmt(position)}</Text>
            <View ref={barRef} style={s.progArea} onClick={(e) => { if (!barRef.current) return; const r = barRef.current.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
              <View style={s.progBg}><View style={[s.progFill, { width: `${Math.max(0, Math.min(100, pct))}%` }]} /></View>
            </View>
            <Text style={s.t}>{fmt(duration)}</Text>
          </View>

          <View style={s.ctrlRow}>
            <Pressable style={({ pressed }) => [s.ctrlBtn, pressed && pressedOpacity()]} onPress={togglePlay}><Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color={colors.textOnOverlay} /></Pressable>
            <Pressable style={({ pressed }) => [s.ctrlBtn, pressed && pressedOpacity()]} onPress={toggleMute}><Ionicons name={isMuted || volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-medium'} size={24} color={colors.textOnOverlay} /></Pressable>
            <View style={s.volArea} onClick={(e) => { if (!e.currentTarget) return; const r = e.currentTarget.getBoundingClientRect(); setVol(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); }}>
              <View style={s.volBg}><View style={[s.volFill, { width: `${volPct}%` }]} /></View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ================================================================
 * NativeVideoPlayer — expo-video (useVideoPlayer + VideoView)
 * ================================================================ */
function NativeVideoPlayer({ visible, videoUrl, onClose }) {
  const s = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [mutedVolume, setMutedVolume] = useState(1);
  const [error, setError] = useState('');

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.volume = 1;
    p.timeUpdateEventInterval = 0.25;
  });

  const { status } = useEvent(player, 'statusChange', {
    status: player.status,
  });
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
  });
  const { duration } = useEvent(player, 'sourceLoad', {
    duration: player.duration,
  });
  const { volume: playerVolume } = useEvent(player, 'volumeChange', {
    volume: player.volume,
  });

  const isLoading = status === 'loading' || status === 'idle';
  const isErrored = status === 'error';

  // 可见性变化时暂停/重置
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/immutability -- expo-video imperative API: volume is a writable property
    if (!visible) { player.pause(); } else { setError(''); setIsMuted(false); player.volume = 1; }
  }, [visible]);

  // 错误状态时设置错误消息
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- error state must sync with player status
    if (status === 'error') setError('视频加载失败');
  }, [status]);

  const togglePlay = useCallback(() => {
    if (isPlaying) { player.pause(); }
    else if (currentTime >= duration && duration > 0) { player.replay(); }
    else if (status === 'readyToPlay') { player.play(); }
  }, [isPlaying, status, currentTime, duration]);

  const toggleMute = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability -- expo-video imperative API: volume is a writable property
    if (isMuted) { player.volume = mutedVolume; setIsMuted(false); }
    else { setMutedVolume(playerVolume); player.volume = 0; setIsMuted(true); }
  }, [isMuted, mutedVolume, playerVolume]);

  const fmt = (s) => { if (!s || s < 0) return '0:00'; const m = Math.floor(s / 60), sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, '0')}`; };

  // eslint-disable-next-line react-hooks/immutability -- expo-video imperative API: currentTime is a writable property for seeking
  const seek = useCallback((frac) => { if (!duration) return; player.currentTime = frac * duration; }, [duration]);

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volPct = isMuted ? 0 : playerVolume * 100;

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <Pressable style={s.full} >
        <View style={s.header}>
          <Pressable style={({ pressed }) => [s.btn, pressed && pressedOpacity()]} onPress={onClose}><Ionicons name="chevron-down" size={28} color={colors.textOnOverlay} /></Pressable>
          <Text style={s.title}>视频预览</Text>
          <View style={s.btn} />
        </View>

        <View style={s.videoBox}>
          {isErrored || error ? <View style={s.center}><Ionicons name="alert-circle-outline" size={48} color="#999" /><Text style={s.errText}>{error || '视频加载失败'}</Text></View>
          : <VideoView player={player} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="contain" nativeControls={false} />}
          {isLoading && !isErrored && !error ? <View style={s.loadingOverlay}><ActivityIndicator size="large" color={colors.textOnOverlay} /><Text style={s.loadingText}>加载中...</Text></View> : null}
          {!isPlaying && !isLoading && !isErrored && !error ? <Pressable style={({ pressed }) => [s.bigPlay, pressed && pressedOpacity()]} onPress={togglePlay}><Ionicons name="play-circle" size={72} color={colors.textOnOverlay} /></Pressable> : null}
        </View>

        <View style={s.ctrlBar}>
          <View style={s.progressRow}>
            <Text style={s.t}>{fmt(currentTime)}</Text>
            <Pressable style={({ pressed }) => [s.progArea, pressed && pressedOpacity()]} onPress={(e) => { e.currentTarget.measure((_, __, w) => seek(e.nativeEvent.locationX / w)); }}>
              <View style={s.progBg}><View style={[s.progFill, { width: `${pct}%` }]} /></View>
            </Pressable>
            <Text style={s.t}>{fmt(duration)}</Text>
          </View>

          <View style={s.ctrlRow}>
            <Pressable style={({ pressed }) => [s.ctrlBtn, pressed && pressedOpacity()]} onPress={togglePlay} disabled={isLoading}><Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color={isLoading ? colors.textTertiary : colors.textOnOverlay} /></Pressable>
            <Pressable style={({ pressed }) => [s.ctrlBtn, pressed && pressedOpacity()]} onPress={toggleMute}><Ionicons name={isMuted || playerVolume === 0 ? 'volume-mute' : playerVolume < 0.5 ? 'volume-low' : 'volume-medium'} size={24} color={colors.textOnOverlay} /></Pressable>
            <Pressable style={({ pressed }) => [s.volArea, pressed && pressedOpacity()]} onPress={(e) => { e.currentTarget.measure((_, __, w) => { const v = Math.max(0, Math.min(1, e.nativeEvent.locationX / w)); player.volume = v; if (v > 0 && isMuted) setIsMuted(false); }); }}>
              <View style={s.volBg}><View style={[s.volFill, { width: `${volPct}%` }]} /></View>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

/* ---- export -------------------------------------------------------------- */
export function VideoPlayer(props) {
  return NATIVE ? <NativeVideoPlayer {...props} /> : <WebVideoPlayer {...props} />;
}

/* ---- shared styles ------------------------------------------------------- */
const createStyles = (colors) => ({
  full: { flex: 1, backgroundColor: colors.overlayHeavy },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: colors.overlayMedium },
  btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Typography.fontSize.callout, fontWeight: Typography.fontWeight.semibold, color: colors.textOnOverlay },
  videoBox: { flex: 1, width: '100%', overflow: 'hidden' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errText: { fontSize: Typography.fontSize.footnote, color: colors.textOnOverlay, marginTop: Spacing.md, textAlign: 'center' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlayMedium, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.textOnOverlay, fontSize: Typography.fontSize.footnote, marginTop: Spacing.md },
  bigPlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ctrlBar: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, backgroundColor: colors.overlayHeavy, paddingBottom: 34, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  progArea: { flex: 1, height: 32, justifyContent: 'center', marginHorizontal: 4 },
  progBg: { height: 3, borderRadius: 1.5, borderCurve: 'continuous', backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 1.5, borderCurve: 'continuous' },
  t: { fontSize: Typography.fontSize.caption1, color: colors.textOnOverlay, minWidth: 42, textAlign: 'center' },
  ctrlRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  ctrlBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  volArea: { flex: 1, height: 28, justifyContent: 'center', cursor: 'pointer' },
  volBg: { height: 3, borderRadius: 1.5, borderCurve: 'continuous', backgroundColor: colors.overlayLight, overflow: 'hidden' },
  volFill: { height: '100%', backgroundColor: colors.textOnOverlay, borderRadius: 1.5, borderCurve: 'continuous' },
});
