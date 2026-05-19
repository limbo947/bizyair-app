import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateImage, getPrice, ENV_API_KEY } from './api';

const HISTORY_KEY = '@image_history';
const API_KEY_STORAGE_KEY = '@api_key';
const RESOLUTIONS = ['1K', '2K', '4K'];
const ASPECT_RATIOS = ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', '3:2', '2:3', '5:4', '4:5', '4:1', '1:4', '8:1', '1:8'];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('2K');
  const [aspectRatio, setAspectRatio] = useState('4:3');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadApiKey();
    loadHistory();
  }, []);

  const loadApiKey = async () => {
    try {
      const saved = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      if (saved) {
        setApiKey(saved);
      }
    } catch (e) {
      console.log('读取密钥失败', e);
    }
  };

  const saveApiKey = async (key) => {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch (e) {
      console.log('保存密钥失败', e);
    }
  };

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.log('读取历史失败', e);
    }
  };

  const saveToHistory = async (entry) => {
    try {
      const updated = [entry, ...history];
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log('保存历史失败', e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    const effectiveKey = apiKey.trim() || ENV_API_KEY;
    if (!effectiveKey) {
      setShowApiKeyInput(true);
      setError('请先输入API密钥');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const result = await generateImage(effectiveKey, prompt.trim(), resolution, aspectRatio);
      const entry = {
        id: Date.now().toString(),
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        resolution: result.resolution,
        aspectRatio: result.aspectRatio,
        price: result.price,
        date: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      await saveToHistory(entry);
    } catch (err) {
      setError(err.message || '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI 文生图</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {showApiKeyInput ? (
          <View style={[styles.card, styles.apiKeyCard]}>
            <Text style={styles.label}>API 密钥</Text>
            <TextInput
              style={styles.apiKeyInput}
              placeholder="输入你的Bizyair API Key（覆盖.env配置）"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              maxLength={100}
            />
            {apiKey.trim() ? (
              <TouchableOpacity style={styles.saveKeyButton} onPress={() => { saveApiKey(apiKey); setShowApiKeyInput(false); }}>
                <Text style={styles.saveKeyButtonText}>保存密钥</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>API 密钥</Text>
            <View style={styles.apiKeyRow}>
              <Text style={styles.apiKeyMasked}>
                {ENV_API_KEY ? '密钥已配置 (.env) ●●●●●●●●' : apiKey ? '密钥已配置 ●●●●●●●●' : '未配置密钥'}
              </Text>
              <TouchableOpacity style={styles.changeKeyButton} onPress={() => {
                if (!apiKey) setApiKey(ENV_API_KEY);
                setShowApiKeyInput(true);
              }}>
                <Text style={styles.changeKeyButtonText}>{apiKey || ENV_API_KEY ? '更换' : '输入'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>提示词</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="描述你想生成的图片..."
            value={prompt}
            onChangeText={setPrompt}
            multiline
            maxLength={500}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>分辨率</Text>
          <View style={styles.selectorRow}>
            {RESOLUTIONS.map((res) => (
              <TouchableOpacity
                key={res}
                style={[
                  styles.selectorButton,
                  resolution === res && styles.selectorButtonActive,
                ]}
                onPress={() => setResolution(res)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    resolution === res && styles.selectorTextActive,
                  ]}
                >
                  {res}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.priceHint}>价格: {getPrice(resolution)} 金币</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>宽高比</Text>
          <View style={styles.aspectRatioGrid}>
            {ASPECT_RATIOS.map((ratio) => (
              <TouchableOpacity
                key={ratio}
                style={[
                  styles.ratioButton,
                  aspectRatio === ratio && styles.ratioButtonActive,
                ]}
                onPress={() => setAspectRatio(ratio)}
              >
                <Text
                  style={[
                    styles.ratioText,
                    aspectRatio === ratio && styles.ratioTextActive,
                  ]}
                >
                  {ratio}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text style={styles.generateButtonText}>生成中...</Text>
            </>
          ) : (
            <Text style={styles.generateButtonText}>生成图片</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.sectionTitle}>历史记录</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>还没有生成记录，开始创作吧~</Text>
        ) : (
          history.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyCard} onPress={() => setPreviewImage(item.imageUrl)}>
              <Image source={{ uri: item.imageUrl }} style={styles.historyThumb} resizeMode="cover" />
              <View style={styles.historyInfo}>
                <Text style={styles.historyPrompt} numberOfLines={2}>{item.prompt}</Text>
                <Text style={styles.historyMeta}>{item.resolution} · {item.aspectRatio} · {item.date}</Text>
                <Text style={styles.historyPrice}>消耗: {item.price} 金币</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={!!previewImage}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPreviewImage(null)}>
          <Image
            source={{ uri: previewImage }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  apiKeyCard: {
    borderColor: '#FF9800',
    borderWidth: 1,
  },
  apiKeyInput: {
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'monospace',
  },
  saveKeyButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  saveKeyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  apiKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  apiKeyMasked: {
    fontSize: 14,
    color: '#999',
  },
  changeKeyButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 4,
  },
  changeKeyButtonText: {
    color: '#2196F3',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  promptInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    maxHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  selectorText: {
    fontSize: 14,
    color: '#666',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  priceHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  aspectRatioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratioButton: {
    width: '22%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  ratioText: {
    fontSize: 13,
    color: '#666',
  },
  ratioTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  generateButtonDisabled: {
    backgroundColor: '#90CAF9',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 15,
    marginTop: 30,
    marginBottom: 30,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  historyThumb: {
    width: 100,
    height: 100,
  },
  historyInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  historyPrompt: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  historyMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  historyPrice: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
});
