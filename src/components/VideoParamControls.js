import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

export function SeedanceVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  generateAudio, setGenerateAudio, seed, setSeed,
  supportsAudio, minDuration,
}) {
  const min = minDuration || 4;
  const durationOptions = ['auto'];
  for (let i = min; i <= 15; i++) durationOptions.push(String(i));
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>宽高比</Text>
        <View style={styles.ratioGrid}>
          {videoRatios.map((r) => (
            <TouchableOpacity key={r} style={[styles.ratioButton, aspectRatio === r && styles.ratioButtonActive]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durationOptions.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {supportsAudio && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>生成音频</Text>
            <Switch value={generateAudio} onValueChange={setGenerateAudio} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>种子 (可选)</Text>
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="随机" placeholderTextColor={Colors.textTertiary} />
      </View>
    </>
  );
}

export function KlingVideoControls({
  videoRatios, aspectRatio, setAspectRatio, duration, setDuration,
  sound, setSound, multiShot, setMultiShot, shotType, setShotType,
  seed, setSeed, maxDuration, minDuration, supportsMultiShot, supportsSeed,
}) {
  const durArray = [];
  for (let i = minDuration || 1; i <= (maxDuration || 15); i++) durArray.push(i);
  return (
    <>
      {videoRatios.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>宽高比</Text>
          <View style={styles.selectorRow}>
            {videoRatios.map((r) => (
              <TouchableOpacity key={r} style={[styles.selectorButton, aspectRatio === r && styles.selectorButtonActive]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>添加音效</Text>
          <Switch value={sound} onValueChange={setSound} trackColor={{ false: Colors.bg, true: Colors.primary }} />
        </View>
      </View>
      {supportsMultiShot && (
        <>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>多镜头</Text>
              <Switch value={multiShot} onValueChange={setMultiShot} trackColor={{ false: Colors.bg, true: Colors.primary }} />
            </View>
          </View>
          {multiShot && (
            <View style={styles.card}>
              <Text style={styles.label}>镜头类型</Text>
              <View style={styles.selectorRow}>
                {['customize', 'intelligence'].map((t) => (
                  <TouchableOpacity key={t} style={[styles.selectorButton, shotType === t && styles.selectorButtonActive]} onPress={() => setShotType(t)}>
                    <Text style={[styles.selectorText, shotType === t && styles.selectorTextActive]}>{t === 'customize' ? '自定义' : '智能'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </>
      )}
      {supportsSeed && (
        <View style={styles.card}>
          <Text style={styles.label}>种子 (可选)</Text>
          <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="-1 为随机" placeholderTextColor={Colors.textTertiary} />
        </View>
      )}
    </>
  );
}

export function KlingO34KControls({
  videoRatios, aspectRatio, setAspectRatio, duration, setDuration,
  sound, setSound, keepOriginalSound, setKeepOriginalSound,
  multiShot, setMultiShot, shotType, setShotType,
  multiPrompt, setMultiPrompt,
  maxDuration, minDuration, supportsMultiShot,
}) {
  const durArray = [];
  for (let i = minDuration || 3; i <= (maxDuration || 15); i++) durArray.push(i);
  return (
    <>
      {videoRatios.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>宽高比</Text>
          <View style={styles.selectorRow}>
            {videoRatios.map((r) => (
              <TouchableOpacity key={r} style={[styles.selectorButton, aspectRatio === r && styles.selectorButtonActive]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>添加音效</Text>
          <Switch value={sound} onValueChange={setSound} trackColor={{ false: Colors.bg, true: Colors.primary }} />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>保留原始声音</Text>
          <Switch value={keepOriginalSound} onValueChange={setKeepOriginalSound} trackColor={{ false: Colors.bg, true: Colors.primary }} />
        </View>
      </View>
      {supportsMultiShot && (
        <>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>多镜头</Text>
              <Switch value={multiShot} onValueChange={setMultiShot} trackColor={{ false: Colors.bg, true: Colors.primary }} />
            </View>
          </View>
          {multiShot && (
            <>
              <View style={styles.card}>
                <Text style={styles.label}>镜头类型</Text>
                <View style={styles.selectorRow}>
                  {['customize', 'intelligence'].map((t) => (
                    <TouchableOpacity key={t} style={[styles.selectorButton, shotType === t && styles.selectorButtonActive]} onPress={() => setShotType(t)}>
                      <Text style={[styles.selectorText, shotType === t && styles.selectorTextActive]}>{t === 'customize' ? '自定义' : '智能'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>多镜头提示词 (可选)</Text>
                <TextInput style={styles.dimInputFull} value={multiPrompt || ''} onChangeText={setMultiPrompt} multiline placeholder="JSON 格式的多镜头配置" placeholderTextColor={Colors.textTertiary} />
              </View>
            </>
          )}
        </>
      )}
    </>
  );
}

export function ViduVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  audio, setAudio, isRec, setIsRec, offPeak, setOffPeak,
  maxDuration, minDuration, supportsAudio, supportsOffPeak, seed, setSeed,
}) {
  const durArray = [];
  for (let i = minDuration || 1; i <= (maxDuration || 16); i++) durArray.push(i);
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>宽高比</Text>
        <View style={styles.selectorRow}>
          {videoRatios.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, aspectRatio === r && styles.selectorButtonActive]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {supportsAudio && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>生成音频</Text>
            <Switch value={audio} onValueChange={setAudio} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>推荐提示词</Text>
          <Switch value={isRec} onValueChange={setIsRec} trackColor={{ false: Colors.bg, true: Colors.primary }} />
        </View>
      </View>
      {supportsOffPeak && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>低谷模式</Text>
            <Switch value={offPeak} onValueChange={setOffPeak} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>种子 (可选)</Text>
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="随机" placeholderTextColor={Colors.textTertiary} />
      </View>
    </>
  );
}

export function WanVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  promptExtend, setPromptExtend, watermark, setWatermark,
  negativePrompt, setNegativePrompt, seed, setSeed,
  supportsPromptExtend, supportsWatermark, supportsNegativePrompt,
  maxDuration, minDuration,
}) {
  const durArray = [];
  for (let i = minDuration || 2; i <= (maxDuration || 15); i++) durArray.push(i);
  return (
    <>
      {videoRatios.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>宽高比</Text>
          <View style={styles.selectorRow}>
            {videoRatios.map((r) => (
              <TouchableOpacity key={r} style={[styles.selectorButton, aspectRatio === r && styles.selectorButtonActive]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {supportsPromptExtend && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>智能改写</Text>
            <Switch value={promptExtend} onValueChange={setPromptExtend} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      {supportsWatermark && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>水印</Text>
            <Switch value={watermark} onValueChange={setWatermark} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      {supportsNegativePrompt && (
        <View style={styles.card}>
          <Text style={styles.label}>反向提示词 (可选)</Text>
          <TextInput style={styles.dimInputFull} value={negativePrompt || ''} onChangeText={setNegativePrompt} placeholder="描述不想要的元素" placeholderTextColor={Colors.textTertiary} multiline />
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>种子 (可选)</Text>
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="-1 为随机" placeholderTextColor={Colors.textTertiary} />
      </View>
    </>
  );
}

export function WanI2VControls({
  resolutions, resolution, setResolution,
  duration, setDuration, promptExtend, setPromptExtend,
  audio, setAudio, supportsPromptExtend, supportsAudio,
  maxDuration, minDuration,
}) {
  const durArray = [];
  for (let i = minDuration || 5; i <= (maxDuration || 10); i++) durArray.push(i);
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {supportsPromptExtend && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>智能改写</Text>
            <Switch value={promptExtend} onValueChange={setPromptExtend} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      {supportsAudio && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>生成音频</Text>
            <Switch value={audio} onValueChange={setAudio} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
    </>
  );
}

export function HailuoVideoControls({
  resolutions, durationOptions, resolutionDurationMap, resolution, setResolution,
  duration, setDuration, promptOptimizer, setPromptOptimizer,
  fastPretreatment, setFastPretreatment, aigcWatermark, setAigcWatermark,
  supportsPromptOptimizer, supportsWatermark,
}) {
  const allowedDurations = resolutionDurationMap
    ? (resolutionDurationMap[resolution] || durationOptions)
    : durationOptions;
  const validDuration = allowedDurations.includes(duration) ? duration : allowedDurations[0];
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => {
              setResolution(r);
              const newAllowed = resolutionDurationMap ? (resolutionDurationMap[r] || durationOptions) : durationOptions;
              if (!newAllowed.includes(duration)) setDuration(newAllowed[0]);
            }}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {allowedDurations.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButton, validDuration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, validDuration === d && styles.selectorTextActive]}>{d}s</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {supportsPromptOptimizer && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Prompt 优化</Text>
            <Switch value={promptOptimizer} onValueChange={setPromptOptimizer} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      {/* Prompt优化和快速预处理共用同一控制条件 */}
      {supportsPromptOptimizer && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>快速预处理</Text>
            <Switch value={fastPretreatment} onValueChange={setFastPretreatment} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      {supportsWatermark && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>AI 水印</Text>
            <Switch value={aigcWatermark} onValueChange={setAigcWatermark} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
    </>
  );
}

export function HappyHorseVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  watermark, setWatermark, supportsWatermark,
  maxDuration, minDuration, seed, setSeed,
}) {
  const durArray = [];
  for (let i = minDuration || 3; i <= (maxDuration || 15); i++) durArray.push(i);
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>宽高比</Text>
        <View style={styles.ratioGrid}>
          {videoRatios.map((r) => (
            <TouchableOpacity key={r} style={[styles.ratioButton, aspectRatio === r && styles.ratioButtonActive]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {supportsWatermark && (
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>水印</Text>
            <Switch value={watermark} onValueChange={setWatermark} trackColor={{ false: Colors.bg, true: Colors.primary }} />
          </View>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>种子 (可选)</Text>
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="随机" placeholderTextColor={Colors.textTertiary} />
      </View>
    </>
  );
}

export function LtxVideoControls({ display, setDisplay, displayOptions, seed, setSeed }) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>显示方向</Text>
        <View style={styles.selectorRow}>
          {displayOptions.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButton, display === d && styles.selectorButtonActive]} onPress={() => setDisplay(d)}>
              <Text style={[styles.selectorText, display === d && styles.selectorTextActive]}>{d === 'horizontal' ? '横屏' : '竖屏'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>种子 (可选)</Text>
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="1~2147483647，留空随机" placeholderTextColor={Colors.textTertiary} />
      </View>
    </>
  );
}

export function BzaVideoXControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration, durationOptions,
  maxDuration, minDuration,
}) {
  const durArray = durationOptions || (() => {
    const arr = [];
    for (let i = minDuration || 6; i <= (maxDuration || 10); i++) arr.push(i);
    return arr;
  })();
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>时长 (秒)</Text>
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <TouchableOpacity key={d} style={[styles.selectorButtonSmall, duration === d && styles.selectorButtonActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}s</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>宽高比</Text>
        <View style={styles.selectorRow}>
          {videoRatios.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, aspectRatio === r && styles.selectorButtonActive]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

export function BzaVideoV3Controls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio,
}) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {resolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>宽高比</Text>
        <View style={styles.selectorRow}>
          {videoRatios.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, aspectRatio === r && styles.selectorButtonActive]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

export function DreamActorControls() {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>上传人物图片和参考视频</Text>
      <Text style={styles.priceHint}>无需参数设置，上传文件后即可生成</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  selectorRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  selectorButton: { flex: 1, minWidth: 60, paddingVertical: 10, borderRadius: Radius.sm, backgroundColor: Colors.bg, alignItems: 'center' },
  selectorButtonSmall: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: Radius.sm, backgroundColor: Colors.bg, alignItems: 'center' },
  selectorButtonActive: { backgroundColor: Colors.primary },
  selectorText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  selectorTextActive: { color: Colors.textInverse, fontWeight: '600' },
  priceHint: { fontSize: 12, color: Colors.textTertiary, marginTop: Spacing.sm },
  ratioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ratioButton: { width: '22%', paddingVertical: 9, borderRadius: Radius.sm, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  ratioButtonActive: { backgroundColor: Colors.primary },
  ratioText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  ratioTextActive: { color: Colors.textInverse, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dimInputFull: { fontSize: 15, color: Colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 10, backgroundColor: Colors.bg },
});
