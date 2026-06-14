import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Pressable, View, Text, Modal, ActivityIndicator, Platform } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';

const NATIVE = Platform.OS !== 'web';

/* ================================================================
 * WebAudioPlayer — HTML5 <audio>，最可靠的音量/进度控制
 * ================================================================ */
function WebAudioPlayer({ visible, audioUrl, onClose }) {
  const st = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const audioRef = useRef(null);
  const rafRef = useRef(null);
  const barRef = useRef(null);
  const volBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [mutedVolume, setMutedVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setLoading(true); setError(''); setVolume(1); setIsMuted(false); setMutedVolume(1);
    setIsPlaying(false); setPosition(0); setDuration(0);

    const a = document.createElement('audio');
    a.src = audioUrl;
    a.preload = 'auto';
    a.volume = 1;

    a.addEventListener('loadedmetadata', () => { setDuration(a.duration); setLoading(false); });
    a.addEventListener('canplay', () => setLoading(false));
    a.addEventListener('play',  () => setIsPlaying(true));
    a.addEventListener('pause', () => setIsPlaying(false));
    a.addEventListener('ended', () => { setIsPlaying(false); setPosition(0); });
    a.addEventListener('error', () => { setError('音频加载失败，请检查网络连接'); setLoading(false); });

    audioRef.current = a;

    rafRef.current = requestAnimationFrame(function tick() {
      if (audioRef.current && !audioRef.current.paused) setPosition(audioRef.current.currentTime);
      if (visible) rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      a.pause();
      a.removeAttribute('src');
      a.load();
      audioRef.current = null;
    };
  }, [visible, audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) { audioRef.current.play(); } else { audioRef.current.pause(); }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) { audioRef.current.volume = mutedVolume; setVolume(mutedVolume); setIsMuted(false); }
    else         { setMutedVolume(volume); audioRef.current.volume = 0; setVolume(0); setIsMuted(true); }
  };

  const setVol = (v) => { if (!audioRef.current) return; audioRef.current.volume = v; setVolume(v); if (v > 0 && isMuted) setIsMuted(false); };

  const seek = (frac) => { if (!audioRef.current || !duration) return; audioRef.current.currentTime = frac * duration; setPosition(frac * duration); };

  const fmt = (s) => { if (!s || s < 0) return '0:00'; const m = Math.floor(s / 60); return `${m}:${(Math.floor(s) % 60).toString().padStart(2, '0')}`; };

  const pct = duration > 0 ? (position / duration) * 100 : 0;
  const volPct = isMuted ? 0 : volume * 100;

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={st.container}>
        <View style={st.header}>
          <Pressable style={({ pressed }) => [st.closeBtn, pressed && pressedOpacity()]} onPress={onClose}><Ionicons name="close" size={28} color={colors.textPrimary} /></Pressable>
          <Text style={st.title}>音频预览</Text>
          <View style={st.closeBtn} />
        </View>

        <View style={st.body}>
          <View style={st.iconCircle}><Ionicons name="musical-note" size={64} color={colors.primary} /></View>
          {error ? <Text style={st.err}>{error}</Text> : null}

          <View style={st.progressRow}>
            <Text style={st.t}>{fmt(position)}</Text>
            <View ref={barRef} style={st.progArea} onClick={(e) => { if (!barRef.current) return; const r = barRef.current.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
              <View style={st.progBg}><View style={[st.progFill, { width: `${Math.max(0, Math.min(100, pct))}%` }]} /></View>
            </View>
            <Text style={st.t}>{fmt(duration)}</Text>
          </View>

          <View style={st.controls}>
            <Pressable style={({ pressed }) => [st.playBtn, pressed && pressedOpacity()]} onPress={togglePlay} disabled={loading}>
              {loading ? <ActivityIndicator color={colors.textInverse} size="small" /> : <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={colors.textInverse} />}
            </Pressable>
          </View>

          <View style={st.volRow}>
            <Pressable style={({ pressed }) => [st.volIcon, pressed && pressedOpacity()]} onPress={toggleMute}>
              <Ionicons name={isMuted || volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-medium'} size={20} color={colors.textSecondary} />
            </Pressable>
            <View ref={volBarRef} style={st.volArea} onClick={(e) => { if (!volBarRef.current) return; const r = volBarRef.current.getBoundingClientRect(); setVol(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); }}>
              <View style={st.volBg}><View style={[st.volFill, { width: `${volPct}%` }]} /></View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ================================================================
 * NativeAudioPlayer — expo-audio (useAudioPlayer)
 * ================================================================ */
function NativeAudioPlayer({ visible, audioUrl, onClose }) {
  const st = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [mutedVolume, setMutedVolume] = useState(1);
  const [volume, setVolume] = useState(1);

  const player = useAudioPlayer(audioUrl);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status.playing;
  const isLoading = !status.isLoaded;
  const duration = status.duration || 0;
  const position = status.currentTime || 0;
  const error = status.error ? '音频加载失败，请检查网络连接' : '';

  // 可见性变化时暂停
  useEffect(() => {
    if (!visible) { player.pause(); }
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/immutability -- expo-audio imperative API: volume is a writable property
    else { setIsMuted(false); player.volume = 1; setVolume(1); }
  }, [visible]);

  const handlePlay = useCallback(async () => {
    if (!audioUrl) return;
    if (isPlaying) { player.pause(); return; }
    // 播放结束后重头播放
    if (position >= duration && duration > 0) { player.seekTo(0); }
    player.play();
  }, [audioUrl, isPlaying, position, duration]);

  const seek = useCallback((frac) => {
    if (!duration) return;
    player.seekTo(frac * duration);
  }, [duration]);

  const toggleMute = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability -- expo-audio imperative API: volume is a writable property
    if (isMuted) { player.volume = mutedVolume; setVolume(mutedVolume); setIsMuted(false); }
    else { setMutedVolume(volume); player.volume = 0; setVolume(0); setIsMuted(true); }
  }, [isMuted, mutedVolume, volume]);

  const fmt = (s) => { if (!s || s < 0) return '0:00'; const m = Math.floor(s / 60); return `${m}:${(Math.floor(s) % 60).toString().padStart(2, '0')}`; };
  const pct = duration > 0 ? (position / duration) * 100 : 0;
  const volPct = isMuted ? 0 : volume * 100;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={st.container}>
        <View style={st.header}>
          <Pressable style={({ pressed }) => [st.closeBtn, pressed && pressedOpacity()]} onPress={onClose}><Ionicons name="close" size={28} color={colors.textPrimary} /></Pressable>
          <Text style={st.title}>音频预览</Text>
          <View style={st.closeBtn} />
        </View>

        <View style={st.body}>
          <View style={st.iconCircle}><Ionicons name="musical-note" size={64} color={colors.primary} /></View>
          {error ? <Text style={st.err}>{error}</Text> : null}

          <View style={st.progressRow}>
            <Text style={st.t}>{fmt(position)}</Text>
            <Pressable style={({ pressed }) => [st.progArea, pressed && pressedOpacity()]} onPress={(e) => { e.currentTarget.measure((_, __, w) => seek(e.nativeEvent.locationX / w)); }}>
              <View style={st.progBg}><View style={[st.progFill, { width: `${pct}%` }]} /></View>
            </Pressable>
            <Text style={st.t}>{fmt(duration)}</Text>
          </View>

          <View style={st.controls}>
            <Pressable style={({ pressed }) => [st.playBtn, pressed && pressedOpacity()]} onPress={handlePlay} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color={colors.textInverse} size="small" /> : <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={colors.textInverse} />}
            </Pressable>
          </View>

          <View style={st.volRow}>
            <Pressable style={({ pressed }) => [st.volIcon, pressed && pressedOpacity()]} onPress={toggleMute}>
              <Ionicons name={isMuted || volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-medium'} size={20} color={colors.textSecondary} />
            </Pressable>
            <Pressable style={({ pressed }) => [st.volArea, pressed && pressedOpacity()]} onPress={(e) => { e.currentTarget.measure((_, __, w) => { const v = Math.max(0, Math.min(1, e.nativeEvent.locationX / w)); player.volume = v; setVolume(v); if (v > 0 && isMuted) setIsMuted(false); }); }}>
              <View style={st.volBg}><View style={[st.volFill, { width: `${volPct}%` }]} /></View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---- export -------------------------------------------------------------- */
export function AudioPlayer(props) {
  return NATIVE ? <NativeAudioPlayer {...props} /> : <WebAudioPlayer {...props} />;
}

/* ---- shared styles ------------------------------------------------------- */
const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: colors.card },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Typography.fontSize.callout, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  iconCircle: { width: 140, height: 140, borderRadius: 70, borderCurve: 'continuous', backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl },
  err: { fontSize: Typography.fontSize.footnote, color: colors.error, marginTop: Spacing.md, textAlign: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, width: '100%', maxWidth: 340 },
  t: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, minWidth: 36, textAlign: 'center' },
  progArea: { flex: 1, height: 28, justifyContent: 'center' },
  progBg: { height: 4, borderRadius: 2, borderCurve: 'continuous', backgroundColor: colors.disabledBg, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2, borderCurve: 'continuous' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.xl },
  playBtn: { width: 64, height: 64, borderRadius: 32, borderCurve: 'continuous', backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  volRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  volIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  volArea: { width: 200, height: 28, justifyContent: 'center' },
  volBg: { height: 3, borderRadius: 1.5, borderCurve: 'continuous', backgroundColor: colors.disabledBg, overflow: 'hidden' },
  volFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 1.5, borderCurve: 'continuous' },
});
