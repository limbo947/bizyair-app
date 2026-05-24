import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

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
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
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
          <TouchableOpacity onPress={onClose} style={st.closeBtn}><Ionicons name="close" size={28} color={colors.textPrimary} /></TouchableOpacity>
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
            <TouchableOpacity style={st.playBtn} onPress={togglePlay} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" />}
            </TouchableOpacity>
          </View>

          <View style={st.volRow}>
            <TouchableOpacity onPress={toggleMute} style={st.volIcon}>
              <Ionicons name={isMuted || volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-medium'} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
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
 * NativeAudioPlayer — expo-av Audio.Sound
 * ================================================================ */
function NativeAudioPlayer({ visible, audioUrl, onClose }) {
  const st = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [mutedVolume, setMutedVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState('');
  const soundRef = useRef(null);
  const tickRef = useRef(null);

  useEffect(() => { if (!visible) clean(); }, [visible]);
  useEffect(() => () => clean(), []);

  const clean = () => { clearInterval(tickRef.current); tickRef.current = null; if (soundRef.current) { try { soundRef.current.unloadAsync(); } catch {} soundRef.current = null; } setIsPlaying(false); setPosition(0); setDuration(0); setError(''); };

  const handlePlay = useCallback(async () => {
    if (!audioUrl) return;
    if (isPlaying && soundRef.current) { await soundRef.current.pauseAsync(); setIsPlaying(false); clearInterval(tickRef.current); return; }
    if (soundRef.current && !isPlaying) { try { const s = await soundRef.current.getStatusAsync(); s.isLoaded && s.positionMillis === s.durationMillis ? await soundRef.current.replayAsync() : await soundRef.current.playAsync(); setIsPlaying(true); startTick(); } catch { setError('播放失败'); } return; }

    setIsLoading(true); setError('');
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, staysActiveInBackground: false });
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: true, volume }, onStatus);
      soundRef.current = sound; setIsPlaying(true); setIsLoading(false); startTick();
    } catch { setIsLoading(false); setError('音频加载失败，请检查网络连接'); }
  }, [audioUrl, isPlaying, volume]);

  const onStatus = (s) => {
    if (!s.isLoaded) return;
    setDuration(s.durationMillis || 0); setPosition(s.positionMillis || 0);
    if (s.didJustFinish) { setIsPlaying(false); setPosition(0); clearInterval(tickRef.current); }
  };

  const startTick = () => { clearInterval(tickRef.current); tickRef.current = setInterval(async () => { if (soundRef.current) { try { const s = await soundRef.current.getStatusAsync(); if (s.isLoaded) setPosition(s.positionMillis || 0); } catch {} } }, 200); };

  const seek = useCallback(async (frac) => { if (!soundRef.current || !duration) return; const t = frac * duration; try { await soundRef.current.setPositionAsync(t); setPosition(t); } catch {} }, [duration]);

  const toggleMute = () => { if (isMuted) { soundRef.current?.setVolumeAsync(mutedVolume); setVolume(mutedVolume); setIsMuted(false); } else { setMutedVolume(volume); soundRef.current?.setVolumeAsync(0); setVolume(0); setIsMuted(true); } };

  const fmt = (ms) => { const t = Math.floor(ms / 1000); return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, '0')}`; };
  const pct = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={st.container}>
        <View style={st.header}>
          <TouchableOpacity onPress={onClose} style={st.closeBtn}><Ionicons name="close" size={28} color={colors.textPrimary} /></TouchableOpacity>
          <Text style={st.title}>音频预览</Text>
          <View style={st.closeBtn} />
        </View>

        <View style={st.body}>
          <View style={st.iconCircle}><Ionicons name="musical-note" size={64} color={colors.primary} /></View>
          {error ? <Text style={st.err}>{error}</Text> : null}

          <View style={st.progressRow}>
            <Text style={st.t}>{fmt(position)}</Text>
            <TouchableOpacity style={st.progArea} activeOpacity={0.8} onPress={(e) => { e.currentTarget.measure((_, __, w) => seek(e.nativeEvent.locationX / w)); }}>
              <View style={st.progBg}><View style={[st.progFill, { width: `${pct}%` }]} /></View>
            </TouchableOpacity>
            <Text style={st.t}>{fmt(duration)}</Text>
          </View>

          <View style={st.controls}>
            <TouchableOpacity style={st.playBtn} onPress={handlePlay} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" />}
            </TouchableOpacity>
          </View>

          <View style={st.volRow}>
            <TouchableOpacity onPress={toggleMute} style={st.volIcon}>
              <Ionicons name={isMuted || volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-medium'} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={st.volArea} activeOpacity={0.8} onPress={(e) => { e.currentTarget.measure((_, __, w) => { const v = Math.max(0, Math.min(1, e.nativeEvent.locationX / w)); setVolume(v); if (v > 0 && isMuted) setIsMuted(false); soundRef.current?.setVolumeAsync(v); }); }}>
              <View style={st.volBg}><View style={[st.volFill, { width: `${isMuted ? 0 : volume * 100}%` }]} /></View>
            </TouchableOpacity>
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
  title: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  iconCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl },
  err: { fontSize: 13, color: colors.error, marginTop: Spacing.md, textAlign: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, width: '100%', maxWidth: 340 },
  t: { fontSize: 12, color: colors.textTertiary, minWidth: 36, textAlign: 'center' },
  progArea: { flex: 1, height: 28, justifyContent: 'center' },
  progBg: { height: 4, borderRadius: 2, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.xl },
  playBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  volRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  volIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  volArea: { width: 200, height: 28, justifyContent: 'center' },
  volBg: { height: 3, borderRadius: 1.5, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  volFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 1.5 },
});
