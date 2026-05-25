import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const NATIVE = Platform.OS !== 'web';

/* ================================================================
 * WebVideoPlayer — HTML5 <video>，尺寸/音量/控件全部原生可靠
 * ================================================================ */
function WebVideoPlayer({ visible, videoUrl, onClose }) {
  const s = useThemedStyles(createStyles);
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
          <TouchableOpacity onPress={onClose} style={s.btn}><Ionicons name="chevron-down" size={28} color="#fff" /></TouchableOpacity>
          <Text style={s.title}>视频预览</Text>
          <View style={s.btn} />
        </View>

        {/* video container */}
        <View style={s.videoBox}>
          <div ref={elRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />

          {loading && !error ? <View style={s.loadingOverlay}><ActivityIndicator size="large" color="#fff" /><Text style={s.loadingText}>加载中...</Text></View> : null}
          {!isPlaying && !loading && !error ? <TouchableOpacity style={s.bigPlay} onPress={togglePlay}><Ionicons name="play-circle" size={72} color="rgba(255,255,255,0.9)" /></TouchableOpacity> : null}
          {error ? <View style={s.center}><Ionicons name="alert-circle-outline" size={48} color="#999" /><Text style={s.errText}>{error}</Text></View> : null}
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
            <TouchableOpacity style={s.ctrlBtn} onPress={togglePlay}><Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={s.ctrlBtn} onPress={toggleMute}><Ionicons name={isMuted || volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-medium'} size={24} color="#fff" /></TouchableOpacity>
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
 * NativeVideoPlayer — expo-av
 * ================================================================ */
function NativeVideoPlayer({ visible, videoUrl, onClose }) {
  const s = useThemedStyles(createStyles);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [mutedVolume, setMutedVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  // 可见性变化时重置播放状态
  useEffect(() => { if (!visible) { try { videoRef.current?.stopAsync(); } catch {} setIsPlaying(false); setIsLoading(true); } else { setIsLoading(true); setError(''); setVolume(1); setIsMuted(false); setMutedVolume(1); } }, [visible]);
  useEffect(() => () => { try { videoRef.current?.stopAsync(); } catch {} }, []);

  const onPlayback = useCallback((s) => {
    if (!s.isLoaded) { if (s.error) setError('视频加载失败'); return; }
    setDuration(s.durationMillis || 0); setPosition(s.positionMillis || 0); setIsPlaying(s.isPlaying); setIsLoading(false);
    if (s.didJustFinish) setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    try { if (isPlaying) { await videoRef.current.pauseAsync(); } else { const st = await videoRef.current.getStatusAsync(); if (st.isLoaded && st.didJustFinish) { await videoRef.current.replayAsync(); } else { await videoRef.current.playAsync(); } } } catch {}
  }, [isPlaying]);

  const toggleMute = () => { if (isMuted) { setVolume(mutedVolume); setIsMuted(false); } else { setMutedVolume(volume); setVolume(0); setIsMuted(true); } };
  const fmt = (ms) => { if (!ms || ms < 0) return '0:00'; const t = Math.floor(ms / 1000); return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, '0')}`; };
  const seek = async (f) => { if (!videoRef.current || !duration) return; const t = f * duration; try { await videoRef.current.setPositionAsync(t); setPosition(t); } catch {} };
  const pct = duration > 0 ? (position / duration) * 100 : 0;

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <TouchableOpacity style={s.full} activeOpacity={1}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.btn}><Ionicons name="chevron-down" size={28} color="#fff" /></TouchableOpacity>
          <Text style={s.title}>视频预览</Text>
          <View style={s.btn} />
        </View>

        <View style={s.videoBox}>
          {error ? <View style={s.center}><Ionicons name="alert-circle-outline" size={48} color="#999" /><Text style={s.errText}>{error}</Text></View>
          : <Video ref={videoRef} source={{ uri: videoUrl }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode={ResizeMode.CONTAIN} shouldPlay={false} isLooping={false} volume={isMuted ? 0 : volume} onPlaybackStatusUpdate={onPlayback} onError={() => { setError('视频加载失败'); setIsLoading(false); }} />}
          {isLoading && !error ? <View style={s.loadingOverlay}><ActivityIndicator size="large" color="#fff" /><Text style={s.loadingText}>加载中...</Text></View> : null}
          {!isPlaying && !isLoading && !error ? <TouchableOpacity style={s.bigPlay} onPress={togglePlay}><Ionicons name="play-circle" size={72} color="rgba(255,255,255,0.9)" /></TouchableOpacity> : null}
        </View>

        <View style={s.ctrlBar}>
          <View style={s.progressRow}>
            <Text style={s.t}>{fmt(position)}</Text>
            <TouchableOpacity style={s.progArea} activeOpacity={0.8} onPress={(e) => { e.currentTarget.measure((_, __, w) => seek(e.nativeEvent.locationX / w)); }}>
              <View style={s.progBg}><View style={[s.progFill, { width: `${pct}%` }]} /></View>
            </TouchableOpacity>
            <Text style={s.t}>{fmt(duration)}</Text>
          </View>

          <View style={s.ctrlRow}>
            <TouchableOpacity style={s.ctrlBtn} onPress={togglePlay}><Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={s.ctrlBtn} onPress={toggleMute}><Ionicons name={isMuted || volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-medium'} size={24} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={s.volArea} activeOpacity={0.8} onPress={(e) => { e.currentTarget.measure((_, __, w) => { const v = Math.max(0, Math.min(1, e.nativeEvent.locationX / w)); setVolume(v); if (v > 0 && isMuted) setIsMuted(false); }); }}>
              <View style={s.volBg}><View style={[s.volFill, { width: `${isMuted ? 0 : volume * 100}%` }]} /></View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/* ---- export -------------------------------------------------------------- */
export function VideoPlayer(props) {
  return NATIVE ? <NativeVideoPlayer {...props} /> : <WebVideoPlayer {...props} />;
}

/* ---- shared styles ------------------------------------------------------- */
const createStyles = (colors) => ({
  full: { flex: 1, backgroundColor: '#000' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: 'rgba(0,0,0,0.5)' },
  btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: '#fff' },
  videoBox: { flex: 1, width: '100%', overflow: 'hidden' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errText: { fontSize: 14, color: '#fff', marginTop: Spacing.md, textAlign: 'center' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#fff', fontSize: 14, marginTop: Spacing.md },
  bigPlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ctrlBar: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.7)', paddingBottom: 34, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  progArea: { flex: 1, height: 32, justifyContent: 'center', marginHorizontal: 4 },
  progBg: { height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 1.5 },
  t: { fontSize: 12, color: '#fff', minWidth: 42, textAlign: 'center' },
  ctrlRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  ctrlBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  volArea: { flex: 1, height: 28, justifyContent: 'center', cursor: 'pointer' },
  volBg: { height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  volFill: { height: '100%', backgroundColor: '#fff', borderRadius: 1.5 },
});
